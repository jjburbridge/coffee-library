import Link from 'next/link'
import {client} from '@/sanity/client'
import {CELLAR_ITEMS_QUERY, type CellarEntry, type CellarItem} from '@/sanity/queries'

const STORAGE_LABELS: Record<string, string> = {
  wall: 'Wall',
  freezer: 'Freezer',
  finished: 'Finished',
}

const STORAGE_TYPE_LABELS: Record<string, string> = {
  bag: 'Bag',
  cellar: 'Cellar',
}

function daysSince(dateStr: string | null | undefined) {
  if (!dateStr) return null
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
}

function totalGrams(items: CellarEntry[]) {
  return items.reduce((sum, item) => sum + (item.weightGrams ?? 0), 0)
}

function ItemList({
  items,
  showBean,
  showType,
}: {
  items: Array<CellarEntry | CellarItem>
  showBean: boolean
  showType: boolean
}) {
  if (items.length === 0) {
    return <p className="mt-3 text-sm text-zinc-500">Nothing here yet.</p>
  }

  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => {
        const days = daysSince(item.roastDate)
        const beanName = 'beanName' in item ? item.beanName : null
        const beanSlug = 'beanSlug' in item ? item.beanSlug : null
        const roasterName = 'roasterName' in item ? item.roasterName : null
        const tastingNotes = 'tastingNotes' in item ? item.tastingNotes : null
        const process = 'process' in item ? item.process : null
        const beanHref = showBean && beanSlug ? `/beans/${beanSlug}` : null
        return (
          <li
            key={item._id}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5"
          >
            <div className="flex gap-4">
              {item.cellarNumber != null && (
                <div className="shrink-0 w-12 text-center">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Tube</p>
                  <p className="text-2xl font-semibold tabular-nums leading-none mt-1">
                    {item.cellarNumber}
                  </p>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div>
                    {showBean &&
                      (beanHref ? (
                        <Link
                          href={beanHref}
                          className="font-semibold leading-tight hover:underline underline-offset-4"
                        >
                          {beanName ?? 'Untitled bean'}
                        </Link>
                      ) : (
                        <h3 className="font-semibold leading-tight">
                          {beanName ?? 'Untitled bean'}
                        </h3>
                      ))}
                    {showBean && roasterName && (
                      <p className="mt-0.5 text-sm text-zinc-500">by {roasterName}</p>
                    )}
                    {!showBean && item.weightGrams == null && (
                      <p className="font-semibold leading-tight">Stored</p>
                    )}
                  </div>
                  {item.weightGrams != null && (
                    <p className="text-sm font-medium tabular-nums">{item.weightGrams}g</p>
                  )}
                </div>
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                  {showType && item.storageType && (
                    <div>
                      <dt className="text-zinc-500">Type</dt>
                      <dd>{STORAGE_TYPE_LABELS[item.storageType] ?? item.storageType}</dd>
                    </div>
                  )}
                  {item.storage && (
                    <div>
                      <dt className="text-zinc-500">Location</dt>
                      <dd>{STORAGE_LABELS[item.storage] ?? item.storage}</dd>
                    </div>
                  )}
                  {process && (
                    <div>
                      <dt className="text-zinc-500">Process</dt>
                      <dd className="capitalize">{process}</dd>
                    </div>
                  )}
                  {days !== null && (
                    <div>
                      <dt className="text-zinc-500">Roasted</dt>
                      <dd>{days === 0 ? 'today' : `${days}d ago`}</dd>
                    </div>
                  )}
                </dl>
                {tastingNotes && tastingNotes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {tastingNotes.slice(0, 4).map((note) => (
                      <span
                        key={note}
                        className="rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 px-2 py-0.5 text-xs"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function CellarSections({
  items,
  showBean = true,
  showEmpty = true,
  nested = false,
}: {
  items: Array<CellarEntry | CellarItem>
  showBean?: boolean
  showEmpty?: boolean
  nested?: boolean
}) {
  const tubes = items.filter((item) => item.storageType === 'cellar')
  const bags = items.filter((item) => item.storageType === 'bag')
  const sections = [
    {title: 'Tubes', items: tubes},
    {title: 'Bags', items: bags},
  ].filter((section) => showEmpty || section.items.length > 0)
  const Heading = nested ? 'h3' : 'h2'

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.title}>
          <Heading className={nested ? 'text-lg font-semibold' : 'text-xl font-semibold'}>
            {section.title}
          </Heading>
          <p className="mt-1 text-sm text-zinc-500">
            {section.items.length} {section.items.length === 1 ? 'item' : 'items'} ·{' '}
            {totalGrams(section.items)}g
          </p>
          <ItemList items={section.items} showBean={showBean} showType={false} />
        </section>
      ))}
    </div>
  )
}

export async function InventoryPage({
  title,
  description,
  empty,
  storage = '',
  storageType = '',
  grouped = false,
}: {
  title: string
  description: string
  empty: string
  storage?: string
  storageType?: string
  grouped?: boolean
}) {
  const items = await client.fetch<CellarItem[]>(CELLAR_ITEMS_QUERY, {storage, storageType})
  const grams = totalGrams(items)

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          {items.length === 0
            ? description
            : `${items.length} item${items.length === 1 ? '' : 's'} · ${grams}g`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">{empty}</p>
        </div>
      ) : grouped ? (
        <CellarSections items={items} />
      ) : (
        <ItemList items={items} showBean showType />
      )}
    </div>
  )
}
