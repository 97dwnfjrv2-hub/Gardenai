import { Activity } from 'lucide-react'
import { Panel } from '../components/Panel'

export function RunsView({ runs, comparison }) {
  return <section className="runs-dashboard">
    <Panel title="Run comparison" icon={Activity}>
      <div className="table-wrap"><table><thead><tr><th>Run</th><th>Setup</th><th>Yield</th><th>Quality</th><th>Avg dryback</th><th>Avg runoff EC</th></tr></thead><tbody>{runs.map(run => <tr key={run.id}><td>{run.name}</td><td>{run.setupLabel}</td><td>{run.yield}</td><td>{run.quality}</td><td>{run.avgDryback}</td><td>{run.avgRunoffEc}</td></tr>)}</tbody></table></div>
    </Panel>
    <div className="panel">
      <h2>Run intelligence</h2>
      {comparison ? <div className="summary-grid run-summary"><div><span>Best yield</span><strong>{comparison.bestYieldRun}</strong></div><div><span>Best quality</span><strong>{comparison.bestQualityRun}</strong></div><div><span>Yield change</span><strong>{comparison.yieldDeltaKg} kg</strong></div><div><span>Top quality</span><strong>{comparison.bestQualityScore}/10</strong></div></div> : <p className="muted-copy">Need at least two completed runs for comparison.</p>}
      <div className="run-cards">{runs.map(run => <article key={run.id}><strong>{run.name}</strong><p>{run.setupLabel}</p><span>{run.yield}</span></article>)}</div>
    </div>
  </section>
}
