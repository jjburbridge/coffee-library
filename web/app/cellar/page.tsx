import type {Metadata} from 'next'
import {InventoryPage} from '@/components/inventory-page'

export const metadata: Metadata = {
  title: 'Cellar · Coffee Library',
}

export default function CellarPage() {
  return (
    <InventoryPage
      title="Cellar"
      description="Bags and tubes in the cellar."
      empty="Nothing in the cellar yet. Add a Cellar document in the Studio."
      grouped
    />
  )
}
