# StonebutStone

돌은 항상 돌입니다.

Windows desktop rock simulator built with Electron, React, Vite, and TypeScript.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run test
npm run build
npm run package:win
```

## Rock Assets

The app bundles 100 surreal rock assets under `src/assets/rocks/catalog-webp`.
Regenerate them from the checked-in source atlases with:

```bash
npm run assets:rocks
```

## Releases And Auto Update

Windows installer updates are served from GitHub Releases through `electron-updater`.
Upload these files together for each release:

- `rock-simulator-desktop-setup-<version>.exe`
- `rock-simulator-desktop-setup-<version>.exe.blockmap`
- `latest.yml`

The portable executable is also published for direct download, but automatic updates are intended for the NSIS setup install.
