# 🏗️ Flutter Arch Studio

Web tool untuk generate Flutter project boilerplate — pilih arsitektur, state management, dan fitur, lalu download `.zip` siap pakai.

## Tech Stack

- **React 18** + Vite
- **JSZip** + file-saver untuk download
- CSS Modules untuk styling

## Local Development

```bash
npm install
npm run dev
```

## Deploy ke Vercel

```bash
# 1. Push ke GitHub
git init && git add . && git commit -m "init"
git remote add origin https://github.com/yourname/flutter-arch-studio.git
git push -u origin main

# 2. Import di vercel.com → New Project → pilih repo
# Vercel auto-detect Vite, langsung deploy
```

## Structure

```
src/
├── components/       # UI components (Header, ConfigPanel, OutputPanel, etc.)
├── data/             # Constants (arch, state, features config)
├── generators/       # File content generators
│   ├── pubspec.js        # pubspec.yaml generator
│   ├── coreFiles.js      # main.dart, app.dart, theme, router, etc.
│   ├── authFeature.js    # Auth domain/data/presentation files
│   └── projectBuilder.js # Main assembler
├── hooks/            # Custom hooks
│   ├── useProjectConfig.js
│   └── useDownload.js
└── styles/           # Global CSS
```

## Adding New Architectures / Features

1. Tambah constant di `src/data/constants.js`
2. Buat generator function di `src/generators/`
3. Register di `src/generators/projectBuilder.js`
