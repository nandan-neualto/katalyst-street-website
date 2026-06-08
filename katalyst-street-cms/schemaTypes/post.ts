import {defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post or White Paper',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postType',
      title: 'Post Type',
      type: 'string',
      options: {
        list: [
          {title: 'Standard Blog Post', value: 'blog'},
          {title: 'Featured White Paper (PDF)', value: 'whitepaper'},
        ],
        layout: 'radio',
      },
      initialValue: 'blog',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'string',
      description: 'e.g. 5 Min Read',
      initialValue: '5 Min Read',
    }),
    defineField({
      name: 'category',
      title: 'Category Tag',
      type: 'string',
      description: 'e.g. Governance, Cloud Security, FinOps',
    }),
    defineField({
      name: 'pdfUrl',
      title: 'PDF File Path (For White Papers)',
      type: 'string',
      description: 'Relative path (e.g. ./Katalyst street whitepaper.pdf) or external URL',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Card Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Post Body Content',
      type: 'array',
      of: [
        {type: 'block'},
      ],
    }),
  ],
})
