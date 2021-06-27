# Tubehunt

## Dev
- `npm install` - Install deps.
- `npm run clean` - Clean up `dist` build folder.
- `npm run watch:all` - Hot reload entire extension.
- `auto/test` - Run tests in watch mode.
- `auto/dev` - Convenience for `clean` and `watch:all`.
- `auto/build-prod` - Build minified bundle for production.

When you run the parcel dev server (e.g. using `auto/dev`), you'll be able to visit your pages by visiting the path of the page at `http://localhost:1234/path/in/dist/folder`.

For example, to view:
- popup page -> `http://localhost:1234/popup/popup.html`
- content page, `http://localhost:1234/content/dummy-content.html` (this works by having a dummy content page that loads the content script.)

### Using React dev tools
Use React dev tools in standalone mode as such:
1. `npm run react-devtools` - This starts a devtools instance listening for your app to connect.

2. Paste this line BEFORE React-DOM is imported, or initialised: `import 'react-devtools'`. E.g. to run devtools for the popup, paste `import 'react-devtools'` in popup.js like so:

```js
import 'react-devtools' // <-- This MUST be at the top
import React from 'react'
import ReactDOM from 'react-dom'
...

window.onload = function() {
...
```

3. `auto/dev` - Start app in dev mode. App should now connect automatically to standalone devtools instance.

See https://github.com/facebook/react/blob/2663a12eb3d47d172eb7b3f5137dfc39babed199/packages/react-devtools/README.md#usage-with-react-dom for more details.
