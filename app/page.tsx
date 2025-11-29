'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import EasterEgg from '@/components/EasterEgg'
import PixelCharacter from '@/components/PixelCharacter'
import { useGameState } from '@/contexts/GameStateContext'
import { useKonamiCode } from '@/hooks/useKonamiCode'
import Achievements from '@/components/Achievements'

export default function Home() {
  const { updateScore } = useGameState()
  const [easterEggActive, setEasterEggActive] = useState(false)

  const triggerEasterEgg = () => {
    setEasterEggActive(true)
    updateScore(100)
  }

  useKonamiCode(triggerEasterEgg)

  const closeEasterEgg = () => {
    setEasterEggActive(false)
  }

  return (
    <main>
      <PixelCharacter />
      <EasterEgg active={easterEggActive} onClose={closeEasterEgg} />
      
      <Header />
      
      <Navigation />
      
      <div className="container">
        <HeroSection />
        <Achievements />
      </div>
      
      <Footer />
    </main>
  )
}
