# Digital Product Passport Catalogue

A working Next.js catalogue generated from the supplied `dppMain.json` information-model export.

## Features
- Search and product-series filtering
- Individual passport pages
- Information-model metadata/path viewer
- Typed adapter layer
- JSON API endpoints at `/api/passports` and `/api/passports/[dppId]`
- Responsive layout

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Production
```bash
npm run build
npm start
```

Replace `src/data/dppMain.json` with a compatible export. For live integration, update `src/lib/dpp-adapter.ts` to fetch the source API while preserving the `Passport` interface.
