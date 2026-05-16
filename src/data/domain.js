export const integrationCatalog = [
  { id: 'manual', name: 'Manual entry', status: 'active', role: 'Baseline logging and correction workflow' },
  { id: 'home-assistant', name: 'Home Assistant', status: 'planned', role: 'Environmental telemetry bridge' },
  { id: 'trolmaster', name: 'TrolMaster / Hydro-X', status: 'planned', role: 'Environmental control and automation' },
  { id: 'aroya', name: 'AROYA', status: 'planned', role: 'Substrate and crop-steering telemetry' },
  { id: 'telegram', name: 'Telegram alerts', status: 'planned', role: 'Operational alert delivery' },
]

export const strategyProfiles = [
  {
    id: 'balanced-flower',
    name: 'Balanced flower',
    drybackBand: '18–26%',
    target: 'Consistency-first steering with moderate generative pressure',
  },
  {
    id: 'generative-flower',
    name: 'Generative flower',
    drybackBand: '24–30%',
    target: 'More aggressive reproductive steering with tighter observation requirements',
  },
  {
    id: 'vegetative-recovery',
    name: 'Vegetative recovery',
    drybackBand: '12–18%',
    target: 'Recovery-oriented steering after stress or weak uptake',
  },
]

export const knowledgeRules = [
  {
    input: 'active pot setup',
    reason: 'Shot volume and substrate response differ between the two validated container strategies.',
    criticality: 'required',
  },
  {
    input: 'overnight dryback endpoints',
    reason: 'Dryback interpretation requires start and end measurements rather than one isolated reading.',
    criticality: 'required',
  },
  {
    input: 'PPFD map',
    reason: 'Average PPFD alone hides edge falloff and under-canopy contribution.',
    criticality: 'important',
  },
  {
    input: 'runoff history',
    reason: 'Runoff EC becomes meaningful as a trend, not as a single value.',
    criticality: 'important',
  },
]
