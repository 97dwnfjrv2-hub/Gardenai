import { useEffect, useMemo, useState } from 'react'
import { AppNav } from './components/AppNav'
import { growProfile } from './data/profile'
import { telemetry } from './data/telemetry'
import { cultivationState, phaseProfiles } from './data/cultivation'
import { initialMeasurements } from './data/measurements'
import { integrationCatalog, knowledgeRules, strategyProfiles } from './data/domain'
import { calculateLighting, calculateVpd, evaluateSteering, overnightDryback } from './lib/cropSteering'
import { buildAssistantReport } from './lib/assistantEngine'
import { assessDataQuality } from './lib/dataQuality'
import { enrichRun, formatQuality, formatYield, totalDailyIrrigation } from './lib/domain'
import { appendItem, average, downloadJson, makeId, removeById } from './lib/collections'
import { buildAlerts, summarizeMeasurements } from './lib/summaries'
import { buildWeeklySummary, compareRuns } from './lib/analytics'
import { validateIrrigationDraft, validateMeasurementDraft, validateObservationDraft } from './lib/validation'
import { loadJson, saveJson } from './lib/storage'
import { OverviewView } from './views/OverviewView'
import { AssistantView } from './views/AssistantView'
import { LogsView } from './views/LogsView'
import { RunsView } from './views/RunsView'
import { IntegrationsView } from './views/IntegrationsView'
import { SettingsView } from './views/SettingsView'
import { IrrigationView } from './views/IrrigationView'
import { MeasurementsView } from './views/MeasurementsView'
import { WeeklySummaryView } from './views/WeeklySummaryView'
import { BackupView } from './views/BackupView'
import './styles.css'

const latest = telemetry[17]
const vpd = calculateVpd(latest.temp, latest.humidity, latest.leafTemp)
const lighting = calculateLighting(growProfile, 860, 12)

function App() {
  const [activeView, setActiveView] = useState(() => loadJson('gardenai.activeView', 'overview'))
  const [activeSetup, setActiveSetup] = useState(() => loadJson('gardenai.activeSetup', ''))
  const [activeStrategy, setActiveStrategy] = useState(() => loadJson('gardenai.activeStrategy', 'balanced-flower'))
  const [note, setNote] = useState(() => loadJson('gardenai.note', 'Morning check: confirm dryback, leaf posture, and runoff EC before steering harder.'))
  const [photosQueued, setPhotosQueued] = useState(() => loadJson('gardenai.photosQueued', 0))
  const [observations, setObservations] = useState(() => loadJson('gardenai.observations', cultivationState.observations))
  const [irrigationEvents, setIrrigationEvents] = useState(() => loadJson('gardenai.irrigationEvents', cultivationState.irrigationEvents))
  const [measurements, setMeasurements] = useState(() => loadJson('gardenai.measurements', initialMeasurements))
  const [newObservation, setNewObservation] = useState({ day: 'Flower D12', category: 'general', note: '' })
  const [draftEvent, setDraftEvent] = useState({ time: '19:00', phase: 'P3', volumeMlPerPlant: '220', runoffPct: '12' })
  const [draftMeasurement, setDraftMeasurement] = useState({ day: 'Flower D12', drybackPct: '25', runoffEc: '2.95', runoffPh: '6.0', rootZoneVwc: '32' })
  const [irrigationErrors, setIrrigationErrors] = useState([])
  const [measurementErrors, setMeasurementErrors] = useState([])
  const [observationErrors, setObservationErrors] = useState([])
  const [backupStatus, setBackupStatus] = useState('')

  useEffect(() => saveJson('gardenai.activeView', activeView), [activeView])
  useEffect(() => saveJson('gardenai.activeSetup', activeSetup), [activeSetup])
  useEffect(() => saveJson('gardenai.activeStrategy', activeStrategy), [activeStrategy])
  useEffect(() => saveJson('gardenai.note', note), [note])
  useEffect(() => saveJson('gardenai.photosQueued', photosQueued), [photosQueued])
  useEffect(() => saveJson('gardenai.observations', observations), [observations])
  useEffect(() => saveJson('gardenai.irrigationEvents', irrigationEvents), [irrigationEvents])
  useEffect(() => saveJson('gardenai.measurements', measurements), [measurements])

  const currentRun = cultivationState.runs.find((run) => run.id === cultivationState.currentRunId)
  const activePlants = cultivationState.plants.filter((plant) => plant.runId === currentRun.id)
  const currentIrrigation = irrigationEvents.filter((event) => event.runId === currentRun.id)
  const currentObservations = observations.filter((observation) => observation.runId === currentRun.id)
  const currentMeasurements = measurements.filter((measurement) => measurement.runId === currentRun.id)
  const latestMeasurement = currentMeasurements[currentMeasurements.length - 1]
  const drybackPct = latestMeasurement?.drybackPct ?? overnightDryback(43, 31.8)
  const activePhase = phaseProfiles[currentRun.phase]
  const strategy = strategyProfiles.find((profile) => profile.id === activeStrategy)
  const dailyIrrigationMl = totalDailyIrrigation(currentIrrigation, activePlants.length)
  const avgRunoffEc = average(currentMeasurements.map((item) => Number(item.runoffEc)))
  const measurementSummary = summarizeMeasurements(currentMeasurements)
  const weeklySummary = buildWeeklySummary({ measurements: currentMeasurements, observations: currentObservations, irrigationEvents: currentIrrigation })
  const alerts = buildAlerts({ latestMeasurement, summary: measurementSummary, drybackBand: strategy.drybackBand })
  const runRows = cultivationState.runs.map((run) => ({ ...enrichRun(run, growProfile.potSetups), yield: formatYield(run.yieldKg), quality: formatQuality(run.qualityScore), avgDryback: `${run.avgDrybackPct}%` }))
  const runComparison = compareRuns(cultivationState.runs)

  const steering = useMemo(() => evaluateSteering({ drybackPct, runoffEcDelta: latest.runoffEc - latest.reservoirEc, currentVpd: vpd, setupConfirmed: Boolean(activeSetup), phaseProfile: activePhase, strategyProfile: strategy }), [activeSetup, activePhase, strategy, drybackPct])
  const assistant = useMemo(() => buildAssistantReport({ activeSetup, drybackPct, runoffEcDelta: latest.runoffEc - latest.reservoirEc, vpd, ppfdMapped: false, runoffTrendPoints: currentMeasurements.length, phaseProfile: activePhase, strategyProfile: strategy, totalDailyIrrigationMl: dailyIrrigationMl }), [activeSetup, activePhase, strategy, dailyIrrigationMl, drybackPct, currentMeasurements.length])
  const quality = useMemo(() => assessDataQuality({ activeSetup, drybackPct, ppfdMapped: false, runoffTrendPoints: currentMeasurements.length }), [activeSetup, drybackPct, currentMeasurements.length])

  const handleAddObservation = () => { const errors = validateObservationDraft(newObservation); setObservationErrors(errors); if (!errors.length) { setObservations((items) => appendItem(items, { id: makeId('obs'), runId: currentRun.id, ...newObservation })); setNewObservation((item) => ({ ...item, note: '' })) } }
  const handleAddIrrigation = () => { const errors = validateIrrigationDraft(draftEvent); setIrrigationErrors(errors); if (!errors.length) setIrrigationEvents((items) => appendItem(items, { id: makeId('irr'), runId: currentRun.id, time: draftEvent.time, phase: draftEvent.phase, volumeMlPerPlant: Number(draftEvent.volumeMlPerPlant), runoffPct: Number(draftEvent.runoffPct) })) }
  const handleAddMeasurement = () => { const errors = validateMeasurementDraft(draftMeasurement); setMeasurementErrors(errors); if (!errors.length) setMeasurements((items) => appendItem(items, { id: makeId('m'), runId: currentRun.id, day: draftMeasurement.day, drybackPct: Number(draftMeasurement.drybackPct), runoffEc: Number(draftMeasurement.runoffEc), runoffPh: Number(draftMeasurement.runoffPh), rootZoneVwc: Number(draftMeasurement.rootZoneVwc) })) }
  const handleExport = () => { downloadJson('gardenai-backup.json', { observations, irrigationEvents, measurements, activeSetup, activeStrategy }); setBackupStatus('Backup exported.') }
  const handleImport = async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const payload = JSON.parse(await file.text()); setObservations(payload.observations ?? []); setIrrigationEvents(payload.irrigationEvents ?? []); setMeasurements(payload.measurements ?? []); setActiveSetup(payload.activeSetup ?? ''); setActiveStrategy(payload.activeStrategy ?? 'balanced-flower'); setBackupStatus('Backup restored.') } catch { setBackupStatus('Could not restore backup. The file was not valid GardenAI JSON.') } }

  const views = {
    overview: <OverviewView latest={latest} vpd={vpd} drybackPct={drybackPct} telemetry={telemetry} lighting={lighting} />,
    assistant: <AssistantView assistant={assistant} steering={steering} quality={quality} knowledgeRules={knowledgeRules} />,
    logs: <LogsView logs={currentObservations} note={note} onNoteChange={setNote} photosQueued={photosQueued} onQueuePhoto={() => setPhotosQueued((count) => count + 1)} onAddObservation={handleAddObservation} newObservation={newObservation} onObservationChange={(field, value) => setNewObservation((item) => ({ ...item, [field]: value }))} onDeleteObservation={(id) => setObservations((items) => removeById(items, id))} errors={observationErrors} />,
    irrigation: <IrrigationView events={currentIrrigation} onAddEvent={handleAddIrrigation} draftEvent={draftEvent} onDraftChange={(field, value) => setDraftEvent((item) => ({ ...item, [field]: value }))} totalDailyIrrigationMl={dailyIrrigationMl} errors={irrigationErrors} onDeleteEvent={(id) => setIrrigationEvents((items) => removeById(items, id))} />,
    measurements: <MeasurementsView measurements={currentMeasurements} onAddMeasurement={handleAddMeasurement} draftMeasurement={draftMeasurement} onDraftChange={(field, value) => setDraftMeasurement((item) => ({ ...item, [field]: value }))} errors={measurementErrors} summary={measurementSummary} alerts={alerts} onDeleteMeasurement={(id) => setMeasurements((items) => removeById(items, id))} />,
    weekly: <WeeklySummaryView summary={weeklySummary} />,
    runs: <RunsView runs={runRows} comparison={runComparison} />,
    backup: <BackupView onExport={handleExport} onImport={handleImport} backupStatus={backupStatus} />,
    integrations: <IntegrationsView integrations={integrationCatalog} />,
    settings: <SettingsView growProfile={growProfile} activeSetup={activeSetup} onSetupChange={setActiveSetup} strategyProfiles={strategyProfiles} activeStrategy={activeStrategy} onStrategyChange={setActiveStrategy} currentRun={currentRun} activePlants={activePlants} irrigationEvents={currentIrrigation} activePhase={activePhase} avgRunoffEc={avgRunoffEc} />,
  }

  return <main className="app-shell"><header className="hero"><div><p>GardenAI · Cultivation Intelligence</p><h1>Professional coco crop-steering platform</h1><span>Built around the active 3.0 m × 1.1 m flowering canopy, not the whole room.</span></div><div className="hero-chip">Evidence-first mode · assumptions exposed</div></header><AppNav activeView={activeView} onChange={setActiveView} />{views[activeView]}</main>
}

export default App
