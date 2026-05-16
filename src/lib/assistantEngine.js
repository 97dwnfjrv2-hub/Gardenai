export function buildAssistantReport({ activeSetup, drybackPct, runoffEcDelta, vpd, ppfdMapped, runoffTrendPoints }) {
  const missing = []
  if (!activeSetup) missing.push('active pot setup')
  if (drybackPct == null) missing.push('overnight dryback endpoints')
  if (!ppfdMapped) missing.push('canopy PPFD map')
  if (runoffTrendPoints < 3) missing.push('at least 3 runoff trend points')

  const observations = [
    'Current dataset supports environment and runoff trend review.',
    runoffEcDelta > 0.5
      ? 'Runoff EC is meaningfully above reservoir EC, which may indicate accumulation or insufficient leaching.'
      : 'Runoff EC is only modestly above reservoir EC in the current sample.',
    vpd > 1.5
      ? 'Current VPD is on the more generative side of the operating range.'
      : 'Current VPD is not unusually aggressive from the present sample.',
  ]

  const confidence = missing.length === 0 ? 'High' : missing.length <= 2 ? 'Medium' : 'Low'
  const recommendation = !activeSetup
    ? 'Confirm the active pot setup before changing irrigation timing or shot size.'
    : drybackPct != null && drybackPct > 30
      ? 'Hold further stress escalation until morning recovery, substrate EC, and next-day transpiration confirm the plants are tolerating the current dryback.'
      : runoffEcDelta > 0.5
        ? 'Review P1 start timing and cumulative daily runoff before increasing EC or extending dryback.'
        : 'No strong corrective action is justified yet; continue logging and tighten measurement coverage.'

  return { confidence, missing, observations, recommendation }
}
