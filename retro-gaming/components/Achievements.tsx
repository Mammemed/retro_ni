'use client'

import React, { useEffect, useState } from 'react'
import { useGameState } from '@/contexts/GameStateContext'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  condition: (state: { totalScore: number; discoveries: number; level: number }) => boolean
}

const achievements: Achievement[] = [
  {
    id: 'first_steps',
    title: 'Premiers Pas',
    description: 'Atteignez 100 points',
    icon: '🎯',
    unlocked: false,
    condition: (state) => state.totalScore >= 100,
  },
  {
    id: 'explorer',
    title: 'Explorateur',
    description: 'Découvrez 5 pionnières',
    icon: '⭐',
    unlocked: false,
    condition: (state) => state.discoveries >= 5,
  },
  {
    id: 'master',
    title: 'Maître du Jeu',
    description: 'Atteignez le niveau 5',
    icon: '👑',
    unlocked: false,
    condition: (state) => state.level >= 5,
  },
  {
    id: 'collector',
    title: 'Collectionneur',
    description: 'Découvrez toutes les pionnières (10)',
    icon: '🏆',
    unlocked: false,
    condition: (state) => state.discoveries >= 10,
  },
  {
    id: 'legend',
    title: 'Légende',
    description: 'Atteignez 1000 points',
    icon: '🌟',
    unlocked: false,
    condition: (state) => state.totalScore >= 1000,
  },
  {
    id: 'quiz_master',
    title: 'Maître du Quiz',
    description: 'Répondez correctement à toutes les questions',
    icon: '🧠',
    unlocked: false,
    condition: (state) => state.totalScore >= 300, // Approximate
  },
]

export default function Achievements() {
  const { totalScore, discoveries, level } = useGameState()
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set())
  const [newAchievements, setNewAchievements] = useState<string[]>([])

  useEffect(() => {
    const currentState = { totalScore, discoveries, level }
    const newlyUnlocked: string[] = []

    achievements.forEach((achievement) => {
      if (!unlockedAchievements.has(achievement.id) && achievement.condition(currentState)) {
        newlyUnlocked.push(achievement.id)
      }
    })

    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => {
        const updated = new Set(prev)
        newlyUnlocked.forEach(id => updated.add(id))
        return updated
      })
      setNewAchievements(newlyUnlocked)
      
      // Clear new achievements after 3 seconds
      setTimeout(() => {
        setNewAchievements([])
      }, 3000)
    }
  }, [totalScore, discoveries, level, unlockedAchievements])

  const unlockedCount = achievements.filter(a => unlockedAchievements.has(a.id)).length

  return (
    <div className="achievements-section">
      <h3>🏅 ACHIEVEMENTS ({unlockedCount}/{achievements.length})</h3>
      <div className="achievements-grid">
        {achievements.map((achievement) => {
          const isUnlocked = unlockedAchievements.has(achievement.id)
          const isNew = newAchievements.includes(achievement.id)
          
          return (
            <div
              key={achievement.id}
              className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${isNew ? 'new' : ''}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-description">{achievement.description}</div>
              </div>
              {isUnlocked && <span className="achievement-check">✓</span>}
            </div>
          )
        })}
      </div>
      {newAchievements.length > 0 && (
        <div className="achievement-notification">
          🎉 Nouveau achievement débloqué!
        </div>
      )}
    </div>
  )
}

