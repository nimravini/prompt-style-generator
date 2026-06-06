# Prompt Style Generator

Style Combo Generator landing repo.

## Installable pseudo-app

This repo now includes a PWA wrapper, so the tool can behave like a lightweight app shortcut once it is served through GitHub Pages.

- Main tool: `index.html`
- Installable app wrapper: `pwa.html`
- Manifest: `manifest.webmanifest`
- Service worker: `sw.js`
- App icon: `icons/style-combo-icon.svg`

Once GitHub Pages has deployed, open:

```text
https://nimravini.github.io/prompt-style-generator/pwa.html
```

Then use the browser’s install option:

- Chrome / Edge desktop: look for the install icon in the address bar, or use the three-dot menu → Cast, save, and share → Install page as app.
- Android Chrome: three-dot menu → Add to Home screen / Install app.
- iPhone Safari: Share button → Add to Home Screen.

The `Install app` button will appear automatically in browsers that expose the PWA install prompt. Some browsers hide that prompt and only offer install through their menu, because browsers are eldritch filing cabinets.
