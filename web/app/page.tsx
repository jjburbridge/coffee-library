import Link from 'next/link'
import {client} from '@/sanity/client'
import {BEANS_QUERY, type BeanListItem} from '@/sanity/queries'

const STORAGE_LABELS: Record<string, string> = {
  bag: 'Bag (open)',
  'bag-sealed': 'Bag (sealed)',
  canister: 'Canister',
  freezer: 'Freezer',
  cupboard: 'Cupboard',
  finished: 'Finished',
}

function daysSince(dateStr: string | null | undefined) {
  if (!dateStr) return null
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
  )
  return days
}

export default async function Home() {
  const beans = await client.fetch<BeanListItem[]>(BEANS_QUERY)

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Beans</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          {beans.length === 0
            ? 'No beans yet — add some in the Studio.'
            : `${beans.length} bean${beans.length === 1 ? '' : 's'} in the library.`}
        </p>
      </div>

      {beans.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            Open{' '}
            <a
              href="http://localhost:3333"
              className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              the Studio
            </a>{' '}
            and create a Roaster, then a Bean.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beans.map((bean) => {
            const days = daysSince(bean.roastDate)
            return (
              <li key={bean._id}>
                <Link
                  href={`/beans/${bean.slug}`}
                  className="block rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                >
                  {bean.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bean.imageUrl}
                      alt={bean.name}
                      className="mb-3 h-32 w-full rounded object-cover"
                    />
                  )}
                  <h2 className="font-semibold leading-tight">{bean.name}</h2>
                  {bean.roasterName && (
                    <p className="mt-0.5 text-sm text-zinc-500">by {bean.roasterName}</p>
                  )}
                  <dl className="mt-3 grid grid-cols-2 gap-y-1 text-xs">
                    {bean.origin && (
                      <>
                        <dt className="text-zinc-500">Origin</dt>
                        <dd className="text-right">{bean.origin}</dd>
                      </>
                    )}
                    {bean.process && (
                      <>
                        <dt className="text-zinc-500">Process</dt>
                        <dd className="text-right capitalize">{bean.process}</dd>
                      </>
                    )}
                    {bean.storage && (
                      <>
                        <dt className="text-zinc-500">Storage</dt>
                        <dd className="text-right">
                          {STORAGE_LABELS[bean.storage] ?? bean.storage}
                        </dd>
                      </>
                    )}
                    {days !== null && (
                      <>
                        <dt className="text-zinc-500">Roasted</dt>
                        <dd className="text-right">
                          {days === 0 ? 'today' : `${days}d ago`}
                        </dd>
                      </>
                    )}
                  </dl>
                  {bean.tastingNotes && bean.tastingNotes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {bean.tastingNotes.slice(0, 4).map((note) => (
                        <span
                          key={note}
                          className="rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 px-2 py-0.5 text-xs"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
