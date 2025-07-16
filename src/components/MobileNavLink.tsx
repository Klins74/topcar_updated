'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { clsx } from 'clsx'

type MobileNavLinkProps = {
  href: string
  children: ReactNode
  currentPath: string
}

export default function MobileNavLink({ href, children, currentPath }: MobileNavLinkProps) {
  const isActive = currentPath === href

  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-3 py-3.5 px-4 rounded-lg text-sm font-medium transition-colors',
        isActive ? 'bg-muted text-foreground' : 'hover:bg-muted text-muted-foreground'
      )}
    >
      {children}
    </Link>
  )
}
