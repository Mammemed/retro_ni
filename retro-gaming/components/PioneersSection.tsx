'use client'

import React, { useState, useEffect, useRef } from 'react'

interface PioneersSectionProps {
  onReveal: () => void
}

interface Pioneer {
  name: string
  fullName: string
  description: string
  achievements: string[]
  year: string
  image?: string
  quote?: string
}

const pioneers: Pioneer[] = [
  {
    name: 'ROBERTA WILLIAMS',
    fullName: 'Roberta Williams',
    description: 'Créatrice de King\'s Quest et pionnière des jeux d\'aventure graphiques. Elle a révolutionné le storytelling dans les jeux vidéo.',
    achievements: [
      'Créatrice de King\'s Quest (1984)',
      'Co-fondatrice de Sierra On-Line',
      'Pionnière du genre adventure game',
      'Plus de 30 jeux à son actif'
    ],
    year: '📅 1980s - 1990s',
    quote: 'Les jeux vidéo peuvent raconter des histoires aussi bien que les livres ou les films.'
  },
  {
    name: 'CAROL SHAW',
    fullName: 'Carol Shaw',
    description: 'Première femme game designer professionnelle. Créatrice de River Raid sur Atari 2600, l\'un des premiers jeux à succès.',
    achievements: [
      'Première femme game designer professionnelle',
      'Créatrice de River Raid (1982)',
      'Programmeuse chez Atari',
      'Pionnière des années 70-80'
    ],
    year: '📅 1978 - 1984',
    quote: 'J\'ai toujours aimé les jeux vidéo, même quand c\'était un monde d\'hommes.'
  },
  {
    name: 'DONA BAILEY',
    fullName: 'Dona Bailey',
    description: 'Co-créatrice de Centipede (1981), l\'un des rares jeux d\'arcade des années 80 créé par une femme.',
    achievements: [
      'Co-créatrice de Centipede',
      'Un des jeux d\'arcade les plus vendus',
      'Programmeuse chez Atari',
      'Inspiration pour les générations futures'
    ],
    year: '📅 1980 - 1982',
    quote: 'Centipede était mon bébé, je l\'ai créé avec passion.'
  },
  {
    name: 'AMY HENNIG',
    fullName: 'Amy Hennig',
    description: 'Scénariste et réalisatrice de la série Uncharted. Pionnière dans la narration cinématographique des jeux vidéo.',
    achievements: [
      'Directrice créative d\'Uncharted',
      'Pionnière de la narration cinématographique',
      'Plusieurs récompenses BAFTA',
      'Influence majeure dans l\'industrie AAA'
    ],
    year: '📅 1989 - Présent',
    quote: 'Les jeux vidéo sont l\'art narratif le plus immersif qui existe.'
  },
  {
    name: 'KIM SWIFT',
    fullName: 'Kim Swift',
    description: 'Designer principale de Portal. A révolutionné le genre puzzle-platformer avec des mécaniques innovantes.',
    achievements: [
      'Designer principale de Portal',
      'Révolution du puzzle-platformer',
      'Game of the Year 2007',
      'Innovation dans le game design'
    ],
    year: '📅 2005 - Présent',
    quote: 'Portal a changé la façon dont on pense aux puzzles dans les jeux.'
  },
  {
    name: 'JADE RAYMOND',
    fullName: 'Jade Raymond',
    description: 'Productrice d\'Assassin\'s Creed. Figure majeure de l\'industrie AAA et fondatrice de plusieurs studios.',
    achievements: [
      'Productrice d\'Assassin\'s Creed',
      'Fondatrice de plusieurs studios',
      'Figure majeure de l\'industrie AAA',
      'Mentor pour les femmes dans le gaming'
    ],
    year: '📅 2004 - Présent',
    quote: 'L\'industrie du jeu vidéo a besoin de plus de diversité.'
  },
  {
    name: 'BRENDA ROMERO',
    fullName: 'Brenda Romero',
    description: 'Game designer légendaire, créatrice de la série Wizardry et professeure renommée.',
    achievements: [
      'Créatrice de la série Wizardry',
      'Plus de 50 jeux créés',
      'Professeur et conférencière',
      'Championne de la diversité'
    ],
    year: '📅 1981 - Présent',
    quote: 'Les jeux peuvent changer le monde en racontant de meilleures histoires.'
  },
  {
    name: 'MURIEL TRAMIS',
    fullName: 'Muriel Tramis',
    description: 'Première game designer française, créatrice de jeux d\'aventure innovants dans les années 80-90.',
    achievements: [
      'Première game designer française',
      'Créatrice de Gobliiins',
      'Pionnière française du gaming',
      'Innovation dans l\'aventure'
    ],
    year: '📅 1987 - 2000',
    quote: 'J\'ai ouvert la voie pour les femmes françaises dans le gaming.'
  }
]

export default function PioneersSection({ onReveal }: PioneersSectionProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [expanded, setExpanded] = useState<number | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  const handleReveal = (index: number) => {
    if (revealed.has(index)) {
      setExpanded(expanded === index ? null : index)
      return
    }
    
    setRevealed(prev => new Set(prev).add(index))
    onReveal()
    
    const card = cardRefs.current[index]
    if (card) {
      card.classList.add('revealed')
      setTimeout(() => {
        card.classList.add('pulse')
      }, 100)
    }
  }

  return (
    <div>
      <div className="pioneers-intro">
        <h2 className="pioneers-title">⭐ PIONNIÈRES LÉGENDAIRES ⭐</h2>
        <p className="pioneers-subtitle">Découvrez les femmes qui ont façonné l&apos;industrie du jeu vidéo. Cliquez sur une carte pour en savoir plus!</p>
      </div>
      <div className="pioneers-gallery">
        {pioneers.map((pioneer, index) => (
          <div
            key={index}
            ref={(el) => { cardRefs.current[index] = el }}
            className={`pioneer-card ${expanded === index ? 'expanded' : ''}`}
            onClick={() => handleReveal(index)}
          >
            <div className="pioneer-card-header">
              <h3>{pioneer.name}</h3>
              {revealed.has(index) && (
                <span className="revealed-badge">✓</span>
              )}
            </div>
            <p className="pioneer-description">{pioneer.description}</p>
            <span className="year">{pioneer.year}</span>
            
            {expanded === index && (
              <div className="pioneer-details">
                <div className="pioneer-full-name">{pioneer.fullName}</div>
                {pioneer.quote && (
                  <div className="pioneer-quote">&quot;{pioneer.quote}&quot;</div>
                )}
                <div className="pioneer-achievements">
                  <h4>Réalisations :</h4>
                  <ul>
                    {pioneer.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
