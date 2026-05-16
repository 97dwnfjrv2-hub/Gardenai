import { CalendarRange } from 'lucide-react'
import { Panel } from '../components/Panel'

export function WeeklySummaryView({ summary }) {
  return <section className="split-grid">
    <Panel title="Weekly summary" icon={CalendarRange}>
      {summary ? <div className="summary-grid weekly-summary">
        <div><span>Measurements</span><strong>{summary.entries}</strong></div>
        <div><span>Dryback range</span><strong>{summary.drybackRange}</strong></div>
        <div><span>Runoff EC range</span><strong>{summary.runoffEcRange}</strong></div>
        <div><span>Runoff EC delta</span><strong>{summary.runoffEcDelta}</strong></div>
        <div><span>Root-zone delta</span><strong>{summary.rootZoneDelta}%</strong></div>
        <div><span>Observations</span><strong>{summary.observationCount}</strong></div>
        <div><span>Irrigation events</span><strong>{summary.irrigationCount}</strong></div>
      </div> : <p className="muted-copy">Not enough data for a weekly summary yet.</p>}
    </Panel>
    <div className="panel">
      <h2>Interpretation</h2>
      <p className="muted-copy">Weekly summaries are intended to condense operational drift, not replace daily decisions. They become more meaningful as the record set deepens.</p>
    </div>
  </section>
}
