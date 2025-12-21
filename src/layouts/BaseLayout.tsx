import React from 'react'
import AppHeader from '@/components/common/AppHeader'

interface BaseLayoutProps {
  variant?: 'default' | 'minimal' | 'hidden'
  children: React.ReactNode
}

const BaseLayout = ({ variant = 'default', children }: BaseLayoutProps) => {
  return (
    <>
      <AppHeader variant={variant} />
      {children}
    </>
  )
}

export default BaseLayout
