export function buildWeeklySummary({ measurements, observations, irrigationEvents }) {
  if (!measurements.length) return null
  const latest = measurements[measurements.length - 1]
  const first = measurements[0]
  return {
    entries: measurements.length,
    drybackRange: `${Math.min(...measurements.map((item) => item.drybackPct))}–${Math.max(...measurements.map((item) => item.drybackPct))}%`,
    runoffEcRange: `${Math.min(...measurements.map((item) => item.runoffEc)).toFixed(2)}–${Math.max(...measurements.map((item) => item.runoffEc)).toFixed(2)}`,
    runoffEcDelta: Number((latest.runoffEc - first.runoffEc).toFixed(2)),
    rootZoneDelta: Number((latest.rootZoneVwc - first.rootZoneVwc).toFixed(1)),
    observationCount: observations.length,
    irrigationCount: irrigationEvents.length,
  }
}

export function compareRuns(runs) {
  const completed = runs.filter((run) => run.yieldKg != null)
  if (completed.length < 2) return null
  const bestYield = completed.reduce((best, run) => run.yieldKg > best.yieldKg ? run : best)
  const bestQuality = completed.reduce((best, run) => run.qualityScore > best.qualityScore ? run : best)
  return {
    bestYieldRun: bestYield.name,
    bestYieldKg: bestYield.yieldKg,
    bestQualityRun: bestQuality.name,
    bestQualityScore: bestQuality.qualityScore,
    yieldDeltaKg: Number((completed[completed.length - 1].yieldKg - completed[0].yieldKg).toFixed(2)),
  }
}
