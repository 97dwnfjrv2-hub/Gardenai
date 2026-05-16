import { NotebookTabs, Trash2 } from 'lucide-react'
import { Panel } from '../components/Panel'

export function LogsView({ logs, note, onNoteChange, photosQueued, onQueuePhoto, onAddObservation, newObservation, onObservationChange, onDeleteObservation, errors }) {
  return <section className="split-grid">
    <Panel title="New daily entry" icon={NotebookTabs}>
      <div className="note-box expanded">
        <label>Daily note<textarea value={note} onChange={(event) => onNoteChange(event.target.value)} /></label>
        <div className="inline-actions"><button onClick={onQueuePhoto}>Queue photo</button><span>{photosQueued} queued today</span></div>
      </div>
      <div className="form-grid">
        <label>Day label<input value={newObservation.day} onChange={(event) => onObservationChange('day', event.target.value)} /></label>
        <label>Category<input value={newObservation.category} onChange={(event) => onObservationChange('category', event.target.value)} /></label>
        <label className="full-span">Observation<textarea value={newObservation.note} onChange={(event) => onObservationChange('note', event.target.value)} /></label>
      </div>
      {errors.length > 0 && <div className="form-errors">{errors.map(error => <span key={error}>{error}</span>)}</div>}
      <button className="primary-action" onClick={onAddObservation}>Add observation</button>
    </Panel>
    <div className="panel"><h2>Recent journal</h2><div className="log-list expanded-list">{logs.map(log => <article key={log.id}><div className="row-between"><strong>{log.day}</strong><button className="icon-button" onClick={() => onDeleteObservation(log.id)}><Trash2 size={14} /></button></div><p>{log.note}</p><span>{log.category}</span></article>)}</div></div>
  </section>
}
