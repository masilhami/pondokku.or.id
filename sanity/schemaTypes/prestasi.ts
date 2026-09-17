// sanity/schemaTypes/prestasi.ts

import { defineField, defineType } from 'sanity';

export const prestasi = defineType({
  name: 'prestasi',
  title: 'Prestasi Siswa',
  type: 'document',

  fields: [
    defineField({
      name: 'jenisLomba',
      title: 'Jenis Lomba / Nama Kejuaraan',
      type: 'string',
      description: 'Contoh: Lomba FLS2N Tingkat Kabupaten',
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .error('Nama atau jenis lomba wajib diisi.'),
    }),

    defineField({
      name: 'juaraLomba',
      title: 'Juara Lomba',
      type: 'string',
      description: 'Contoh: Juara 1, Juara 2, Juara Harapan 1',
      validation: (Rule) =>
        Rule.required().error('Tingkat juara wajib diisi.'),
    }),

    defineField({
      name: 'namaSiswa',
      title: 'Nama Siswa yang Juara',
      type: 'string',
      description: 'Masukkan nama lengkap siswa.',
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .error('Nama siswa wajib diisi.'),
    }),

    defineField({
      name: 'tanggalLomba',
      title: 'Waktu / Tanggal Lomba',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
      validation: (Rule) =>
        Rule.required().error('Tanggal lomba wajib diisi.'),
    }),

    defineField({
      name: 'foto',
      title: 'Foto Penghargaan / Dokumentasi',
      type: 'image',
      description: 'Upload foto siswa, piala, piagam, atau dokumentasi lomba.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Teks Alternatif / Alt Text',
          type: 'string',
          description:
            'Contoh: Siswa meraih Juara 1 FLS2N tingkat kabupaten',
        }),
      ],
    }),

    defineField({
      name: 'deskripsi',
      title: 'Keterangan / Deskripsi',
      type: 'text',
      rows: 4,
      description:
        'Tambahkan informasi singkat mengenai prestasi atau perlombaan.',
    }),
  ],

  preview: {
    select: {
      jenisLomba: 'jenisLomba',
      juaraLomba: 'juaraLomba',
      namaSiswa: 'namaSiswa',
      tanggalLomba: 'tanggalLomba',
      media: 'foto',
    },

    prepare({
      jenisLomba,
      juaraLomba,
      namaSiswa,
      tanggalLomba,
      media,
    }) {
      const title = jenisLomba || 'Prestasi Siswa';

      const bagianSubtitle = [
        namaSiswa || null,
        juaraLomba || null,
        tanggalLomba || null,
      ].filter(Boolean);

      return {
        title,
        subtitle:
          bagianSubtitle.length > 0
            ? bagianSubtitle.join(' • ')
            : 'Belum ada informasi prestasi',
        media,
      };
    },
  },
});

export default prestasi;