# GardenAI Cultivation Intelligence

A React/Vite dashboard prototype for a professional coco crop-steering workflow.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Then open the local URL printed by Vite.

## What is included

- Professional dark-mode dashboard
- Mock environmental telemetry
- Crop steering interpretation engine
- Uncertainty-aware AI assistant surface
- Lighting calculations based on active canopy area
- Daily grow log and run comparison
- Responsive layouts for desktop, tablet, and mobile

## Architecture

- `src/data/profile.js` — real grow profile and evidence model
- `src/data/telemetry.js` — mock live telemetry, logs, run history
- `src/lib/cropSteering.js` — calculations and rule evaluation
- `src/lib/assistantEngine.js` — uncertainty-aware assistant logic
- `src/App.jsx` — dashboard composition

## Next production steps

1. Add a real database and run history model
2. Add authenticated user/profile management
3. Add ingestion adapters for Trolmaster, Home Assistant, AROYA, and manual CSV imports
4. Replace mock assistant rules with a retrieval-backed evidence layer and explicit source citations
5. Add PPFD mapping workflow, irrigation event editor, and image upload storage
