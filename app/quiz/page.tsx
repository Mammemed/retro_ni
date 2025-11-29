'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import QuizSection from '@/components/QuizSection'
import Footer from '@/components/Footer'
import PixelCharacter from '@/components/PixelCharacter'
import { useGameState } from '@/contexts/GameStateContext'

export default function QuizPage() {
  const { totalScore, discoveries, level, updateScore, addDiscovery } = useGameState()

  return (
    <main>
      <PixelCharacter />
      
      <Header />
      
      <Navigation />
      
      <div className="container">
        <QuizSection 
          onAnswerCorrect={(points) => {
            updateScore(points)
            addDiscovery()
          }}
        />
      </div>
      
      <Footer />
    </main>
  )
}

