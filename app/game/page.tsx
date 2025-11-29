'use client'

import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import GameSection from '@/components/GameSection'
import Footer from '@/components/Footer'
import PixelCharacter from '@/components/PixelCharacter'
import { useGameState } from '@/contexts/GameStateContext'

export default function GamePage() {
  const { totalScore, discoveries, level, updateScore, addDiscovery } = useGameState()

  return (
    <main>
      <PixelCharacter />
      
      <Header />
      
      <Navigation />
      
      <div className="container">
        <GameSection 
          onScoreUpdate={updateScore}
          onDiscovery={addDiscovery}
        />
      </div>
      
      <Footer />
    </main>
  )
}

