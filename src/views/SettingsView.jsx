import { Settings2 } from 'lucide-react'
import { Panel } from '../components/Panel'

export function SettingsView({ growProfile, activeSetup, onSetupChange, strategyProfiles, activeStrategy, onStrategyChange }) {
  return <section className="split-grid settings-layout">
    <Panel title="Grow profile" icon={Settings2}>
      <div className="settings-group">
        <span>Active pot setup</span>
        <div className="setup-picker">
          {growProfile.potSetups.map(setup => (
            <button key={setup.id} className={activeSetup === setup.id ? 'active' : ''} onClick={() => onSetupChange(setup.id)}>
              {setup.label}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-group">
        <span>Steering strategy</span>
        <div className="strategy-list">{strategyProfiles.map(profile => (
          <button key={profile.id} className={activeStrategy === profile.id ? 'active' : ''} onClick={() => onStrategyChange(profile.id)}>
            <strong>{profile.name}</strong>
            <small>{profile.drybackBand}</small>
          </button>
        ))}</div>
      </div>
    </Panel>
    <div className="panel">
      <h2>Fixed room profile</h2>
      <dl className="definition-grid">
        <div><dt>Room</dt><dd>3.0 × 1.8 × 3.0 m</dd></div>
        <div><dt>Active canopy</dt><dd>3.0 × 1.1 m</dd></div>
        <div><dt>Medium</dt><dd>{growProfile.cultivation.medium}</dd></div>
        <div><dt>Workflow</dt><dd>{growProfile.cultivation.fertigation}</dd></div>
      </dl>
    </div>
  </section>
}
