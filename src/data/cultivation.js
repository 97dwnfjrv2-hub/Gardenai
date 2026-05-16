export const cultivationState = {
  currentRunId: 'run-03',
  runs: [
    { id: 'run-01', name: 'Run 01', setupId: '4x30', cultivar: 'Mixed canopy', status: 'completed', phase: 'harvested', startDate: '2026-01-12', yieldKg: 2.42, qualityScore: 8.7, avgDrybackPct: 22, avgRunoffEc: 2.7 },
    { id: 'run-02', name: 'Run 02', setupId: '4x30', cultivar: 'Mixed canopy', status: 'completed', phase: 'harvested', startDate: '2026-02-26', yieldKg: 2.58, qualityScore: 8.9, avgDrybackPct: 24, avgRunoffEc: 2.8 },
    { id: 'run-03', name: 'Run 03', setupId: '8x15', cultivar: 'Current flowering crop', status: 'active', phase: 'flower-stretch', startDate: '2026-04-28', yieldKg: null, qualityScore: null, avgDrybackPct: 26, avgRunoffEc: 2.9 },
  ],
  plants: [
    { id: 'p1', label: 'Plant 1', runId: 'run-03', position: 'Front left', status: 'active' },
    { id: 'p2', label: 'Plant 2', runId: 'run-03', position: 'Front center-left', status: 'active' },
    { id: 'p3', label: 'Plant 3', runId: 'run-03', position: 'Front center-right', status: 'active' },
    { id: 'p4', label: 'Plant 4', runId: 'run-03', position: 'Front right', status: 'active' },
    { id: 'p5', label: 'Plant 5', runId: 'run-03', position: 'Rear left', status: 'active' },
    { id: 'p6', label: 'Plant 6', runId: 'run-03', position: 'Rear center-left', status: 'active' },
    { id: 'p7', label: 'Plant 7', runId: 'run-03', position: 'Rear center-right', status: 'active' },
    { id: 'p8', label: 'Plant 8', runId: 'run-03', position: 'Rear right', status: 'active' },
  ],
  irrigationEvents: [
    { id: 'irr-1', runId: 'run-03', time: '07:00', phase: 'P1', volumeMlPerPlant: 220, runoffPct: 0 },
    { id: 'irr-2', runId: 'run-03', time: '09:00', phase: 'P2', volumeMlPerPlant: 220, runoffPct: 3 },
    { id: 'irr-3', runId: 'run-03', time: '11:00', phase: 'P2', volumeMlPerPlant: 220, runoffPct: 6 },
    { id: 'irr-4', runId: 'run-03', time: '13:00', phase: 'P2', volumeMlPerPlant: 220, runoffPct: 8 },
    { id: 'irr-5', runId: 'run-03', time: '15:00', phase: 'P2', volumeMlPerPlant: 220, runoffPct: 10 },
    { id: 'irr-6', runId: 'run-03', time: '17:00', phase: 'P3', volumeMlPerPlant: 220, runoffPct: 12 },
  ],
  observations: [
    { id: 'obs-1', runId: 'run-03', day: 'Flower D08', category: 'canopy', note: 'Canopy fully netted. Stretch controlled. First intentional generative dryback window started.' },
    { id: 'obs-2', runId: 'run-03', day: 'Flower D09', category: 'runoff', note: 'Runoff EC rose slightly after later first shot. Leaf posture remained strong.' },
    { id: 'obs-3', runId: 'run-03', day: 'Flower D10', category: 'environment', note: 'Under-canopy lights enabled. Slight RH overshoot at lights-off.' },
    { id: 'obs-4', runId: 'run-03', day: 'Flower D11', category: 'dryback', note: 'Dryback recovered after earlier P1 start. Good morning turgor.' },
  ],
}

export const phaseProfiles = {
  'flower-stretch': { label: 'Flower stretch', preferredSteering: 'generative', drybackTarget: '22–28%', caution: 'Stretch response can mask stress; confirm morning recovery before escalating.' },
  'bulk-flower': { label: 'Bulk flower', preferredSteering: 'balanced', drybackTarget: '18–24%', caution: 'Protect uptake and avoid unnecessary substrate EC drift.' },
  ripening: { label: 'Ripening', preferredSteering: 'generative', drybackTarget: '20–28%', caution: 'Bias toward consistency over dramatic late stress changes.' },
}
