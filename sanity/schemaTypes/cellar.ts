import {defineType, defineField} from 'sanity'
import {ArchiveIcon} from '@sanity/icons/Archive'

export const cellar = defineType({
  name: 'cellar',
  title: 'Cellar',
  type: 'document',
  icon: ArchiveIcon,
  fields: [
    defineField({
      name: 'bean',
      type: 'reference',
      to: [{type: 'bean'}],
      validation: (rule) => rule.required().error('Choose the bean stored in this tube'),
    }),
    defineField({
      name: 'weightGrams',
      title: 'Weight (g)',
      type: 'number',
      validation: (rule) => rule.required().min(0).error('Enter a weight of 0g or more'),
    }),
    defineField({
      name: 'roastDate',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'storageType',
      type: 'string',
      options: {
        list: [
          {title: 'Bag', value: 'bag'},
          {title: 'Cellar', value: 'cellar'},
        ],
      },
    }),
    defineField({
      name: 'storage',
      title: 'Storage location',
      type: 'string',
      options: {
        list: [
          {title: 'Wall', value: 'wall'},
          {title: 'Freezer', value: 'freezer'},
          {title: 'Finished', value: 'finished'},
        ],
      },
    }),
    defineField({
      name: 'cellarNumber',
      title: 'Cellar number',
      type: 'number',
      hidden: ({parent}) => parent?.storageType !== 'cellar',
      validation: (rule,context) => 
        rule.custom((value,context) => {
          if (context?.document?.storageType === 'cellar' && value === undefined) {
            return 'Cellar number is required for cellar storage'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      bean: 'bean.name',
      roaster: 'bean.roaster.name',
      tube: 'testTubeNumber',
      storage: 'storage',
      weight: 'weightGrams',
      cellarNumber: 'cellarNumber',
    },
    prepare({bean, roaster, storage, weight, cellarNumber}) {
      const details = [storage, weight != null ? `${weight}g` : undefined, cellarNumber != null ? `Cellar ${cellarNumber}` : undefined].filter(Boolean)
      return {
        title: `${roaster} — ${bean}` ,
        subtitle: details.join(' · ') || undefined,
      }
    },
  },
  orderings: [
    {
      title: 'Test tube',
      name: 'testTubeNumberAsc',
      by: [{field: 'testTubeNumber', direction: 'asc'}],
    },
  ],
})
