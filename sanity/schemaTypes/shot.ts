import {defineType, defineField} from 'sanity'
import {BarChartIcon} from '@sanity/icons/BarChart'

export const shot = defineType({
  name: 'shot',
  title: 'Shot Analysis (Gaggimate)',
  type: 'document',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'title',
      description: 'Optional label — otherwise generated from bean + date',
      type: 'string',
    }),
    defineField({
      name: 'bean',
      type: 'reference',
      to: [{type: 'bean'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'recipe',
      description: 'Recipe this shot was pulled with (optional)',
      type: 'reference',
      to: [{type: 'recipe'}],
    }),
    defineField({
      name: 'pulledAt',
      title: 'Pulled at',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'profile',
      title: 'Profile name',
      description: 'Gaggimate profile used, e.g. "9 bar", "Blooming espresso"',
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
      name: 'extractionTimeSeconds',
      title: 'Extraction time (s)',
      type: 'number',
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: 'preinfusionSeconds',
      title: 'Preinfusion (s)',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'peakPressureBar',
      title: 'Peak pressure (bar)',
      type: 'number',
    }),
    defineField({
      name: 'peakFlowMlPerSec',
      title: 'Peak flow (ml/s)',
      type: 'number',
    }),
    defineField({
      name: 'peakTempC',
      title: 'Peak temperature (°C)',
      type: 'number',
    }),
    defineField({
      name: 'samples',
      title: 'Samples',
      description: 'Time-series samples pulled from Gaggimate',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sample',
          fields: [
            {name: 't', title: 'Time (s)', type: 'number'},
            {name: 'pressure', title: 'Pressure (bar)', type: 'number'},
            {name: 'flow', title: 'Flow (ml/s)', type: 'number'},
            {name: 'weight', title: 'Weight (g)', type: 'number'},
            {name: 'temp', title: 'Temperature (°C)', type: 'number'},
          ],
          preview: {
            select: {t: 't', pressure: 'pressure', flow: 'flow'},
            prepare({t, pressure, flow}) {
              return {
                title: `${t ?? '?'}s`,
                subtitle: `${pressure ?? '?'} bar · ${flow ?? '?'} ml/s`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: 'notes',
      title: 'Tasting notes',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      bean: 'bean.name',
      pulledAt: 'pulledAt',
      dose: 'doseGrams',
      yield: 'yieldGrams',
      time: 'extractionTimeSeconds',
    },
    prepare({title, bean, pulledAt, dose, yield: y, time}) {
      const date = pulledAt ? new Date(pulledAt).toLocaleDateString() : ''
      const stats =
        dose && y && time ? `${dose}g → ${y}g in ${time}s` : dose ? `${dose}g dose` : ''
      return {
        title: title || `${bean ?? 'Shot'} — ${date}`,
        subtitle: stats,
      }
    },
  },
  orderings: [
    {
      title: 'Most recent',
      name: 'pulledAtDesc',
      by: [{field: 'pulledAt', direction: 'desc'}],
    },
  ],
})
