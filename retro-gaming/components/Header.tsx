'use client'

import React from 'react'
import { useGameState } from '@/contexts/GameStateContext'

export default function Header() {
  const { totalScore, discoveries, level, resetProgress } = useGameState()

  return (
    <header>
      <h1>👾 FEMMES PIONNIÈRES DU GAMING 👾</h1>
      <p className="subtitle">Nuit de l&apos;Info 2024 - Célébrons l&apos;héritage féminin dans le jeu vidéo</p>
      <div className="score-board">
        <div className="score-item">DÉCOUVERTES: <span>{discoveries}</span>/10</div>
        <div className="score-item">SCORE: <span>{totalScore}</span></div>
        <div className="score-item">NIVEAU: <span>{level}</span></div>
        <button 
          className="reset-button" 
          onClick={resetProgress}
          title="Réinitialiser la progression"
        >
          🔄 Reset
        </button>
      </div>
    </header>
  )
}

