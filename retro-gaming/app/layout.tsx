import type { Metadata } from 'next'
import '../styles/globals.css'
import { GameStateProvider } from '@/contexts/GameStateContext'

export const metadata: Metadata = {
  title: 'Femmes Pionnières du Gaming - Nuit de l\'Info 2024',
  description: 'Célébrez l\'héritage des femmes dans l\'industrie du jeu vidéo. Découvrez les pionnières, testez vos connaissances avec un quiz interactif, jouez à un jeu de plateforme rétro, et explorez la timeline historique.',
  keywords: ['femmes gaming', 'pionnières jeu vidéo', 'women in gaming', 'nuit de l\'info', 'game design', 'histoire gaming', 'diversité gaming'],
  authors: [{ name: 'Nuit de l\'Info 2024' }],
  openGraph: {
    title: 'Femmes Pionnières du Gaming',
    description: 'Célébrez l\'héritage des femmes dans l\'industrie du jeu vidéo',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👾</text></svg>" />
      </head>
      <body>
        <GameStateProvider>
          {children}
        </GameStateProvider>
      </body>
    </html>
  )
}
