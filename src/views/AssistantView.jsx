import { Brain, Leaf, ShieldAlert } from 'lucide-react'
import { Panel } from '../components/Panel'

export function AssistantView({ assistant, steering, quality, knowledgeRules }) {
  return <section className="assistant-layout">
    <Panel title="AI cultivation assistant" icon={Brain} className="assistant-panel large-panel">
      <div className="assistant-head"><strong>{assistant.confidence} confidence</strong><span>{assistant.missing.length} unresolved inputs</span></div>
      <p className="assistant-rec">{assistant.recommendation}</p>
      <div className="assistant-columns">
        <div>
          <h3>What the system knows</h3>
          <ul>{assistant.observations.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>What it still needs</h3>
          <ul>{assistant.missing.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </Panel>

    <Panel title="Crop steering interpretation" icon={Leaf}>
      <div className="steering-list">{steering.map((item, index) => <div className={`steering ${item.severity}`} key={index}>{item.text}</div>)}</div>
    </Panel>

    <Panel title="Data quality gate" icon={ShieldAlert}>
      <div className="quality-head"><strong>{quality.label}</strong><span>{quality.score} / {quality.maxScore}</span></div>
      <div className="quality-list">{quality.checks.map(check => <article key={check.label} className={check.status}><strong>{check.label}</strong><p>{check.detail}</p></article>)}</div>
    </Panel>

    <div className="panel rules-panel">
      <h2>Recommendation prerequisites</h2>
      {knowledgeRules.map(rule => <article key={rule.input}><strong>{rule.input}</strong><p>{rule.reason}</p></article>)}
    </div>
  </section>
}
