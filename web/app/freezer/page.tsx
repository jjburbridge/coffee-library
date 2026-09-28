import type {Metadata} from 'next'
import {InventoryPage} from '@/components/inventory-page'

export const metadata: Metadata = {
  title: 'Freezer · Coffee Library',
}

export default function FreezerPage() {
  return (
    <InventoryPage
      title="Freezer"
      description="Coffee stored in the freezer."
      empty="Nothing in the freezer yet. Set a Cellar document’s storage location to Freezer."
      storage="freezer"
    />
  )
}
