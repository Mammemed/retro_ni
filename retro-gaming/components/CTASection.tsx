'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface CTASectionProps {
  onDiscover: () => void
  totalScore: number
  discoveries: number
}

export default function CTASection({ onDiscover, totalScore, discoveries }: CTASectionProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareText = `🎮 J'ai marqué ${totalScore} points et découvert ${discoveries}/10 faits sur les femmes dans le gaming! #NuitDeLInfo #WomenInGaming`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Femmes Pionnières du Gaming',
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        alert(shareText)
      }
    }
  }

  const completionRate = discoveries >= 10 ? 100 : (discoveries / 10) * 100

  return (
    <div className="cta-section">
      <h2>🚀 REJOIGNEZ LE MOUVEMENT 🚀</h2>
      <p className="cta-description">
        Explorez toutes les sections pour découvrir l&apos;histoire fascinante des femmes dans le gaming!
      </p>
      
      <div className="cta-stats">
        <div className="cta-stat">
          <div className="cta-stat-value">{totalScore}</div>
          <div className="cta-stat-label">Points</div>
        </div>
        <div className="cta-stat">
          <div className="cta-stat-value">{discoveries}/10</div>
          <div className="cta-stat-label">Découvertes</div>
        </div>
        <div className="cta-stat">
          <div className="cta-stat-value">{Math.round(completionRate)}%</div>
          <div className="cta-stat-label">Complété</div>
        </div>
      </div>

      <div className="cta-progress">
        <div className="cta-progress-bar">
          <div 
            className="cta-progress-fill" 
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      <div className="cta-buttons">
        <button className="cta-button primary" onClick={onDiscover}>
          🎁 DÉCOUVRIR PLUS
        </button>
        <button 
          className={`cta-button secondary ${copied ? 'copied' : ''}`} 
          onClick={handleShare}
        >
          {copied ? '✓ COPIÉ!' : '📤 PARTAGER'}
        </button>
        <Link href="/quiz" className="cta-button link">
          🎯 COMMENCER LE QUIZ
        </Link>
      </div>

      <div className="cta-links">
        <Link href="/quiz" className="cta-link">🎯 Quiz</Link>
        <Link href="/game" className="cta-link">🕹️ Jeu</Link>
        <Link href="/pioneers" className="cta-link">⭐ Pionnières</Link>
        <Link href="/timeline" className="cta-link">📜 Timeline</Link>
      </div>
    </div>
  )
}
