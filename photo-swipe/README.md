# Swipe Clean

A single-page website for iPhone that helps you clean up your photo library Tinder-style.

- **Choose Photos** opens the iOS photo picker (pick as many as you like).
- Photos are shown one at a time. **Swipe left to delete, right to keep** (or tap ✕ / ♥). ↺ undoes.
- **Finish** shows a summary: tap any thumbnail to flip its decision, and **Save Kept Photos…** opens the iOS share sheet.

Everything runs in the browser; nothing is uploaded.

## Limitation

Browsers on iOS are not allowed to delete items from the Photos library. Swipe Clean builds the
"To Delete" list; you then delete those photos in the Photos app (Select → tap them → trash).

## Running it

It's one self-contained file (`index.html`) with no build step. Host it anywhere over HTTPS
(e.g. GitHub Pages), open it in Safari, and use Share → **Add to Home Screen** for a full-screen app.
