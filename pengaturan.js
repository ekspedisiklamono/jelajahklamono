/* ==================================================================
   PENGATURAN WEBSITE KLAMONO
   ------------------------------------------------------------------
   Ini satu-satunya file yang perlu Anda ubah untuk:
     1. Mengaktifkan email otomatis      → bagian  pemesanan
     2. Mengisi kontak tiap kampung       → bagian  KLM.kampung
     3. Menggeser / menambah titik peta   → koordinat di KLM.pengalaman
     4. Mengisi tim, foto, galeri, dan ucapan terima kasih

   ATURAN AMAN:
     • Ubah hanya teks di dalam tanda kutip  '...'
     • Jangan hapus tanda koma  ,  kurung  { } [ ]  atau titik dua  :
     • id = Bahasa Indonesia, en = Bahasa Inggris
     • Setelah mengubah, simpan file lalu unggah ulang website.
   ================================================================== */

window.KLM = window.KLM || {};

KLM.pengaturan = {
  namaSitus: 'Klamono',
  emailTim: 'ekspedisiklamono@gmail.com',

  // WhatsApp resmi Ekspedisi Klamono. Tulis dengan kode negara, tanpa + dan spasi.
  whatsappTim: '6285167527409',

  // WhatsApp operator (pegawai Distrik Klamono) yang meneruskan permintaan wisatawan
  // ke penanggung jawab tiap kampung. Selama masih kosong '', semua chat wisatawan
  // masuk ke WhatsApp resmi di atas. Begitu diisi, pemesanan langsung diarahkan ke operator.
  whatsappOperator: '',
  namaOperator: { id: 'Operator Distrik Klamono', en: 'Klamono District operator' },

  // Akun Instagram tim (nama akun tanpa @, atau tautan lengkap). Kosongkan '' bila belum ada.
  instagram: 'ekspedisiklamono',

  pemesanan: {
    // Tempel URL "Web app" dari Google Apps Script di sini (lihat panduan).
    // Selama masih kosong, permintaan booking diarahkan ke WhatsApp / email.
    urlGoogleScript: '',
    waktuBalasan: { id: '1–3 hari', en: '1–3 days' }
  },

  peta: {
    // Titik awal perjalanan wisatawan.
    gerbang: { nama: { id: 'Bandara DEO Sorong', en: 'Sorong DEO Airport' }, koordinat: [-0.8941, 131.2872] },
    perjalanan: { id: 'Kira-kira 1,5–2 jam naik mobil lewat Aimas', en: 'About 1.5–2 hours by road via Aimas (estimate)' }
  }
};

/* ------------------------------------------------------------------
/* ------------------------------------------------------------------
   KAMPUNG & KONTAK KOORDINATOR
   • Setiap pengalaman terhubung ke satu kampung. Isi kontak SEKALI di sini,
     lalu semua pengalaman di kampung itu memakai kontak yang sama.
   • whatsapp → '62812...' (tanpa + dan spasi). Kosongkan '' bila belum ada;
     selama kosong, website menulis "Dihubungkan oleh tim".
   • PENTING: email koordinator untuk notifikasi otomatis diisi di Google Sheet
     (tab "Kontak Kampung"), bukan di sini, agar tidak tampil publik.
   • Urutan daftar = urutan tampil di website (barat ke timur).
   ------------------------------------------------------------------ */
KLM.kampung = [
  { id: 'klawosom', nama: 'Klawosom',
    kontak: { nama: '', peran: { id: 'Koordinator Kampung Klawosom', en: 'Klawosom village coordinator' }, whatsapp: '' } },
  { id: 'mlais', nama: 'Mlais',
    kontak: { nama: '', peran: { id: 'Koordinator Kampung Mlais', en: 'Mlais village coordinator' }, whatsapp: '' } },
  { id: 'wariyau', nama: 'Wariyau',
    kontak: { nama: '', peran: { id: 'Koordinator Kampung Wariyau', en: 'Wariyau village coordinator' }, whatsapp: '' } },
  { id: 'klawana', nama: 'Klawana',
    kontak: { nama: '', peran: { id: 'Koordinator Kampung Klawana', en: 'Klawana village coordinator' }, whatsapp: '' } },
  { id: 'klalomon', nama: 'Klalomon',
    kontak: { nama: '', peran: { id: 'Koordinator Kampung Klalomon', en: 'Klalomon village coordinator' }, whatsapp: '' } },
  { id: 'klamono', nama: 'Klamono',
    kontak: { nama: '', peran: { id: 'Koordinator Kampung Klamono', en: 'Klamono village coordinator' }, whatsapp: '' } },
  { id: 'posa', nama: 'Posa',
    kontak: { nama: '', peran: { id: 'Koordinator Kampung Posa', en: 'Posa village coordinator' }, whatsapp: '' } },
  /* id 'klamono-oil' sengaja tidak diubah (dipakai Google Sheet & Apps Script); nama tampilnya Klamono Olie */
  { id: 'klamono-oil', nama: 'Klamono Olie', distrik: 'Klasafet',
    kontak: { nama: '', peran: { id: 'Koordinator Kampung Klamono Olie', en: 'Klamono Olie village coordinator' }, whatsapp: '' } }
];

/* ------------------------------------------------------------------
   PENGALAMAN WISATA (titik di peta)
   Titik diambil dari peta potensi Tim Ekspedisi Patriot 2026. Koordinat Posa, Klamonovasi,
   aula tari, tokok sagu Klalomon, agroliving, dan sumur NNGPM diperbarui dari titik GPS tim (8 Nov 2026).
   Kolam Budidaya Nusantara Jaya ditambahkan dari geotag foto tim (15 Okt 2026).
   • kampung: id kampung dari daftar di atas (huruf kecil).
   • kategori: 'alam', 'pangan', 'budaya', 'produk', 'agro' (agroliving), 'agroforestri', atau 'sejarah'
   • ikon: jejak, tombak, bibit, burung, noken, sagu, buaya, perahu, tifa,
           toko, ikan, olahan, tunas, minyak
   • koordinat: [lintang, bujur]. Cara mendapatkannya: buka Google Maps,
     klik kanan titik lokasi, lalu klik angka koordinat yang muncul.
   • status: 'buka' (bisa dipesan) atau 'persiapan' (baru bisa daftar minat)
   • unggulan: hanya SATU pengalaman yang diberi bagian unggulan: { ... }.
     Bagian itu tampil besar di Beranda dan di halaman Jelajah.
   • foto: kosongkan '' bila belum ada; website memakai ilustrasi.
     Simpan file di assets/img/foto/ (lebar ± 1200 piksel, format .jpg).
     fotoKet: keterangan foto (dibaca pembaca layar dan muncul saat kursor di atas foto).
     instagram: nama akun Instagram pengalaman (tanpa @), tampil sebagai tautan.
     fotoPosisi: bagian foto yang diutamakan saat dipotong, misalnya 'center 30%'
     (0% = bagian atas foto, 100% = bagian bawah). Boleh dihapus bila tidak perlu.
   • Untuk menambah pengalaman: salin satu blok { ... }, tempel di akhir daftar,
     lalu ganti id (huruf kecil, tanpa spasi), kampung, koordinat, dan teksnya.
   ------------------------------------------------------------------ */
KLM.pengalaman = [
  {
    id: 'trekking-klawosom',
    kampung: 'klawosom',
    kategori: 'alam',
    ikon: 'jejak',
    status: 'buka',
    koordinat: [-1.119375, 131.414904],   // titik GPS tim, 27 Okt 2026
    foto: 'assets/img/foto/hutan-klawosom.jpg',
    fotoKet: { id: 'Sepasang burung nuri di antara rimbunnya hutan Klawosom. Foto: Tim 20 UB, TEP 2026.',
               en: 'A pair of parrots in the dense Klawosom forest. Photo: Tim 20 UB, TEP 2026.' },
    fotoPosisi: 'center 52%',
    instagram: 'jejakklawosom',   // akun Instagram pengalaman ini (tanpa @); kosongkan '' bila tidak ada
    judul:   { id: 'Trekking Hutan Klawosom', en: 'Klawosom forest trek' },
    ringkas: { id: 'Masuk ke hutan rimbun bersama pemandu Moi. Dengarkan kicau burung, kenali tanaman obat, dan simak cerita aturan adat hutan.',
               en: 'Walk through dense forest with a Moi guide: listen for birds, learn medicinal plants and the forest’s customary rules.' },
    aktivitas: {
      id: ['Jalan menyusuri hutan bersama pemandu lokal', 'Kenalan dengan tanaman obat Suku Moi di sepanjang jalur', 'Istirahat di shelter / pos peristirahatan sepanjang jalur'],
      en: ['Walk the forest trail with a local guide', 'Learn Moi medicinal plants along the way', 'Rest at the shelters along the trail']
    },
    durasi: { id: 'Setengah hari, mulai pagi', en: 'Half a day, early start' },
    catatan: { id: 'Pakai sepatu yang enak untuk jalan tanah, dan selalu ikuti arahan pemandu selama di hutan.', en: 'Wear shoes suited to dirt paths and follow your guide in the forest.' },
    // Atraksi: sorotan utama pengalaman (ikon: burung, kupu, pohon, atau ikon pengalaman lain)
    atraksi: [
      { ikon: 'burung', judul: { id: 'Mengamati burung', en: 'Birdwatching' },
        ket: { id: 'Intip burung-burung hutan dataran rendah di sela pepohonan. Paling ramai saat pagi.', en: 'Spot lowland forest birds among the trees. Mornings are liveliest.' } },
      { ikon: 'kupu', judul: { id: 'Taman kupu-kupu', en: 'Butterfly garden' },
        ket: { id: 'Kupu-kupu warna-warni beterbangan di antara tanaman hutan.', en: 'Colourful butterflies flitting among the forest plants.' } },
      { ikon: 'pohon', judul: { id: 'Pohon sakral & bersejarah', en: 'Sacred & historic trees' },
        ket: { id: 'Pohon-pohon tua yang dihormati masyarakat Moi, lengkap dengan kisahnya.', en: 'Old trees revered by the Moi, each with a story of its own.' } }
    ],
    unggulan: {
      // Angka jalur dari rencana program TEP 2026. Sesuaikan dengan kondisi di lapangan.
      fakta: [
        { angka: '± 1 km', ket: { id: 'panjang jalur', en: 'trail length' } },
        { angka: { id: '1–2 jam', en: '1–2 hrs' }, ket: { id: 'waktu jalan kaki', en: 'walking time' } },
        { angka: '3', ket: { id: 'shelter / pos peristirahatan', en: 'shelters / rest stops' } }
      ],
      sorotan: {
        id: ['Hutan dataran rendah yang masih rimbun dan jadi rumah banyak jenis burung.',
             '“Apotek hidup” di sepanjang jalur: pemandu akan menunjukkan tanaman obat Suku Moi dan kegunaannya.',
             'Cerita tentang aturan adat hutan, seperti egek, sasi, dan pantangan membawa makanan basi.',
             'Ditemani warga Moi yang hafal jalur dan hutannya.'],
        en: ['Dense lowland forest, home to many kinds of birds.',
             'A “living pharmacy”: Moi medicinal plants along the trail, explained by your guide.',
             'Stories of the forest’s customary rules, such as egek, sasi and the taboo on carrying stale food.',
             'Guided by Moi residents who know the trail and the forest.']
      },
      bawa: { id: 'sepatu untuk jalan tanah, air minum, jas hujan, dan losion antinyamuk. Berangkatlah pagi supaya sempat melihat burung.',
              en: 'Shoes for dirt paths, drinking water, a rain jacket and insect repellent. Start early to catch the birds.' },
      fotoKet: { id: 'Sepasang burung nuri di antara rimbunnya hutan Klawosom. Foto: Tim 20 UB, TEP 2026.',
                 en: 'A pair of parrots in the dense Klawosom forest. Photo: Tim 20 UB, TEP 2026.' }
    }
  },
  {
    id: 'berburu-klawosom',
    kampung: 'klawosom',
    kategori: 'alam',
    ikon: 'tombak',
    status: 'buka',
    koordinat: [-1.115977, 131.415447],   // titik GPS tim, 6 Okt 2026
    foto: '',
    // event: pengalaman yang hanya diadakan pada waktu tertentu. Tombol pesannya diganti
    // dengan ajakan berkoordinasi lewat WhatsApp admin.
    event: { id: 'Event tahunan · peserta terbatas', en: 'Annual event · limited places' },
    judul:   { id: 'Ikut berburu cara tradisional', en: 'Traditional hunting experience' },
    ringkas: { id: 'Event tahunan dengan peserta terbatas. Ikut pemburu Moi membaca jejak satwa dan belajar cara berburu tradisional, lengkap dengan aturan adatnya.',
               en: 'An annual event with limited places. Join Moi hunters to read animal tracks and learn traditional hunting and its customary rules.' },
    aktivitas: {
      id: ['Belajar membaca jejak satwa bersama pemburu Moi', 'Kenalan dengan alat dan teknik berburu tradisional', 'Dengar aturan adatnya: kapan dan di mana boleh berburu'],
      en: ['Read animal tracks with Moi hunters', 'Learn traditional hunting tools and techniques', 'Hear the customary rules on when and where hunting is allowed']
    },
    durasi: { id: '1–2 hari', en: '1–2 days' },
    catatan: { id: 'Diadakan setahun sekali dengan peserta terbatas. Event ini baru bisa diselenggarakan setelah berkoordinasi dengan admin dan pengelola, jadi hubungi admin lebih dulu. Semua kegiatan mengikuti aturan adat dan hukum, dan satwa yang dilindungi tidak pernah diburu.',
               en: 'Held once a year with limited places. The event can only go ahead after coordinating with the admin and the organisers, so please contact the admin first. Everything follows customary rules and the law, and protected animals are never hunted.' }
  },
  {
    id: 'rumah-bibit-klawosom',
    kampung: 'klawosom',
    kategori: 'agroforestri',
    ikon: 'bibit',
    status: 'buka',
    koordinat: [-1.12156, 131.41872],
    foto: 'assets/img/foto/rumah-persemaian.jpg',
    fotoKet: { id: 'Bibit mangga, nangka madu, sengon, dan banyak tanaman lain di Rumah Persemaian Bina Brawijaya. Foto: Tim 20 UB, TEP 2026.',
               en: 'Mango, honey jackfruit, sengon and many other seedlings at the Bina Brawijaya nursery. Photo: Tim 20 UB, TEP 2026.' },
    fotoPosisi: 'center 62%',
    judul:   { id: 'Rumah Persemaian dan Agroforestri Bina Brawijaya', en: 'Bina Brawijaya Nursery and Agroforestry House' },
    ringkas: { id: 'Tempat bibit disemai untuk agroforestri. Lihat bibit dari banyak sekali jenis tanaman, lalu coba sendiri teknik grafting bersama warga.',
               en: 'Where seedlings are raised for agroforestry. See seedlings of a great many plant species, then try grafting yourself with residents.' },
    aktivitas: {
      id: ['Melihat bibit dari banyak sekali jenis tanaman', 'Mencoba teknik grafting (menyambung batang tanaman) bersama warga', 'Pas digabung dengan trekking hutan Klawosom'],
      en: ['See seedlings of a great many plant species', 'Try grafting (joining plant stems) with residents', 'Easy to combine with the Klawosom forest trek']
    },
    durasi: { id: '1–2 jam', en: '1–2 hours' },
    catatan: { id: '', en: '' }
  },
  {
    id: 'burung-mlais',
    kampung: 'mlais',
    kategori: 'alam',
    ikon: 'burung',
    status: 'buka',
    koordinat: [-1.13945, 131.44372],
    foto: '',
    judul:   { id: 'Pengamatan burung di Mlais', en: 'Birdwatching in Mlais' },
    ringkas: { id: 'Pagi-pagi, amati burung hutan Papua bersama warga yang tahu di mana mereka biasa bertengger.',
               en: 'Watch Papuan forest birds in the early morning with residents who know where they perch.' },
    aktivitas: {
      id: ['Berangkat pagi, saat burung sedang ramai-ramainya', 'Mengamati dan memotret burung bersama pemandu', 'Mencatat burung apa saja yang kamu lihat'],
      en: ['Set out early when birds are most active', 'Watch and photograph birds with a guide', 'Note down the species you see']
    },
    durasi: { id: 'Setengah hari, mulai subuh', en: 'Half a day, from dawn' },
    catatan: { id: 'Bawa teropong kalau punya.', en: 'Bring binoculars if you have them.' }
  },
  {
    id: 'kerajinan-wariyau',
    kampung: 'wariyau',
    kategori: 'budaya',
    ikon: 'noken',
    status: 'buka',
    koordinat: [-1.13817, 131.46131],
    foto: 'assets/img/foto/hiasan-kepala.jpg',
    fotoKet: { id: 'Hiasan kepala buatan tangan dari manik-manik, kerang, dan bulu burung.', en: 'Handmade headdresses of beads, cowrie shells and feathers.' },
    fotoPosisi: 'center 45%',
    judul:   { id: 'Kerajinan tangan Wariyau', en: 'Wariyau handicrafts' },
    ringkas: { id: 'Lihat perajin kampung bekerja, coba buat sendiri, lalu bawa pulang hasil karya tangan mereka.',
               en: 'Watch village crafters at work, try making a piece yourself and take home something handmade.' },
    aktivitas: {
      id: ['Lihat langsung perajin berkarya', 'Coba membuat sendiri, dibimbing perajin', 'Beli langsung dari pembuatnya'],
      en: ['Watch crafters at work', 'Try making a piece with them', 'Buy directly from the maker']
    },
    durasi: { id: '2–3 jam', en: '2–3 hours' },
    catatan: { id: '', en: '' }
  },
  {
    id: 'tokok-sagu-klawana',
    kampung: 'klawana',
    kategori: 'pangan',
    ikon: 'sagu',
    status: 'buka',
    koordinat: [-1.13312, 131.48192],
    foto: '',
    judul:   { id: 'Tokok sagu di Klawana', en: 'Sago processing in Klawana' },
    ringkas: { id: 'Ikut menokok sagu dari batang pohon sampai jadi tepung, lalu cicipi sagu pipa, sagu forno, dan papeda.',
               en: 'Process sago from palm to starch, then taste sagu pipa, sagu forno and papeda.' },
    aktivitas: {
      id: ['Ikut menebang dan membelah batang sagu bersama warga', 'Memarut empulur, lalu meramas dan menyaring patinya', 'Mencicipi sagu pipa, sagu forno, dan papeda'],
      en: ['Fell and split a sago trunk with residents', 'Grate the pith, then knead and strain the starch', 'Taste sagu pipa, sagu forno and papeda']
    },
    durasi: { id: 'Satu hari', en: 'One day' },
    catatan: { id: '', en: '' }
  },
  {
    id: 'tokok-sagu-klalomon',
    kampung: 'klalomon',
    kategori: 'pangan',
    ikon: 'sagu',
    status: 'buka',
    koordinat: [-1.133504, 131.486922],   // titik GPS tim, 21 Okt 2026
    foto: 'assets/img/foto/tokok-sagu-klalomon.jpg',
    fotoKet: { id: 'Warga Klalomon menokok empulur batang sagu dengan alat tradisional. Foto: Tim 20 UB, TEP 2026.',
               en: 'A Klalomon resident pounding sago pith with a traditional tool. Photo: Tim 20 UB, TEP 2026.' },
    fotoPosisi: 'center 45%',
    judul:   { id: 'Tokok sagu di Klalomon', en: 'Sago processing in Klalomon' },
    ringkas: { id: 'Belajar mengolah sagu cara tradisional bersama keluarga di Klalomon, lalu cicipi hasilnya.',
               en: 'Learn traditional sago processing with a family in Klalomon, then taste the results.' },
    aktivitas: {
      id: ['Lihat batang sagu ditebang dan dibelah', 'Ikut memarut empulur dan menyaring patinya', 'Cicipi aneka olahan sagu'],
      en: ['Watch a sago trunk being felled and split', 'Help grate the pith and strain the starch', 'Taste sago dishes']
    },
    durasi: { id: 'Setengah hari', en: 'Half a day' },
    catatan: { id: '', en: '' }
  },
  {
    id: 'telusur-sungai',
    kampung: 'klamono',
    kategori: 'alam',
    ikon: 'buaya',
    status: 'buka',
    koordinat: [-1.12872, 131.48826],
    foto: '',
    // Wisata buaya digabung ke sini (15 Nov 2026): lokasinya di sungai Kampung Klamono.
    judul:   { id: 'Telusur sungai & wisata buaya', en: 'River journey & crocodile viewing' },
    ringkas: { id: 'Susuri sungai di Kampung Klamono bersama pemandu, lihat kehidupan warga di tepiannya, lalu amati buaya muara dari jarak aman.',
               en: 'Travel the river at Klamono village with a guide, see life along its banks, then watch saltwater crocodiles from a safe distance.' },
    aktivitas: {
      id: ['Menyusuri sungai bersama pemandu lokal', 'Mengamati buaya dari titik yang aman', 'Dengar kisah ritual pemanggil buaya Suku Moi', 'Melihat hutan di tepi sungai dan burung-burungnya'],
      en: ['Travel the river with a local guide', 'Watch crocodiles from a safe viewpoint', 'Hear about the Moi crocodile-calling ritual', 'See riverside forest and birds']
    },
    atraksi: [
      { ikon: 'perahu', judul: { id: 'Telusur sungai', en: 'River journey' },
        ket: { id: 'Menyusuri sungai yang berkelok di antara hutan dan kampung.', en: 'Following the winding river between forest and village.' } },
      { ikon: 'buaya', judul: { id: 'Wisata buaya', en: 'Crocodile viewing' },
        ket: { id: 'Melihat buaya muara dari titik yang aman, ditemani warga yang paham kebiasaannya.', en: 'Watching saltwater crocodiles from a safe spot with residents who know their habits.' } }
    ],
    durasi: { id: '2–3 jam', en: '2–3 hours' },
    catatan: { id: 'Pelampung wajib dipakai. Selalu ikuti arahan pemandu dan jangan turun ke air.', en: 'Life jackets are required. Always follow your guide and never enter the water.' }
  },
  {
    id: 'sanggar-tari',
    kampung: 'klamono',
    kategori: 'budaya',
    ikon: 'tifa',
    status: 'buka',
    koordinat: [-1.1261478, 131.4869731],
    foto: 'assets/img/foto/sanggar-tari.jpg',
    fotoKet: { id: 'Penari dengan mahkota bulu dan rok rumbai menari bersama warga.', en: 'Dancers in feather crowns and fibre skirts dancing with residents.' },
    fotoPosisi: 'center 25%',
    judul:   { id: 'Sanggar tari', en: 'Dance studio' },
    ringkas: { id: 'Tonton tarian penyambutan, lalu ikut belajar menari bersama anak-anak sanggar dan kenali filosofi di balik setiap gerakannya.',
               en: 'Watch the welcome dance, then learn to dance with the studio’s children and discover the philosophy behind each movement.' },
    aktivitas: {
      id: ['Menonton latihan atau pertunjukan tari', 'Belajar menari bersama anak-anak sanggar', 'Mengenal filosofi di balik tarian'],
      en: ['Watch a rehearsal or performance', 'Learn to dance with the studio’s children', 'Discover the philosophy behind the dances']
    },
    durasi: { id: '2 jam', en: '2 hours' },
    catatan: { id: 'Jadwal latihan akan dikabarkan lebih dulu.', en: 'Rehearsal times are confirmed in advance.' }
  },
  {
    id: 'klamonovasi',
    kampung: 'posa',
    kategori: 'produk',
    ikon: 'toko',
    status: 'buka',
    koordinat: [-1.1231235, 131.4893844],
    foto: 'assets/img/foto/kedai-klamonovasi.jpg',
    fotoKet: { id: 'Kedai Klamonovasi, tempat produk UMKM warga dipajang dan dijual.', en: 'The Klamonovasi shop, where local small-business products are displayed and sold.' },
    fotoPosisi: 'center 22%',
    judul:   { id: 'Klamonovasi, galeri produk UMKM', en: 'Klamonovasi, local products gallery' },
    ringkas: { id: 'Kedai di Kampung Posa tempat produk buatan warga Distrik Klamono dipajang dan dijual, dari makanan olahan sampai kerajinan.',
               en: 'A shop in Posa village where goods made by small businesses across Klamono District are displayed and sold, from food products to crafts.' },
    aktivitas: {
      id: ['Lihat-lihat makanan olahan dan kerajinan warga', 'Beli oleh-oleh langsung dari pembuatnya', 'Mengobrol dengan pelaku usaha kampung'],
      en: ['Browse food products and crafts', 'Buy souvenirs from the makers', 'Chat with local business owners']
    },
    durasi: { id: '1 jam', en: '1 hour' },
    catatan: { id: '', en: '' }
  },
  {
    id: 'budidaya-ikan-posa',
    kampung: 'posa',
    kategori: 'pangan',
    ikon: 'ikan',
    status: 'buka',
    koordinat: [-1.1222979, 131.4895704],
    foto: 'assets/img/foto/pakan-ikan.jpg',
    fotoKet: { id: 'Warga dan tim bersama hasil pembuatan pakan ikan.', en: 'Residents and the team with freshly made fish feed.' },
    fotoPosisi: 'center 62%',
    judul:   { id: 'Budidaya ikan dan pakan', en: 'Fish and feed farming' },
    ringkas: { id: 'Lihat kolam budidaya ikan warga Posa dan cara mereka membuat pakan sendiri.',
               en: 'See Posa’s fish ponds and how the farmers make their own feed.' },
    aktivitas: {
      id: ['Keliling kolam ikan bersama pembudidaya', 'Lihat cara pakan ikan dibuat', 'Ikut memberi makan ikan dan memanen'],
      en: ['Visit the fish ponds with the farmers', 'Learn how fish feed is made', 'Help feed and harvest the fish']
    },
    durasi: { id: '2 jam', en: '2 hours' },
    catatan: { id: '', en: '' }
  },
  {
    id: 'olahan-ikan-posa',
    kampung: 'posa',
    kategori: 'pangan',
    ikon: 'olahan',
    status: 'buka',
    koordinat: [-1.1199598, 131.4889971],
    foto: 'assets/img/foto/produk-ikan-posa.jpg',
    fotoKet: { id: 'Warga dan tim di Rumah Produksi Posa Mam Kro, tempat ikan diolah menjadi produk.', en: 'Residents and the team at the Posa Mam Kro production house, where fish is made into products.' },
    fotoPosisi: 'center 45%',
    judul:   { id: 'Produksi abon lele', en: 'Catfish floss production' },
    ringkas: { id: 'Lihat ikan lele diolah jadi abon di Rumah Produksi Posa Mam Kro. Produksinya zero waste dan halal, sehingga bisa jadi percontohan usaha olahan ikan.',
               en: 'See catfish made into abon (fish floss) at the Posa Mam Kro production house. It is zero-waste and halal, a model for other small fish-processing businesses.' },
    aktivitas: {
      id: ['Melihat proses produksi abon dari ikan lele', 'Mengenal produksi zero waste: kulit lele pun diolah jadi keripik', 'Belajar dari usaha halal yang bisa jadi percontohan'],
      en: ['Watch catfish being made into abon', 'See zero-waste production in action: even the skin becomes crisps', 'Learn from a halal business that serves as a model']
    },
    durasi: { id: '1–2 jam', en: '1–2 hours' },
    catatan: { id: '', en: '' }
  },
  {
    id: 'kolam-nusantara-jaya',
    kampung: 'posa',
    kategori: 'pangan',
    ikon: 'ikan',
    status: 'buka',
    koordinat: [-1.1204148, 131.4888381],
    foto: 'assets/img/foto/kolam-nusantara-jaya.jpg',
    fotoKet: { id: 'Kolam dan kebun kecil di Kolam Budidaya Nusantara Jaya, menjelang senja.', en: 'Ponds and small gardens at the Nusantara Jaya fish ponds, near dusk.' },
    fotoPosisi: 'center 60%',
    judul:   { id: 'Kolam Budidaya Nusantara Jaya', en: 'Nusantara Jaya Fish Ponds' },
    ringkas: { id: 'Kolam ikan warga yang dikelilingi kebun kecil. Di sini kamu bisa lihat ikan dari dekat sekaligus mampir ke agroliving mini.',
               en: 'Village fish ponds surrounded by small gardens. See the fish up close and drop by a mini agroliving plot.' },
    aktivitas: {
      id: ['Keliling kolam dan lihat ikan dari dekat', 'Jalan-jalan di kebun agroliving mini', 'Ngobrol santai dengan pengelola kolam'],
      en: ['Walk around the ponds and see the fish up close', 'Stroll through the mini agroliving garden', 'Chat with the people who run the ponds']
    },
    durasi: { id: '1–2 jam', en: '1–2 hours' },
    catatan: { id: 'Saung untuk bersantai di tepi kolam sedang direncanakan.', en: 'A saung (open-sided hut) for resting by the ponds is being planned.' }
  },
  {
    id: 'agroliving-klamono-oil',
    kampung: 'klamono-oil',
    kategori: 'agro',
    ikon: 'tunas',
    status: 'buka',
    koordinat: [-1.129122, 131.497091],
    foto: 'assets/img/foto/agroliving-klamono.jpg',
    fotoKet: { id: 'Klamono Agroliving dari udara: kolam, rumah kaca, dan kebun di tepi hutan. Foto: Tim 20 UB, TEP 2026.',
               en: 'Klamono Agroliving from the air: ponds, a greenhouse and gardens at the forest edge. Photo: Tim 20 UB, TEP 2026.' },
    fotoPosisi: 'center 68%',
    judul:   { id: 'Klamono Agroliving', en: 'Klamono Agroliving' },
    ringkas: { id: 'Habiskan setengah hari bersama keluarga petani: menanam, memanen, lalu menikmati hasil kebun sendiri.',
               en: 'Spend half a day with a farming family: plant, harvest, then enjoy what the garden gives.' },
    aktivitas: {
      id: ['Menanam dan merawat sayur bersama petani', 'Panen, lalu masak hasil kebunnya'],
      en: ['Plant and tend vegetables with farmers', 'Harvest and cook from the garden']
    },
    durasi: { id: 'Setengah hari', en: 'Half a day' },
    catatan: { id: '', en: '' }
  },
  {
    id: 'sumur-nngpm',
    kampung: 'klamono-oil',
    kategori: 'sejarah',
    ikon: 'minyak',
    status: 'buka',
    koordinat: [-1.129231, 131.497465],
    foto: 'assets/img/foto/sumur-nngpm-pompa.jpg',
    fotoKet: { id: 'Pompa angguk PU-026 di sumur tua lapangan minyak Klamono.', en: 'Pump jack PU-026 at an old well in the Klamono oil field.' },
    fotoPosisi: 'center 32%',
    judul:   { id: 'Sumur heritage NNGPM', en: 'NNGPM heritage well' },
    ringkas: { id: 'Sumur tua peninggalan perusahaan minyak Belanda NNGPM. Di lapangan Klamono inilah minyak pertama di Tanah Papua ditemukan pada 1936.',
               en: 'An old well left by the Dutch oil company NNGPM in the Klamono field, where oil was first found in Papua in 1936.' },
    aktivitas: {
      id: ['Dengar cerita NNGPM dari warga dan mantan pekerja', 'Lihat pipa dan sumur tua dari titik yang diizinkan', 'Pahami kaitan tanah adat Moi dengan industri minyak'],
      en: ['Hear the NNGPM story from residents and former workers', 'See old pipes and wells from approved viewpoints', 'Learn how Moi customary land and the oil industry are linked']
    },
    durasi: { id: 'Setengah hari', en: 'Half a day' },
    catatan: { id: 'Lapangan migas ini masih beroperasi, jadi kunjungan hanya ke titik yang diizinkan pengelolanya.', en: 'The oil field is still active. Visits only go to points approved by the field operator.' }
  }
];

/* ------------------------------------------------------------------
   TIM PENELITI
   • foto: taruh file foto di folder  foto-tim/  lalu tulis namanya,
     contoh  'foto-tim/wayan.jpg'. Kosongkan '' untuk memakai inisial.
   • tampil: false  → anggota disembunyikan tanpa dihapus.
   ------------------------------------------------------------------ */
KLM.tim = [
  { tampil: true, nama: 'I Wayan Suyadnya, M.Sos.', foto: 'foto-tim/wayan.jpg', instansi: '',
    peran: { id: 'Ketua tim', en: 'Team lead' }, bidang: { id: 'Sosiologi', en: 'Sociology' },
    keahlian: { id: 'Analisis struktur sosial dan mediasi konflik agraria', en: 'Social structure analysis and agrarian conflict mediation' } },
  { tampil: false, nama: 'Dr. Desi Dwi Prianti', foto: '', instansi: '',
    peran: { id: 'Anggota', en: 'Member' }, bidang: { id: 'Ilmu Komunikasi', en: 'Communication studies' },
    keahlian: { id: 'Komunikasi lintas budaya dan narasi pembangunan', en: 'Cross-cultural communication and development narratives' } },
  { tampil: false, nama: 'Dr. Edriana Pangestuti', foto: '', instansi: '',
    peran: { id: 'Anggota', en: 'Member' }, bidang: { id: 'Pemasaran pariwisata', en: 'Tourism marketing' },
    keahlian: { id: 'Branding destinasi dan pasar minat khusus', en: 'Destination branding and special-interest markets' } },
  { tampil: false, nama: 'Dr. Marlina Flassy', foto: '', instansi: '',
    peran: { id: 'Anggota', en: 'Member' }, bidang: { id: 'Antropologi', en: 'Anthropology' },
    keahlian: { id: 'Etnografi Papua', en: 'Ethnography of Papua' } },
  { tampil: true, nama: 'Baharuddin Azhar, M.Sc.', foto: 'foto-tim/baharuddin.jpg', instansi: '',
    peran: { id: 'Anggota', en: 'Member' }, bidang: { id: 'Perencanaan lingkungan', en: 'Environmental planning' },
    keahlian: { id: 'Desain infrastruktur hijau dan konservasi lanskap', en: 'Green infrastructure design and landscape conservation' } },
  { tampil: true, nama: 'Tita Alifiani, S.Sos.', foto: 'foto-tim/tita.jpg', instansi: '',
    peran: { id: 'Anggota', en: 'Member' }, bidang: { id: 'Dokumentasi dan media', en: 'Documentation and media' },
    keahlian: { id: 'Dokumentasi etnografis, konten digital, dan website', en: 'Ethnographic documentation, digital content and website' } },
  { tampil: true, nama: 'Putri Nirmala Maulidya, S.Sos.', foto: 'foto-tim/putri.jpg', instansi: '',
    peran: { id: 'Anggota', en: 'Member' }, bidang: { id: 'Pemberdayaan masyarakat', en: 'Community empowerment' },
    keahlian: { id: 'Pemberdayaan ekonomi desa dan pelatihan teknis', en: 'Village economic empowerment and technical training' } },
  { tampil: true, nama: 'Hasyidan Muhammad Radifan, S.Sos.', foto: 'foto-tim/hasyidan.jpg', instansi: '',
    peran: { id: 'Anggota', en: 'Member' }, bidang: { id: 'Pendampingan masyarakat', en: 'Community facilitation' },
    keahlian: { id: 'Pendampingan ekowisata dan pemantauan dampak sosial', en: 'Ecotourism facilitation and social impact monitoring' } },
  { tampil: true, nama: 'Shahnaz Dwi Pasha, S.Hut.', foto: 'foto-tim/shahnaz.jpg', instansi: '',
    peran: { id: 'Anggota', en: 'Member' }, bidang: { id: 'Pemetaan', en: 'Mapping' },
    keahlian: { id: 'Inventarisasi tanaman obat, pemetaan, dan kehutanan', en: 'Medicinal plant inventory, mapping and forestry' } }
];

/* ------------------------------------------------------------------
   GALERI FOTO
   Taruh foto di folder  foto-galeri/  lalu tambahkan baris seperti:
   { foto: 'foto-galeri/nama-file.jpg', ket: { id: 'Keterangan', en: 'Caption' } },
   ------------------------------------------------------------------ */
KLM.galeri = [
  { foto: 'assets/img/foto/hiasan-kepala.jpg', lebar: true, ket: { id: 'Hiasan kepala buatan tangan dari manik-manik, kerang, dan bulu burung.', en: 'Handmade headdresses of beads, cowrie shells and feathers.' } },
  { foto: 'assets/img/foto/koba-koba-warga.jpg',  ket: { id: 'Penari Tradisional menggunakan Properti Koba-koba.', en: 'Traditional dancers using koba-koba as props.' } },
  { foto: 'assets/img/foto/warga-moi-noken.jpg',  ket: { id: 'Masyarakat Moi di acara peminangan adat Suku Moi.', en: 'Moi community members at a customary Moi betrothal ceremony.' } },
  { foto: 'assets/img/foto/kain-timur-piring.jpg', ket: { id: 'Kain timur dan piring untuk pembayaran harta.', en: 'Kain timur cloth and plates for the payment of wealth.' } },
  { foto: 'assets/img/foto/pipa-minyak-klamono.jpg', ket: { id: 'Kepala sumur tua peninggalan industri minyak.', en: 'An old wellhead left by the oil industry.' } }
];

/* ------------------------------------------------------------------
   UCAPAN TERIMA KASIH
   Tambahkan nama yang ingin disebut:
     { nama: '...', peran: { id: '...', en: '...' }, ikon: 'orang' },
   ikon: 'orang' (perorangan), 'istilah' (bahasa/terjemahan), 'daun' (masyarakat adat), 'rumah' (kampung)
   lebar: true  membuat kartu memanjang dua kolom (untuk nama yang panjang).
   Atas permintaan tim, daftar ini tidak memuat nama perorangan (8 Nov 2026).
   ------------------------------------------------------------------ */
KLM.terimaKasih = {
  pesan: {
    id: 'Pustaka dan jejaring wisata ini tidak akan ada tanpa kemurahan hati masyarakat Klamono Raya. Terima kasih kepada para tetua adat, kepala kampung, mama-mama, bapak-bapak, dan anak muda yang membuka rumah, kebun, hutan, dan ingatannya untuk kami catat bersama.',
    en: 'This library and tourism network would not exist without the generosity of the people of Klamono Raya. Thank you to the customary elders, village heads, mothers, fathers and young people who opened their homes, gardens, forests and memories for us to record together.'
  },
  daftar: [
    { nama: 'Masyarakat adat Moi di Klamono Raya', ikon: 'daun', lebar: true,
      peran: { id: 'Pemilik pengetahuan yang dicatat di pustaka ini', en: 'Owners of the knowledge recorded in this library' } },
    /* jalurKampung: true → nama-nama kampung digambar sebagai jalur dari barat ke timur (diambil dari KLM.kampung) */
    { nama: 'Warga Kampung Klawosom, Mlais, Wariyau, Klawana, Klalomon, Klamono, Posa, dan Klamono Olie', ikon: 'rumah', lebar: true, jalurKampung: true,
      peran: { id: 'Tuan rumah dan narasumber selama kegiatan ini berlangsung', en: 'Hosts and sources throughout this programme' } }
  ]
};

/* Logo pendukung (file di folder assets/img/logo/) */
KLM.pendukung = [
  { nama: 'Kementerian Transmigrasi Republik Indonesia', logo: 'assets/img/logo/kementerian-transmigrasi.png' },
  { nama: 'Universitas Brawijaya', logo: 'assets/img/logo/universitas-brawijaya.png' }
];
