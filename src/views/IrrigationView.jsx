import { Droplets, Trash2 } from 'lucide-react'
import { Panel } from '../components/Panel'

export function IrrigationView({ events, onAddEvent, draftEvent, onDraftChange, totalDailyIrrigationMl, errors, onDeleteEvent }) {
  return <section className="split-grid">
    <Panel title="Irrigation program" icon={Droplets}>
      <div className="table-wrap"><table><thead><tr><th>Time</th><th>Phase</th><th>mL / plant</th><th>Runoff target</th><th></th></tr></thead><tbody>{events.map(event => <tr key={event.id}><td>{event.time}</td><td>{event.phase}</td><td>{event.volumeMlPerPlant}</td><td>{event.runoffPct}%</td><td><button className="icon-button" onClick={() => onDeleteEvent(event.id)}><Trash2 size={14} /></button></td></tr>)}</tbody></table></div>
      <p className="muted-copy">Programmed total: {totalDailyIrrigationMl} mL/day across the active crop.</p>
    </Panel>
    <div className="panel">
      <h2>Add irrigation event</h2>
      <div className="form-grid compact">
        <label>Time<input value={draftEvent.time} onChange={(event) => onDraftChange('time', event.target.value)} /></label>
        <label>Phase<input value={draftEvent.phase} onChange={(event) => onDraftChange('phase', event.target.value)} /></label>
        <label>mL / plant<input value={draftEvent.volumeMlPerPlant} onChange={(event) => onDraftChange('volumeMlPerPlant', event.target.value)} /></label>
        <label>Runoff %<input value={draftEvent.runoffPct} onChange={(event) => onDraftChange('runoffPct', event.target.value)} /></label>
      </div>
      {errors.length > 0 && <div className="form-errors">{errors.map(error => <span key={error}>{error}</span>)}</div>}
      <button className="primary-action" onClick={onAddEvent}>Add event</button>
    </div>
  </section>
}
