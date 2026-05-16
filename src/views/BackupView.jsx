import { HardDriveDownload, HardDriveUpload } from 'lucide-react'
import { Panel } from '../components/Panel'

export function BackupView({ onExport, onImport, backupStatus }) {
  return <section className="split-grid">
    <Panel title="Backup" icon={HardDriveDownload}>
      <p className="muted-copy">Export the current local GardenAI record set as JSON so the data is not trapped in this browser.</p>
      <button className="primary-action" onClick={onExport}>Export backup</button>
    </Panel>
    <Panel title="Restore" icon={HardDriveUpload}>
      <label className="file-input">
        Import backup
        <input type="file" accept="application/json" onChange={onImport} />
      </label>
      {backupStatus && <p className="muted-copy">{backupStatus}</p>}
    </Panel>
  </section>
}
