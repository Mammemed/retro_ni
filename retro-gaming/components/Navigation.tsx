'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '🏠 ACCUEIL', id: 'home' },
    { href: '/quiz', label: '🎯 QUIZ', id: 'quiz' },
    { href: '/game', label: '🕹️ JOUER', id: 'game' },
    { href: '/pioneers', label: '⭐ PIONNIÈRES', id: 'pioneers' },
    { href: '/timeline', label: '📜 HISTOIRE', id: 'timeline' },
  ]

  return (
    <nav>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-button ${pathname === item.href ? 'active' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
