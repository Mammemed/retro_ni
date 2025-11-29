'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'

interface GameStateContextType {
  totalScore: number
  discoveries: number
  level: number
  updateScore: (points: number) => void
  addDiscovery: () => void
  resetProgress: () => void
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined)

const STORAGE_KEY = 'retro-gaming-progress'

function loadProgress() {
  if (typeof window === 'undefined') return { totalScore: 0, discoveries: 0 }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        totalScore: parsed.totalScore || 0,
        discoveries: parsed.discoveries || 0,
      }
    }
  } catch (e) {
    console.error('Failed to load progress:', e)
  }
  return { totalScore: 0, discoveries: 0 }
}

function saveProgress(totalScore: number, discoveries: number) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ totalScore, discoveries }))
  } catch (e) {
    console.error('Failed to save progress:', e)
  }
}

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [totalScore, setTotalScore] = useState(0)
  const [discoveries, setDiscoveries] = useState(0)
  
  // Load progress on mount
  useEffect(() => {
    const loaded = loadProgress()
    setTotalScore(loaded.totalScore)
    setDiscoveries(loaded.discoveries)
  }, [])

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(totalScore, discoveries)
  }, [totalScore, discoveries])

  const updateScore = useCallback((points: number) => {
    setTotalScore(prev => prev + points)
  }, [])

  const addDiscovery = useCallback(() => {
    setDiscoveries(prev => prev + 1)
  }, [])

  const resetProgress = useCallback(() => {
    setTotalScore(0)
    setDiscoveries(0)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const level = Math.floor(totalScore / 100) + 1

  return (
    <GameStateContext.Provider
      value={{
        totalScore,
        discoveries,
        level,
        updateScore,
        addDiscovery,
        resetProgress,
      }}
    >
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const context = useContext(GameStateContext)
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
}

