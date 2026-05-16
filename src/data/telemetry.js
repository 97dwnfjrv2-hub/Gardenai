const hours = Array.from({ length: 24 }, (_, i) => i)

export const telemetry = hours.map((hour) => {
  const lightsOn = hour >= 6 && hour < 18
  const ppfd = lightsOn ? 780 + Math.round(Math.sin(((hour - 6) / 12) * Math.PI) * 140) : 0
  const temp = lightsOn ? 25.4 + Math.sin(((hour - 6) / 12) * Math.PI) * 1.2 : 22.3
  const humidity = lightsOn ? 58 - Math.sin(((hour - 6) / 12) * Math.PI) * 6 : 62
  const leafTemp = temp - (lightsOn ? 1.1 : 0.4)
  const rootZone = lightsOn ? 43 - Math.max(0, hour - 6) * 1.2 : 31 + Math.max(0, 6 - hour) * 0.35
  const reservoirEc = 2.2
  const reservoirPh = 5.8
  const runoffEc = lightsOn ? 2.8 + Math.sin((hour / 24) * Math.PI) * 0.25 : 3.0
  const runoffPh = lightsOn ? 6.0 : 6.1
  return {
    hour,
    label: `${hour.toString().padStart(2, '0')}:00`,
    temp: Number(temp.toFixed(1)),
    humidity: Number(humidity.toFixed(0)),
    leafTemp: Number(leafTemp.toFixed(1)),
    ppfd,
    rootZone: Number(rootZone.toFixed(1)),
    reservoirEc,
    reservoirPh,
    runoffEc: Number(runoffEc.toFixed(2)),
    runoffPh,
    irrigationMl: [7, 9, 11, 13, 15, 17].includes(hour) ? 220 : 0,
  }
})

export const growLogs = [
  { day: 'Flower D08', note: 'Canopy fully netted. Stretch controlled. First intentional generative dryback window started.', issue: 'None', photos: 4 },
  { day: 'Flower D09', note: 'Runoff EC rose slightly after later first shot. Leaf posture remained strong.', issue: 'Watch EC separation', photos: 3 },
  { day: 'Flower D10', note: 'Under-canopy lights enabled. Slight RH overshoot at lights-off.', issue: 'Night humidity', photos: 5 },
  { day: 'Flower D11', note: 'Dryback recovered after earlier P1 start. Good morning turgor.', issue: 'None', photos: 2 },
]

export const runs = [
  { run: 'Run 01', setup: '4 × 30 L', yield: '2.42 kg', quality: '8.7/10', avgDryback: '22%', avgRunoffEc: '2.7' },
  { run: 'Run 02', setup: '4 × 30 L', yield: '2.58 kg', quality: '8.9/10', avgDryback: '24%', avgRunoffEc: '2.8' },
  { run: 'Run 03', setup: '8 × 15 L', yield: 'In progress', quality: '—', avgDryback: '26%', avgRunoffEc: '2.9' },
]
