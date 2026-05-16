import { Cable } from 'lucide-react'
import { Panel } from '../components/Panel'

export function IntegrationsView({ integrations }) {
  return <section className="split-grid integrations-layout">
    <Panel title="Integration roadmap" icon={Cable}>
      <div className="integration-list">{integrations.map(item => <article key={item.id} className={item.status}><strong>{item.name}</strong><p>{item.role}</p><span>{item.status}</span></article>)}</div>
    </Panel>
    <div className="panel">
      <h2>Architecture intent</h2>
      <p className="muted-copy">Manual input is treated as a first-class source now. Later, vendor adapters should write into the same normalized telemetry model rather than creating separate one-off pathways.</p>
    </div>
  </section>
}
