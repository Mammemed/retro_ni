'use client'

import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import PioneersSection from '@/components/PioneersSection'
import Footer from '@/components/Footer'
import PixelCharacter from '@/components/PixelCharacter'
import { useGameState } from '@/contexts/GameStateContext'

export default function PioneersPage() {
  const { totalScore, discoveries, level, updateScore, addDiscovery } = useGameState()

  return (
    <main>
      <PixelCharacter />
      
      <Header />
      
      <Navigation />
      
      <div className="container">
        <PioneersSection 
          onReveal={() => {
            updateScore(25)
            addDiscovery()
          }}
        />
      </div>
      
      <Footer />
    </main>
  )
}

