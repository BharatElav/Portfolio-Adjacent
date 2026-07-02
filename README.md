# Portfolio — Content Guide

This is a reference for editing the site's content without touching component code.
Everything you regularly update lives in the `content/` folder as markdown files.
Media (images/videos) goes in `public/`.

---

## Folder overview

```
portfolio/
  content/
    home.md          ← homepage scroll highlights
    projects.md       ← project index cards
    projects/           ← individual project detail pages (real markdown + frontmatter)
    blog.md            ← blog index posts
    blog/                ← individual blog post pages (real markdown + frontmatter)
    cv.md                 ← CV: contact, experience, education (incl. course categories), skills, references
    courses.md              ← individual coursework entries, tagged by category
  public/
    images/            ← all images referenced in markdown
    videos/            ← all videos referenced in markdown
  app/
    page.tsx                    ← homepage (reads home.md + cv.md + courses.md)
    projects/page.tsx             ← projects index page (reads projects.md)
    projects/[slug]/page.tsx        ← individual project page (reads content/projects/[slug].md)
    blog/page.tsx                     ← blog index page (reads blog.md)
    blog/[slug]/page.tsx                ← individual blog post page (reads content/blog/[slug].md)
    components/                           ← React components (don't need to touch these to add content)
  lib/
    parseHome.ts        ← parser for home.md
    parseProjects.ts      ← parser for projects.md (index cards)
    parseProjectPage.ts     ← parser for content/projects/*.md (full project pages)
    parseBlog.ts               ← parser for blog.md (index list)
    parseBlogPage.ts              ← parser for content/blog/*.md (full post pages)
    parseCV.ts                       ← parser for cv.md
    parseCourses.ts                     ← parser for courses.md
```

You should only ever need to edit files inside `content/` and drop media into `public/`
for day-to-day updates. Editing `.tsx` files is only needed if you want to change layout/styling.

---

## 1. Homepage — `content/home.md`

Controls the full-screen scroll sections at the top of the homepage.

```markdown
---highlight---
media: /videos/formula.mp4
mediaType: video
side: right

Text about this section goes here...

---highlight---
media: /images/hackathon.jpg
mediaType: image
side: left

Text about this section goes here...
```

- `media` — path starting with `/videos/` or `/images/` (matches what's in `public/`)
- `mediaType` — `video` or `image`
- `side` — `left` or `right` (which side the media sits on; alternates the layout)
- The blank line after the fields, then everything below it, is the body text.
- Add a new highlight by copy-pasting a `---highlight---` block. Order in the file = order on the page.
- The CV section (see below) renders directly after the last highlight, as its own full-screen
  snap section.

---

## 2. Projects

### Index cards — `content/projects.md`

Controls the cards shown on the `/projects` page.

```markdown
---project---
title: SR-26 Wiring Harness
tag: Formula SAE
media: /images/harness.jpg
mediaType: image
slug: harness
github: https://github.com/BharatElav/harness-project

Short description of the project...
```

- `tag` — must match one of the filter categories in `app/components/projectgrid.tsx`
  (currently: `Formula SAE`, `Hackathons`, `Research`)
- `slug` — used for the URL (`/projects/harness`) — lowercase, no spaces
- `github` — optional, shown as a link button on the individual project page

### Full project page — `content/projects/[slug].md`

Each card's `slug` must have a matching file here, e.g. `content/projects/harness.md`.
This uses **standard markdown with frontmatter**, not the custom `---block---` format —
so headers, bold, links, and images all work normally.

```markdown
---
title: SR-26 Wiring Harness
tag: Formula SAE
date: 2025-01-15
github: https://github.com/BharatElav/harness-project
---

## Overview

Architected a full vehicle wiring harness for the SR-26 formula car...

## Key results

- **33% reduction** in rear harness mass through connector consolidation
- Custom PCB integration for the Brake System Plausibility Device

![harness photo](/images/harness.jpg)
```

If a slug in `projects.md` doesn't have a matching file here, that project's page will 404.

---

## 3. Blog

### Index list — `content/blog.md`

Controls the list on the `/blog` page.

```markdown
---post---
title: Why CAN bus architecture matters
date: 2025-01-15
readtime: 3
slug: can-bus-architecture
pinned: true
tags: motorsport, electronics
thumbnail: /images/can-bus.jpg

One-liner description of the post...
```

- `pinned: true` — shows the post as a featured card at the top instead of in the regular list
- `tags` — comma-separated, used for the filter row at the top of the blog page
- `thumbnail` — optional; only regular (non-pinned) posts show a thumbnail
- `readtime` — manual (you set the number yourself, not auto-calculated)

### Full post page — `content/blog/[slug].md`

Same idea as projects — standard markdown with frontmatter, matched by `slug`.

```markdown
---
title: Why CAN bus architecture matters
date: 2025-01-15
readtime: 3
tags: [motorsport, electronics]
---

Full post content goes here, with normal markdown formatting —
headers, **bold**, links, images, code blocks, etc.
```

If a slug in `blog.md` doesn't have a matching file here, that post's page will 404.

---

## 4. CV — `content/cv.md`

Five section types, each using a different delimiter. Section order on the page is always
Contact → Experience → Education → Skills → References, regardless of order in the file.
Order *within* a section (e.g. which experience is listed first) follows file order.

### Contact
```markdown
---contact---
name: Bharatraj Elavarasan
email: elavara1@msu.edu
```

### Experience
Company header, then one or more `role:` blocks nested under it — use this for promotions or
title changes at the same company.

```markdown
---experience---
company: MSU Formula SAE
link: https://www.msuformularacing.com/

role: Low Voltage Power Lead
start: October 2024
end: Present
location: East Lansing, MI

Description of this specific role...

role: Electronics Team Member
start: January 2024
end: October 2024
location: East Lansing, MI

Description of the earlier role...
```

- Add more roles at the same company inside the same `---experience---` block.
- Start a new `---experience---` block for each different company.

### Education
Institution header, then one or more `degree:` blocks — plus, uniquely, `category:` blocks
that define the coursework groupings used by every degree in this file.

```markdown
---education---
institution: Michigan State University
link: https://msu.edu

degree: Bachelor of Science, Electrical Engineering
start: 2023
end: Present
gpa: 4.0

Description of the program...

category: Evolutionary Computing and Algorithms
description: Genetic programming and evolutionary algorithms, with a focus on scalability, sustained innovation, and avoiding premature convergence.

category: Digital Systems & Embedded
description: Hardware and low-level software for microprocessors, digital logic, and embedded control.
```

- `category:`/`description:` pairs define **named coursework groups** — think of them as
  folders that courses (from `courses.md`) get filed into.
- The **category name must match exactly** between here and the `category:` field in
  `courses.md`, or that course won't show up under any group.
- Add a new category by adding another `category:`/`description:` pair.
- These categories currently apply to *all* degree programs listed under this institution
  (they're not scoped per-degree).

### Skills
```markdown
---skills---
PCB Design (Altium, KiCad), CAN bus architecture, Embedded C, Python, MATLAB, Git
```
One comma-separated list, no sub-fields.

### References
```markdown
---reference---
name: Jane Doe
title: Professor · MSU
relationship: Faculty advisor for Formula SAE
```
One `---reference---` block per person. **Do not include their email/phone** — name, title,
and relationship only, for their privacy.

---

## 5. Coursework — `content/courses.md`

Separate file from `cv.md`. Each course is tagged with a `category` that must match a
`category:` name defined in `cv.md`'s education section. On the CV page, courses render
grouped into collapsible sections by category — click a category to expand and see every
course (name + description) inside it. There's no second nested toggle per course; opening
the category reveals every course's full description at once.

```markdown
---course---
name: ECE 846 — Multi-Criterion Optimization
category: Evolutionary Computing and Algorithms

Classical optimization. Evolutionary optimization. Multi criterion decision making.
Advanced topics in research & industry. Did a term project on generalized domination.

---course---
name: ECE 848 — Evolutionary Computation
category: Evolutionary Computing and Algorithms

Currently taking.
```

- `name` — shown as the course title inside its category
- `category` — must exactly match a category name in `cv.md`
- Everything after the blank line is the course description
- To add a new course: copy a `---course---` block, fill in `name`/`category`, and make sure
  that category already exists in `cv.md` (or add it there too)

---

## 6. Adding media

Drop files directly into:
- `public/images/yourfile.jpg`
- `public/videos/yourfile.mp4`

Then reference them in markdown as `/images/yourfile.jpg` or `/videos/yourfile.mp4`
(no `public` in the path — Next.js serves that folder's contents from the root automatically).

---

## 7. After editing content

1. Save the markdown file.
2. If the dev server is running (`npm run dev`), the change appears automatically at `localhost:3000`.
3. To publish: commit and push.

```bash
git add .
git commit -m "update content"
git push
```

Vercel auto-deploys on every push to `main`.

---

## 8. Things that still require code changes (not just markdown)

- Adding a new project filter tag → edit the `tags` array in `app/components/projectgrid.tsx`
- Site-wide colors → `app/globals.css` (uses `--background`, `--foreground`, `--border`, `--muted`
  CSS variables that auto-swap for dark mode — prefer these over hardcoded `dark:bg-black` etc.)
- Nav bar links/socials → `app/components/navbar.tsx`
- CV section order or sidebar labels → `app/components/cv.tsx`
- Course category collapse/expand behavior → `CourseCategoryBlock` inside `app/components/cv.tsx`
