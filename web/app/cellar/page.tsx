import type {Metadata} from 'next'
import Link from 'next/link'
import {CellarSections} from '@/components/inventory-page'
import {client} from '@/sanity/client'
import {CELLAR_ITEMS_QUERY, type CellarItem} from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Cellar · Coffee Library',
}

const TYPES = [
  {value: 'all', label: 'All'},
  {value: 'tube', label: 'Tubes'},
  {value: 'bag', label: 'Bags'},
] as const

const LOCATIONS = [
  {value: 'all', label: 'All'},
  {value: 'wall', label: 'Wall'},
  {value: 'freezer', label: 'Freezer'},
] as const

type TypeFilter = (typeof TYPES)[number]['value']
type LocationFilter = (typeof LOCATIONS)[number]['value']

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function cellarHref(type: TypeFilter, location: LocationFilter) {
  const params = new URLSearchParams()
  if (type !== 'all') params.set('type', type)
  if (location !== 'all') params.set('location', location)
  const query = params.toString()
  return query ? `/cellar?${query}` : '/cellar'
}

export default async function CellarPage({searchParams}: PageProps<'/cellar'>) {
  const params = await searchParams
  const typeParam = one(params.type)
  const locationParam = one(params.location)
  const type: TypeFilter = TYPES.some((option) => option.value === typeParam)
    ? (typeParam as TypeFilter)
    : 'all'
  const location: LocationFilter = LOCATIONS.some((option) => option.value === locationParam)
    ? (locationParam as LocationFilter)
    : 'all'

  const items = await client.fetch<CellarItem[]>(CELLAR_ITEMS_QUERY, {
    storage: '',
    storageType: '',
  })
  const filtered = items.filter((item) => {
    if (type === 'tube' && item.storageType !== 'cellar') return false
    if (type === 'bag' && item.storageType !== 'bag') return false
    if (location !== 'all' && item.storage !== location) return false
    return true
  })
  const totalGrams = filtered.reduce((sum, item) => sum + (item.weightGrams ?? 0), 0)
  const filtering = type !== 'all' || location !== 'all'

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Cellar</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          {items.length === 0
            ? 'Bags and tubes in the cellar.'
            : `${filtered.length} item${filtered.length === 1 ? '' : 's'} · ${totalGrams}g`}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-x-8 gap-y-4">
        <FilterGroup label="Type">
          {TYPES.map((option) => (
            <FilterLink
              key={option.value}
              href={cellarHref(option.value, location)}
              active={type === option.value}
            >
              {option.label}
            </FilterLink>
          ))}
        </FilterGroup>
        <FilterGroup label="Location">
          {LOCATIONS.map((option) => (
            <FilterLink
              key={option.value}
              href={cellarHref(type, option.value)}
              active={location === option.value}
            >
              {option.label}
            </FilterLink>
          ))}
        </FilterGroup>
      </div>

      {items.length === 0 ? (
        <Empty>Nothing in the cellar yet. Add a Cellar document in the Studio.</Empty>
      ) : filtered.length === 0 ? (
        <Empty>Nothing matches these filters.</Empty>
      ) : (
        <CellarSections items={filtered} showEmpty={!filtering} />
      )}
    </div>
  )
}

function FilterGroup({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <div className="mt-2 flex gap-2">{children}</div>
    </div>
  )
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'true' : undefined}
      className={
        active
          ? 'rounded-full bg-zinc-900 px-3 py-1 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900'
          : 'rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-100'
      }
    >
      {children}
    </Link>
  )
}

function Empty({children}: {children: React.ReactNode}) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center">
      <p className="text-zinc-600 dark:text-zinc-400">{children}</p>
    </div>
  )
}
