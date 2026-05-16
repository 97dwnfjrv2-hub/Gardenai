export function assessDataQuality({ activeSetup, drybackPct, ppfdMapped, runoffTrendPoints }) {
  const checks = [
    {
      label: 'Active pot setup',
      status: activeSetup ? 'complete' : 'missing',
      detail: activeSetup ? 'Container strategy confirmed.' : 'Needed before shot-size recommendations.',
    },
    {
      label: 'Overnight dryback',
      status: drybackPct == null ? 'missing' : 'complete',
      detail: drybackPct == null ? 'Need start and end substrate readings.' : `${drybackPct}% calculated from endpoints.`,
    },
    {
      label: 'PPFD mapping',
      status: ppfdMapped ? 'complete' : 'partial',
      detail: ppfdMapped ? 'Canopy map available.' : 'Average reading exists; grid map still missing.',
    },
    {
      label: 'Runoff history',
      status: runoffTrendPoints >= 3 ? 'complete' : 'partial',
      detail: runoffTrendPoints >= 3 ? 'Trend depth is sufficient.' : 'Need at least 3 points for trend confidence.',
    },
  ]

  const score = checks.reduce((total, check) => {
    if (check.status === 'complete') return total + 1
    if (check.status === 'partial') return total + 0.5
    return total
  }, 0)

  return {
    checks,
    score,
    maxScore: checks.length,
    label: score >= 3.5 ? 'Strong' : score >= 2.5 ? 'Usable' : 'Limited',
  }
}
