'use client'

import React, { useEffect, useState } from 'react'

interface NotificationProps {
  message: string
  type: 'success' | 'info' | 'warning'
  duration?: number
  onClose: () => void
}

export default function Notification({ message, type, duration = 3000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: { bg: '#4caf50', border: '#2e7d32', icon: '✓' },
    info: { bg: '#2196f3', border: '#1565c0', icon: 'ℹ' },
    warning: { bg: '#ff9800', border: '#e65100', icon: '⚠' },
  }

  const style = typeStyles[type]

  return (
    <div
      className={`notification ${isVisible ? 'visible' : ''}`}
      style={{
        background: style.bg,
        borderColor: style.border,
      }}
    >
      <span className="notification-icon">{style.icon}</span>
      <span className="notification-message">{message}</span>
    </div>
  )
}

interface NotificationManagerProps {
  notifications: Array<{ id: string; message: string; type: 'success' | 'info' | 'warning' }>
  onRemove: (id: string) => void
}

export function NotificationManager({ notifications, onRemove }: NotificationManagerProps) {
  return (
    <div className="notification-container">
      {notifications.map((notif) => (
        <Notification
          key={notif.id}
          message={notif.message}
          type={notif.type}
          onClose={() => onRemove(notif.id)}
        />
      ))}
    </div>
  )
}

