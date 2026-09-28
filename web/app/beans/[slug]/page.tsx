import Link from 'next/link'
import {notFound} from 'next/navigation'
import {client} from '@/sanity/client'
import {BEAN_BY_SLUG_QUERY, type BeanDetail} from '@/sanity/queries'

const STORAGE_LABELS: Record<string, string> = {
  bag: 'Bag (open)',
  'bag-sealed': 'Bag (sealed)',
  canister: 'Canister',
  freezer: 'Freezer',
  cupboard: 'Cupboard',
  finished: 'Finished',
}

function computeRatio(dose?: number | null, other?: number | null) {
  if (!dose || !other) return null
  const r = other / dose
  return `1:${r.toFixed(r >= 10 ? 0 : 1)}`
}

function formatTime(seconds?: number | null) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default async function BeanPage({params}: PageProps<'/beans/[slug]'>) {
  const {slug} = await params
  const bean = await client.fetch<BeanDetail | null>(BEAN_BY_SLUG_QUERY, {slug})
  if (!bean) notFound()

  const filterRecipes = bean.recipes?.filter((r) => r.method === 'filter') ?? []
  const espressoRecipes = bean.recipes?.filter((r) => r.method === 'espresso') ?? []

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← Back to beans
      </Link>

      <header className="mt-4 flex flex-col sm:flex-row gap-6 items-start">
        {bean.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bean.imageUrl}
            alt={bean.name}
            className="h-40 w-40 rounded-lg object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{bean.name}</h1>
          {bean.roaster && (
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              by{' '}
              {bean.roaster.website ? (
                <a
                  href={bean.roaster.website}
                  className="underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  {bean.roaster.name}
                </a>
              ) : (
                bean.roaster.name
              )}
              {bean.roaster.location && ` · ${bean.roaster.location}`}
            </p>
          )}
          {bean.tastingNotes && bean.tastingNotes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {bean.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 text-sm"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        {bean.origin?.country && (
          <Info label="Origin">
            {[bean.origin.country, bean.origin.region, bean.origin.farm]
              .filter(Boolean)
              .join(' · ')}
            {bean.origin.elevation && ` (${bean.origin.elevation} masl)`}
          </Info>
        )}
        {bean.variety && <Info label="Variety">{bean.variety}</Info>}
        {bean.process && (
          <Info label="Process">
            <span className="capitalize">{bean.process}</span>
            {bean.processDetail && ` — ${bean.processDetail}`}
          </Info>
        )}
        {bean.roastLevel && (
          <Info label="Roast level">
            <span className="capitalize">{bean.roastLevel.replace('-', ' ')}</span>
          </Info>
        )}
        {bean.roastDate && (
          <Info label="Roast date">
            {new Date(bean.roastDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Info>
        )}
        {bean.storage && (
          <Info label="Storage">{STORAGE_LABELS[bean.storage] ?? bean.storage}</Info>
        )}
        {bean.weightGrams != null && <Info label="Weight">{bean.weightGrams}g</Info>}
      </section>

      {bean.notes && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Notes</h2>
          <p className="mt-2 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
            {bean.notes}
          </p>
        </section>
      )}

      <RecipeSection title="Filter recipes" method="filter" recipes={filterRecipes} />
      <RecipeSection title="Espresso recipes" method="espresso" recipes={espressoRecipes} />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Gaggimate shots</h2>
        {(!bean.shots || bean.shots.length === 0) ? (
          <p className="mt-2 text-sm text-zinc-500">No shots recorded yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {bean.shots.map((shot) => (
              <li
                key={shot._id}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="font-medium">
                      {shot.title || 'Shot'}
                      {shot.profile && (
                        <span className="ml-2 text-xs font-normal text-zinc-500">
                          · {shot.profile}
                        </span>
                      )}
                    </h3>
                    {shot.pulledAt && (
                      <p className="text-xs text-zinc-500">
                        {new Date(shot.pulledAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {shot.rating != null && (
                    <span className="text-sm text-amber-600 dark:text-amber-400">
                      {'★'.repeat(shot.rating)}
                      <span className="text-zinc-300 dark:text-zinc-700">
                        {'★'.repeat(5 - shot.rating)}
                      </span>
                    </span>
                  )}
                </div>
                <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-y-1 gap-x-4 text-sm">
                  {shot.doseGrams != null && (
                    <Stat label="Dose">{shot.doseGrams}g</Stat>
                  )}
                  {shot.yieldGrams != null && (
                    <Stat label="Yield">{shot.yieldGrams}g</Stat>
                  )}
                  {shot.extractionTimeSeconds != null && (
                    <Stat label="Time">{shot.extractionTimeSeconds}s</Stat>
                  )}
                  {computeRatio(shot.doseGrams, shot.yieldGrams) && (
                    <Stat label="Ratio">
                      {computeRatio(shot.doseGrams, shot.yieldGrams)}
                    </Stat>
                  )}
                  {shot.peakPressureBar != null && (
                    <Stat label="Peak pressure">{shot.peakPressureBar} bar</Stat>
                  )}
                  {shot.peakFlowMlPerSec != null && (
                    <Stat label="Peak flow">{shot.peakFlowMlPerSec} ml/s</Stat>
                  )}
                </dl>
                {shot.notes && (
                  <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {shot.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function RecipeSection({
  title,
  method,
  recipes,
}: {
  title: string
  method: 'filter' | 'espresso'
  recipes: Array<{
    _id: string
    title: string | null
    method: string | null
    brewer?: string | null
    doseGrams?: number | null
    yieldGrams?: number | null
    waterGrams?: number | null
    timeSeconds?: number | null
    ratio?: string | null
    rating?: number | null
    notes?: string | null
  }>
}) {
  if (recipes.length === 0) return null
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {recipes.map((r) => {
          const other = method === 'espresso' ? r.yieldGrams : r.waterGrams
          const ratio = r.ratio || computeRatio(r.doseGrams, other)
          return (
            <li
              key={r._id}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-medium">
                  {r.title}
                  {r.brewer && (
                    <span className="ml-2 text-xs font-normal text-zinc-500">
                      · {r.brewer}
                    </span>
                  )}
                </h3>
                {r.rating != null && (
                  <span className="text-sm text-amber-600 dark:text-amber-400">
                    {'★'.repeat(r.rating)}
                    <span className="text-zinc-300 dark:text-zinc-700">
                      {'★'.repeat(5 - r.rating)}
                    </span>
                  </span>
                )}
              </div>
              <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-y-1 gap-x-4 text-sm">
                {r.doseGrams != null && <Stat label="Dose">{r.doseGrams}g</Stat>}
                {method === 'espresso' && r.yieldGrams != null && (
                  <Stat label="Yield">{r.yieldGrams}g</Stat>
                )}
                {method === 'filter' && r.waterGrams != null && (
                  <Stat label="Water">{r.waterGrams}g</Stat>
                )}
                {r.timeSeconds != null && <Stat label="Time">{formatTime(r.timeSeconds)}</Stat>}
                {ratio && <Stat label="Ratio">{ratio}</Stat>}
              </dl>
              {r.notes && (
                <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {r.notes}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Info({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  )
}

function Stat({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div>
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  )
}
