'use client'

import React, { useEffect, useState } from 'react'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`hero-section ${isVisible ? 'visible' : ''}`}>
      <div className="hero-content">
        <h2>⚡ MISSION: CÉLÉBRER LES FEMMES DANS LE GAMING ⚡</h2>
        <p className="hero-text">
          Depuis les débuts de l&apos;industrie du jeu vidéo, les femmes ont joué un rôle crucial 
          mais souvent méconnu. Des programmeuses pionnières aux game designers innovantes, 
          explorez leur héritage à travers cette expérience rétro interactive!
        </p>
        <div className="hero-stats">
          <div className="hero-stat-item">
            <span className="stat-icon">👩‍💻</span>
            <div>
              <div className="stat-value">46%</div>
              <div className="stat-label">Joueuses dans le monde</div>
            </div>
          </div>
          <div className="hero-stat-item">
            <span className="stat-icon">🎮</span>
            <div>
              <div className="stat-value">30%</div>
              <div className="stat-label">Développeuses dans l&apos;industrie</div>
            </div>
          </div>
          <div className="hero-stat-item">
            <span className="stat-icon">⭐</span>
            <div>
              <div className="stat-value">50+</div>
              <div className="stat-label">Années d&apos;histoire</div>
            </div>
          </div>
        </div>
        <div className="hero-features">
          <div className="feature-badge">🎯 Quiz Interactif</div>
          <div className="feature-badge">🕹️ Jeu de Plateforme</div>
          <div className="feature-badge">⭐ Galerie de Pionnières</div>
          <div className="feature-badge">📜 Timeline Historique</div>
        </div>
      </div>
    </div>
  )
}
