import { useEffect, useMemo, useState } from 'react'
import { AppNav } from './components/AppNav'
import { growProfile } from './data/profile'
import { telemetry, growLogs, runs } from './data/telemetry'
import { integrationCatalog, knowledgeRules, strategyProfiles } from './data/domain'
import { calculateLighting, calculateVpd, evaluateSteering, overnightDryback } from './lib/cropSteering'
import { buildAssistantReport } from './lib/assistantEngine'
import { assessDataQuality } from './lib/dataQuality'
import { loadJson, saveJson } from './lib/storage'
import { OverviewView } from './views/OverviewView'
import { AssistantView } from './views/AssistantView'
import { LogsView } from './views/LogsView'
import { RunsView } from './views/RunsView'
import { IntegrationsView } from './views/IntegrationsView'
import { SettingsView } from './views/SettingsView'
import './styles.css'

const latest = telemetry[17]
const vpd = calculateVpd(latest.temp, latest.humidity, latest.leafTemp)
const drybackPct = overnightDryback(43, 31.8)
const lighting = calculateLighting(growProfile, 860, 12)

function App() {
  const [activeView, setActiveView] = useState(() => loadJson('gardenai.activeView', 'overview'))
  const [activeSetup, setActiveSetup] = useState(() => loadJson('gardenai.activeSetup', ''))
  const [activeStrategy, setActiveStrategy] = useState(() => loadJson('gardenai.activeStrategy', 'balanced-flower'))
  const [note, setNote] = useState(() => loadJson('gardenai.note', 'Morning check: confirm dryback, leaf posture, and runoff EC before steering harder.'))
  const [photosQueued, setPhotosQueued] = useState(() => loadJson('gardenai.photosQueued', 0))

  useEffect(() => saveJson('gardenai.activeView', activeView), [activeView])
  useEffect(() => saveJson('gardenai.activeSetup', activeSetup), [activeSetup])
  useEffect(() => saveJson('gardenai.activeStrategy', activeStrategy), [activeStrategy])
  useEffect(() => saveJson('gardenai.note', note), [note])
  useEffect(() => saveJson('gardenai.photosQueued', photosQueued), [photosQueued])

  const steering = useMemo(() => evaluateSteering({
    drybackPct,
    runoffEcDelta: latest.runoffEc - latest.reservoirEc,
    currentVpd: vpd,
    setupConfirmed: Boolean(activeSetup),
  }), [activeSetup])

  const assistant = useMemo(() => buildAssistantReport({
    activeSetup,
    drybackPct,
    runoffEcDelta: latest.runoffEc - latest.reservoirEc,
    vpd,
    ppfdMapped: false,
    runoffTrendPoints: 2,
  }), [activeSetup])

  const quality = useMemo(() => assessDataQuality({
    activeSetup,
    drybackPct,
    ppfdMapped: false,
    runoffTrendPoints: 2,
  }), [activeSetup])

  const views = {
    overview: <OverviewView latest={latest} vpd={vpd} drybackPct={drybackPct} telemetry={telemetry} lighting={lighting} />,
    assistant: <AssistantView assistant={assistant} steering={steering} quality={quality} knowledgeRules={knowledgeRules} />,
    logs: <LogsView logs={growLogs} note={note} onNoteChange={setNote} photosQueued={photosQueued} onQueuePhoto={() => setPhotosQueued((count) => count + 1)} />,
    runs: <RunsView runs={runs} />,
    integrations: <IntegrationsView integrations={integrationCatalog} />,
    settings: <SettingsView growProfile={growProfile} activeSetup={activeSetup} onSetupChange={setActiveSetup} strategyProfiles={strategyProfiles} activeStrategy={activeStrategy} onStrategyChange={setActiveStrategy} />,
  }

  return <main className="app-shell">
    <header className="hero">
      <div>
        <p>GardenAI · Cultivation Intelligence</p>
        <h1>Professional coco crop-steering platform</h1>
        <span>Built around the active 3.0 m × 1.1 m flowering canopy, not the whole room.</span>
      </div>
      <div className="hero-chip">Evidence-first mode · assumptions exposed</div>
    </header>

    <AppNav activeView={activeView} onChange={setActiveView} />
    {views[activeView]}
  </main>
}

export default App
