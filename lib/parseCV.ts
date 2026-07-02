import fs from 'fs'
import path from 'path'

export type CVContact = {
  name: string
  email: string
}

export type CVRole = {
  role: string
  start: string
  end: string
  location: string
  description: string
}

export type CVExperience = {
  company: string
  link: string
  roles: CVRole[]
}

export type CVCourse = {
  name: string
  description: string
}

export type CVProgram = {
  degree: string
  start: string
  end: string
  gpa: string
  description: string
  courses: CVCourse[]
}

export type CVEducation = {
  institution: string
  link: string
  programs: CVProgram[]
}

export type CVReference = {
  name: string
  title: string
  relationship: string
}

export type CV = {
  contact: CVContact
  experience: CVExperience[]
  education: CVEducation[]
  skills: string[]
  references: CVReference[]
}

export function parseCV(): CV {
  const filePath = path.join(process.cwd(), 'content', 'cv.md')
  const raw = fs.readFileSync(filePath, 'utf-8')

  const cv: CV = {
    contact: { name: '', email: '' },
    experience: [],
    education: [],
    skills: [],
    references: [],
  }

  const sections = raw.split(/---(\w+)---/).filter(Boolean)

  for (let i = 0; i < sections.length; i += 2) {
    const type = sections[i].trim()
    const content = sections[i + 1]?.trim() ?? ''

    if (type === 'experience') {
      const roleBlocks = content.split(/(?=^role:)/m).filter(Boolean)
      const hasHeader = !roleBlocks[0].trim().startsWith('role:')
      const companyHeader = hasHeader ? roleBlocks.shift()! : ''

      const companyMeta: Record<string, string> = {}
      companyHeader.split('\n').forEach((line: string) => {
        const [key, ...rest] = line.split(':')
        if (key && rest.length) companyMeta[key.trim()] = rest.join(':').trim()
      })

      const roles: CVRole[] = roleBlocks.map((block: string) => {
        const lines = block.split('\n')
        const meta: Record<string, string> = {}
        let contentStart = 0

        for (let j = 0; j < lines.length; j++) {
          const line = lines[j].trim()
          if (line === '') {
            contentStart = j + 1
            break
          }
          const [key, ...rest] = lines[j].split(':')
          meta[key.trim()] = rest.join(':').trim()
        }

        const description = lines.slice(contentStart).join('\n').trim()

        return {
          role: meta.role,
          start: meta.start,
          end: meta.end,
          location: meta.location ?? '',
          description,
        }
      })

      cv.experience.push({
        company: companyMeta.company,
        link: companyMeta.link,
        roles,
      })
      continue
    }

    if (type === 'education') {
      const programBlocks = content.split(/(?=^degree:)/m).filter(Boolean)
      const hasHeader = !programBlocks[0].trim().startsWith('degree:')
      const instHeader = hasHeader ? programBlocks.shift()! : ''

      const instMeta: Record<string, string> = {}
      instHeader.split('\n').forEach((line: string) => {
        const [key, ...rest] = line.split(':')
        if (key && rest.length) instMeta[key.trim()] = rest.join(':').trim()
      })

      const programs: CVProgram[] = programBlocks.map((programBlock: string) => {
        // Split this program block further into: header fields+description, then course: sub-blocks
        const courseBlocks = programBlock.split(/(?=^course:)/m).filter(Boolean)
        const programHeader = courseBlocks[0].trim().startsWith('course:') ? '' : courseBlocks.shift()!

        const lines = programHeader.split('\n')
        const meta: Record<string, string> = {}
        let contentStart = 0

        for (let j = 0; j < lines.length; j++) {
          const line = lines[j].trim()
          if (line === '') {
            contentStart = j + 1
            break
          }
          const [key, ...rest] = lines[j].split(':')
          meta[key.trim()] = rest.join(':').trim()
        }

        const description = lines.slice(contentStart).join('\n').trim()

        const courses: CVCourse[] = courseBlocks.map((cBlock: string) => {
          const cLines = cBlock.split('\n')
          const firstLine = cLines[0].trim()
          const name = firstLine.replace(/^course:\s*/, '').trim()
          const courseDescription = cLines.slice(1).join('\n').trim()

          return {
            name,
            description: courseDescription,
          }
        })

        return {
          degree: meta.degree,
          start: meta.start,
          end: meta.end,
          gpa: meta.gpa,
          description,
          courses,
        }
      })

      cv.education.push({
        institution: instMeta.institution,
        link: instMeta.link,
        programs,
      })
      continue
    }

    const lines = content.split('\n')
    const meta: Record<string, string> = {}
    let contentStart = 0

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j].trim()
      if (line === '') {
        contentStart = j + 1
        break
      }
      const [key, ...rest] = lines[j].split(':')
      meta[key.trim()] = rest.join(':').trim()
    }

    const description = lines.slice(contentStart).join('\n').trim()

    if (type === 'contact') {
      cv.contact = { name: meta.name, email: meta.email }
    } else if (type === 'skills') {
      cv.skills = content.split(',').map((s: string) => s.trim())
    } else if (type === 'reference') {
      cv.references.push({
        name: meta.name,
        title: meta.title,
        relationship: meta.relationship,
      })
    }
  }

  return cv
}