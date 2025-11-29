export interface Player {
  x: number
  y: number
  width: number
  height: number
  speed: number
  velocityY: number
  jumping: boolean
  color: string
}

export interface GameItem {
  x: number
  y: number
  width: number
  height: number
  speed: number
  color: string
  type: 'item' | 'obstacle' | 'star'
}

export interface GameState {
  running: boolean
  score: number
  gameOver: boolean
  paused: boolean
}

