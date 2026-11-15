/* BUKU SAKU (dibaca daring)
   Setiap halaman buku disimpan sebagai gambar di  assets/buku/<id>/001.webp, 002.webp, dst.
   File PDF untuk diunduh ada di  assets/buku/.
   Versi terpasang: revisi 10 Nov 2026 (tanaman obat 51 halaman, sejarah 31 halaman).
   Bila buku direvisi: ganti gambar halaman dan PDF-nya, lalu sesuaikan "halaman" dan "ukuranPdf".
   "babHalaman": halaman PDF (bukan nomor cetak) tempat tiap bab dimulai, agar tautan
   "Lihat di buku" dari pustaka langsung membuka halaman yang tepat. */
window.KLM = window.KLM || {};
KLM.buku = [
  {
    id: 'tanaman-obat',
    judul: { id: 'Buku Saku Inventarisasi Pengetahuan Lokal Tanaman Obat Klamono Raya',
             en: 'Inventory of Local Knowledge on Medicinal Plants of Klamono Raya' },
    pendek: { id: 'Tanaman Obat Klamono Raya', en: 'Medicinal Plants of Klamono Raya' },
    ringkas: { id: '34 tanaman obat yang dipakai Suku Moi, lengkap dengan nama Moi, nama latin, dan cara pengolahannya.',
               en: '34 medicinal plants used by the Moi, with their Moi and Latin names and how they are prepared.' },
    halaman: 51,
    folder: 'assets/buku/tanaman-obat/',
    pdf: 'assets/buku/buku-saku-tanaman-obat-klamono-raya.pdf',
    ukuranPdf: '8,9 MB',
    teks: '#tanaman',
    babHalaman: { 'asal-usul-suku-moi': 8, 'suku-moi-dan-hutannya': 11 },
    /* tanaman nomor N ada di halaman PDF (tanamanMulai + N) */
    tanamanMulai: 15
  },
  {
    id: 'sejarah-klamono',
    judul: { id: 'Buku Saku Inventarisasi Warisan Budaya Sejarah Lokal Klamono Raya',
             en: 'Inventory of the Cultural Heritage and Local History of Klamono Raya' },
    pendek: { id: 'Sejarah Lokal Klamono Raya', en: 'Local History of Klamono Raya' },
    ringkas: { id: 'Tujuh bab tentang Klamono: suku penghuninya, tanah minyak, kearifan lokal, ritus, seni, dan cara menjelajahinya.',
               en: 'Seven chapters on Klamono: its peoples, the oil land, local wisdom, rites, arts and how to explore it.' },
    halaman: 31,
    folder: 'assets/buku/sejarah-klamono/',
    pdf: 'assets/buku/buku-saku-sejarah-lokal-klamono-raya.pdf',
    ukuranPdf: '3,8 MB',
    teks: '#pengetahuan',
    babHalaman: { 'mengenal-klamono': 5, 'suku-penghuni-klamono': 8, 'tanah-minyak': 11, 'kearifan-lokal': 15,
                  'ritus-upacara': 18, 'seni-tradisi': 22, 'menjelajahi-klamono': 26 }
  }
];
