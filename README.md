# Personal Website — Thanh Truc Phan

A minimal, recruiter-friendly personal website built with pure HTML, CSS, and JavaScript.
No frameworks, no build tools — just open `index.html` and it works.

---

## File structure

```
personal-site/
├── index.html        ← all page content and sections
├── styles.css        ← all colors, fonts, and layout
├── script.js         ← mobile menu, scroll effects
├── README.md         ← this file
└── assets/
    ├── profile.jpg   ← your profile photo  ← ADD THIS
    └── cv.pdf        ← your CV file        ← ADD THIS
```

---

## 1. How to open the project in VS Code

1. Open **Visual Studio Code**
2. Go to **File → Open Folder…**
3. Select the `personal-site` folder on your Desktop
4. Install the **Live Server** extension (search for it in the Extensions panel on the left)
5. Right-click `index.html` in the file explorer → **Open with Live Server**
6. The website opens at `http://localhost:5500` and auto-refreshes on every save

---

## 2. How to replace the profile photo

1. Prepare your photo — a square crop works best (e.g. 600 × 600 px)
2. Save it as **`profile.jpg`** (lowercase, exactly this name)
3. Copy it into the **`assets/`** folder
4. If the folder does not exist yet, create it inside `personal-site/`

> If no photo is found, the site automatically shows your initials **TTP** instead.

---

## 3. How to replace the CV

1. Export your CV as a PDF
2. Rename the file to **`cv.pdf`**
3. Copy it into the **`assets/`** folder

The "Download CV" buttons link to `assets/cv.pdf` — no code change needed.

---

## 4. How to edit the links

Open `index.html` in VS Code and search (`Ctrl + F`) for the following comments:

| What to change | Search for this comment |
|---|---|
| LinkedIn URL | `✏️ Replace href="#" with your actual LinkedIn URL` |
| Email address | `✏️ Edit your email address here` |
| Phone number | `✏️ Edit your phone number here` |
| CV file link | `✏️ CV link — make sure assets/cv.pdf exists` |
| Any text | Search for the text you want to change |

All editable parts are marked with a `✏️` comment in the HTML.

---

## 5. How to change colors or fonts

Open `styles.css` and scroll to the top — you will find a `:root` block like this:

```css
:root {
    --color-accent: #1B4F72;   /* main blue — change this for a different accent */
    --color-bg:     #F4F7F9;   /* page background */
    /* ... */
}
```

Change only the values on the right (the `#hex` codes) and save.
The entire site updates automatically because all colors reference these variables.

---

## 6. How to host on GitHub Pages (free)

1. **Create a GitHub account** at github.com if you do not have one
2. **Create a new repository** — click the **+** icon → New repository
   - Name it: `your-username.github.io` (e.g. `thanhtrucp.github.io`)
   - Set it to **Public**
   - Do NOT initialise with a README (you already have one)
3. **Upload your files** — on the new empty repo page, click **uploading an existing file**
   - Drag and drop: `index.html`, `styles.css`, `script.js`, `README.md`, and the entire `assets/` folder
   - Click **Commit changes**
4. **Enable GitHub Pages** — go to **Settings → Pages**
   - Under *Source*, select **Deploy from a branch**
   - Branch: **main**, Folder: **/ (root)**
   - Click **Save**
5. After 1–2 minutes your site is live at `https://your-username.github.io`

> **Tip:** Every time you update a file, go to the repository on GitHub, click the file, then click the pencil icon (Edit) to paste the new content, or drag-and-drop new versions from your computer.

---

## Quick checklist before going live

- [ ] Added `assets/profile.jpg` (your photo)
- [ ] Added `assets/cv.pdf` (your CV)
- [ ] Updated the LinkedIn URL in `index.html`
- [ ] Checked all contact details (email, phone) are correct
- [ ] Opened the site in a browser and verified everything looks good
- [ ] Tested on mobile (resize the browser window to a narrow width)
