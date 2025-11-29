'use client'

import React, { useState, useEffect, useRef } from 'react'

interface TimelineSectionProps {
  onHighlight: () => void
}

interface TimelineItem {
  year: string
  title: string
  description: string
  details?: string[]
  icon?: string
}

const timelineItems: TimelineItem[] = [
  {
    year: '1978',
    title: 'L\'ÈRE COMMENCE',
    description: 'Carol Shaw rejoint Atari comme la première femme game designer professionnelle',
    details: [
      'Première femme game designer professionnelle',
      'Création de jeux pour Atari 2600',
      'Ouverture de la voie pour les générations futures'
    ],
    icon: '👩‍💻'
  },
  {
    year: '1981',
    title: 'CENTIPEDE',
    description: 'Dona Bailey co-crée Centipede, devenant l\'un des jeux d\'arcade les plus populaires',
    details: [
      'Plus de 55 000 machines d\'arcade vendues',
      'Un des jeux les plus joués des années 80',
      'Inspiration pour de nombreux jeux futurs'
    ],
    icon: '🕹️'
  },
  {
    year: '1984',
    title: 'RÉVOLUTION NARRATIVE',
    description: 'Roberta Williams lance King\'s Quest, définissant le genre adventure game',
    details: [
      'Premier jeu d\'aventure graphique',
      'Révolution du storytelling interactif',
      'Série vendue à des millions d\'exemplaires'
    ],
    icon: '📖'
  },
  {
    year: '1987',
    title: 'PREMIÈRE FRANÇAISE',
    description: 'Muriel Tramis devient la première game designer française professionnelle',
    details: [
      'Création de Gobliiins',
      'Pionnière française du gaming',
      'Innovation dans l\'humour et l\'aventure'
    ],
    icon: '🇫🇷'
  },
  {
    year: '2004',
    title: 'L\'ÈRE AAA',
    description: 'Jade Raymond produit Assassin\'s Creed, marquant l\'entrée des femmes dans les blockbusters',
    details: [
      'Franchise vendue à plus de 200 millions',
      'Influence majeure dans l\'industrie AAA',
      'Inspiration pour les femmes développeuses'
    ],
    icon: '🎬'
  },
  {
    year: '2007',
    title: 'NOUVELLE ÈRE',
    description: 'Kim Swift révolutionne le puzzle-platformer avec Portal',
    details: [
      'Game of the Year 2007',
      'Innovation majeure dans le game design',
      'Influence durable sur l\'industrie'
    ],
    icon: '⭐'
  },
  {
    year: '2010',
    title: 'NARRATION CINÉMATIQUE',
    description: 'Amy Hennig élève la narration dans Uncharted à un niveau cinématographique',
    details: [
      'Série acclamée par la critique',
      'Plusieurs récompenses BAFTA',
      'Nouveau standard pour la narration'
    ],
    icon: '🎥'
  },
  {
    year: '2024',
    title: 'AUJOURD\'HUI',
    description: 'Les femmes représentent 46% des joueurs et continuent d\'innover dans l\'industrie',
    details: [
      '46% de joueuses dans le monde',
      '30% de développeuses dans l\'industrie',
      'Croissance continue de la diversité'
    ],
    icon: '🚀'
  }
]

export default function TimelineSection({ onHighlight }: TimelineSectionProps) {
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set())
  const [expanded, setExpanded] = useState<number | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

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

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  const handleHighlight = (index: number) => {
    if (highlighted.has(index)) {
      setExpanded(expanded === index ? null : index)
      return
    }
    
    setHighlighted(prev => new Set(prev).add(index))
    onHighlight()
    
    const item = itemRefs.current[index]
    if (item) {
      item.classList.add('highlighted')
      setTimeout(() => {
        item.classList.remove('highlighted')
      }, 1000)
    }
  }

  return (
    <div className="timeline">
      <div className="timeline-intro">
        <h2>📜 CHRONOLOGIE DE L&apos;HISTOIRE 📜</h2>
        <p className="timeline-subtitle">Explorez les moments clés qui ont façonné la présence des femmes dans le gaming</p>
      </div>
      <div className="timeline-container">
        {timelineItems.map((item, index) => (
          <div
            key={index}
            ref={(el) => { itemRefs.current[index] = el }}
            className={`timeline-item ${expanded === index ? 'expanded' : ''}`}
            onClick={() => handleHighlight(index)}
          >
            <div className="timeline-year">{item.icon} {item.year}</div>
            <h3>{item.title}</h3>
            <p className="timeline-description">{item.description}</p>
            {expanded === index && item.details && (
              <div className="timeline-details">
                <ul>
                  {item.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
