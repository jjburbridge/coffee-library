import {defineType, defineField} from 'sanity'
import {DropIcon} from '@sanity/icons/Drop'

export const recipe = defineType({
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  icon: DropIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bean',
      type: 'reference',
      to: [{type: 'bean'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'method',
      type: 'string',
      options: {
        list: [
          {title: 'Filter', value: 'filter'},
          {title: 'Espresso', value: 'espresso'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'brewer',
      title: 'Brewer / Equipment',
      description: 'e.g. "V60", "Aeropress", "Gaggia Classic Pro", "Gaggiuino"',
      type: 'string',
    }),
    defineField({
      name: 'grinder',
      type: 'string',
      description: 'e.g. "Kingrinder K6"',
    }),
    defineField({
      name: 'grindSetting',
      title: 'Grind setting',
      type: 'string',
    }),
    defineField({
      name: 'doseGrams',
      title: 'Dose (g)',
      type: 'number',
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: 'yieldGrams',
      title: 'Yield (g)',
      type: 'number',
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: 'waterGrams',
      title: 'Water (g) — filter only',
      type: 'number',
      hidden: ({parent}) => parent?.method !== 'filter',
    }),
    defineField({
      name: 'waterTempC',
      title: 'Water temperature (°C)',
      type: 'number',
      validation: (rule) => rule.min(60).max(100),
    }),
    defineField({
      name: 'timeSeconds',
      title: 'Total time (s)',
      type: 'number',
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: 'ratio',
      title: 'Ratio',
      description: 'e.g. "1:2.2" for espresso, "1:16" for filter — computed if left blank',
      type: 'string',
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'time', title: 'Time (mm:ss)', type: 'string'},
            {name: 'action', title: 'Action', type: 'string'},
          ],
          preview: {
            select: {title: 'action', subtitle: 'time'},
          },
        },
      ],
    }),
    defineField({
      name: 'notes',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (rule) => rule.min(1).max(5),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'bean.name',
      method: 'method',
    },
    prepare({title, subtitle, method}) {
      const prefix = method === 'espresso' ? '☕' : '💧'
      return {
        title: `${prefix} ${title}`,
        subtitle,
      }
    },
  },
})
