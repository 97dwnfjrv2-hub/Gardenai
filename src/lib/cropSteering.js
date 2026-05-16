export function saturationVaporPressure(tempC) {
  return 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3))
}

export function calculateVpd(tempC, rh, leafTempC = tempC) {
  const airVp = saturationVaporPressure(tempC) * (rh / 100)
  const leafSvp = saturationVaporPressure(leafTempC)
  return Number((leafSvp - airVp).toFixed(2))
}

export function calculateDli(ppfd, photoperiodHours) {
  return Number(((ppfd * 3600 * photoperiodHours) / 1_000_000).toFixed(1))
}

export function calculateLighting(profile, averageTopPpfd = 860, photoperiodHours = 12) {
  const canopyArea = profile.room.activeCanopyM.length * profile.room.activeCanopyM.width
  const topWatts = profile.lighting.topLights.reduce((sum, light) => sum + light.watts, 0)
  const underWatts = profile.lighting.underCanopyLights.reduce((sum, light) => sum + light.watts, 0)
  const totalWatts = topWatts + underWatts
  return {
    canopyArea,
    totalWatts,
    topWatts,
    underWatts,
    wattsPerSqm: Math.round(totalWatts / canopyArea),
    estimatedTopDli: calculateDli(averageTopPpfd, photoperiodHours),
    estimatedUnderContribution: 'Requires measured under-canopy PPFD map',
    edgeFalloff: 'Requires grid readings across canopy edges',
  }
}

export function overnightDryback(startVwc, endVwc) {
  if (startVwc == null || endVwc == null || startVwc <= 0) return null
  return Number((((startVwc - endVwc) / startVwc) * 100).toFixed(1))
}

export function evaluateSteering({ drybackPct, runoffEcDelta, currentVpd, setupConfirmed, phaseProfile, strategyProfile }) {
  const findings = []
  if (!setupConfirmed) {
    findings.push({ severity: 'required', text: 'Confirm the active pot setup before irrigation recommendations: 8 × 15 L and 4 × 30 L behave differently.' })
  }
  if (drybackPct == null) {
    findings.push({ severity: 'missing', text: 'Overnight dryback cannot be evaluated without start-of-night and pre-first-shot root-zone readings.' })
  } else if (drybackPct < 15) {
    findings.push({ severity: 'watch', text: 'Dryback is shallow; this may indicate overly vegetative steering or excessive late-day irrigation.' })
  } else if (drybackPct > 30) {
    findings.push({ severity: 'watch', text: 'Dryback is aggressive; confirm cultivar response, morning turgor, and substrate EC before pushing harder.' })
  } else {
    findings.push({ severity: 'good', text: 'Dryback is within a useful steering window for interpretation, assuming sensor calibration is valid.' })
  }
  if (runoffEcDelta > 0.5) findings.push({ severity: 'watch', text: 'Runoff EC is separating materially from input EC; investigate shot size, frequency, and substrate accumulation trend.' })
  if (currentVpd > 1.5) findings.push({ severity: 'watch', text: 'VPD is elevated for a heavily lit room; confirm leaf temperature and transpiration response before increasing light or stress.' })
  if (phaseProfile && strategyProfile) findings.push({ severity: 'good', text: `${phaseProfile.label} is currently paired with the ${strategyProfile.name.toLowerCase()} profile. Target dryback reference: ${strategyProfile.drybackBand}.` })
  return findings
}
