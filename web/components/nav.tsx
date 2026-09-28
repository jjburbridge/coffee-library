'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

const LINKS = [
  {href: '/', label: 'Beans', match: (path: string) => path === '/' || path.startsWith('/beans')},
  {href: '/cellar', label: 'Cellar', match: (path: string) => path.startsWith('/cellar')},
  {href: '/wall', label: 'Wall', match: (path: string) => path.startsWith('/wall')},
  {href: '/freezer', label: 'Freezer', match: (path: string) => path.startsWith('/freezer')},
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-4 text-sm">
      {LINKS.map((link) => {
        const active = link.match(pathname)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? 'text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }
            aria-current={active ? 'page' : undefined}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
