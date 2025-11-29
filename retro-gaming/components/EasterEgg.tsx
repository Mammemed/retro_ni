'use client'

import React from 'react'

interface EasterEggProps {
  active: boolean
  onClose: () => void
}

export default function EasterEgg({ active, onClose }: EasterEggProps) {
  if (!active) return null

  return (
    <div className={`easter-egg ${active ? 'active' : ''}`} id="easterEgg">
      <h3>🎮 ACHIEVEMENT UNLOCKED! 🎮</h3>
      <p>
        Vous avez découvert un secret!<br />
        Les femmes représentent 46% des joueurs dans le monde!
      </p>
      <button onClick={onClose}>CONTINUER</button>
    </div>
  )
}

