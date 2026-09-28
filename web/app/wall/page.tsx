import type {Metadata} from 'next'
import {InventoryPage} from '@/components/inventory-page'

export const metadata: Metadata = {
  title: 'Wall · Coffee Library',
}

export default function WallPage() {
  return (
    <InventoryPage
      title="Wall"
      description="Coffee stored on the wall."
      empty="Nothing on the wall yet. Set a Cellar document’s storage location to Wall."
      storage="wall"
    />
  )
}
