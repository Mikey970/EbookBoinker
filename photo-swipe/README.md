# Swipe Clean

A single-page website for iPhone that helps you clean up your photo library Tinder-style.

- **Choose Photos** opens the iOS photo picker (pick as many as you like).
- Photos are shown one at a time. **Swipe left to delete, right to keep** (or tap ✕ / ♥). ↺ undoes.
- **Finish** shows a summary: tap any thumbnail to flip its decision, and **Save Kept Photos…** opens the iOS share sheet.

Everything runs in the browser; nothing is uploaded.

## Deleting photos

Browsers on iOS aren't allowed to delete from the Photos library, but the Shortcuts app is.
**Delete in Photos** copies the "To Delete" file names to the clipboard (as `|IMG_0001|IMG_0002|`)
and opens a Shortcut named **Swipe Clean**, which you build once (steps are on the summary screen):

1. Get Clipboard
2. Find Photos (sort by Creation Date, latest first, limit e.g. 1000)
3. Repeat with Each photo → Get Details of Images: Name → Text `|Name|` → If Clipboard contains Text → Add to Variable `ToDelete`
4. Delete Photos: `ToDelete` (iOS asks to confirm; photos go to Recently Deleted for 30 days)

Matching relies on Safari passing the photos' original names (e.g. `IMG_1234`). The page warns when it
gets generic or repeated names, since those can't be matched.

## Running it

It's one self-contained file (`index.html`) with no build step. Host it anywhere over HTTPS
(e.g. GitHub Pages), open it in Safari, and use Share → **Add to Home Screen** for a full-screen app.
