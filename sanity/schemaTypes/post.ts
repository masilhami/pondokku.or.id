// sanity/schemaTypes/post.ts
import { defineArrayMember, defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Artikel Berita / Video',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Judul Berita',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Kategori / Topik',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'youtubeUrl',
      title: 'Link URL Video YouTube',
      type: 'url',
      description:
        'Masukkan URL YouTube lengkap. Jika diisi, website dapat menggunakan thumbnail YouTube.',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'author',
      title: 'Nama Penulis',
      type: 'string',
    }),

    defineField({
      name: 'editor',
      title: 'Nama Editor',
      type: 'string',
    }),

    defineField({
      name: 'publishedAt',
      title: 'Tanggal Tayang',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'mainImage',
      title: 'Gambar Utama (Thumbnail Manual)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description:
        'Boleh dikosongkan jika memakai thumbnail dari link YouTube.',

      fields: [
        defineField({
          name: 'alt',
          title: 'Deskripsi Gambar (Alt Text)',
          type: 'string',
          description:
            'Jelaskan isi gambar secara singkat untuk aksesibilitas.',
        }),

        defineField({
          name: 'caption',
          title: 'Keterangan Gambar (Caption)',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'summary',
      title: 'Ringkasan Berita (Poin-Poin)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'body',
      title: 'Isi Berita',
      type: 'array',
      description:
        'Tulis artikel dan sisipkan gambar melalui menu tambah blok.',

      of: [
        defineArrayMember({
          type: 'block',
        }),

        defineArrayMember({
          type: 'image',
          title: 'Gambar dalam Artikel',
          options: {
            hotspot: true,
          },

          fields: [
            defineField({
              name: 'alt',
              title: 'Deskripsi Gambar (Alt Text)',
              type: 'string',
              description:
                'Jelaskan isi gambar secara singkat untuk aksesibilitas.',
            }),

            defineField({
              name: 'caption',
              title: 'Keterangan Gambar (Caption)',
              type: 'string',
            }),
          ],

          validation: (Rule) =>
            Rule.custom((value) => {
              if (!value?.asset?._ref) {
                return 'Unggah atau pilih gambar terlebih dahulu.';
              }

              return true;
            }),
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'mainImage',
      youtubeUrl: 'youtubeUrl',
    },

    prepare({ title, author, media, youtubeUrl }) {
      return {
        title,
        subtitle: `${author || 'Anonim'} | ${
          youtubeUrl ? '🎥 VIDEO YOUTUBE' : '📝 ARTIKEL'
        }`,
        media,
      };
    },
  },
});