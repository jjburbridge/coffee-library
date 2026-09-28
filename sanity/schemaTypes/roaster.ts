import {defineType, defineField} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const roaster = defineType({
  name: 'roaster',
  title: 'Roaster',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
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
      name: 'location',
      title: 'Location (City, Country)',
      type: 'string',
    }),
    defineField({
      name: 'website',
      type: 'url',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}).error('Must start with http:// or https://'),
    }),
    defineField({
      name: 'notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'location'},
  },
})
