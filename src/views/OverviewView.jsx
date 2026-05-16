import { Activity, Droplets, Lightbulb, ThermometerSun } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts'
import { Panel } from '../components/Panel'
import { MetricCard } from '../components/MetricCard'
import { calculateDli } from '../lib/cropSteering'

export function OverviewView({ latest, vpd, drybackPct, telemetry, lighting }) {
  return <>
    <section className="metric-grid">
      <MetricCard label="Room Temp" value={`${latest.temp}°C`} detail="Inkbird mock telemetry" />
      <MetricCard label="Humidity" value={`${latest.humidity}%`} detail="Lights on" />
      <MetricCard label="Leaf Temp" value={`${latest.leafTemp}°C`} detail="Leaf offset captured" />
      <MetricCard label="VPD" value={`${vpd} kPa`} detail="Leaf-adjusted" />
      <MetricCard label="PPFD" value={`${latest.ppfd} µmol/m²/s`} detail="Needs canopy map" />
      <MetricCard label="DLI" value={`${calculateDli(860, 12)} mol/m²/d`} detail="Estimated top-light DLI" />
      <MetricCard label="Runoff EC" value={`${latest.runoffEc} mS/cm`} detail={`+${(latest.runoffEc - latest.reservoirEc).toFixed(2)} over feed`} />
      <MetricCard label="Dryback" value={`${drybackPct}%`} detail="Overnight estimate" />
    </section>

    <section className="dashboard-grid overview-grid">
      <Panel title="Environmental control" icon={ThermometerSun}>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height={240}><LineChart data={telemetry}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" minTickGap={28} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Line yAxisId="left" type="monotone" dataKey="temp" stroke="#8de0b0" strokeWidth={2} /><Line yAxisId="left" type="monotone" dataKey="leafTemp" stroke="#60a5fa" strokeWidth={2} /><Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#fbbf24" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
      </Panel>

      <Panel title="Irrigation + dryback" icon={Droplets}>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height={240}><BarChart data={telemetry}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" minTickGap={28} /><YAxis /><Tooltip /><Bar dataKey="irrigationMl" fill="#38bdf8" /><Line type="monotone" dataKey="rootZone" stroke="#a78bfa" /></BarChart></ResponsiveContainer></div>
        <div className="schedule-row">
          <span>P1 07:00 · 220 mL</span>
          <span>P2 09:00–15:00 · 220 mL q2h</span>
          <span>P3 17:00 · 220 mL</span>
        </div>
      </Panel>

      <Panel title="Runoff + EC trends" icon={Activity}>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height={220}><AreaChart data={telemetry}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" minTickGap={28} /><YAxis /><Tooltip /><Area type="monotone" dataKey="runoffEc" stroke="#fb7185" fill="#fb718533" /><Area type="monotone" dataKey="reservoirEc" stroke="#34d399" fill="#34d39922" /></AreaChart></ResponsiveContainer></div>
      </Panel>

      <Panel title="Lighting intelligence" icon={Lightbulb}>
        <div className="spec-grid">
          <MetricCard label="Active canopy" value={`${lighting.canopyArea.toFixed(1)} m²`} detail="3.0 × 1.1 m" />
          <MetricCard label="Total power" value={`${lighting.totalWatts} W`} detail={`${lighting.topWatts} W top + ${lighting.underWatts} W under`} />
          <MetricCard label="Watt density" value={`${lighting.wattsPerSqm} W/m²`} detail="Based on active canopy" />
          <MetricCard label="Edge falloff" value="Unresolved" detail="Needs PPFD grid" />
        </div>
      </Panel>
    </section>
  </>
}
