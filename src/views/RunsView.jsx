import { Activity } from 'lucide-react'
import { Panel } from '../components/Panel'

export function RunsView({ runs }) {
  return <section className="split-grid runs-layout">
    <Panel title="Run comparison" icon={Activity}>
      <div className="table-wrap"><table><thead><tr><th>Run</th><th>Setup</th><th>Yield</th><th>Quality</th><th>Avg dryback</th><th>Avg runoff EC</th></tr></thead><tbody>{runs.map(run => <tr key={run.run}><td>{run.run}</td><td>{run.setup}</td><td>{run.yield}</td><td>{run.quality}</td><td>{run.avgDryback}</td><td>{run.avgRunoffEc}</td></tr>)}</tbody></table></div>
    </Panel>
    <div className="panel">
      <h2>Run intelligence</h2>
      <div className="run-cards">{runs.map(run => <article key={run.run}><strong>{run.run}</strong><p>{run.setup}</p><span>{run.yield}</span></article>)}</div>
    </div>
  </section>
}
