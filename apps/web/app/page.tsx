'use client'

import { useEffect, useState } from 'react'

type Status = 'loading' | 'online' | 'offline'

interface Service {
  name: string
  runtime: string
  prefix: string
  status: Status
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '/api'
const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL || '/svc/agent'

export default function Home() {
  const [services, setServices] = useState<Service[]>([
    { name: 'Landing', runtime: 'Next.js', prefix: '/', status: 'online' },
    { name: 'Dashboard', runtime: 'Next.js', prefix: '/dashboard', status: 'online' },
    { name: 'Backend API', runtime: 'Flask · Python', prefix: '/api', status: 'loading' },
    { name: 'Agent Service', runtime: 'Go', prefix: '/svc/agent', status: 'loading' },
  ])

  useEffect(() => {
    const check = async (index: number, url: string) => {
      try {
        const res = await fetch(`${url}/health`)
        const status: Status = res.ok ? 'online' : 'offline'
        setServices(prev => prev.map((s, i) => i === index ? { ...s, status } : s))
      } catch {
        setServices(prev => prev.map((s, i) => i === index ? { ...s, status: 'offline' } : s))
      }
    }

    check(2, BACKEND_URL)
    check(3, AGENT_URL)
  }, [])

  return (
    <>
      <nav>
        <span className="logo">Multi-Runtime</span>
        <div className="links">
          <a href="/dashboard">Dashboard</a>
        </div>
      </nav>

      <section className="hero">
        <h1>Multi-Runtime Platform</h1>
        <p>
          Four services. Three runtimes. One monorepo.
          Next.js, Flask, and Go working together seamlessly.
        </p>
        <div className="actions">
          <a href="/dashboard" className="primary">Open Dashboard</a>
          <a href={`${BACKEND_URL}/health`} className="secondary">API Health &rarr;</a>
        </div>
      </section>

      <section className="services">
        {services.map(service => (
          <div key={service.name} className="card">
            <h3>{service.name}</h3>
            <div className="runtime">{service.runtime}</div>
            <div className="prefix">{service.prefix}</div>
            <span className={`status-badge ${service.status}`}>
              <span className="dot" />
              {service.status}
            </span>
          </div>
        ))}
      </section>

      <footer>Built with Next.js, Flask, and Go</footer>
    </>
  )
}
