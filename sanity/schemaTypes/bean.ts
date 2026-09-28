import {defineType, defineField} from 'sanity'
import {PackageIcon} from '@sanity/icons/Package'

export const bean = defineType({
  name: 'bean',
  title: 'Coffee Bean',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description: 'e.g. "Ethiopia Yirgacheffe Kochere"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'roaster',
      type: 'reference',
      to: [{type: 'roaster'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      description:
        'Bag photo. Uploads are unavailable on unclaimed projects — add after claiming, or paste an external URL in the imageUrl field below.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageUrl',
      title: 'External image URL',
      description: 'Use this until you claim the project and can upload assets.',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'origin',
      type: 'object',
      fields: [
        defineField({name: 'country', type: 'string'}),
        defineField({name: 'region', type: 'string'}),
        defineField({name: 'farm', title: 'Farm', type: 'string'}),
        defineField({name: 'producer', title: 'Producer', type: 'string'}),
        defineField({
          name: 'elevation',
          title: 'Elevation (masl)',
          type: 'string',
          description: 'e.g. "1800-2100"',
        }),
      ],
    }),
    defineField({
      name: 'variety',
      title: 'Variety / Cultivar',
      description: 'e.g. "Heirloom", "Bourbon", "SL28"',
      type: 'string',
    }),
    defineField({
      name: 'process',
      type: 'string',
      options: {
        list: [
          {title: 'Washed', value: 'washed'},
          {title: 'Natural', value: 'natural'},
          {title: 'Honey', value: 'honey'},
          {title: 'Anaerobic', value: 'anaerobic'},
          {title: 'Carbonic maceration', value: 'carbonic'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'processDetail',
      title: 'Process detail',
      description: 'Any extra detail (e.g. "72h anaerobic natural")',
      type: 'string',
    }),
    defineField({
      name: 'roastLevel',
      type: 'string',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Medium-light', value: 'medium-light'},
          {title: 'Medium', value: 'medium'},
          {title: 'Medium-dark', value: 'medium-dark'},
          {title: 'Dark', value: 'dark'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'tastingNotes',
      title: 'Tasting notes',
      description: 'Short descriptors — e.g. "blueberry, jasmine, chocolate"',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'notes',
      title: 'Personal notes',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'roaster.name',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? `by ${subtitle}` : undefined,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Roast date (newest)',
      name: 'roastDateDesc',
      by: [{field: 'roastDate', direction: 'desc'}],
    },
  ],
})
