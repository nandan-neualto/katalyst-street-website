import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author Profiles',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Display Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Corporate Title / Role',
      type: 'string',
    }),
    defineField({
      name: 'avatar',
      title: 'Profile Avatar Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})
