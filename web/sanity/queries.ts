import {defineQuery} from 'next-sanity'

export type BeanListItem = {
  _id: string
  name: string
  slug: string
  roastDate: string | null
  roastLevel: string | null
  storage: string | null
  process: string | null
  tastingNotes: string[] | null
  imageUrl: string | null
  roasterName: string | null
  origin: string | null
}

export type Recipe = {
  _id: string
  title: string
  method: 'filter' | 'espresso'
  brewer: string | null
  doseGrams: number | null
  yieldGrams: number | null
  waterGrams: number | null
  timeSeconds: number | null
  ratio: string | null
  rating: number | null
  notes: string | null
}

export type Shot = {
  _id: string
  title: string | null
  pulledAt: string | null
  profile: string | null
  doseGrams: number | null
  yieldGrams: number | null
  extractionTimeSeconds: number | null
  peakPressureBar: number | null
  peakFlowMlPerSec: number | null
  rating: number | null
  notes: string | null
}

export type BeanDetail = {
  _id: string
  name: string
  slug: string
  roastDate: string | null
  roastLevel: string | null
  storage: string | null
  weightGrams: number | null
  process: string | null
  processDetail: string | null
  variety: string | null
  tastingNotes: string[] | null
  notes: string | null
  imageUrl: string | null
  origin: {
    country: string | null
    region: string | null
    farm: string | null
    elevation: string | null
  } | null
  roaster: {
    _id: string
    name: string
    slug: string | null
    location: string | null
    website: string | null
  } | null
  recipes: Recipe[]
  shots: Shot[]
  cellar: CellarEntry[]
}

export const BEANS_QUERY = defineQuery(`
  *[_type == "bean" && defined(slug.current)]
  | order(roastDate desc) {
    _id,
    name,
    "slug": slug.current,
    roastDate,
    roastLevel,
    storage,
    process,
    tastingNotes,
    "imageUrl": coalesce(image.asset->url + "?w=800&auto=format", imageUrl),
    "roasterName": roaster->name,
    "origin": origin.country
  }
`)

export const BEAN_BY_SLUG_QUERY = defineQuery(`
  *[_type == "bean" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    roastDate,
    roastLevel,
    storage,
    weightGrams,
    process,
    processDetail,
    variety,
    tastingNotes,
    notes,
    "imageUrl": coalesce(image.asset->url + "?w=800&auto=format", imageUrl),
    origin,
    roaster->{
      _id, name, "slug": slug.current, location, website
    },
    "recipes": *[_type == "recipe" && bean._ref == ^._id] | order(method asc, _createdAt desc){
      _id, title, method, brewer, doseGrams, yieldGrams, waterGrams,
      timeSeconds, ratio, rating, notes
    },
    "shots": *[_type == "shot" && bean._ref == ^._id] | order(pulledAt desc){
      _id, title, pulledAt, profile, doseGrams, yieldGrams,
      extractionTimeSeconds, peakPressureBar, peakFlowMlPerSec, rating, notes
    },
    "cellar": *[_type == "cellar" && bean._ref == ^._id] | order(cellarNumber asc, roastDate desc){
      _id,
      weightGrams,
      roastDate,
      storageType,
      storage,
      cellarNumber
    }
  }
`)

export const BEAN_SLUGS_QUERY = defineQuery(`
  *[_type == "bean" && defined(slug.current)][].slug.current
`)

export type CellarEntry = {
  _id: string
  weightGrams: number | null
  roastDate: string | null
  storageType: string | null
  storage: string | null
  cellarNumber: number | null
}

export type CellarItem = CellarEntry & {
  beanName: string | null
  beanSlug: string | null
  roasterName: string | null
  imageUrl: string | null
  tastingNotes: string[] | null
  process: string | null
}

export const CELLAR_ITEMS_QUERY = defineQuery(`
  *[
    _type == "cellar"
    && ($storageType == "" || storageType == $storageType)
    && ($storage == "" || storage == $storage)
  ]
  | order(cellarNumber asc, roastDate desc) {
    _id,
    weightGrams,
    roastDate,
    storageType,
    storage,
    cellarNumber,
    "beanName": bean->name,
    "beanSlug": bean->slug.current,
    "roasterName": bean->roaster->name,
    "imageUrl": coalesce(bean->image.asset->url + "?w=800&auto=format", bean->imageUrl),
    "tastingNotes": bean->tastingNotes,
    "process": bean->process
  }
`)
