# DE.NET — Tracker + Tool Library

Deploy the whole `tracker/` folder as one static site.

## Open

```powershell
start index.html              # Roadmap progress tracker
start library\index.html      # Tool docs library
```

Or use the sidebar links: **TOOL_LIBRARY →** / **← ROADMAP TRACKER**

## Layout

```
tracker/
  index.html          # Progress tracker
  app.js
  data.js
  style.css
  python-de-roadmap.md
  library/
    index.html        # Tool library
    library-app.js
    content.js
    library.css
```

## Deploy

Upload `tracker/` (GitHub Pages, Netlify, S3…).  
- Tracker: `/` or `/index.html`  
- Library: `/library/` or `/library/index.html`
