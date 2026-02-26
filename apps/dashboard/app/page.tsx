'use client'

import { useEffect, useState } from 'react'

interface BackendStats {
  requests: number
  uptime: string
  latency_ms: number
}

interface AgentTasks {
  active: number
  completed: number
  queue_depth: number
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '/api'
const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL || '/svc/agent'

export default function Dashboard() {
  const [backendHealth, setBackendHealth] = useState('checking...')
  const [agentHealth, setAgentHealth] = useState('checking...')
  const [stats, setStats] = useState<BackendStats | null>(null)
  const [tasks, setTasks] = useState<AgentTasks | null>(null)

  useEffect(() => {
    fetch(`${BACKEND_URL}/health`)
      .then(r => r.json())
      .then(d => setBackendHealth(d.status))
      .catch(() => setBackendHealth('offline'))

    fetch(`${AGENT_URL}/health`)
      .then(r => r.json())
      .then(d => setAgentHealth(d.status))
      .catch(() => setAgentHealth('offline'))

    fetch(`${BACKEND_URL}/stats`)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})

    fetch(`${AGENT_URL}/tasks`)
      .then(r => r.json())
      .then(d => setTasks(d))
      .catch(() => {})
  }, [])

  const healthClass = (status: string) =>
    status === 'ok' ? 'online' : status === 'checking...' ? 'loading' : 'offline'

  return (
    <>
      <nav>
        <span className="logo">Dashboard</span>
        <div className="links">
          <a href="/">&larr; Home</a>
        </div>
      </nav>

      <main>
        <section className="section">
          <h2>Service Health</h2>
          <div className="grid">
            <div className="card">
              <div className="card-label">Backend API</div>
              <div className="card-value">
                <span className={`dot ${healthClass(backendHealth)}`} />
                {backendHealth}
              </div>
              <div className="card-meta">Flask &middot; Python</div>
            </div>
            <div className="card">
              <div className="card-label">Agent Service</div>
              <div className="card-value">
                <span className={`dot ${healthClass(agentHealth)}`} />
                {agentHealth}
              </div>
              <div className="card-meta">Go</div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Backend Metrics</h2>
          <div className="grid">
            <div className="card">
              <div className="card-label">Total Requests</div>
              <div className="card-number">{stats?.requests?.toLocaleString() ?? '—'}</div>
            </div>
            <div className="card">
              <div className="card-label">Uptime</div>
              <div className="card-number">{stats?.uptime ?? '—'}</div>
            </div>
            <div className="card">
              <div className="card-label">Avg Latency</div>
              <div className="card-number">{stats ? `${stats.latency_ms}ms` : '—'}</div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Agent Tasks</h2>
          <div className="grid">
            <div className="card">
              <div className="card-label">Active</div>
              <div className="card-number">{tasks?.active ?? '—'}</div>
            </div>
            <div className="card">
              <div className="card-label">Completed</div>
              <div className="card-number">{tasks?.completed?.toLocaleString() ?? '—'}</div>
            </div>
            <div className="card">
              <div className="card-label">Queue Depth</div>
              <div className="card-number">{tasks?.queue_depth ?? '—'}</div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
