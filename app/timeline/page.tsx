'use client'

import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import TimelineSection from '@/components/TimelineSection'
import Footer from '@/components/Footer'
import PixelCharacter from '@/components/PixelCharacter'
import { useGameState } from '@/contexts/GameStateContext'

export default function TimelinePage() {
  const { totalScore, discoveries, level, updateScore, addDiscovery } = useGameState()

  return (
    <main>
      <PixelCharacter />
      
      <Header />
      
      <Navigation />
      
      <div className="container">
        <TimelineSection 
          onHighlight={() => {
            updateScore(15)
            addDiscovery()
          }}
        />
      </div>
      
      <Footer />
    </main>
  )
}

