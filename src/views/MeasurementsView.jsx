import { AlertTriangle, FlaskConical, Trash2 } from 'lucide-react'
import { Panel } from '../components/Panel'

export function MeasurementsView({ measurements, onAddMeasurement, draftMeasurement, onDraftChange, errors, summary, alerts, onDeleteMeasurement }) {
  return <section className="measurement-layout">
    <Panel title="Manual measurements" icon={FlaskConical}>
      <div className="table-wrap"><table><thead><tr><th>Day</th><th>Dryback</th><th>Runoff EC</th><th>Runoff pH</th><th>Root zone</th><th></th></tr></thead><tbody>{measurements.map(item => <tr key={item.id}><td>{item.day}</td><td>{item.drybackPct}%</td><td>{item.runoffEc}</td><td>{item.runoffPh}</td><td>{item.rootZoneVwc}%</td><td><button className="icon-button" onClick={() => onDeleteMeasurement(item.id)}><Trash2 size={14} /></button></td></tr>)}</tbody></table></div>
    </Panel>
    <div className="panel">
      <h2>Add measurement</h2>
      <div className="form-grid compact">
        <label>Day<input value={draftMeasurement.day} onChange={(event) => onDraftChange('day', event.target.value)} /></label>
        <label>Dryback %<input value={draftMeasurement.drybackPct} onChange={(event) => onDraftChange('drybackPct', event.target.value)} /></label>
        <label>Runoff EC<input value={draftMeasurement.runoffEc} onChange={(event) => onDraftChange('runoffEc', event.target.value)} /></label>
        <label>Runoff pH<input value={draftMeasurement.runoffPh} onChange={(event) => onDraftChange('runoffPh', event.target.value)} /></label>
        <label>Root zone VWC %<input value={draftMeasurement.rootZoneVwc} onChange={(event) => onDraftChange('rootZoneVwc', event.target.value)} /></label>
      </div>
      {errors.length > 0 && <div className="form-errors">{errors.map(error => <span key={error}>{error}</span>)}</div>}
      <button className="primary-action" onClick={onAddMeasurement}>Add measurement</button>
    </div>
    <Panel title="Measurement summary" icon={AlertTriangle} className="wide-panel">
      {summary ? <div className="summary-grid">
        <div><span>Entries</span><strong>{summary.count}</strong></div>
        <div><span>Latest dryback</span><strong>{summary.latestDrybackPct}%</strong></div>
        <div><span>Runoff EC change</span><strong>{summary.runoffEcChange}</strong></div>
        <div><span>Root zone change</span><strong>{summary.rootZoneChange}%</strong></div>
      </div> : <p className="muted-copy">No measurements yet.</p>}
      <div className="steering-list compact-alerts">{alerts.map((alert, index) => <div className={`steering ${alert.severity}`} key={index}>{alert.text}</div>)}</div>
    </Panel>
  </section>
}
