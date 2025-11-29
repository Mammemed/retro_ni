'use client'

import React, { useEffect, useRef } from 'react'

interface Stat {
  value: number
  suffix: string
  label: string
}

const stats: Stat[] = [
  { value: 46, suffix: '%', label: 'DE JOUEUSES DANS LE MONDE' },
  { value: 30, suffix: '%', label: 'DE DÉVELOPPEUSES DANS L\'INDUSTRIE' },
  { value: 5, suffix: 'B', label: 'DE FEMMES JOUENT RÉGULIÈREMENT' },
  { value: 67, suffix: '%', label: 'DES FEMMES JOUENT SUR MOBILE' },
]

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const animatedRef = useRef<boolean>(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true
            animateStats()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number')
    statNumbers.forEach((stat, index) => {
      const target = stats[index].value
      let current = 0
      const increment = target / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          stat.textContent = target + stats[index].suffix
          clearInterval(timer)
        } else {
          stat.textContent = Math.floor(current) + stats[index].suffix
        }
      }, 30)
    })
  }

  return (
    <div className="stats-section" id="stats" ref={sectionRef}>
      <h2>📊 STATISTIQUES ACTUELLES 📊</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-number" data-target={stat.value}>
              0{stat.suffix}
            </span>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

