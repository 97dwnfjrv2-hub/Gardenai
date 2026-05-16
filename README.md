# GardenAI Cultivation Intelligence

A React/Vite local MVP for a professional coco crop-steering workflow.

## What you can use now

- Overview dashboard for environment, dryback, runoff EC, and lighting
- Assistant surface with confidence, uncertainty, and data-quality checks
- Grow log with add/delete observations
- Irrigation program with add/delete events and validation
- Manual measurements with add/delete records, summaries, and alerts
- Weekly summary view
- Run comparison analytics
- Backup export / restore for local data
- Local persistence in the browser so entered records survive reloads

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Then open the local URL printed by Vite.

## Current limitation

This is a usable local MVP, not yet the final cloud product. It stores data in the browser, not a hosted database, and it does not yet connect to live controllers or sensors.

## Architecture

- `src/data/profile.js` — physical grow profile and evidence sources
- `src/data/cultivation.js` — normalized run, plant, irrigation, and observation models
- `src/data/measurements.js` — seeded manual measurements
- `src/data/domain.js` — strategy profiles, integration roadmap, recommendation prerequisites
- `src/lib/cropSteering.js` — environmental and steering calculations
- `src/lib/assistantEngine.js` — confidence-aware assistant logic
- `src/lib/dataQuality.js` — input quality scoring
- `src/lib/analytics.js` — weekly summary and run comparison analytics
- `src/lib/summaries.js` — measurement summaries and alerts
- `src/lib/validation.js` — form validation
- `src/views/*` — product surfaces
- `src/components/*` — reusable UI building blocks

## Next production phase

1. Move records from browser-local storage into a backend database and API
2. Add user auth, photos, and stronger date-aware history
3. Add retrieval-backed evidence with citations for recommendations
4. Add live integrations for Home Assistant, TrolMaster, and AROYA when credentials are available
