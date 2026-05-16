export function summarizeMeasurements(measurements) {
  if (!measurements.length) return null
  const latest = measurements[measurements.length - 1]
  const first = measurements[0]
  return {
    count: measurements.length,
    latestDrybackPct: latest.drybackPct,
    runoffEcChange: Number((latest.runoffEc - first.runoffEc).toFixed(2)),
    rootZoneChange: Number((latest.rootZoneVwc - first.rootZoneVwc).toFixed(1)),
  }
}

export function buildAlerts({ latestMeasurement, summary, drybackBand }) {
  const alerts = []
  if (!latestMeasurement) return alerts
  const [min, max] = drybackBand.replace('%', '').split('–').map(Number)
  if (latestMeasurement.drybackPct < min) alerts.push({ severity: 'watch', text: 'Latest dryback is below the active strategy band.' })
  if (latestMeasurement.drybackPct > max) alerts.push({ severity: 'watch', text: 'Latest dryback is above the active strategy band.' })
  if (summary?.runoffEcChange > 0.2) alerts.push({ severity: 'watch', text: 'Runoff EC is trending upward across the available measurements.' })
  return alerts
}
