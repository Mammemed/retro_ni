'use client'

import React, { useRef, useEffect } from 'react'

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

interface ParticleSystemProps {
  particles: Particle[]
  onUpdate: (particles: Particle[]) => void
}

export function ParticleSystem({ particles, onUpdate }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const updatedParticles: Particle[] = []

      particles.forEach((particle) => {
        const newParticle = {
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1,
          vy: particle.vy + 0.2, // gravity
        }

        if (newParticle.life > 0) {
          updatedParticles.push(newParticle)

          const alpha = newParticle.life / newParticle.maxLife
          ctx.globalAlpha = alpha
          ctx.fillStyle = newParticle.color
          ctx.beginPath()
          ctx.arc(newParticle.x, newParticle.y, newParticle.size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      ctx.globalAlpha = 1

      if (updatedParticles.length > 0) {
        onUpdate(updatedParticles)
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    if (particles.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [particles, onUpdate])

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10000,
      }}
    />
  )
}

export function createParticles(
  x: number,
  y: number,
  count: number,
  color: string,
  spread: number = 5
): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * spread,
      vy: (Math.random() - 0.5) * spread - 2,
      life: 30 + Math.random() * 20,
      maxLife: 30 + Math.random() * 20,
      color,
      size: 2 + Math.random() * 3,
    })
  }
  return particles
}

