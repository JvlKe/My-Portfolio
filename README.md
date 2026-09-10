# Portfolio

A dependency-free, static portfolio workspace for Joalnes John D. Vender.

## Structure

- `index.html`: document and entry point
- `script.js`: app shell, hash routing, sidebar, dialogs, theme and chat interactions
- `views.js`: dedicated view renderers and reusable project cards
- `ui.js`: icons, buttons, tags and escaping helpers
- `portfolio-data.js`: profile, project, skill and credential data
- `assistant.js`: local preset-response adapter; no AI API or credentials
- `workspace.css`: responsive V2 styles
- `style.css`: original shared styles retained because the original demo pages depend on them
- Demo folders and the original HTML resume remain available at their existing paths.

Serve this directory with an HTTP static server and open `index.html`. ES modules require HTTP rather than opening the file directly. No installation or compilation is required.

Run `node validate.mjs` for generated-view, local-link and data checks.

## Content and behavior

Major views use hash navigation, including browser back/forward and direct links. Old `#home` and `#certifications` URLs map to Overview and Learning.

Theme and desktop sidebar preferences are stored locally when storage is available. Chat history stays in memory. The assistant uses preset answers and explicitly identifies undocumented information. To connect an AI later, replace `getAssistantReply` with a call to a server endpoint; keep provider secrets on the server.

The source portfolio supplies all facts. The resume supplies Holy Angel University, the existing education dates/year, Dean’s List recognition, phone and languages. Chami is the ongoing thesis and SmartTripPH is the APSI final project, as supplied by the owner. No undocumented technologies or contributions were added.

Resume downloads preserve the existing HTML format. View it in a new tab and use browser Print to save a PDF.
