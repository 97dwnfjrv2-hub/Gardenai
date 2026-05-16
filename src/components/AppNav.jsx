import { Activity, Brain, Cable, Gauge, NotebookTabs, Settings2 } from 'lucide-react'

const items = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'assistant', label: 'Assistant', icon: Brain },
  { id: 'logs', label: 'Grow log', icon: NotebookTabs },
  { id: 'runs', label: 'Runs', icon: Activity },
  { id: 'integrations', label: 'Integrations', icon: Cable },
  { id: 'settings', label: 'Settings', icon: Settings2 },
]

export function AppNav({ activeView, onChange }) {
  return <nav className="app-nav">
    {items.map(({ id, label, icon: Icon }) => (
      <button key={id} className={activeView === id ? 'active' : ''} onClick={() => onChange(id)}>
        <Icon size={16} />
        <span>{label}</span>
      </button>
    ))}
  </nav>
}
