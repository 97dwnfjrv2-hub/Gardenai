import { NotebookTabs } from 'lucide-react'
import { Panel } from '../components/Panel'

export function LogsView({ logs, note, onNoteChange, photosQueued, onQueuePhoto }) {
  return <section className="split-grid">
    <Panel title="New daily entry" icon={NotebookTabs}>
      <div className="note-box expanded">
        <label>
          Daily note
          <textarea value={note} onChange={(event) => onNoteChange(event.target.value)} />
        </label>
        <div className="inline-actions">
          <button onClick={onQueuePhoto}>Queue photo</button>
          <span>{photosQueued} queued today</span>
        </div>
      </div>
    </Panel>

    <div className="panel">
      <h2>Recent journal</h2>
      <div className="log-list expanded-list">{logs.map(log => <article key={log.day}><strong>{log.day}</strong><p>{log.note}</p><span>{log.issue} · {log.photos} photos</span></article>)}</div>
    </div>
  </section>
}
