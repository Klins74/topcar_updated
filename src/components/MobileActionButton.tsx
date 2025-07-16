'use client'

import { ReactNode } from 'react'

type MobileActionButtonProps = {
  onClick: () => void
  children: ReactNode
}

export default function MobileActionButton({ onClick, children }: MobileActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 py-3.5 px-4 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
    >
      {children}
    </button>
  )
}
