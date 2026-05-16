import { useMemo, useState } from 'react'
import { Activity, AlertTriangle, Brain, Droplets, Leaf, Lightbulb, NotebookTabs, ThermometerSun } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts'
import { growProfile, evidenceLibrary } from './data/profile'
import { telemetry, growLogs, runs } from './data/telemetry'
import { calculateDli, calculateLighting, calculateVpd, evaluateSteering, overnightDryback } from './lib/cropSteering'
import { buildAssistantReport } from './lib/assistantEngine'
import './styles.css'

const latest = telemetry[17]
const vpd = calculateVpd(latest.temp, latest.humidity, latest.leafTemp)
const drybackPct = overnightDryback(43, 31.8)
const lighting = calculateLighting(growProfile, 860, 12)

function MetricCard({ label, value, detail }) {
  return <div className="metric-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
}

function Panel({ title, icon: Icon, children, className = '' }) {
  return <section className={`panel ${className}`}><header><Icon size={18} /><h2>{title}</h2></header>{children}</section>
}

function App() {
  const [activeSetup, setActiveSetup] = useState('')
  const [note, setNote] = useState('Morning check: confirm dryback, leaf posture, and runoff EC before steering harder.')
  const [photosQueued, setPhotosQueued] = useState(0)

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

  return <main className="app-shell">
    <header className="hero">
      <div>
        <p>GardenAI · Cultivation Intelligence</p>
        <h1>Professional coco crop-steering dashboard</h1>
        <span>Built around the active 3.0 m × 1.1 m flowering canopy, not the whole room.</span>
      </div>
      <div className="hero-chip">Evidence-first mode · assumptions exposed</div>
    </header>

    <section className="metric-grid">
      <MetricCard label="Room Temp" value={`${latest.temp}°C`} detail="Inkbird mock telemetry" />
      <MetricCard label="Humidity" value={`${latest.humidity}%`} detail="Lights on" />
      <MetricCard label="Leaf Temp" value={`${latest.leafTemp}°C`} detail="Leaf offset captured" />
      <MetricCard label="VPD" value={`${vpd} kPa`} detail="Leaf-adjusted" />
      <MetricCard label="PPFD" value={`${latest.ppfd} µmol/m²/s`} detail="Needs canopy map" />
      <MetricCard label="DLI" value={`${calculateDli(860, 12)} mol/m²/d`} detail="Estimated top-light DLI" />
      <MetricCard label="Runoff EC" value={`${latest.runoffEc} mS/cm`} detail={`+${(latest.runoffEc - latest.reservoirEc).toFixed(2)} over feed`} />
      <MetricCard label="Dryback" value={`${drybackPct}%`} detail="Overnight estimate" />
    </section>

    <section className="dashboard-grid">
      <Panel title="Environmental control" icon={ThermometerSun}>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height={240}><LineChart data={telemetry}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" minTickGap={28} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Line yAxisId="left" type="monotone" dataKey="temp" stroke="#8de0b0" strokeWidth={2} /><Line yAxisId="left" type="monotone" dataKey="leafTemp" stroke="#60a5fa" strokeWidth={2} /><Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#fbbf24" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
      </Panel>

      <Panel title="Irrigation + dryback" icon={Droplets}>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height={240}><BarChart data={telemetry}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" minTickGap={28} /><YAxis /><Tooltip /><Bar dataKey="irrigationMl" fill="#38bdf8" /><Line type="monotone" dataKey="rootZone" stroke="#a78bfa" /></BarChart></ResponsiveContainer></div>
        <div className="schedule-row">
          <span>P1 07:00 · 220 mL</span>
          <span>P2 09:00–15:00 · 220 mL q2h</span>
          <span>P3 17:00 · 220 mL</span>
        </div>
      </Panel>

      <Panel title="AI cultivation assistant" icon={Brain} className="assistant-panel">
        <div className="assistant-head"><strong>{assistant.confidence} confidence</strong><span>{assistant.missing.length} data gaps</span></div>
        <p className="assistant-rec">{assistant.recommendation}</p>
        <h3>Why</h3>
        <ul>{assistant.observations.map(item => <li key={item}>{item}</li>)}</ul>
        <h3>Need before stronger advice</h3>
        <ul>{assistant.missing.map(item => <li key={item}>{item}</li>)}</ul>
      </Panel>

      <Panel title="Crop steering engine" icon={Leaf}>
        <div className="setup-picker">
          <span>Active pot setup</span>
          {growProfile.potSetups.map(setup => (
            <button key={setup.id} className={activeSetup === setup.id ? 'active' : ''} onClick={() => setActiveSetup(setup.id)}>
              {setup.label}
            </button>
          ))}
        </div>
        <div className="steering-list">{steering.map((item, index) => <div className={`steering ${item.severity}`} key={index}>{item.text}</div>)}</div>
      </Panel>

      <Panel title="Lighting intelligence" icon={Lightbulb}>
        <div className="spec-grid">
          <MetricCard label="Active canopy" value={`${lighting.canopyArea.toFixed(1)} m²`} detail="3.0 × 1.1 m" />
          <MetricCard label="Total power" value={`${lighting.totalWatts} W`} detail={`${lighting.topWatts} W top + ${lighting.underWatts} W under`} />
          <MetricCard label="Watt density" value={`${lighting.wattsPerSqm} W/m²`} detail="Based on active canopy" />
          <MetricCard label="Edge falloff" value="Unresolved" detail="Needs PPFD grid" />
        </div>
      </Panel>

      <Panel title="Runoff + EC trends" icon={Activity}>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height={220}><AreaChart data={telemetry}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" minTickGap={28} /><YAxis /><Tooltip /><Area type="monotone" dataKey="runoffEc" stroke="#fb7185" fill="#fb718533" /><Area type="monotone" dataKey="reservoirEc" stroke="#34d399" fill="#34d39922" /></AreaChart></ResponsiveContainer></div>
      </Panel>

      <Panel title="Daily grow log" icon={NotebookTabs}>
        <div className="note-box">
          <textarea value={note} onChange={(event) => setNote(event.target.value)} />
          <button onClick={() => setPhotosQueued((count) => count + 1)}>Queue photo</button>
          <span>{photosQueued} queued today</span>
        </div>
        <div className="log-list">{growLogs.map(log => <article key={log.day}><strong>{log.day}</strong><p>{log.note}</p><span>{log.issue} · {log.photos} photos</span></article>)}</div>
      </Panel>

      <Panel title="Run comparison" icon={AlertTriangle}>
        <div className="table-wrap"><table><thead><tr><th>Run</th><th>Setup</th><th>Yield</th><th>Quality</th><th>Avg dryback</th></tr></thead><tbody>{runs.map(run => <tr key={run.run}><td>{run.run}</td><td>{run.setup}</td><td>{run.yield}</td><td>{run.quality}</td><td>{run.avgDryback}</td></tr>)}</tbody></table></div>
      </Panel>
    </section>

    <section className="footer-panels">
      <div className="panel mini-panel">
        <h2>Current measurement gaps</h2>
        <p>Active pot setup, PPFD mapping, under-canopy readings, and longer runoff history are intentionally unresolved. The system refuses to invent them.</p>
      </div>
      <div className="panel mini-panel">
        <h2>Evidence model</h2>
        <div className="evidence-row">{evidenceLibrary.map(item => <span key={item.source}>{item.source}</span>)}</div>
      </div>
      <div className="panel mini-panel integrations">
        <h2>Future integrations</h2>
        <p>Trolmaster · Home Assistant · AROYA sensors · Telegram alerts · live APIs</p>
      </div>
    </section>
  </main>
}

export default App
