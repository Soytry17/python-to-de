# DE Roadmap Progress Tracker

Standalone static website for tracking your [Python for Data Engineering roadmap](../python-de-roadmap.md).

Progress is stored in the browser **localStorage** only (no server, no login).

## How to open

1. Open `index.html` in your browser (double-click, or drag into Chrome/Edge/Firefox).
2. Or from this folder:

```powershell
start index.html
```

## Features

- Check off prerequisites, daily lessons, mini-project DoD, stretch goals, quizzes
- SQL habit counters (0–7 days per week)
- Capstone 1 & 2 checklists
- Week 9 AWS / GCP track switch
- **Fast Track** toggle — hides Exposure (🟡) items and recalculates progress on Core only
- Overall + Core-only progress bars
- Per-week progress on each card
- Daily study log
- **Backup JSON** / **Restore** / **Reset**

## Files

| File | Role |
|------|------|
| `index.html` | Page shell |
| `style.css` | Dark UI styles |
| `data.js` | Roadmap content (`ROADMAP`) |
| `app.js` | Render + localStorage logic |

To change checklist content later, edit `data.js` only.
