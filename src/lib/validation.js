export function validateIrrigationDraft(draft) {
  const errors = []
  if (!/^\d{2}:\d{2}$/.test(draft.time)) errors.push('Time must use HH:MM format.')
  if (!draft.phase.trim()) errors.push('Phase is required.')
  if (!Number.isFinite(Number(draft.volumeMlPerPlant)) || Number(draft.volumeMlPerPlant) <= 0) errors.push('mL per plant must be greater than zero.')
  if (!Number.isFinite(Number(draft.runoffPct)) || Number(draft.runoffPct) < 0) errors.push('Runoff % must be zero or greater.')
  return errors
}

export function validateMeasurementDraft(draft) {
  const errors = []
  if (!draft.day.trim()) errors.push('Day is required.')
  for (const [label, value] of [
    ['Dryback %', draft.drybackPct],
    ['Runoff EC', draft.runoffEc],
    ['Runoff pH', draft.runoffPh],
    ['Root zone VWC %', draft.rootZoneVwc],
  ]) if (!Number.isFinite(Number(value))) errors.push(`${label} must be numeric.`)
  return errors
}

export function validateObservationDraft(draft) {
  const errors = []
  if (!draft.day.trim()) errors.push('Day is required.')
  if (!draft.category.trim()) errors.push('Category is required.')
  if (!draft.note.trim()) errors.push('Observation text is required.')
  return errors
}
