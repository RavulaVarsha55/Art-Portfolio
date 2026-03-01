# Art Portfolio (HTML + CSS + JS)

Simple Ghibli-inspired static portfolio for your paintings.

## Project structure

- `index.html` -> page layout
- `styles.css` -> theme and design
- `script.js` -> gallery + lightbox behavior
- `files/paintings.js` -> list of paintings to show
- `files/` -> your uploaded painting images

## Add your paintings

1. Put your image in `files/` (example: `files/sunrise-lake.jpg`).
2. Open `files/paintings.js`.
3. Add an item in `window.paintings`:

```js
{
  src: "files/sunrise-lake.jpg",
  title: "Sunrise Lake",
  date: "2026-03-01"
}
```

4. Save, then commit + push.

## Run locally

Just open `index.html` in browser.

## Host on GitHub Pages

1. Create a GitHub repo.
2. In terminal from this project:

```bash
git init
git add .
git commit -m "Initial art portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

3. On GitHub: `Settings` -> `Pages`.
4. In `Build and deployment`:
   - Source: `Deploy from a branch`
   - Branch: `main` and `/ (root)`
5. Save.

Your live URL will be:

`https://<your-username>.github.io/<repo-name>/`

## Update workflow (every new painting)

```bash
git add .
git commit -m "Add new painting"
git push
```

GitHub Pages auto-updates in 1-2 minutes.
