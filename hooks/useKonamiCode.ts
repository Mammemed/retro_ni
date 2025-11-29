import { useEffect, useRef } from 'react'

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
]

export function useKonamiCode(onActivate: () => void) {
  const bufferRef = useRef<string[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      bufferRef.current.push(e.key)
      
      if (bufferRef.current.length > KONAMI_SEQUENCE.length) {
        bufferRef.current.shift()
      }
      
      if (bufferRef.current.length === KONAMI_SEQUENCE.length) {
        const sequence = bufferRef.current.join(',').toLowerCase()
        const expected = KONAMI_SEQUENCE.join(',').toLowerCase()
        
        if (sequence === expected) {
          onActivate()
          alert('✨ KONAMI CODE ACTIVÉ ! Secret débloqué.')
          bufferRef.current = []
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onActivate])
}

