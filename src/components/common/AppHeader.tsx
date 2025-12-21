import React from 'react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface AppHeaderProps {
  variant?: 'default' | 'minimal' | 'hidden'
  className?: string
}


export default function AppHeader({ 
  variant = 'default',
  className 
}: AppHeaderProps) {
  if (variant === 'hidden') {
    return null
  }

  return (
    <header 
      className={cn(
        'border-b border-border bg-background',
        variant === 'minimal' && 'border-transparent',
        className
      )}
    >
      <div className="container-app py-4 md:py-6">
        <Link 
          to="/"
          className="inline-block text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
        >
          ReadWise
        </Link>
      </div>
    </header>
  )
}
