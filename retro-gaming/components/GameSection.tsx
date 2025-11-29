'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Player, GameItem, GameState } from '@/types/game'
import Notification from './Notification'

interface GameSectionProps {
  onScoreUpdate: (points: number) => void
  onDiscovery: () => void
}

interface FloatingText {
  id: string
  x: number
  y: number
  text: string
  color: string
  life: number
}

export default function GameSection({ onScoreUpdate, onDiscovery }: GameSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>({
    running: false,
    score: 0,
    gameOver: false,
    paused: false,
  })
  const [health, setHealth] = useState(3)
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'success' | 'info' | 'warning' }>>([])
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])
  const [combo, setCombo] = useState(0)
  const [comboTimer, setComboTimer] = useState(0)

  const playerRef = useRef<Player>({
    x: 50,
    y: 0,
    width: 35,
    height: 35,
    speed: 6,
    velocityY: 0,
    jumping: false,
    color: '#ff6ec7',
  })

  const itemsRef = useRef<GameItem[]>([])
  const obstaclesRef = useRef<GameItem[]>([])
  const starsRef = useRef<GameItem[]>([])
  const keysRef = useRef<{ [key: string]: boolean }>({})
  const animationFrameRef = useRef<number>()
  const lastItemTimeRef = useRef<number>(0)
  const lastObstacleTimeRef = useRef<number>(0)
  const lastStarTimeRef = useRef<number>(0)

  const CANVAS_WIDTH = 700
  const CANVAS_HEIGHT = 450
  const GROUND_Y = CANVAS_HEIGHT - 30
  const GRAVITY = 0.5
  const JUMP_STRENGTH = -12
  const INITIAL_HEALTH = 3

  const addNotification = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [])

  const addFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    const id = Date.now().toString() + Math.random()
    setFloatingTexts(prev => [...prev, { id, x, y, text, color, life: 60 }])
  }, [])

  const addParticles = useCallback((x: number, y: number, color: string, count: number = 10) => {
    // Particles are drawn directly on canvas in the draw function
    // This function is kept for future enhancement
  }, [])

  const checkCollision = useCallback((rect1: { x: number; y: number; width: number; height: number }, 
                                      rect2: { x: number; y: number; width: number; height: number }): boolean => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }, [])

  const getDifficultyMultiplier = useCallback(() => {
    const level = Math.floor(gameStateRef.current.score / 100) + 1
    return Math.min(1 + (level - 1) * 0.1, 2) // Max 2x speed
  }, [])

  const createItem = useCallback(() => {
    const multiplier = getDifficultyMultiplier()
    itemsRef.current.push({
      x: CANVAS_WIDTH,
      y: Math.random() * (CANVAS_HEIGHT - 200) + 50,
      width: 25,
      height: 25,
      speed: 3 * multiplier,
      color: '#ff6ec7',
      type: 'item',
    })
  }, [getDifficultyMultiplier])

  const createObstacle = useCallback(() => {
    const multiplier = getDifficultyMultiplier()
    obstaclesRef.current.push({
      x: CANVAS_WIDTH,
      y: GROUND_Y - 40,
      width: 30,
      height: 40,
      speed: 4 * multiplier,
      color: '#b388ff',
      type: 'obstacle',
    })
  }, [getDifficultyMultiplier])

  const createStar = useCallback(() => {
    const multiplier = getDifficultyMultiplier()
    starsRef.current.push({
      x: CANVAS_WIDTH,
      y: Math.random() * (CANVAS_HEIGHT - 250) + 50,
      width: 20,
      height: 20,
      speed: 3.5 * multiplier,
      color: '#ffd700',
      type: 'star',
    })
  }, [getDifficultyMultiplier])

  const gameStateRef = useRef(gameState)
  
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Fond dégradé
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
    gradient.addColorStop(0, '#1a0a2e')
    gradient.addColorStop(1, '#0f0520')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Grille de fond
    ctx.strokeStyle = 'rgba(255, 110, 199, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i < CANVAS_WIDTH; i += 30) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, CANVAS_HEIGHT)
      ctx.stroke()
    }

    // Sol
    ctx.fillStyle = '#2d1b4e'
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 30)
    ctx.strokeStyle = '#ff6ec7'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, GROUND_Y)
    ctx.lineTo(CANVAS_WIDTH, GROUND_Y)
    ctx.stroke()

    const player = playerRef.current

    // Joueur
    ctx.fillStyle = player.color
    ctx.fillRect(player.x, player.y, player.width, player.height)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 3
    ctx.strokeRect(player.x, player.y, player.width, player.height)
    
    // Yeux
    ctx.fillStyle = '#fff'
    ctx.fillRect(player.x + 8, player.y + 8, 8, 8)
    ctx.fillRect(player.x + 20, player.y + 8, 8, 8)

    // Items
    itemsRef.current.forEach((item, index) => {
      ctx.fillStyle = item.color
      ctx.beginPath()
      ctx.arc(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.stroke()
      
      ctx.fillStyle = '#fff'
      ctx.font = '16px Arial'
      ctx.fillText('♀', item.x + 7, item.y + 18)
      
      item.x -= item.speed

      if (gameStateRef.current.running && checkCollision(player, item)) {
        itemsRef.current.splice(index, 1)
        const basePoints = 20
        const comboMultiplier = combo > 0 ? 1 + (combo * 0.1) : 1
        const points = Math.floor(basePoints * comboMultiplier)
        
        setGameState(prev => ({ ...prev, score: prev.score + points }))
        onScoreUpdate(points)
        onDiscovery()
        
        // Visual feedback
        addFloatingText(item.x, item.y, `+${points}`, '#ff6ec7')
        
        // Combo system
        setCombo(prev => prev + 1)
        setComboTimer(180) // 3 seconds at 60fps
        
        if (combo > 0 && combo % 5 === 0) {
          addNotification(`🔥 COMBO x${combo}!`, 'success')
        }
      }

      if (item.x + item.width < 0) {
        itemsRef.current.splice(index, 1)
      }
    })

    // Obstacles
    obstaclesRef.current.forEach((obs, index) => {
      ctx.fillStyle = obs.color
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height)
      
      obs.x -= obs.speed

      if (gameStateRef.current.running && checkCollision(player, obs)) {
        const newHealth = health - 1
        setHealth(newHealth)
        
        // Visual feedback
        addFloatingText(obs.x, obs.y, '-10', '#ff3366')
        
        // Reset combo on hit
        setCombo(0)
        setComboTimer(0)
        
        // Faire reculer le joueur légèrement
        player.x = Math.max(0, player.x - 15)
        
        if (newHealth <= 0) {
          setGameState(prev => ({ ...prev, gameOver: true, running: false }))
          addNotification('💔 Game Over! Appuyez sur R pour recommencer', 'warning')
        } else {
          addNotification(`⚠️ ${newHealth} vie${newHealth > 1 ? 's' : ''} restante${newHealth > 1 ? 's' : ''}`, 'warning')
        }
      }

      if (obs.x + obs.width < 0) {
        obstaclesRef.current.splice(index, 1)
      }
    })

    // Étoiles bonus
    starsRef.current.forEach((star, index) => {
      ctx.fillStyle = star.color
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
        const x = star.x + star.width / 2 + Math.cos(angle) * star.width / 2
        const y = star.y + star.height / 2 + Math.sin(angle) * star.height / 2
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.stroke()
      
      star.x -= star.speed

      if (gameStateRef.current.running && checkCollision(player, star)) {
        starsRef.current.splice(index, 1)
        const points = 50
        setGameState(prev => ({ ...prev, score: prev.score + points }))
        onScoreUpdate(points)
        onDiscovery()
        
        // Visual feedback
        addFloatingText(star.x, star.y, `+${points}`, '#ffd700')
        
        // Bonus facts
        const facts = [
          '30% des développeurs de jeux vidéo sont des femmes',
          '46% des joueurs dans le monde sont des femmes',
          'Le premier jeu vidéo narratif a été créé par Roberta Williams',
          'Centipede a été co-créé par Dona Bailey en 1981',
        ]
        const randomFact = facts[Math.floor(Math.random() * facts.length)]
        addNotification(`⭐ BONUS! ${randomFact}`, 'success')
      }

      if (star.x + star.width < 0) {
        starsRef.current.splice(index, 1)
      }
    })

    // Score du jeu
    ctx.fillStyle = '#ffd700'
    ctx.font = '14px "Press Start 2P"'
    ctx.fillText('GAME: ' + gameStateRef.current.score, 20, 30)
    
    // Health display
    ctx.fillStyle = '#ff3366'
    ctx.font = '12px "Press Start 2P"'
    let healthText = '❤️'.repeat(health) + '💔'.repeat(INITIAL_HEALTH - health)
    ctx.fillText(healthText, 20, 50)
    
    // Combo display
    if (combo > 0) {
      ctx.fillStyle = '#ff6ec7'
      ctx.font = '12px "Press Start 2P"'
      ctx.fillText(`COMBO x${combo}!`, CANVAS_WIDTH - 150, 30)
    }
    
    // Floating texts
    floatingTexts.forEach((ft) => {
      const alpha = ft.life / 60
      ctx.globalAlpha = alpha
      ctx.fillStyle = ft.color
      ctx.font = '16px "Press Start 2P"'
      ctx.fillText(ft.text, ft.x, ft.y - (60 - ft.life))
      ctx.globalAlpha = 1
    })

    // Game Over
    if (gameStateRef.current.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.fillStyle = '#ff6ec7'
      ctx.font = '20px "Press Start 2P"'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40)
      ctx.fillStyle = '#ffd700'
      ctx.font = '14px "Press Start 2P"'
      ctx.fillText('SCORE: ' + gameStateRef.current.score, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      ctx.fillText('APPUYEZ SUR R POUR RECOMMENCER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30)
      ctx.textAlign = 'left'
    }
  }, [checkCollision, onScoreUpdate, onDiscovery, health, combo, floatingTexts])

  const update = useCallback(() => {
    const currentState = gameStateRef.current
    
    if (!currentState.running || currentState.gameOver || currentState.paused) {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) draw(ctx)
      }
      animationFrameRef.current = requestAnimationFrame(update)
      return
    }

    const player = playerRef.current
    const keys = keysRef.current
    const now = Date.now()
    
    // Update combo timer
    if (comboTimer > 0) {
      setComboTimer(prev => {
        if (prev <= 1) {
          setCombo(0)
          return 0
        }
        return prev - 1
      })
    }
    
    // Update floating texts
    setFloatingTexts(prev => prev.filter(ft => {
      ft.life -= 1
      return ft.life > 0
    }))
    

    // Mouvement horizontal
    if (keys['ArrowLeft'] && player.x > 0) {
      player.x -= player.speed
    }
    if (keys['ArrowRight'] && player.x < CANVAS_WIDTH - player.width) {
      player.x += player.speed
    }

    // Physique de saut
    player.velocityY += GRAVITY
    player.y += player.velocityY

    // Collision avec le sol
    if (player.y >= GROUND_Y - player.height) {
      player.y = GROUND_Y - player.height
      player.velocityY = 0
      player.jumping = false
    }

    // Génération d'éléments
    if (now - lastItemTimeRef.current > 2000) {
      createItem()
      lastItemTimeRef.current = now
    }
    if (now - lastObstacleTimeRef.current > 3000) {
      createObstacle()
      lastObstacleTimeRef.current = now
    }
    if (now - lastStarTimeRef.current > 5000) {
      createStar()
      lastStarTimeRef.current = now
    }

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) draw(ctx)
    }

    animationFrameRef.current = requestAnimationFrame(update)
  }, [draw, createItem, createObstacle, createStar, comboTimer])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialiser la position du joueur
    playerRef.current.y = GROUND_Y - playerRef.current.height

    // Dessin initial
    draw(ctx)

    // Démarrer la boucle de jeu
    animationFrameRef.current = requestAnimationFrame(update)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [draw, update])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true

      // Saut
      if (e.key === ' ' && !playerRef.current.jumping && gameState.running) {
        e.preventDefault()
        playerRef.current.velocityY = JUMP_STRENGTH
        playerRef.current.jumping = true
      }

      // Démarrer le jeu
      if (e.key === 'Enter' && !gameState.running && !gameState.gameOver) {
        setGameState(prev => ({ ...prev, running: true }))
        addNotification('🎮 Jeu démarré!', 'success')
      }

      // Restart game
      if (e.key === 'r' || e.key === 'R') {
        if (gameState.gameOver || gameState.running) {
          setGameState({
            running: false,
            score: 0,
            gameOver: false,
            paused: false,
          })
          setHealth(INITIAL_HEALTH)
          setCombo(0)
          setComboTimer(0)
          itemsRef.current = []
          obstaclesRef.current = []
          starsRef.current = []
          playerRef.current.x = 50
          playerRef.current.y = GROUND_Y - playerRef.current.height
          playerRef.current.velocityY = 0
          playerRef.current.jumping = false
          addNotification('🔄 Partie réinitialisée', 'info')
        }
      }

      // Pause
      if (e.key === 'Escape' && gameState.running) {
        setGameState(prev => {
          const newPaused = !prev.paused
          addNotification(newPaused ? '⏸️ En pause' : '▶️ Repris', 'info')
          return { ...prev, paused: newPaused }
        })
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState.running, gameState.gameOver])

  return (
    <div className="game-section">
      <h2>🕹️ JEU: COLLECTE DE L&apos;HÉRITAGE 🕹️</h2>
      <div className="game-wrapper">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          id="gameCanvas"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        {!gameState.running && !gameState.gameOver && (
          <div className="game-overlay" id="gameOverlay">
            PRESS ENTER TO START<br />
            <span className="game-overlay-small">Utilise ← → ESPACE</span>
          </div>
        )}
        {gameState.paused && (
          <div className="game-overlay" id="gameOverlay">
            PAUSED<br />
            <span className="game-overlay-small">Press ESC to resume</span>
          </div>
        )}
      </div>
      <div className="game-controls">
        ← → Déplacer | ESPACE Sauter | ENTER Démarrer | ESC Pause | R Recommencer
      </div>
      <div className="game-instructions">
        🎮 OBJECTIF: Incarnez une game designer et collectez les symboles roses (contributions féminines)<br />
        ⚠️ Évitez les obstacles violets (barrières historiques) - Vous avez {INITIAL_HEALTH} vies<br />
        ⭐ Bonus: Collectez les étoiles dorées pour débloquer des faits historiques!<br />
        🔥 Combo: Collectez plusieurs items rapidement pour multiplier vos points!
      </div>
      <div className="notification-container">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            onClose={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
          />
        ))}
      </div>
    </div>
  )
}

