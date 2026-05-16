export function Panel({ title, icon: Icon, children, className = '' }) {
  return <section className={`panel ${className}`}><header><Icon size={18} /><h2>{title}</h2></header>{children}</section>
}
