/* Klamono — aplikasi website (tidak perlu diubah; pengaturan ada di pengaturan.js) */
(function () {
  'use strict';

  var KLM = window.KLM || {};
  var CFG = KLM.pengaturan || {};
  var TANAMAN = KLM.tanaman || [];
  var BAB = KLM.bab || [];
  var KAMUS = KLM.kamus || [];
  var BUKU = KLM.buku || [];
  var ARTIKEL = (KLM.artikel || []).slice().sort(function (a, b) { return (b.tanggal || '').localeCompare(a.tanggal || ''); });
  var PENGALAMAN = KLM.pengalaman || [];
  var KAMPUNG = (KLM.kampung || []).slice();
  /* each experience points to a village id (pengaturan.js); keep e.kampung as the display name */
  PENGALAMAN.forEach(function (e) {
    var id = String(e.kampung || '').trim(), k = null;
    for (var i = 0; i < KAMPUNG.length; i++) if (KAMPUNG[i].id === id || KAMPUNG[i].nama === id) k = KAMPUNG[i];
    if (!k) { k = { id: id.toLowerCase().replace(/\s+/g, '-'), nama: id.charAt(0).toUpperCase() + id.slice(1), kontak: {} }; KAMPUNG.push(k); }
    e.kampungId = k.id; e.kampung = k.nama;
    if (!e.kontak || !(e.kontak.nama || e.kontak.whatsapp)) e.kontak = k.kontak || {};
  });
  var UNGGULAN = PENGALAMAN.filter(function (e) { return e.unggulan; })[0] || null;
  var URUT_KAT = ['alam', 'pangan', 'budaya', 'produk', 'agroforestri', 'agro', 'sejarah', 'kuliner'];
  var WARNA_KAT = { alam: '#2F6B3A', pangan: '#B06D1F', budaya: '#A3352B', produk: '#6A4C93', agro: '#55771A', agroforestri: '#2E7D6B', sejarah: '#4A3F35', kuliner: '#2E6F80' };
  function warnaKat(k) { return WARNA_KAT[k] || '#1F3B26'; }
  var TIM = (KLM.tim || []).filter(function (t) { return t.tampil !== false; });
  var EMAIL = CFG.emailTim || 'ekspedisiklamono@gmail.com';

  /* ------------------------------------------------------------ utilities */
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var simpan = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage not available */ } }
  };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function rich(s) { return esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>'); }
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function inisial(n) {
    var bersih = String(n || '').replace(/^(dr|ir|prof)\.?\s+/i, '').split(',')[0];
    var parts = bersih.split(/\s+/).filter(Boolean);
    return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }

  /* ------------------------------------------------------------ language */
  var lang = 'id';
  var TEKS = {
    id: {
      'nav.beranda': 'Beranda', 'nav.jelajah': 'Jelajah', 'nav.pustaka': 'Pustaka', 'nav.tentang': 'Tentang',
      'nav.jelajahPanjang': 'Jelajah & pesan', 'nav.tentangPanjang': 'Tentang kami',
      'merek.nama': 'Jelajah Klamono', 'merek.sub': 'Jejaring wisata & pustaka Moi', 'lewati': 'Lewati ke isi',
      'cari': 'Cari', 'cari.ph': 'Cari tanaman, istilah, kisah, atau kampung', 'cari.tutup': 'Tutup pencarian',
      'cari.kosong': 'Tidak ada hasil untuk “{q}”.', 'cari.kosongSaran': 'Coba kata lain, misalnya nama tanaman dalam bahasa Moi atau keluhan seperti “luka”.',
      'cari.coba': 'Coba cari', 'cari.navigasi': '↑ ↓ pilih', 'cari.enter': 'Enter buka', 'cari.esc': 'Esc tutup',
      'tipe.semua': 'Semua', 'tipe.tanaman': 'Tanaman obat', 'tipe.bab': 'Pengetahuan lokal', 'tipe.istilah': 'Istilah', 'tipe.artikel': 'Kisah & berita', 'tipe.pengalaman': 'Pengalaman',
      'hero.atas': 'Distrik Klamono, Kabupaten Sorong, Papua Barat Daya',
      'hero.tag': 'Merawat hutan, merawat pengetahuan.',
      'hero.sub': 'Pesan pengalaman langsung dari kampung, dan pelajari pengetahuan Suku Moi yang dicatat bersama warga.',
      'hero.cta1': 'Lihat peta kampung', 'hero.cta2': 'Buka pustaka',
      'hero.angkaKampung': 'kampung', 'hero.angkaPengalaman': 'pengalaman wisata', 'hero.angkaTanaman': 'tanaman obat tercatat',
      'hero.foto': 'Penari Tradisional menggunakan Properti Koba-koba. Foto: Tim 20 UB, TEP 2026.',
      'hero.alt': 'Penari tradisional berjalan beriringan membawa properti koba-koba di jalan kampung.',
      'home.jejaring': '{k} kampung, {n} pengalaman',
      'home.jejaringSub': 'Dari hutan Klawosom di ujung barat sampai Klamono Olie di timur. Pilih kampung untuk melihat apa saja yang bisa kamu lakukan di sana. Setiap permintaan diteruskan ke penanggung jawab kampungnya.',
      'jalur.catatan': 'Kampung diurutkan dari barat ke timur. Jaraknya tidak sesuai skala.', 'jalur.n': '{n} pengalaman', 'jalur.n1': '1 pengalaman',
      'ung.label': 'Pengalaman unggulan', 'ung.lencana': 'Unggulan', 'ung.pesan': 'Pesan sekarang', 'ung.peta': 'Lihat di peta',
      'ig.ikuti': 'Ikuti di Instagram', 'ung.sorotan': 'Yang akan kamu temui', 'ung.bawa': 'Jangan lupa bawa', 'ung.catatanAngka': 'Angka jalur bisa berubah, tergantung kondisi di lapangan.',
      'jelajah.petaJudul': 'Peta wisata', 'jelajah.petaSub': '{n} pengalaman di {k} kampung, hasil pemetaan Tim Ekspedisi Patriot 2026. Pilih titik di peta atau nama kampung untuk melihat lebih dekat.',
      'filter.label': 'Pilih jenis pengalaman', 'filter.semuaJenis': 'Semua',
      'home.pustaka': 'Dari pustaka',
      'home.pustakaSub': '{n} tanaman obat, {b} bab pengetahuan lokal, dan {k} istilah Moi yang bisa kamu cari.',
      'home.tanamanHari': 'Tanaman hari ini', 'home.bukaPeta': 'Buka peta lengkap', 'home.dariKamus': 'Dari kamus istilah',
      'home.tentang': 'Disusun oleh Tim Ekspedisi Patriot 20 Universitas Brawijaya bersama masyarakat Klamono Raya, 2026.',
      'lihatSemua': 'Lihat semua', 'selengkapnya': 'Selengkapnya', 'kenalTim': 'Kenali tim',
      'status.buka': 'Bisa dipesan', 'status.persiapan': 'Segera dibuka',
      'kat.kuliner': 'Kuliner', 'kat.pangan': 'Pangan lokal', 'kat.alam': 'Alam & hutan', 'kat.budaya': 'Seni & budaya', 'kat.produk': 'Produk lokal', 'kat.agro': 'Agroliving', 'kat.agroforestri': 'Agroforestri', 'kat.sejarah': 'Sejarah',
      'jelajah.judul': 'Jelajah Klamono', 'jelajah.label': 'Jelajah & pesan',
      'alur.1j': 'Pilih pengalaman', 'alur.1': 'Dari peta atau daftar kampung', 'alur.2j': 'Isi formulir singkat', 'alur.2': 'Tanggal, jumlah orang, dan kontakmu', 'alur.3j': 'Lanjut di WhatsApp', 'alur.3': 'Chat dengan Admin',
      'faq.tanyaJudul': 'Masih ada pertanyaan?', 'faq.tanyaIsi': 'Tanyakan apa saja soal wisata di Klamono langsung ke Admin lewat WhatsApp.', 'kontak.tanyaUmum': 'Halo {k}, saya ingin bertanya tentang wisata di Klamono.',
      'jelajah.sub': 'Pilih pengalaman yang kamu suka dari peta atau daftar kampung, lalu kirim permintaan. Kami akan membalas lewat WhatsApp dalam {w}.',
      'peta.satelit': 'Satelit', 'peta.jalan': 'Peta', 'peta.dariSorong': 'Dari Bandara DEO Sorong:', 'peta.keSorong': 'ke Aimas · Sorong', 'peta.semua': 'Lihat semua titik',
      'peta.klaster': '{n} pengalaman di {k}. Klik untuk melihat lebih dekat.', 'peta.satelitGagal': 'Citra satelit belum bisa dimuat di sini, jadi peta kembali ke tampilan biasa.',
      'peta.sumber': 'Jalan & sungai © kontributor OpenStreetMap', 'peta.sumberTitik': 'Titik pengalaman berasal dari pemetaan Tim Ekspedisi Patriot 2026.',
      'peta.perkiraan': 'Titik perkiraan', 'peta.perbesar': 'Perbesar', 'peta.perkecil': 'Perkecil', 'peta.label': 'Peta potensi wisata Klamono Raya',
      'peta.fallback': 'Peta interaktif belum bisa dimuat, jadi yang tampil versi sederhananya.',
      'peta.utara': 'U',
      'kartu.atraksi': 'Atraksi', 'kartu.aktivitas': 'Yang bisa kamu lakukan', 'kartu.durasi': 'Durasi', 'kartu.kontak': 'Kontak',
      'kartu.pesan': 'Pesan pengalaman ini', 'kartu.minat': 'Daftar minat', 'event.lencana': 'Event tahunan', 'event.koordinasi': 'Koordinasi dengan admin', 'event.tanya': 'Halo {k}, saya ingin berkoordinasi untuk event “{p}”. Kapan event ini diadakan dan bagaimana cara ikut?', 'kartu.baca': 'Kisah kampung', 'tutup': 'Tutup',
      'kontak.tim': 'Admin akan menghubungkanmu', 'kontak.resmi': 'Admin Jelajah Klamono', 'kontak.operator': 'Operator Distrik Klamono', 'kontak.tanya': 'Halo {k}, saya ingin bertanya tentang “{p}”.',
      'info.cara': 'Cara ke Klamono', 'info.etika': 'Selama berkunjung', 'info.faq': 'Yang sering ditanyakan',
      'pesan.judul': 'Pesan pengalaman', 'pesan.l1': 'Pengalaman', 'pesan.l2': 'Data diri', 'pesan.l3': 'Cek & kirim',
      'f.pengalaman': 'Pilih pengalaman', 'f.tanggal': 'Kapan mau datang?', 'f.fleksibel': 'Tanggal saya masih fleksibel',
      'f.durasi': 'Lama kunjungan', 'f.dewasa': 'Dewasa', 'f.anak': 'Anak (di bawah 12 tahun)', 'f.kurang': 'Kurangi', 'f.tambah': 'Tambah',
      'f.jemput': 'Saya perlu bantuan mengatur transportasi dari Sorong',
      'f.nama': 'Nama lengkap', 'f.email': 'Email', 'f.emailBantu': 'Kami kirim konfirmasinya ke email ini.',
      'f.telp': 'Nomor WhatsApp / telepon', 'f.telpBantu': 'Pakai kode negara, misalnya +62 812 3456 7890.',
      'f.negara': 'Kewarganegaraan', 'f.pilih': 'Pilih…', 'f.bahasaPemandu': 'Bahasa pemandu',
      'f.kebutuhan': 'Kebutuhan khusus (opsional)', 'f.kebutuhanBantu': 'Misalnya alergi makanan, pantangan, kondisi kesehatan, atau kebutuhan aksesibilitas.',
      'f.pesan': 'Pesan tambahan (opsional)',
      'f.setuju': 'Saya setuju data ini dibagikan ke admin Jelajah Klamono, operator Distrik Klamono, dan penanggung jawab kampung untuk mengatur kunjungan.',
      'durasi.0': 'Setengah hari', 'durasi.1': '1 hari', 'durasi.2': '2 hari 1 malam', 'durasi.3': '3 hari 2 malam', 'durasi.4': 'Lebih lama / belum tahu',
      'pemandu.0': 'Bahasa Indonesia', 'pemandu.1': 'Bahasa Inggris', 'pemandu.2': 'Lainnya (tulis di pesan)',
      'btn.lanjut': 'Lanjut', 'btn.kembali': 'Kembali', 'btn.kirim': 'Kirim permintaan', 'btn.mengirim': 'Mengirim…',
      'err.wajib': 'Bagian ini perlu diisi.', 'err.email': 'Cek lagi alamat emailnya.', 'err.telp': 'Cek lagi nomornya.', 'err.tanggal': 'Pilih hari ini atau tanggal sesudahnya.', 'err.setuju': 'Centang kotak persetujuan dulu, ya.', 'err.orang': 'Minimal ada satu orang dewasa.',
      'r.pengalaman': 'Pengalaman', 'r.tanggal': 'Tanggal', 'r.orang': 'Jumlah orang', 'r.durasi': 'Lama', 'r.jemput': 'Transportasi', 'r.kontak': 'Kontak', 'r.negara': 'Kewarganegaraan', 'r.pemandu': 'Bahasa pemandu', 'r.catatan': 'Catatan',
      'r.fleksibel': 'fleksibel', 'r.dewasa': '{n} dewasa', 'r.anak': '{n} anak', 'r.ya': 'Minta dibantu dari Sorong', 'r.tidak': 'Atur sendiri', 'r.belum': 'Belum ada',
      'samping.judul': 'Begini cara pemesanannya',
      'samping.1': 'Kamu cukup mengirim permintaan dulu.', 'samping.2': 'Kamu langsung menerima email konfirmasi.', 'samping.2wa': 'Kamu diarahkan ke WhatsApp dengan pesan yang sudah terisi, tinggal kirim.', 'samping.3': '{k} akan membalas lewat WhatsApp dalam {w} untuk mengatur jadwal dan detail kunjungan.',
      'samping.data': 'Datamu', 'samping.dataIsi': 'Hanya dibagikan ke admin, operator distrik, dan penanggung jawab kampung. Tidak dijual dan tidak dipakai untuk iklan.',
      'berhasil.judul': 'Permintaanmu sudah terkirim', 'berhasil.sub': 'Konfirmasinya sudah kami kirim ke {email}. Simpan kode ini, ya, lalu lanjutkan obrolan di WhatsApp.',
      'berhasil.lanjut': 'Lanjutkan lewat WhatsApp', 'berhasil.wa': 'Chat di WhatsApp', 'btn.selesai': 'Kembali ke peta',
      'gagal.judul': 'Permintaanmu belum terkirim', 'gagal.belumAktif': 'Kirim permintaanmu lewat WhatsApp ke {k}. Pesannya sudah kami siapkan, kamu tinggal menekan kirim. Bisa juga lewat email.', 'gagal.satuLangkah': 'Tinggal satu langkah lagi',
      'gagal.jaringan': 'Pengiriman gagal, sepertinya karena koneksi. Coba lagi, atau kirim lewat WhatsApp atau email. Pesannya sudah kami siapkan.',
      'btn.cobaLagi': 'Coba lagi', 'btn.email': 'Kirim lewat email', 'btn.salin': 'Salin pesan', 'disalin': 'Disalin', 'gagalSalin': 'Teksnya tidak bisa tersalin otomatis. Pilih teksnya lalu salin sendiri.',
      'teks.salam': 'Halo, saya ingin memesan pengalaman wisata di Klamono.',
      'pustaka.judul': 'Pustaka Klamono', 'pustaka.label': 'Pustaka · Pengetahuan Suku Moi', 'angka.bab': 'bab pengetahuan', 'angka.istilah': 'istilah Moi', 'angka.buku': 'buku saku daring', 'angka.peneliti': 'peneliti', 'angka.kampungMitra': 'kampung mitra', 'tentang.label': 'Tentang kami · TEP 20 UB 2026',
      'pustaka.sub': 'Pengetahuan Suku Moi tentang tanaman obat, sejarah, adat, dan seni, dicatat bersama warga oleh Tim Ekspedisi Patriot.',
      'pustaka.milik': 'Pengetahuan di pustaka ini milik masyarakat adat Moi dan dicatat untuk pelestarian. Gunakan dengan hormat dan sebutkan sumbernya; untuk kepentingan komersial, mintalah izin.',
      'tab.tanaman': 'Tanaman obat', 'tab.pengetahuan': 'Pengetahuan lokal', 'tab.kamus': 'Kamus istilah', 'tab.kisah': 'Kisah & berita', 'tab.buku': 'Buku saku',
      'buku.sub': 'Dua buku saku yang disusun Tim Ekspedisi Patriot 2026 bersama masyarakat Klamono Raya. Baca halaman demi halaman di sini, atau unduh PDF-nya.',
      'buku.baca': 'Baca online', 'buku.unduh': 'Unduh PDF ({s})', 'buku.hal': '{n} halaman', 'buku.posisi': 'Halaman {a} dari {n}',
      'buku.sebelum': 'Halaman sebelumnya', 'buku.berikut': 'Halaman berikutnya', 'buku.kembali': 'Semua buku saku', 'buku.teks': 'Baca versi teks',
      'buku.lihat': 'Lihat halaman aslinya di buku saku (hlm. {n})', 'buku.geser': 'Pindah halaman', 'buku.altHal': 'Halaman {n}', 'buku.sampul': 'Sampul {j}',
      'buku.atas': 'Buku saku', 'buku.perbesar': 'Klik untuk memperbesar halaman', 'buku.kecilkan': 'Klik untuk kembali ke tampilan dua halaman', 'buku.geserHP': 'Geser ke kiri atau kanan untuk membalik halaman.',
      'tanaman.cari': 'Cari nama, nama Moi, atau keluhan', 'tanaman.tentang': 'Tentang katalog ini',
      'tanaman.peringatan': 'Ini dokumentasi pengetahuan tradisional, bukan anjuran medis. Jangan memakainya sebagai pengganti pemeriksaan tenaga kesehatan, terutama untuk ibu hamil, bayi, dan penyakit berat seperti malaria.',
      'filter.semua': 'Semua kegunaan', 'filter.bagian': 'Semua bagian', 'filter.pakai': 'Semua cara pakai', 'urut.buku': 'Urutan buku', 'urut.az': 'Nama A–Z',
      'filter.labelBagian': 'Bagian yang dipakai', 'filter.labelPakai': 'Cara pakai', 'filter.labelUrut': 'Urutkan',
      'hitung.tanaman': '{n} dari {t} tanaman', 'kosong.tanaman': 'Tidak ada tanaman yang cocok', 'hapusFilter': 'Hapus filter',
      'fotoMenyusul': 'Foto menyusul',
      'keg.nyeri': 'Pegal & stamina', 'keg.demam': 'Demam & malaria', 'keg.luka': 'Luka & kulit', 'keg.cerna': 'Perut & lambung', 'keg.napas': 'Batuk & napas', 'keg.ibu': 'Ibu & bayi', 'keg.darah': 'Tensi, gula & kolesterol', 'keg.tulang': 'Tulang & sendi', 'keg.lain': 'Keluhan lain', 'keg.adat': 'Tanaman adat',
      'bag.daun': 'Daun', 'bag.akar': 'Akar', 'bag.batang': 'Batang', 'bag.kayu': 'Kayu', 'bag.kulit-kayu': 'Kulit kayu', 'bag.buah': 'Buah', 'bag.getah': 'Getah', 'bag.pati': 'Pati sagu', 'bag.pucuk': 'Pucuk', 'bag.seluruh': 'Seluruh tanaman',
      'pakai.minum': 'Diminum', 'pakai.luar': 'Obat luar', 'pakai.makan': 'Dimakan', 'pakai.adat': 'Penanda adat',
      'kel.moi': 'Pengetahuan Suku Moi', 'kel.klabra': 'Pengetahuan Moi Klabra', 'kel.umum': 'Pengetahuan masyarakat setempat',
      'd.namaID': 'Nama Indonesia', 'd.latin': 'Nama latin', 'd.moi': 'Nama Moi', 'd.lokal': 'Nama setempat', 'd.lain': 'Nama lain', 'd.en': 'Nama Inggris', 'd.belum': 'Belum tercatat',
      'd.cara': 'Cara Pengolahan', 'd.catatan': 'Catatan redaksi', 'd.untuk': 'Dipakai untuk', 'd.bagian': 'Bagian dipakai', 'd.pakai': 'Cara pakai',
      'd.sumberTanaman': 'Sumber: Buku Saku Inventarisasi Pengetahuan Lokal Tanaman Obat Klamono Raya, Tim Ekspedisi Patriot 20 UB, 2026.',
      'd.sumberKlamono': 'Sumber: Buku Saku Inventarisasi Warisan Budaya Sejarah Lokal Klamono Raya, Tim Ekspedisi Patriot 20 UB, 2026.',
      'd.sebelum': 'Sebelumnya', 'd.berikut': 'Berikutnya', 'salinTautan': 'Salin tautan', 'tautanDisalin': 'Tautan disalin',
      'kredit.foto': 'Foto: Tim 20 UB, TEP 2026', 'kredit.ilustrasi': 'Foto ilustrasi', 'kredit.dipotong': 'dipotong', 'no': 'No.',
      'peng.bab': 'Bab pengetahuan lokal', 'peng.kamus': 'Kamus istilah', 'peng.kamusSub': 'Istilah Moi dan istilah lokal yang muncul di pustaka, dengan tautan ke bab asalnya.', 'kamus.cari': 'Cari istilah atau artinya…', 'kamus.hitung': '{n} dari {t} istilah', 'kamus.kosong': 'Belum ada istilah yang cocok.',
      'kamus.baca': 'Baca di bab “{b}”', 'rujukan': 'Daftar pustaka', 'menitBaca': '{m} menit baca',
      'bab.wilayah': 'Wilayah', 'bab.masyarakat': 'Masyarakat', 'bab.sejarah': 'Sejarah', 'bab.adat': 'Adat', 'bab.seni': 'Seni', 'bab.wisata': 'Wisata',
      'judul.beranda': 'Jelajah Klamono — Wisata Kampung & Pengetahuan Suku Moi di Sorong', 'bab.istilah': 'Istilah dalam bab ini', 'bab.ke': 'Bab {n} dari {t}', 'bab.nIstilah': 'Istilah: {n}', 'bab.sumberJudul': 'Sumber bab ini', 'bab.sebelum': 'Bab sebelumnya', 'bab.berikut': 'Bab berikutnya', 'buku.pendekTanaman': 'Buku saku Tanaman Obat', 'buku.pendekKlamono': 'Buku saku Sejarah Lokal', 'buku.klamono': 'Buku Saku Inventarisasi Warisan Budaya Sejarah Lokal Klamono Raya', 'buku.tanaman': 'Buku saku Tanaman Obat',
      'kisah.sub': 'Kisah hidup warga, berita kampung, dan kabar program.',
      'kisah.kirimJ': 'Punya kisah dari Klamono?', 'kisah.kirim': 'Kirim tulisan, foto, atau rekaman kisah warga ke {email}. Kami menyuntingnya bersama penuturnya sebelum terbit.',
      'art.kisah': 'Kisah', 'art.berita': 'Berita', 'art.program': 'Program', 'oleh': 'Oleh {p}',
      'tentang.judul': 'Tentang kami',
      'tentang.sub': 'Website ini dibuat oleh Tim Ekspedisi Patriot (TEP) 20 Universitas Brawijaya 2026 melalui program “Merawat Hutan, Merawat Pengetahuan”, sebuah model pariwisata pengalaman berbasis komunitas di kawasan transmigrasi Klamono, Kabupaten Sorong.',
      'noken.label': 'Cara program ini bekerja', 'noken.judul': 'Model NOKEN', 'noken.sub': 'Seperti noken yang lentur dan kuat menopang beban, program ini menghubungkan warga Orang Asli Papua dan warga transmigran dalam satu wadah kerja sama yang setara.',
      'noken.N1': 'Hutan dan ekosistem Klamono sebagai modal utama yang dijaga.', 'noken.O': 'Penghormatan pada hak ulayat dan identitas Suku Moi.',
      'noken.K': 'Pengetahuan lokal dicatat dan diceritakan dengan menghormati kesakralannya.', 'noken.E': 'Menghidupkan Jejaring Antar Kampung dan usaha warga melalui pelatihan.', 'noken.N2': 'Kerja sama warga, pemerintah, kampus, lembaga adat, dan mitra.',
      'tentang.tim': 'Tim peneliti', 'tentang.galeri': 'Galeri', 'tentang.terima': 'Terima kasih', 'terima.label': 'Ucapan dari Tim Ekspedisi Patriot 20 UB', 'terima.judul': 'Terima kasih, ', 'terima.kampung': '{n} kampung tuan rumah', 'terima.barat': 'Barat', 'terima.timur': 'Timur', 'tentang.kontak': 'Hubungi admin',
      'tentang.kontakSub': 'WhatsApp untuk urusan wisata. Email dan Instagram untuk mengirim tulisan dan masukan.', 'kontak.wisataJudul': 'Wisata & pemesanan', 'kontak.wisataIsi': 'Tanya soal wisata, pesan pengalaman, atau atur kunjungan ke kampung.', 'kontak.tulisanJudul': 'Tulisan & masukan', 'kontak.tulisanIsi': 'Kirim tulisan, koreksi isi pustaka, atau masukan untuk website ini.', 'salinEmail': 'Salin alamat', 'tulisEmail': 'Tulis email', 'emailDisalin': 'Alamat email disalin',
      'tentang.pendukung': 'Didukung oleh', 'ketua': 'Ketua tim',
      'kaki.tentang': 'Jejaring wisata berbasis kampung dan pustaka pengetahuan lokal Suku Moi di Klamono Raya, Papua Barat Daya.',
      'kaki.jelajahi': 'Jelajahi', 'kaki.kontak': 'Kontak admin',
      'kaki.hak': '© 2026 Tim Ekspedisi Patriot 20 Universitas Brawijaya. Pengetahuan lokal di website ini milik masyarakat adat Moi.',
      'spanduk': 'This website is also available in English.', 'spandukBtn': 'Switch to English'
    },
    en: {
      'nav.beranda': 'Home', 'nav.jelajah': 'Explore', 'nav.pustaka': 'Library', 'nav.tentang': 'About',
      'nav.jelajahPanjang': 'Explore & book', 'nav.tentangPanjang': 'About us',
      'merek.nama': 'Explore Klamono', 'merek.sub': 'Village tourism & Moi library', 'lewati': 'Skip to content',
      'cari': 'Search', 'cari.ph': 'Search plants, terms, stories or villages', 'cari.tutup': 'Close search',
      'cari.kosong': 'No results for “{q}”.', 'cari.kosongSaran': 'Try another word, such as a plant’s Moi name or a complaint like “wound”.',
      'cari.coba': 'Try searching', 'cari.navigasi': '↑ ↓ select', 'cari.enter': 'Enter open', 'cari.esc': 'Esc close',
      'tipe.semua': 'All', 'tipe.tanaman': 'Medicinal plants', 'tipe.bab': 'Local knowledge', 'tipe.istilah': 'Terms', 'tipe.artikel': 'Stories & news', 'tipe.pengalaman': 'Experiences',
      'hero.atas': 'Klamono District, Sorong Regency, Southwest Papua',
      'hero.tag': 'Caring for the forest, caring for knowledge.',
      'hero.sub': 'Book experiences directly with the villages, and learn Moi knowledge recorded together with residents.',
      'hero.cta1': 'See the village map', 'hero.cta2': 'Open the library',
      'hero.angkaKampung': 'villages', 'hero.angkaPengalaman': 'experiences', 'hero.angkaTanaman': 'medicinal plants recorded',
      'hero.foto': 'Traditional dancers using koba-koba as props. Photo: Tim 20 UB, TEP 2026.',
      'hero.alt': 'Traditional dancers walking in a line along a village road carrying koba-koba props.',
      'home.jejaring': '{k} villages, {n} experiences',
      'home.jejaringSub': 'From the Klawosom forest in the west to Klamono Olie in the east. Choose a village to see its experiences on the map. Every request is passed on to the person in charge in that village.',
      'jalur.catatan': 'Villages from west to east (schematic, not to scale).', 'jalur.n': '{n} experiences', 'jalur.n1': '1 experience',
      'ung.label': 'Featured experience', 'ung.lencana': 'Featured', 'ung.pesan': 'Book now', 'ung.peta': 'See on the map',
      'ig.ikuti': 'Follow on Instagram', 'ung.sorotan': 'What you will find', 'ung.bawa': 'Bring', 'ung.catatanAngka': 'Trail figures may change with conditions on the ground.',
      'jelajah.petaJudul': 'Tourism potential map', 'jelajah.petaSub': '{n} experiences in {k} villages, from the potential mapping by Tim Ekspedisi Patriot 2026. Choose a point or a village to see the details.',
      'filter.label': 'Filter by type of experience', 'filter.semuaJenis': 'All',
      'home.pustaka': 'From the library',
      'home.pustakaSub': '{n} medicinal plants, {b} chapters of local knowledge and {k} Moi terms, all searchable.',
      'home.tanamanHari': 'Plant of the day', 'home.bukaPeta': 'Open the full map', 'home.dariKamus': 'From the glossary',
      'home.tentang': 'Compiled by Tim Ekspedisi Patriot 20 of Universitas Brawijaya with the people of Klamono Raya, 2026.',
      'lihatSemua': 'See all', 'selengkapnya': 'Read more', 'kenalTim': 'Meet the team',
      'status.buka': 'Open for booking', 'status.persiapan': 'In preparation',
      'kat.kuliner': 'Food', 'kat.pangan': 'Local food', 'kat.alam': 'Nature & forest', 'kat.budaya': 'Arts & culture', 'kat.produk': 'Local products', 'kat.agro': 'Agroliving', 'kat.agroforestri': 'Agroforestry', 'kat.sejarah': 'Heritage',
      'jelajah.judul': 'Explore Klamono', 'jelajah.label': 'Explore & book',
      'alur.1j': 'Choose an experience', 'alur.1': 'From the map or the village list', 'alur.2j': 'Fill in a short form', 'alur.2': 'Dates, group size and your contact', 'alur.3j': 'Continue on WhatsApp', 'alur.3': 'Chat with our admin',
      'faq.tanyaJudul': 'Still have questions?', 'faq.tanyaIsi': 'Ask our admin anything about visiting Klamono, straight on WhatsApp.', 'kontak.tanyaUmum': 'Hello {k}, I have a question about visiting Klamono.',
      'jelajah.sub': 'Choose an experience from the map or the village list, then send a request. We will reply on WhatsApp within {w}.',
      'peta.satelit': 'Satellite', 'peta.jalan': 'Map', 'peta.dariSorong': 'From DEO Airport, Sorong:', 'peta.keSorong': 'to Aimas · Sorong', 'peta.semua': 'Show all points',
      'peta.klaster': '{n} experiences in {k}. Click to zoom in.', 'peta.satelitGagal': 'Satellite imagery cannot load here. The map is back to the standard view.',
      'peta.sumber': 'Roads & rivers © OpenStreetMap contributors', 'peta.sumberTitik': 'Experience points from the potential mapping by Tim Ekspedisi Patriot 2026.',
      'peta.perkiraan': 'Approximate location', 'peta.perbesar': 'Zoom in', 'peta.perkecil': 'Zoom out', 'peta.label': 'Map of tourism experiences in Klamono Raya',
      'peta.fallback': 'Simplified map, as the interactive map could not load.',
      'peta.utara': 'N',
      'kartu.atraksi': 'Attractions', 'kartu.aktivitas': 'What you’ll do', 'kartu.durasi': 'Duration', 'kartu.kontak': 'Contact',
      'kartu.pesan': 'Book this experience', 'kartu.minat': 'Register interest', 'event.lencana': 'Annual event', 'event.koordinasi': 'Coordinate with the admin', 'event.tanya': 'Hello {k}, I would like to coordinate for the “{p}” event. When is it held and how can I join?', 'kartu.baca': 'Village story', 'tutup': 'Close',
      'kontak.tim': 'Connected by the admin', 'kontak.resmi': 'Jelajah Klamono admin', 'kontak.operator': 'Klamono District operator', 'kontak.tanya': 'Hello {k}, I would like to ask about “{p}”.',
      'info.cara': 'Getting to Klamono', 'info.etika': 'Visiting etiquette', 'info.faq': 'Common questions',
      'pesan.judul': 'Book an experience', 'pesan.l1': 'Experience', 'pesan.l2': 'Your details', 'pesan.l3': 'Review & send',
      'f.pengalaman': 'Choose an experience', 'f.tanggal': 'Planned arrival date', 'f.fleksibel': 'My dates are flexible',
      'f.durasi': 'Length of visit', 'f.dewasa': 'Adults', 'f.anak': 'Children (under 12)', 'f.kurang': 'Decrease', 'f.tambah': 'Increase',
      'f.jemput': 'I need help arranging transport from Sorong',
      'f.nama': 'Full name', 'f.email': 'Email', 'f.emailBantu': 'An automatic confirmation is sent to this address.',
      'f.telp': 'WhatsApp / phone number', 'f.telpBantu': 'Include the country code, for example +44 7700 900123.',
      'f.negara': 'Nationality', 'f.pilih': 'Choose…', 'f.bahasaPemandu': 'Guide language',
      'f.kebutuhan': 'Special needs (optional)', 'f.kebutuhanBantu': 'Food allergies, dietary rules, health conditions or accessibility needs.',
      'f.pesan': 'Anything else? (optional)',
      'f.setuju': 'I agree that these details are shared with the Jelajah Klamono admin, the Klamono District operator and the village’s person in charge to arrange the visit.',
      'durasi.0': 'Half a day', 'durasi.1': '1 day', 'durasi.2': '2 days 1 night', 'durasi.3': '3 days 2 nights', 'durasi.4': 'Longer / not sure yet',
      'pemandu.0': 'Indonesian', 'pemandu.1': 'English', 'pemandu.2': 'Other (write in the message)',
      'btn.lanjut': 'Continue', 'btn.kembali': 'Back', 'btn.kirim': 'Send request', 'btn.mengirim': 'Sending…',
      'err.wajib': 'Required.', 'err.email': 'Check the email address.', 'err.telp': 'Check the phone number.', 'err.tanggal': 'Choose today or a later date.', 'err.setuju': 'Tick the consent box to send.', 'err.orang': 'At least one adult.',
      'r.pengalaman': 'Experience', 'r.tanggal': 'Date', 'r.orang': 'Group size', 'r.durasi': 'Length', 'r.jemput': 'Transport', 'r.kontak': 'Contact', 'r.negara': 'Nationality', 'r.pemandu': 'Guide language', 'r.catatan': 'Notes',
      'r.fleksibel': 'flexible', 'r.dewasa': '{n} adult(s)', 'r.anak': '{n} child(ren)', 'r.ya': 'Help needed from Sorong', 'r.tidak': 'Arranging my own', 'r.belum': 'Not set yet',
      'samping.judul': 'How booking works',
      'samping.1': 'You simply send a request first.', 'samping.2': 'An automatic confirmation email is sent to you.', 'samping.2wa': 'You are taken to WhatsApp with the message already written; just send it.', 'samping.3': 'The {k} replies on WhatsApp within {w} to arrange dates and visit details.',
      'samping.data': 'Your data', 'samping.dataIsi': 'Shared only with the admin, the district operator and the village’s person in charge. Never sold or used for advertising.',
      'berhasil.judul': 'Request sent', 'berhasil.sub': 'A confirmation email has been sent to {email}. Keep this code, then carry on the conversation on WhatsApp.',
      'berhasil.lanjut': 'Continue on WhatsApp', 'berhasil.wa': 'Chat on WhatsApp', 'btn.selesai': 'Back to the map',
      'gagal.judul': 'Your request was not sent automatically', 'gagal.belumAktif': 'Send your request to the {k} on WhatsApp. The message is ready; just press send. Email works too.', 'gagal.satuLangkah': 'One more step',
      'gagal.jaringan': 'Sending failed, probably because of the connection. Try again, or send by WhatsApp or email; the message is ready below.',
      'btn.cobaLagi': 'Try again', 'btn.email': 'Send by email', 'btn.salin': 'Copy message', 'disalin': 'Copied', 'gagalSalin': 'Could not copy automatically. Select the text and copy it manually.',
      'teks.salam': 'Hello, I would like to book a visit in Klamono.',
      'pustaka.judul': 'Klamono library', 'pustaka.label': 'Library · Moi knowledge', 'angka.bab': 'knowledge chapters', 'angka.istilah': 'Moi terms', 'angka.buku': 'pocket books online', 'angka.peneliti': 'researchers', 'angka.kampungMitra': 'partner villages', 'tentang.label': 'About us · TEP 20 UB 2026',
      'pustaka.sub': 'Moi knowledge of medicinal plants, history, custom and art, recorded together with residents by Tim Ekspedisi Patriot.',
      'pustaka.milik': 'The knowledge in this library belongs to the Moi people and has been recorded for preservation. Use it respectfully and cite the source; ask permission for any commercial use.',
      'tab.tanaman': 'Medicinal plants', 'tab.pengetahuan': 'Local knowledge', 'tab.kamus': 'Glossary', 'tab.kisah': 'Stories & news', 'tab.buku': 'Pocket books',
      'buku.sub': 'Two pocket books compiled by Tim Ekspedisi Patriot 2026 with the people of Klamono Raya. Read them page by page here, or download the PDF.',
      'buku.baca': 'Read online', 'buku.unduh': 'Download PDF ({s})', 'buku.hal': '{n} pages', 'buku.posisi': 'Page {a} of {n}',
      'buku.sebelum': 'Previous page', 'buku.berikut': 'Next page', 'buku.kembali': 'All pocket books', 'buku.teks': 'Read the text version',
      'buku.lihat': 'See the original page in the pocket book (p. {n})', 'buku.geser': 'Change page', 'buku.altHal': 'Page {n}', 'buku.sampul': 'Cover of {j}',
      'buku.atas': 'Pocket book', 'buku.perbesar': 'Click to enlarge the page', 'buku.kecilkan': 'Click to return to the two-page view', 'buku.bahasa': 'The book itself is in Indonesian. An English text version is in the library.', 'buku.geserHP': 'Swipe left or right to turn the page.',
      'tanaman.cari': 'Search a name, Moi name or complaint', 'tanaman.tentang': 'About this catalogue',
      'tanaman.peringatan': 'This documents traditional knowledge; it is not medical advice. Do not use it in place of professional care, especially for pregnant women, babies and serious illnesses such as malaria.',
      'filter.semua': 'All uses', 'filter.bagian': 'All parts', 'filter.pakai': 'All methods', 'urut.buku': 'Book order', 'urut.az': 'Name A–Z',
      'filter.labelBagian': 'Part used', 'filter.labelPakai': 'How it’s used', 'filter.labelUrut': 'Sort',
      'hitung.tanaman': '{n} of {t} plants', 'kosong.tanaman': 'No plants match', 'hapusFilter': 'Clear filters',
      'fotoMenyusul': 'Photo to come',
      'keg.nyeri': 'Aches & stamina', 'keg.demam': 'Fever & malaria', 'keg.luka': 'Wounds & skin', 'keg.cerna': 'Stomach & digestion', 'keg.napas': 'Cough & breathing', 'keg.ibu': 'Mother & baby', 'keg.darah': 'Blood pressure, sugar & cholesterol', 'keg.tulang': 'Bones & joints', 'keg.lain': 'Other ailments', 'keg.adat': 'Customary plant',
      'bag.daun': 'Leaf', 'bag.akar': 'Root', 'bag.batang': 'Stem', 'bag.kayu': 'Wood', 'bag.kulit-kayu': 'Bark', 'bag.buah': 'Fruit', 'bag.getah': 'Sap', 'bag.pati': 'Sago starch', 'bag.pucuk': 'Heart shoot', 'bag.seluruh': 'Whole plant',
      'pakai.minum': 'Drunk', 'pakai.luar': 'External use', 'pakai.makan': 'Eaten', 'pakai.adat': 'Customary marker',
      'kel.moi': 'Moi knowledge', 'kel.klabra': 'Moi Klabra knowledge', 'kel.umum': 'Local community knowledge',
      'd.namaID': 'Indonesian name', 'd.latin': 'Latin name', 'd.moi': 'Moi name', 'd.lokal': 'Local name', 'd.lain': 'Also called', 'd.en': 'English name', 'd.belum': 'Not yet recorded',
      'd.cara': 'Preparation', 'd.catatan': 'Editorial note', 'd.untuk': 'Used for', 'd.bagian': 'Part used', 'd.pakai': 'How it is used',
      'd.sumberTanaman': 'Source: pocket book “Inventory of Local Knowledge on Medicinal Plants of Klamono Raya”, Tim Ekspedisi Patriot 20 UB, 2026.',
      'd.sumberKlamono': 'Source: pocket book “Inventory of the Cultural Heritage and Local History of Klamono Raya”, Tim Ekspedisi Patriot 20 UB, 2026.',
      'd.sebelum': 'Previous', 'd.berikut': 'Next', 'salinTautan': 'Copy link', 'tautanDisalin': 'Link copied',
      'kredit.foto': 'Photo: Tim 20 UB, TEP 2026', 'kredit.ilustrasi': 'Illustrative photo', 'kredit.dipotong': 'cropped', 'no': 'No.',
      'peng.bab': 'Local knowledge chapters', 'peng.kamus': 'Glossary', 'peng.kamusSub': 'Moi and local terms that appear in the library, linked to the chapters they come from.', 'kamus.cari': 'Search a term or its meaning…', 'kamus.hitung': '{n} of {t} terms', 'kamus.kosong': 'No matching terms yet.',
      'kamus.baca': 'Read in “{b}”', 'rujukan': 'References', 'menitBaca': '{m} min read',
      'bab.wilayah': 'Place', 'bab.masyarakat': 'People', 'bab.sejarah': 'History', 'bab.adat': 'Custom', 'bab.seni': 'Arts', 'bab.wisata': 'Travel',
      'judul.beranda': 'Jelajah Klamono — Village Tourism & Moi Knowledge in Sorong, Papua', 'bab.istilah': 'Terms in this chapter', 'bab.ke': 'Chapter {n} of {t}', 'bab.nIstilah': 'Terms: {n}', 'bab.sumberJudul': 'Source of this chapter', 'bab.sebelum': 'Previous chapter', 'bab.berikut': 'Next chapter', 'buku.pendekTanaman': 'Medicinal Plants pocket book', 'buku.pendekKlamono': 'Local History pocket book', 'buku.klamono': 'Pocket book: Inventory of the Cultural Heritage and Local History of Klamono Raya', 'buku.tanaman': 'Pocket book: Medicinal Plants',
      'kisah.sub': 'Residents’ life stories, village news and programme updates.',
      'kisah.kirimJ': 'Have a story from Klamono?', 'kisah.kirim': 'Send writing, photos or recordings of residents’ stories to {email}. We edit them with the storytellers before publishing.',
      'art.kisah': 'Story', 'art.berita': 'News', 'art.program': 'Programme', 'oleh': 'By {p}',
      'tentang.judul': 'About us',
      'tentang.sub': 'This website was made by Tim Ekspedisi Patriot (TEP) 20 of Universitas Brawijaya, 2026, through the programme “Caring for the Forest, Caring for Knowledge”, a model of community-based experience tourism in the Klamono transmigration area, Sorong Regency.',
      'noken.label': 'How the programme works', 'noken.judul': 'The NOKEN model', 'noken.sub': 'Like a noken, flexible yet strong enough to carry a load, the programme links Indigenous Papuan and transmigrant residents in one partnership of equals.',
      'noken.N1': 'Klamono’s forest and ecosystem as the main asset to protect.', 'noken.O': 'Respect for customary land rights and Moi identity.',
      'noken.K': 'Local knowledge recorded and shared while respecting what is sacred.', 'noken.E': 'Reviving the Jejaring Antar Kampung (inter-village network) and local businesses through training.', 'noken.N2': 'Cooperation between residents, government, universities, customary bodies and partners.',
      'tentang.tim': 'Research team', 'tentang.galeri': 'Gallery', 'tentang.terima': 'Thank you', 'terima.label': 'A note from Tim Ekspedisi Patriot 20 UB', 'terima.judul': 'Thank you, ', 'terima.kampung': '{n} host villages', 'terima.barat': 'West', 'terima.timur': 'East', 'tentang.kontak': 'Contact the admin',
      'tentang.kontakSub': 'WhatsApp for anything about visiting. Email and Instagram for sending writing and feedback.', 'kontak.wisataJudul': 'Trips & bookings', 'kontak.wisataIsi': 'Ask about visiting, book an experience or arrange a village visit.', 'kontak.tulisanJudul': 'Writing & feedback', 'kontak.tulisanIsi': 'Send us writing, corrections to the library or feedback on this website.', 'salinEmail': 'Copy address', 'tulisEmail': 'Write an email', 'emailDisalin': 'Email address copied',
      'tentang.pendukung': 'Supported by', 'ketua': 'Team lead',
      'kaki.tentang': 'A village-based tourism network and library of Moi local knowledge in Klamono Raya, Southwest Papua.',
      'kaki.jelajahi': 'Explore', 'kaki.kontak': 'Admin contact',
      'kaki.hak': '© 2026 Tim Ekspedisi Patriot 20, Universitas Brawijaya. The local knowledge on this website belongs to the Moi people.',
      'spanduk': 'Website ini juga tersedia dalam Bahasa Indonesia.', 'spandukBtn': 'Ganti ke Bahasa Indonesia'
    }
  };
  function t(k, v) {
    var s = (TEKS[lang] && TEKS[lang][k]) || TEKS.id[k] || k;
    if (v) Object.keys(v).forEach(function (x) { s = s.split('{' + x + '}').join(v[x]); });
    return s;
  }
  function L(o) {
    if (o == null) return '';
    if (typeof o === 'string') return o;
    if (Array.isArray(o)) return o;
    var v = o[lang];
    if (v == null || (Array.isArray(v) && !v.length) || v === '') v = o.id;
    return v == null ? '' : v;
  }

  /* travel info, etiquette, FAQ (bilingual) */
  var INFO = {
    cara: {
      id: ['Terbang ke Bandara Domine Eduard Osok (DEO) di Kota Sorong.', 'Dari sana, lanjut lewat darat ke Klamono melalui Aimas, kira-kira 1,5–2 jam. Tim bisa bantu mengatur penjemputan.', 'Jalan ke pusat distrik sudah diperkeras, tapi jalan ke beberapa kampung masih tanah dan licin kalau hujan.', 'Sinyal HP putus-putus di beberapa tempat. Kabari keluarga sebelum masuk hutan.', 'Kamu akan menginap di rumah warga (homestay). Di Klamono belum ada hotel.', 'Bawa uang tunai secukupnya, obat pribadi, losion antinyamuk, jas hujan, dan sepatu jalan. Sebelum berangkat, tanyakan ke dokter soal pencegahan malaria.'],
      en: ['Fly to Domine Eduard Osok Airport (DEO) in Sorong.', 'Continue by road to Klamono via Aimas, about 1.5–2 hours (estimate). The team can help arrange a pick-up.', 'The road to the district centre is paved, but roads to some villages are dirt and slippery after rain.', 'Phone signal is patchy in places. Tell someone before you head into the forest.', 'Stays are homestays with local families. There are no hotels in Klamono yet.', 'Bring enough cash, personal medicine, insect repellent, a rain jacket and walking shoes. Ask your doctor about malaria prevention before you travel.']
    },
    etika: {
      id: ['Minta izin dulu sebelum memotret orang, rumah, atau tempat adat.', 'Bambu yang diikat kain merah adalah tanda adat (sasi, egek, palang, atau Bambu Tui). Jangan masuk, mencabut, atau mengambil apa pun di area itu.', 'Hormati pantangan setempat, misalnya tidak membawa makanan dingin atau basi ke hutan.', 'Jangan ambil tumbuhan, satwa, atau benda apa pun dari hutan tanpa izin pemandu.', 'Jangan berenang atau turun ke sungai tanpa pemandu. Sungai di Klamono adalah rumah buaya muara.', 'Bawa pulang sampahmu dan berpakaian sopan selama di kampung.'],
      en: ['Ask before photographing people, homes or customary places.', 'Bamboo tied with red cloth is a customary sign (sasi, egek, palang or Bambu Tui). Do not enter, remove it or take anything from that area.', 'Respect local taboos, such as not carrying cold or stale food into the forest.', 'Do not take plants, animals or objects from the forest without your guide’s permission.', 'Do not swim in or enter rivers without your guide; Klamono’s rivers are home to saltwater crocodiles.', 'Take your rubbish home and dress modestly in the village.']
    },
    faq: {
      id: [['Perlu bayar di website?', 'Tidak. Website ini hanya meneruskan permintaanmu. Soal biaya dan cara bayar, kamu bicarakan langsung dengan {k} lewat WhatsApp.'], ['Berapa lama sampai dihubungi?', 'Biasanya dalam {w}. Kalau belum ada kabar, chat kami di WhatsApp {wa} atau email ke ' + EMAIL + '.'], ['Bagaimana kalau rencana berubah?', 'Kabari kami lewat WhatsApp secepatnya dan sebutkan kode pemesananmu. Soal perubahan dan pembatalan, kalian sepakati bersama.'], ['Pemandunya bisa bahasa Inggris?', 'Pemandu kami berbahasa Indonesia. Pendamping yang bisa bahasa Inggris akan kami usahakan, jadi pilih bahasa pemandu saat memesan.']],
      en: [['Do I pay on the website?', 'No. The website only sends your request. Costs and payment are agreed directly with the {k} on WhatsApp.'], ['How soon will I hear back?', 'Usually within {w}. If you have not heard anything, message us on WhatsApp {wa} or email ' + EMAIL + '.'], ['What if my plans change?', 'Tell us on WhatsApp as soon as possible, quoting your booking code. Changes and cancellations are agreed directly.'], ['Do guides speak English?', 'Guides speak Indonesian. An English-speaking companion can be arranged where possible; choose the guide language when booking.']]
    }
  };

  /* ------------------------------------------------------------ icons */
  var IK = {
    rumah: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
    peta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
    buku: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z"/><path d="M4 19a2 2 0 012-2h13"/><path d="M9 7h6"/></svg>',
    orang: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2c3 .2 5.5 2.6 5.5 5.8"/></svg>',
    cari: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    tutup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    panah: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    kiri: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
    centang: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    awas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.01"/></svg>',
    salin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/></svg>',
    surat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.3 2.2 2.2 0 00.2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
    daun: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M60 108c-2-30 2-60 30-92-34 6-62 32-60 66 1 13 12 24 30 26z"/><path d="M60 108c4-26 12-48 26-72"/><path d="M48 88c8-6 15-8 24-8M44 70c9-4 18-5 30-3M50 52c8-2 17-1 28 2"/></svg>',
    ikan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12c3-4 7-6 11-6 3 0 5 2 7 6-2 4-4 6-7 6-4 0-8-2-11-6z"/><path d="M3 12l-1-3M3 12l-1 3"/><circle cx="16" cy="11" r=".9" fill="currentColor"/></svg>',
    sagu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22V9"/><path d="M12 9C10 5 6 4 3 5c3 1 6 2 9 4zM12 9c2-4 6-5 9-4-3 1-6 2-9 4zM12 9c-1-3-1-5 0-7 1 2 1 4 0 7z"/><path d="M10 22h4"/></svg>',
    burung: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14c2 0 4-1 5-3 1-3 3-5 6-5 2 0 3 1 4 2l2 1-2 1c0 4-3 8-8 8H6"/><path d="M9 18l-2 3M12 18l-1 3"/><path d="M15.5 8.2v.01"/></svg>',
    tunas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21v-9"/><path d="M12 12c0-4-3-7-8-7 0 5 3 7 8 7zM12 12c0-3 2-6 7-6 0 4-2 6-7 6z"/><path d="M5 21h14"/></svg>',
    minyak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18"/><path d="M6 21l2-12h8l2 12"/><path d="M5 7l9-3 5 3-9 3z"/><path d="M12 21v-6"/></svg>',
    pesawat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.5 13.5L3 11l1.5-1.5 8 1L17 6a1.8 1.8 0 012.5 2.5L15 13l1 8-1.5 1.5-2.5-7.5-3 3v2.5L7.5 22 6 18l-4-1.5L3.5 15H6z"/></svg>',
    istilah: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19V5l8 4 8-4v14l-8 4z"/><path d="M12 9v14"/></svg>'
  };
  var S24 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  IK.jejak = S24 + '<path d="M8.5 3C10.2 3 11 4.8 11 7s-.8 4-2.5 4S6 9.2 6 7s.8-4 2.5-4z"/><path d="M6.6 13.2h3.8v1.3a1.9 1.9 0 01-3.8 0z"/><path d="M15.5 9c1.7 0 2.5 1.8 2.5 4s-.8 4-2.5 4-2.5-1.8-2.5-4 .8-4 2.5-4z"/><path d="M13.6 19.2h3.8v.3a1.9 1.9 0 01-3.8 0z"/></svg>';
  IK.tombak = S24 + '<path d="M3.5 20.5l10-10"/><path d="M12.5 9.2l8-5.7-5.7 8z"/><path d="M5.5 15.5l3 3"/></svg>';
  IK.bibit = S24 + '<path d="M6.5 14h11l-1.6 7H8.1z"/><path d="M12 14V9.5"/><path d="M12 9.5C12 6.4 10 4.5 6.8 4.5c0 3.1 2 5 5.2 5zM12 11c0-2.6 1.8-4.6 5-4.6 0 2.6-1.8 4.6-5 4.6z"/></svg>';
  IK.noken = S24 + '<path d="M8.5 9V7a3.5 3.5 0 017 0v2"/><path d="M5 9h14l-1.6 10.6a1.6 1.6 0 01-1.6 1.4H8.2a1.6 1.6 0 01-1.6-1.4z"/><path d="M6.2 13l11.6 4.5M17.8 13L6.2 17.5"/></svg>';
  /* crocodile seen from above: long snout, four splayed legs, tapering tail */
  IK.buaya = S24 + '<path d="M22.5 12c0-.7-.8-1-2.2-1.1l-3.2-.3c-.6-.8-1.6-1.2-2.8-1.2h-1.6c-1.6-.4-3.6-.2-5.2.6-1.9.9-3.8 1.8-6.3 2 2.5.2 4.4 1.1 6.3 2 1.6.8 3.6 1 5.2.6h1.6c1.2 0 2.2-.4 2.8-1.2l3.2-.3c1.4-.1 2.2-.4 2.2-1.1z"/><path d="M12.8 9.6l1.3-2.4h1.5M12.8 14.4l1.3 2.4h1.5M8.4 9.9l-1-2.5H6M8.4 14.1l-1 2.5H6"/></svg>';
  IK.perahu = S24 + '<path d="M2 12.5h20c-2.4 3.4-17.6 3.4-20 0z"/><path d="M15.5 3l-4.2 12"/><path d="M14.8 2.2l2 .7-.8 2.5-2.1-.7z"/><path d="M2.5 20c1.6 0 1.6-1 3.2-1s1.6 1 3.2 1 1.6-1 3.2-1 1.6 1 3.2 1 1.6-1 3.2-1 1.6 1 3.2 1"/></svg>';
  IK.tifa = S24 + '<path d="M7.5 3h9c0 3.2-2.3 5.4-2.3 9s2.3 5.8 2.3 9h-9c0-3.2 2.3-5.4 2.3-9S7.5 6.2 7.5 3z"/><path d="M10.4 8.2h3.2M10.4 15.8h3.2"/></svg>';
  IK.toko = S24 + '<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0 2.7 2.7 0 005.3 0"/><path d="M5 11.5V20h14v-8.5"/><path d="M10 20v-5h4v5"/></svg>';
  IK.olahan = S24 + '<path d="M4 11h16v2.5a6.5 6.5 0 01-6.5 6.5h-3A6.5 6.5 0 014 13.5z"/><path d="M2 11h20"/><path d="M9 7.5c0-1.6 1-1.6 1-3.2M13.5 7.5c0-1.6 1-1.6 1-3.2"/></svg>';
  IK.kamera = S24 + '<path d="M3.5 8.5h3.2l1.6-2.2h7.4l1.6 2.2h3.2v11h-17z"/><circle cx="12" cy="13.6" r="3.6"/></svg>';
  IK.instagram = S24 + '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/></svg>';
  IK.kupu = S24 + '<path d="M12 8v9.5"/><path d="M12 10C10.6 6.6 7.2 4.6 5 5.5c-1.7.7-1.4 4 1.2 5.6-2 1-2.5 3.7-.8 4.8 1.9 1.2 5-.6 6.6-3.7"/><path d="M12 10c1.4-3.4 4.8-5.4 7-4.5 1.7.7 1.4 4-1.2 5.6 2 1 2.5 3.7.8 4.8-1.9 1.2-5-.6-6.6-3.7"/><path d="M12 8l-1.5-2.4M12 8l1.5-2.4"/></svg>';
  IK.pohon = S24 + '<path d="M12 21.2v-6.4M8.8 21.2h6.4"/><path d="M12 14.8c-4.4 0-7-2.3-7-5.1 0-2.2 1.6-3.8 3.6-4.2.6-1.9 1.9-2.8 3.4-2.8s2.8.9 3.4 2.8c2 .4 3.6 2 3.6 4.2 0 2.8-2.6 5.1-7 5.1z"/><path d="M12 14.8l-2.3-2.4M12 12.6l2.4-2.3"/></svg>';
  IK.kalender = S24 + '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.8h17M8 3v4M16 3v4"/><path d="M8.5 14h2M13.5 14h2M8.5 17.2h2"/></svg>';
  IK.hati = S24 + '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>';
  IK.unduh = S24 + '<path d="M12 4v11"/><path d="M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19.5h14"/></svg>';
  IK.pusat = S24 + '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  IK.bintang = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6l2.85 5.9 6.45.8-4.75 4.5 1.25 6.45L12 17.1l-5.8 3.15 1.25-6.45L2.7 9.3l6.45-.8z"/></svg>';
  IK.jam = S24 + '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
  var IKON_KAT = { kuliner: 'ikan', pangan: 'sagu', alam: 'burung', agro: 'tunas', sejarah: 'minyak', budaya: 'tifa', produk: 'toko' };
  function ikonKat(k) { return IK[IKON_KAT[k] || 'peta']; }
  function ikonE(e) { return (e && IK[e.ikon]) || ikonKat(e && e.kategori); }

  /* noken net pattern (inline SVG, inherits currentColor) */
  var POLA_NOKEN = '<svg class="jaring" width="100%" height="100%" aria-hidden="true"><defs><pattern id="noken-pola" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M0 14L14 0L28 14L14 28Z" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="14" cy="0" r="1.8" fill="currentColor"/><circle cx="0" cy="14" r="1.8" fill="currentColor"/><circle cx="28" cy="14" r="1.8" fill="currentColor"/><circle cx="14" cy="28" r="1.8" fill="currentColor"/></pattern></defs><rect width="100%" height="100%" fill="url(#noken-pola)"/></svg>';
  function pola(cls) { return POLA_NOKEN.replace('class="jaring"', 'class="' + (cls || 'pola') + '"').replace(/noken-pola/g, 'np' + Math.random().toString(36).slice(2, 7)); }

  /* ------------------------------------------------------------ search index */
  var INDEKS = [];
  function bangunIndeks() {
    INDEKS = [];
    function f(w, arr) { return { w: w, n: ' ' + norm(arr.filter(Boolean).join(' ')) + ' ' }; }
    function both(o) { return o ? [o.id, o.en].map(function (x) { return Array.isArray(x) ? x.join(' ') : x; }) : []; }
    TANAMAN.forEach(function (p) {
      var keg = [];
      p.kegunaan.forEach(function (k) { keg.push(TEKS.id['keg.' + k], TEKS.en['keg.' + k]); });
      INDEKS.push({ tipe: 'tanaman', id: p.id, href: '#t-' + p.id, obj: p,
        f: [f(10, [p.nama, p.alias, p.moi, p.lokal, p.latin, p.gloss]), f(6, keg), f(4, both(p.ringkas)), f(1, both(p.deskripsi).concat(both(p.pengolahan)))],
        judulWords: norm([p.nama, p.alias, p.moi, p.lokal, p.latin, p.gloss].join(' ')).split(' ') });
    });
    BAB.forEach(function (b) {
      var teks = []; b.blok.forEach(function (x) { if (x.p) teks.push(x.p.id, x.p.en); });
      INDEKS.push({ tipe: 'bab', id: b.id, href: '#p-' + b.id, obj: b, f: [f(10, both(b.judul)), f(4, both(b.ringkas)), f(1, teks)], judulWords: norm(both(b.judul).join(' ')).split(' ') });
    });
    KAMUS.forEach(function (k) {
      INDEKS.push({ tipe: 'istilah', id: k.id, href: '#k-' + k.id, obj: k, f: [f(12, [k.istilah, k.alias]), f(3, both(k.arti))], judulWords: norm(k.istilah + ' ' + k.alias).split(' ') });
    });
    ARTIKEL.forEach(function (a) {
      INDEKS.push({ tipe: 'artikel', id: a.id, href: '#a-' + a.id, obj: a, f: [f(10, both(a.judul)), f(4, both(a.ringkas)), f(1, both(a.isi))], judulWords: norm(both(a.judul).join(' ')).split(' ') });
    });
    PENGALAMAN.forEach(function (e) {
      INDEKS.push({ tipe: 'pengalaman', id: e.id, href: '#x-' + e.id, obj: e,
        f: [f(10, [e.kampung].concat(both(e.judul))), f(5, [TEKS.id['kat.' + e.kategori], TEKS.en['kat.' + e.kategori]]), f(3, both(e.ringkas).concat(both(e.aktivitas)))],
        judulWords: norm(e.kampung + ' ' + both(e.judul).join(' ')).split(' ') });
    });
  }
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    var d = []; for (var i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (var j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function cari(q, tipe) {
    var tok = norm(q).split(' ').filter(function (x) { return x.length > 0; });
    if (!tok.length) return [];
    var hasil = [];
    INDEKS.forEach(function (e) {
      if (tipe && tipe !== 'semua' && e.tipe !== tipe) return;
      var total = 0;
      for (var i = 0; i < tok.length; i++) {
        var w = tok[i], best = 0;
        e.f.forEach(function (fl) {
          var s = 0;
          if (fl.n.indexOf(' ' + w + ' ') > -1) s = fl.w * 3;
          else if (fl.n.indexOf(' ' + w) > -1) s = fl.w * 2;
          else if (w.length >= 3 && fl.n.indexOf(w) > -1) s = fl.w;
          if (s > best) best = s;
        });
        if (!best && w.length >= 4) {
          if (!e.kataFuzzy) {
            var kumpulan = {};
            e.judulWords.concat((e.f[1] ? e.f[1].n : '').split(' ')).forEach(function (x) { if (x.length >= 4) kumpulan[x] = 1; });
            e.kataFuzzy = Object.keys(kumpulan);
          }
          e.kataFuzzy.forEach(function (jw) { if (lev(w, jw) <= (w.length >= 7 ? 2 : 1)) best = Math.max(best, 8); });
        }
        if (!best) return;
        total += best;
      }
      if (e.f[0].n.indexOf(' ' + norm(q) + ' ') > -1) total += 20;
      hasil.push({ e: e, s: total });
    });
    hasil.sort(function (a, b) { return b.s - a.s; });
    return hasil;
  }
  function cuplikan(teks, q) {
    var tok = norm(q).split(' ').filter(function (x) { return x.length > 2; });
    var low = teks.toLowerCase(), pos = -1;
    for (var i = 0; i < tok.length && pos < 0; i++) pos = low.indexOf(tok[i]);
    var awal = Math.max(0, pos - 50), s = teks.slice(awal, awal + 170);
    var h = esc((awal > 0 ? '…' : '') + s.replace(/\*/g, '') + (awal + 170 < teks.length ? '…' : ''));
    tok.forEach(function (w) { h = h.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
    return h;
  }
  function tandai(teks, q) {
    var h = esc(teks);
    norm(q).split(' ').filter(function (x) { return x.length > 1; }).forEach(function (w) {
      h = h.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
    });
    return h;
  }
  function teksPanjang(e) {
    var o = e.obj;
    if (e.tipe === 'tanaman') return L(o.deskripsi).join(' ') + ' ' + L(o.pengolahan).join(' ');
    if (e.tipe === 'bab') return o.blok.filter(function (b) { return b.p; }).map(function (b) { return L(b.p); }).join(' ');
    if (e.tipe === 'istilah') return L(o.arti);
    if (e.tipe === 'artikel') return L(o.isi).join(' ');
    return L(o.ringkas) + ' ' + L(o.aktivitas).join(' ');
  }
  function judulHasil(e) {
    var o = e.obj;
    if (e.tipe === 'tanaman') return { j: o.nama, s: [o.latin, o.moi ? 'Moi: ' + o.moi : ''].filter(Boolean).join(', ') };
    if (e.tipe === 'bab') return { j: L(o.judul), s: t('bab.' + o.kategori) };
    if (e.tipe === 'istilah') return { j: o.istilah, s: o.alias };
    if (e.tipe === 'artikel') return { j: L(o.judul), s: t('art.' + o.kategori) };
    return { j: L(o.judul), s: 'Kampung ' + o.kampung };
  }

  /* ------------------------------------------------------------ toast, copy */
  var rotiTimer;
  function roti(pesan) {
    var el = $('.roti'); if (el) el.remove();
    el = document.createElement('div'); el.className = 'roti'; el.setAttribute('role', 'status'); el.textContent = pesan;
    document.body.appendChild(el); clearTimeout(rotiTimer); rotiTimer = setTimeout(function () { el.remove(); }, 2600);
  }
  function salin(teks, ok, sumberEl) {
    function cadangan() {
      if (sumberEl && sumberEl.select) { sumberEl.focus(); sumberEl.select(); }
      roti(t('gagalSalin'));
    }
    try {
      navigator.clipboard.writeText(teks).then(function () { roti(ok); }, cadangan);
    } catch (e) { cadangan(); }
  }

  /* ------------------------------------------------------------ overlay (modal) */
  var Lapis = {
    el: null, lastFocus: null, onClose: null,
    buka: function (html, kelas, opsi) {
      opsi = opsi || {};
      var sudahBuka = !!this.el;
      if (!sudahBuka) { this.lastFocus = document.activeElement; }
      if (this.el) this.el.remove();
      var wadah = document.createElement('div');
      wadah.className = 'lapis' + (opsi.cari ? ' cari' : '');
      if (sudahBuka) wadah.style.animation = 'none';
      wadah.innerHTML = html;
      document.body.appendChild(wadah);
      this.el = wadah; this.onClose = opsi.onClose || null; this.jenis = opsi.jenis || '';
      document.documentElement.style.overflow = 'hidden';
      var self = this;
      wadah.addEventListener('mousedown', function (ev) { if (ev.target === wadah) self.minta(); });
      $$('[data-tutup]', wadah).forEach(function (b) { b.addEventListener('click', function () { self.minta(); }); });
      var fokus = opsi.fokus ? $(opsi.fokus, wadah) : $('.lembar, .kotak-cari', wadah);
      if (fokus) { if (!fokus.hasAttribute('tabindex') && !/INPUT|BUTTON|A|SELECT|TEXTAREA/.test(fokus.tagName)) fokus.setAttribute('tabindex', '-1'); fokus.focus({ preventScroll: true }); }
      if (!sudahBuka && fokus && fokus.scrollTop !== undefined) fokus.scrollTop = 0;
      return wadah;
    },
    minta: function () { if (this.onClose) this.onClose(); else this.tutup(); },
    tutup: function () {
      if (!this.el) return;
      this.el.remove(); this.el = null; this.onClose = null; this.jenis = '';
      document.documentElement.style.overflow = '';
      if (this.lastFocus && this.lastFocus.focus && document.contains(this.lastFocus)) this.lastFocus.focus({ preventScroll: true });
    }
  };
  document.addEventListener('keydown', function (ev) {
    if (!Lapis.el) return;
    if (ev.key === 'Escape') { ev.preventDefault(); Lapis.minta(); return; }
    if (ev.key === 'Tab') {
      var f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', Lapis.el).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === a) { ev.preventDefault(); z.focus(); }
      else if (!ev.shiftKey && document.activeElement === z) { ev.preventDefault(); a.focus(); }
    }
  });

  /* ------------------------------------------------------------ routing */
  var kunciHalaman = null, navDalam = 0, modalDariNav = false;
  function parse(h) {
    h = decodeURIComponent((h || '').replace(/^#/, ''));
    var m;
    if (!h || h === 'beranda') return { page: 'beranda' };
    if (h === 'jelajah') return { page: 'jelajah' };
    if ((m = h.match(/^x-(.+)$/))) return { page: 'jelajah', sel: m[1] };
    if ((m = h.match(/^kampung-(.+)$/))) return { page: 'jelajah', kampung: m[1] };
    if ((m = h.match(/^pesan-(.+)$/))) return { page: 'jelajah', sel: m[1], pesan: true };
    if (h === 'pesan') return { page: 'jelajah', pesan: true };
    if (h === 'pustaka' || h === 'tanaman') return { page: 'pustaka', tab: 'tanaman' };
    if (h === 'pengetahuan') return { page: 'pustaka', tab: 'pengetahuan' };
    if (h === 'kamus') return { page: 'pustaka', tab: 'kamus' };
    if (h === 'kisah') return { page: 'pustaka', tab: 'kisah' };
    if (h === 'buku') return { page: 'pustaka', tab: 'buku' };
    if ((m = h.match(/^buku-([a-z0-9-]+?)(?:\/(\d+))?$/))) return { page: 'pustaka', tab: 'buku', buku: m[1], hal: Math.max(1, parseInt(m[2] || '1', 10)) };
    if ((m = h.match(/^t-(.+)$/))) return { page: 'pustaka', tab: 'tanaman', modal: 't', id: m[1] };
    if ((m = h.match(/^p-(.+)$/))) return { page: 'pustaka', tab: 'pengetahuan', modal: 'p', id: m[1] };
    if ((m = h.match(/^k-(.+)$/))) return { page: 'pustaka', tab: 'kamus', modal: 'k', id: m[1] };
    if ((m = h.match(/^a-(.+)$/))) return { page: 'pustaka', tab: 'kisah', modal: 'a', id: m[1] };
    if (h === 'tentang') return { page: 'tentang' };
    return { page: 'beranda' };
  }
  function pergi(hash, ganti) {
    if (ganti) { try { history.replaceState(null, '', hash); } catch (e) { location.replace(hash); return; } rute(); }
    else if (location.hash === hash) rute();
    else location.hash = hash;
  }
  function tutupRute(dasar) {
    if (modalDariNav && navDalam > 0) { modalDariNav = false; history.back(); }
    else pergi('#' + dasar, true);
  }
  var ruteSebelum = null;
  function rute(paksa) {
    var r = parse(location.hash);
    var kunci = r.page + (r.page === 'pustaka' ? ':' + r.tab + (r.buku ? ':' + r.buku : '') : '') + ':' + lang;
    var halamanBaru = paksa || kunci !== kunciHalaman;
    if (halamanBaru) {
      if (r.page !== 'jelajah') Peta.lepas();
      renderHalaman(r);
      kunciHalaman = kunci;
      if (!r.sel && !r.kampung && !paksa) window.scrollTo(0, 0);
    }
    // modals
    if (r.modal) {
      modalDariNav = !!(ruteSebelum && !ruteSebelum.modal && navDalam > 0) || (modalDariNav && ruteSebelum && ruteSebelum.modal);
      bukaModal(r);
    } else if (r.pesan) {
      modalDariNav = !!(ruteSebelum && navDalam > 0);
      Pesan.buka(r.sel, halamanBaru);
    } else if (Lapis.el && Lapis.jenis !== 'cari') {
      Lapis.tutup();
    }
    if (r.page === 'jelajah') { Peta.pilih(r.sel || null); if (r.kampung) Peta.keKampung(r.kampung); else Peta.sorotKampung(''); }
    if (r.page === 'pustaka' && r.tab === 'buku' && r.buku) Buku.ke(r.hal);
    perbaruiNav(r);
    ruteSebelum = r;
  }
  window.addEventListener('hashchange', function () { navDalam++; rute(); });

  /* ------------------------------------------------------------ chrome */
  function perbaruiNav(r) {
    $$('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === r.page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function renderChrome() {
    document.documentElement.lang = lang;
    var kepala = $('#kepala');
    kepala.innerHTML =
      '<div class="wrap">' +
      '<a class="merek" href="#beranda" aria-label="' + esc(t('merek.nama')) + ', ' + esc(t('nav.beranda')) + '">' + logoSVG() + '<span><b>' + esc(t('merek.nama')) + '</b><small>' + esc(t('merek.sub')) + '</small></span></a>' +
      '<nav class="nav-atas" aria-label="Menu">' +
      '<a href="#beranda" data-nav="beranda">' + esc(t('nav.beranda')) + '</a>' +
      '<a href="#jelajah" data-nav="jelajah">' + esc(t('nav.jelajahPanjang')) + '</a>' +
      '<a href="#pustaka" data-nav="pustaka">' + esc(t('nav.pustaka')) + '</a>' +
      '<a href="#tentang" data-nav="tentang">' + esc(t('nav.tentangPanjang')) + '</a></nav>' +
      '<button class="tombol-ikon tombol-cari" type="button" data-buka-cari aria-label="' + esc(t('cari')) + '">' + IK.cari + '<span class="label">' + esc(t('cari')) + '</span><kbd>/</kbd></button>' +
      '<div class="bahasa" role="group" aria-label="Bahasa / Language"><button type="button" data-lang="id" aria-pressed="' + (lang === 'id') + '">ID</button><button type="button" data-lang="en" aria-pressed="' + (lang === 'en') + '">EN</button></div>' +
      '</div>';
    $('#nav-bawah').innerHTML =
      '<a href="#beranda" data-nav="beranda">' + IK.rumah + '<span>' + esc(t('nav.beranda')) + '</span></a>' +
      '<a href="#jelajah" data-nav="jelajah">' + IK.peta + '<span>' + esc(t('nav.jelajah')) + '</span></a>' +
      '<a href="#pustaka" data-nav="pustaka">' + IK.buku + '<span>' + esc(t('nav.pustaka')) + '</span></a>' +
      '<a href="#tentang" data-nav="tentang">' + IK.orang + '<span>' + esc(t('nav.tentang')) + '</span></a>';
    $('#kaki').classList.add('berombak');
    $('#kaki').innerHTML =
      '<div class="wrap">' +
      '<div><h2>' + esc(t('merek.nama')) + '</h2><p style="margin-top:10px;max-width:46ch">' + esc(t('kaki.tentang')) + '</p></div>' +
      '<div><div class="judul-kecil">' + esc(t('kaki.jelajahi')) + '</div><ul>' +
      '<li><a href="#jelajah">' + esc(t('nav.jelajahPanjang')) + '</a></li><li><a href="#tanaman">' + esc(t('tab.tanaman')) + '</a></li><li><a href="#pengetahuan">' + esc(t('tab.pengetahuan')) + '</a></li><li><a href="#kamus">' + esc(t('tab.kamus')) + '</a></li><li><a href="#kisah">' + esc(t('tab.kisah')) + '</a></li><li><a href="#tentang">' + esc(t('nav.tentangPanjang')) + '</a></li></ul></div>' +
      '<div><div class="judul-kecil">' + esc(t('kaki.kontak')) + '</div><ul class="kaki-kontak">' +
      (waTujuan() ? '<li><span class="kecil">' + esc(t('kontak.wisataJudul')) + '</span><a class="ig-kecil" href="' + esc(tautanWA(t('kontak.tanyaUmum', { k: namaKontak() }))) + '" target="_blank" rel="noopener">' + IK.wa + 'WhatsApp ' + esc(formatWA(waTujuan())) + '</a></li>' : '') +
      '<li><span class="kecil">' + esc(t('kontak.tulisanJudul')) + '</span><a href="mailto:' + esc(EMAIL) + '">' + esc(EMAIL) + '</a>' +
      (namaIG(CFG.instagram) ? '<a class="ig-kecil" href="' + esc(tautanIG(namaIG(CFG.instagram))) + '" target="_blank" rel="noopener">' + IK.instagram + 'Instagram @' + esc(namaIG(CFG.instagram)) + '</a>' : '') + '</li>' +
      '<li>Distrik Klamono, Kabupaten Sorong, Papua Barat Daya</li></ul></div>' +
      '<p class="hak">' + esc(t('kaki.hak')) + '</p></div>';
    // language banner for visitors whose browser is not Indonesian (once)
    var sp = $('#spanduk');
    var bLang = (navigator.language || 'id').slice(0, 2);
    var tampil = !simpan.get('klm-spanduk') && ((lang === 'id' && bLang !== 'id') || (lang === 'en' && bLang === 'id' && false));
    sp.hidden = !tampil;
    if (tampil) {
      sp.innerHTML = '<div class="wrap"><span>' + esc(t('spanduk')) + '</span><button type="button" data-lang="' + (lang === 'id' ? 'en' : 'id') + '">' + esc(t('spandukBtn')) + '</button><button type="button" data-tutup-spanduk aria-label="' + esc(t('tutup')) + '">×</button></div>';
    }
  }
  function logoSVG() {
    // noken knot mark: diamond mesh with a knot
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#1F3B26"/><path d="M5 16L16 5l11 11-11 11z" fill="none" stroke="#B6D167" stroke-width="1.6"/><path d="M10.5 10.5l11 11M21.5 10.5l-11 11" stroke="#B6D167" stroke-width="1.6"/><circle cx="16" cy="16" r="3.2" fill="#B6D167"/></svg>';
  }
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-lang]');
    if (b) { gantiBahasa(b.getAttribute('data-lang')); return; }
    if (ev.target.closest('[data-buka-cari]')) { Cari.buka(); return; }
    if (ev.target.closest('[data-tutup-spanduk]')) { simpan.set('klm-spanduk', '1'); $('#spanduk').hidden = true; return; }
    var c = ev.target.closest('[data-salin]');
    if (c) { salin(c.getAttribute('data-salin'), c.getAttribute('data-ok') || t('disalin')); }
  });
  document.addEventListener('keydown', function (ev) {
    if (Lapis.el) return;
    var tag = (ev.target.tagName || '').toLowerCase();
    if ((ev.key === '/' && !/input|textarea|select/.test(tag)) || ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k')) { ev.preventDefault(); Cari.buka(); }
  });
  function gantiBahasa(l) {
    if (l !== 'id' && l !== 'en') return;
    lang = l; simpan.set('klm-bahasa', l);
    var y = window.scrollY;
    renderChrome();
    var lapisJenis = Lapis.el ? Lapis.jenis : '';
    rute(true);
    if (lapisJenis === 'cari') Cari.buka(true);
    window.scrollTo(0, y);
  }

  /* ------------------------------------------------------------ shared pieces */
  function fotoAtauKosong(src, alt, lazy) {
    if (src) return '<img src="' + esc(src) + '" alt="' + esc(alt) + '"' + (lazy === false ? '' : ' loading="lazy"') + ' decoding="async">';
    return '<div class="tanpa-foto">' + IK.daun + '<span>' + esc(t('fotoMenyusul')) + '</span></div>';
  }
  function kartuTanaman(p, besar, q) {
    var tags = p.kegunaan.slice(0, 2).map(function (k) { return '<span class="tag' + (k === 'adat' ? ' merah' : '') + '">' + esc(t('keg.' + k)) + '</span>'; }).join('');
    return '<a class="herbarium' + (besar ? ' besar' : '') + '" href="#t-' + esc(p.id) + '">' +
      '<div class="foto">' + fotoAtauKosong(p.foto, p.nama) + '</div>' +
      '<div class="label">' + (besar ? '<span class="no">' + esc(t('home.tanamanHari')) + '</span>' : '<span class="no tnum">' + esc(t('no')) + ' ' + String(p.no).padStart(2, '0') + '</span>') +
      '<h3>' + (q ? tandai(p.nama, q) : esc(p.nama)) + '</h3>' +
      (p.latin ? '<span class="latin">' + esc(p.latin) + '</span>' : '') +
      (p.moi ? '<span class="moi">Moi: <b>' + (q ? tandai(p.moi, q) : esc(p.moi)) + '</b></span>' : (lang === 'en' && p.gloss ? '<span class="moi">' + esc(p.gloss) + '</span>' : '')) +
      '<p class="ringkas">' + esc(L(p.ringkas)) + '</p>' +
      '<div class="tags">' + tags + '</div></div></a>';
  }
  /* a stable gradient for each card without a photo (picked from the id) */
  var GRADASI = [['#1F3B26', '#6F9A3A'], ['#2E5536', '#B6D167'], ['#14281A', '#3F7A5C'], ['#4A3B1E', '#C98A3A'], ['#5B2A22', '#C46A4F'], ['#1E3A3A', '#4E9A8F']];
  function gradasiUntuk(id) { var h = 0; String(id).split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) >>> 0; }); var g = GRADASI[h % GRADASI.length]; return '--g1:' + g[0] + ';--g2:' + g[1]; }
  function kartuBab(b) {
    var sampul = b.sampul ? '<img src="' + esc(b.sampul) + '" alt="" loading="lazy">' : pola('pola') + '<span class="huruf" aria-hidden="true">' + esc(L(b.judul).charAt(0)) + '</span>';
    return '<a class="kartu-bab" href="#p-' + esc(b.id) + '"><div class="sampul' + (b.sampul ? '' : ' gradasi') + '" style="' + gradasiUntuk(b.id) + '">' + sampul + '</div><div class="isi">' +
      '<div class="meta"><span class="tag daun">' + esc(t('bab.' + b.kategori)) + '</span><span>' + esc(t('menitBaca', { m: menitBaca(b) })) + '</span></div>' +
      '<h3>' + esc(L(b.judul)) + '</h3><p>' + esc(L(b.ringkas)) + '</p></div></a>';
  }
  function kartuArtikel(a) {
    return '<a class="kartu-bab" href="#a-' + esc(a.id) + '"><div class="sampul' + (a.foto ? '' : ' gradasi') + '" style="' + gradasiUntuk(a.id) + '">' + (a.foto ? '<img src="' + esc(a.foto) + '" alt="" loading="lazy">' : pola('pola') + '<span class="huruf ikon" aria-hidden="true">' + IK.buku + '</span>') + '</div><div class="isi">' +
      '<div class="meta"><span class="tag daun">' + esc(t('art.' + a.kategori)) + '</span><span class="tnum">' + esc(tanggal(a.tanggal)) + '</span></div>' +
      '<h3>' + esc(L(a.judul)) + '</h3><p>' + esc(L(a.ringkas)) + '</p></div></a>';
  }
  function menitBaca(b) {
    var n = 0; b.blok.forEach(function (x) { if (x.p) n += L(x.p).split(/\s+/).length; });
    return Math.max(1, Math.round(n / 200));
  }
  function tanggal(s) {
    if (!s) return '';
    try { var d = new Date(s + 'T00:00:00'); return d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return s; }
  }
  function cariPengalaman(id) { for (var i = 0; i < PENGALAMAN.length; i++) if (PENGALAMAN[i].id === id) return PENGALAMAN[i]; return null; }
  function cariKampung(id) { for (var i = 0; i < KAMPUNG.length; i++) if (KAMPUNG[i].id === id) return KAMPUNG[i]; return null; }
  /* WhatsApp: tourists chat with the district operator once that number is set, otherwise with the official team number.
     The operator passes each request on to the person in charge in the village. */
  function waTujuan() { return String(CFG.whatsappOperator || CFG.whatsappTim || '').replace(/\D/g, ''); }
  function namaKontak() { return CFG.whatsappOperator ? (L(CFG.namaOperator) || t('kontak.operator')) : t('kontak.resmi'); }
  function formatWA(n) {
    var d = String(n || '').replace(/\D/g, ''); if (!d) return '';
    return d.indexOf('62') === 0 ? '+62 ' + d.slice(2).replace(/^(\d{3})(\d{4})(\d+)$/, '$1-$2-$3') : '+' + d;
  }
  function tautanWA(teks, nomor) {
    var n = String(nomor || waTujuan()).replace(/\D/g, '');
    return n ? 'https://wa.me/' + n + (teks ? '?text=' + encodeURIComponent(teks) : '') : '';
  }
  function pengalamanDi(kid) { return PENGALAMAN.filter(function (e) { return e.kampungId === kid; }); }
  function kampungAktif() { return KAMPUNG.filter(function (k) { return pengalamanDi(k.id).length > 0; }); }
  function katDipakai() { return URUT_KAT.filter(function (k) { return PENGALAMAN.some(function (e) { return e.kategori === k; }); }); }
  /* Instagram account of an experience: accepts 'nama', '@nama' or a full link */
  function akunIG(e) { return namaIG(e && e.instagram); }
  function namaIG(v) {
    var a = String(v || '').trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^[@\uFF20]/, '').replace(/[\/?#].*$/, '');
    return /^[A-Za-z0-9._]{1,30}$/.test(a) ? a : '';
  }
  function tautanIG(a) { return 'https://www.instagram.com/' + a + '/'; }
  function jumlahTeks(n) { return n === 1 ? t('jalur.n1') : t('jalur.n', { n: n }); }

  /* ---------- base map data (konten/peta.js): encoded polylines, settlement cells, place names */
  function dekode(s) {
    var out = [], i = 0, la = 0, lo = 0;
    while (i < s.length) {
      var v = [0, 0];
      for (var k = 0; k < 2; k++) {
        var sh = 0, r = 0, b;
        do { b = s.charCodeAt(i++) - 63; r |= (b & 31) << sh; sh += 5; } while (b >= 32 && i < s.length);
        v[k] = (r & 1) ? ~(r >> 1) : (r >> 1);
      }
      la += v[0]; lo += v[1]; out.push([la / 1e5, lo / 1e5]);
    }
    return out;
  }
  var DASAR = null;
  function petaDasar() {
    if (DASAR) return DASAR;
    var pd = KLM.petaDasar || {}, garis = [];
    String(pd.garis || '').split(' ').forEach(function (g) { if (g.length > 2) garis.push({ j: g.charAt(0), p: dekode(g.slice(1)) }); });
    var bangunan = String(pd.bangunan || '').split(';').filter(Boolean).map(function (c) { var a = c.split(','); return [Number(a[0]) * 0.0015, Number(a[1]) * 0.0015, Number(a[2]) || 1]; });
    DASAR = { garis: garis, bangunan: bangunan, label: pd.label || [], keSorong: pd.keSorong || null };
    return DASAR;
  }

  /* ---------- decorative contour lines for the featured band */
  var KONTUR = null;
  function polaKontur() {
    if (KONTUR) return KONTUR;
    var d = '';
    [[0.8, 0.28, 0], [0.08, 0.92, 2.1]].forEach(function (c) {
      for (var n = 1; n <= 10; n++) {
        var r0 = n * 44, titik = [];
        for (var s = 0; s < 72; s++) {
          var a = s / 72 * Math.PI * 2;
          var r = r0 * (1 + 0.15 * Math.sin(3 * a + c[2] + n * 0.32) + 0.07 * Math.sin(5 * a + n * 0.55) + 0.05 * Math.cos(2 * a - c[2]));
          titik.push((c[0] * 1200 + r * Math.cos(a) * 1.3).toFixed(0) + ' ' + (c[1] * 600 + r * Math.sin(a)).toFixed(0));
        }
        d += 'M' + titik.join('L') + 'Z';
      }
    });
    KONTUR = '<svg class="kontur" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="' + d + '"/></svg>';
    return KONTUR;
  }

  /* ---------- featured experience band */
  /* "Atraksi": an experience's main attractions, as cards (featured band) or compact chips (map card) */
  function hAtraksi(e, gaya) {
    var aa = (e && e.atraksi) || []; if (!aa.length) return '';
    function ikon(a) { return IK[a.ikon] || ikonE(e); }
    if (gaya === 'kartu') return '<div class="atraksi-mini"><b>' + esc(t('kartu.atraksi')) + '</b><ul>' + aa.map(function (a) { return '<li>' + ikon(a) + '<span>' + esc(L(a.judul)) + '</span></li>'; }).join('') + '</ul></div>';
    return '<div class="unggulan-atraksi"><h3>' + esc(t('kartu.atraksi')) + '</h3><ul>' + aa.map(function (a) {
      return '<li><span class="ikon-atraksi" aria-hidden="true">' + ikon(a) + '</span><div><b>' + esc(L(a.judul)) + '</b>' + (L(a.ket) ? '<span>' + esc(L(a.ket)) + '</span>' : '') + '</div></li>';
    }).join('') + '</ul></div>';
  }
  function hUnggulan(lengkap) {
    var e = UNGGULAN; if (!e) return '';
    var u = e.unggulan || {}, fakta = u.fakta || [], sorotan = L(u.sorotan) || [], ket = L(u.fotoKet), idJ = 'ung-' + (lengkap ? 'j' : 'b');
    var gambar = e.foto ? '<img src="' + esc(e.foto) + '" alt="' + esc(ket || L(e.judul)) + '" loading="lazy">' : '<div class="ilustrasi">' + pola('pola') + ikonE(e).replace('<svg ', '<svg class="ik" ') + '</div>';
    return '<section class="unggulan berombak' + (lengkap ? ' lengkap' : '') + '" aria-labelledby="' + idJ + '">' + polaKontur() +
      '<div class="wrap unggulan-tata">' +
      '<figure class="unggulan-foto"><div class="bingkai-foto">' + gambar + '</div>' +
      (ket ? '<figcaption>' + esc(ket) + '</figcaption>' : '') + '</figure>' +
      '<div class="unggulan-kata">' +
      '<p class="unggulan-atas">' + IK.bintang + '<span>' + esc(t('ung.label')) + ' · Kampung ' + esc(e.kampung) + '</span></p>' +
      '<h2 id="' + idJ + '">' + esc(L(e.judul)) + '</h2>' +
      '<p class="unggulan-ringkas">' + esc(L(e.ringkas)) + '</p>' +
      (fakta.length ? '<ul class="unggulan-fakta" style="--n:' + fakta.length + ';--n-hp:' + (fakta.length <= 3 ? fakta.length : 2) + '">' + fakta.map(function (f) { return '<li><b>' + esc(L(f.angka)) + '</b><span>' + esc(L(f.ket)) + '</span></li>'; }).join('') + '</ul>' : '') +
      (lengkap && sorotan.length ? '<div class="unggulan-sorotan"><h3>' + esc(t('ung.sorotan')) + '</h3><ul>' + sorotan.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' : '') +
      (lengkap && L(u.bawa) ? '<p class="unggulan-bawa"><b>' + esc(t('ung.bawa')) + ':</b> ' + esc(L(u.bawa)) + '</p>' : '') +
      '<div class="aksi"><a class="tombol" href="#pesan-' + esc(e.id) + '">' + esc(e.status === 'buka' ? t('ung.pesan') : t('kartu.minat')) + IK.panah + '</a>' +
      '<a class="tombol sekunder" href="#x-' + esc(e.id) + '">' + IK.peta + esc(t('ung.peta')) + '</a></div>' +
      (akunIG(e) ? '<a class="tautan-ig" href="' + esc(tautanIG(akunIG(e))) + '" target="_blank" rel="noopener">' + IK.instagram + '<span>' + esc(t('ig.ikuti')) + ' <b>@' + esc(akunIG(e)) + '</b></span></a>' : '') +
      (lengkap && fakta.length ? '<p class="unggulan-catatan">' + esc(t('ung.catatanAngka')) + '</p>' : '') +
      '</div>' + hAtraksi(e, 'band') + '</div></section>';
  }

  /* ---------- village line (home): west → east, like stations on a noken thread */
  function hJalurKampung() {
    var kk = kampungAktif();
    return '<ol class="jalur-kampung" style="--n:' + kk.length + '">' + kk.map(function (k) {
      var ee = pengalamanDi(k.id), unggul = !!(UNGGULAN && UNGGULAN.kampungId === k.id);
      return '<li class="stasiun' + (unggul ? ' unggul' : '') + '"><span class="titik" aria-hidden="true">' + (unggul ? IK.bintang : '') + '</span>' +
        '<div class="stasiun-isi"><a class="stasiun-nama" href="#kampung-' + esc(k.id) + '">' + esc(k.nama) + '</a>' +
        '<span class="jumlah">' + esc(jumlahTeks(ee.length)) + (unggul ? ' · <b>' + esc(t('ung.lencana')) + '</b>' : '') + '</span>' +
        '<ul class="ikon-ikon">' + ee.map(function (e) {
          return '<li><a class="ikon-mini' + (e === UNGGULAN ? ' unggul' : '') + '" href="#x-' + esc(e.id) + '" style="--w:' + warnaKat(e.kategori) + '" title="' + esc(L(e.judul)) + '">' +
            '<span class="bulat">' + ikonE(e) + '</span><span class="teks">' + esc(L(e.judul)) + '</span></a></li>';
        }).join('') + '</ul></div></li>';
    }).join('') + '</ol>';
  }

  /* ------------------------------------------------------------ pages */
  function renderHalaman(r) {
    var main = $('#isi');
    if (r.page === 'beranda') main.innerHTML = hBeranda();
    else if (r.page === 'jelajah') main.innerHTML = hJelajah();
    else if (r.page === 'pustaka') main.innerHTML = hPustaka(r.tab, r);
    else if (r.page === 'tentang') main.innerHTML = hTentang();
    if (r.page === 'beranda') ikatBeranda();
    if (r.page === 'jelajah') ikatJelajah();
    if (r.page === 'pustaka') ikatPustaka(r.tab, r);
    var judul = { beranda: 'Klamono', jelajah: t('jelajah.judul'), pustaka: t('pustaka.judul'), tentang: t('tentang.judul') }[r.page];
    document.title = r.page === 'beranda' ? t('judul.beranda') : judul + ' · Jelajah Klamono';
  }

  function tanamanHariIni() {
    var berfoto = TANAMAN.filter(function (p) { return p.foto; });
    if (!berfoto.length) return TANAMAN[0];
    var d = new Date(), awal = new Date(d.getFullYear(), 0, 0);
    return berfoto[Math.floor((d - awal) / 864e5) % berfoto.length];
  }
  function hBeranda() {
    var p = tanamanHariIni();
    return '' +
      '<section class="hero"><div class="wrap">' +
      '<div class="hero-kata"><p class="hero-atas"><span class="titik" aria-hidden="true"></span>' + esc(t('hero.atas')) + '</p><h1 class="hero-merek">Klamono</h1>' +
      '<p class="hero-tag">' + esc(t('hero.tag')) + '</p><p class="hero-sub">' + esc(t('hero.sub')) + '</p>' +
      '<div class="aksi"><a class="tombol" href="#jelajah">' + IK.peta + esc(t('hero.cta1')) + '</a><a class="tombol sekunder" href="#pustaka">' + IK.buku + esc(t('hero.cta2')) + '</a></div>' +
      '<dl class="hero-angka"><div><dt>' + kampungAktif().length + '</dt><dd>' + esc(t('hero.angkaKampung')) + '</dd></div><div><dt>' + PENGALAMAN.length + '</dt><dd>' + esc(t('hero.angkaPengalaman')) + '</dd></div><div><dt>' + TANAMAN.length + '</dt><dd>' + esc(t('hero.angkaTanaman')) + '</dd></div></dl></div>' +
      '<figure class="hero-foto"><img src="assets/img/foto/koba-koba-warga.jpg" alt="' + esc(t('hero.alt')) + '" width="759" height="739" fetchpriority="high"><figcaption>' + esc(t('hero.foto')) + '</figcaption></figure>' +
      '</div></section>' +
      hUnggulan(false) +
      '<section class="bagian bagian-jejaring"><div class="wrap">' +
      '<div class="kepala-bagian"><div><h2>' + esc(t('home.jejaring', { k: kampungAktif().length, n: PENGALAMAN.length })) + '</h2><p>' + esc(t('home.jejaringSub')) + '</p></div><a class="tombol sekunder kecil" href="#jelajah">' + IK.peta + esc(t('home.bukaPeta')) + '</a></div>' +
      '<div class="kaca-jalur">' + hJalurKampung() + '</div><p class="catatan-jalur">' + esc(t('jalur.catatan')) + '</p></div></section>' +
      '<section class="bagian bagian-pustaka-beranda"><span class="cahaya c1" aria-hidden="true"></span><div class="wrap">' +
      '<div class="kepala-bagian"><div><h2>' + esc(t('home.pustaka')) + '</h2><p>' + esc(t('home.pustakaSub', { n: TANAMAN.length, b: BAB.length, k: KAMUS.length })) + '</p></div>' +
      '<form class="kolom-cari" role="search" id="cari-beranda">' + IK.cari + '<input type="search" id="cari-beranda-q" placeholder="' + esc(t('cari.ph')) + '" aria-label="' + esc(t('cari')) + '"></form></div>' +
      '<div class="pustaka-beranda">' + (p ? kartuTanaman(p, true) : '') +
      '<div class="kamus-kecil"><h3>' + esc(t('home.dariKamus')) + '</h3><dl>' + istilahPilihan().map(function (k) { return '<div><dt><a href="#k-' + esc(k.id) + '">' + esc(k.istilah) + '</a></dt><dd>' + esc(L(k.arti)) + '</dd></div>'; }).join('') + '</dl>' +
      '<a class="tombol halus kecil" href="#kamus" style="justify-self:start">' + esc(t('peng.kamus')) + '</a></div></div>' +
      '<div class="grid-tiga">' + [cariBab('tanah-minyak'), cariBab('ritus-upacara')].filter(Boolean).map(kartuBab).join('') + (ARTIKEL[0] ? kartuArtikel(ARTIKEL[0]) : '') + '</div>' +
      '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap"><a class="tombol kecil" href="#tanaman">' + esc(t('tab.tanaman')) + '</a><a class="tombol halus kecil" href="#pengetahuan">' + esc(t('tab.pengetahuan')) + '</a><a class="tombol halus kecil" href="#kamus">' + esc(t('tab.kamus')) + '</a><a class="tombol halus kecil" href="#kisah">' + esc(t('tab.kisah')) + '</a><a class="tombol halus kecil" href="#buku">' + esc(t('tab.buku')) + '</a></div>' +
      '</div></section>';
  }
  function cariBab(id) { for (var i = 0; i < BAB.length; i++) if (BAB[i].id === id) return BAB[i]; return null; }
  function istilahPilihan() {
    var pilih = ['egek', 'kambik', 'koba-koba', 'maladum'];
    var hasil = KAMUS.filter(function (k) { return pilih.indexOf(k.id) > -1; });
    return hasil.length ? hasil : KAMUS.slice(0, 4);
  }
  /* experiences held only at certain times (e.g. the annual hunting event): instead of the booking form,
     visitors first coordinate with the admin on WhatsApp */
  function tautanEvent(e) { return waTujuan() ? tautanWA(t('event.tanya', { k: namaKontak(), p: L(e.judul) })) : '#pesan-' + e.id; }
  function tombolEvent(e, kelas) {
    var wa = !!waTujuan();
    return '<a class="tombol ' + (wa ? 'wa ' : '') + (kelas || '') + '" href="' + esc(tautanEvent(e)) + '"' + (wa ? ' target="_blank" rel="noopener"' : '') + '>' + (wa ? IK.wa : IK.kalender) + esc(t('event.koordinasi')) + '</a>';
  }
  function barisPengalaman(e) {
    var unggul = e === UNGGULAN;
    var tanda = unggul ? '<span class="tag unggul">' + IK.bintang + esc(t('ung.lencana')) + '</span>' : e.event ? '<span class="tag event">' + IK.kalender + esc(t('event.lencana')) + '</span>' : (e.status !== 'buka' ? '<span class="tag">' + esc(t('status.' + e.status)) + '</span>' : '');
    return '<a class="baris-pengalaman' + (unggul ? ' unggul' : '') + '" href="#x-' + esc(e.id) + '" data-pilih="' + esc(e.id) + '" data-kat="' + esc(e.kategori) + '">' +
      '<span class="ikon-kat" style="--w:' + warnaKat(e.kategori) + '">' + ikonE(e) + '</span>' +
      '<span class="min"><b>' + esc(L(e.judul)) + '</b><small>' + esc(t('kat.' + e.kategori)) + ' · ' + esc(L(e.durasi)) + '</small></span>' + tanda + '</a>';
  }
  function ikatBeranda() {
    var f = $('#cari-beranda');
    if (f) f.addEventListener('submit', function (ev) { ev.preventDefault(); Cari.buka(false, $('#cari-beranda-q').value); });
  }

  /* ---------- jelajah */
  var filterKat = '';
  /* page header in the style of the home hero: label pill, big title, intro, optional extras */
  function kepalaHalaman(kelas, label, judul, sub, ekstra) {
    return '<section class="kepala-halaman' + (kelas ? ' ' + kelas : '') + '">' + '<span class="cahaya c1" aria-hidden="true"></span><span class="cahaya c2" aria-hidden="true"></span>' +
      '<div class="wrap"><header class="judul-halaman"><p class="hero-atas"><span class="titik" aria-hidden="true"></span>' + esc(label) + '</p>' +
      '<h1>' + esc(judul) + '</h1><p class="sub">' + esc(sub) + '</p></header>' + (ekstra || '') + '</div></section>';
  }
  function deretAngka(aa) {
    return '<dl class="hero-angka">' + aa.map(function (a) { return '<div><dt>' + a[0] + '</dt><dd>' + esc(a[1]) + '</dd></div>'; }).join('') + '</dl>';
  }
  function hJelajah() {
    var w = L(CFG.pemesanan && CFG.pemesanan.waktuBalasan) || '1–3 hari';
    var faq = L(INFO.faq);
    if (filterKat && katDipakai().indexOf(filterKat) < 0) filterKat = '';
    var chips = '<button type="button" class="chip-kat" data-kat="" aria-pressed="' + (!filterKat) + '">' + esc(t('filter.semuaJenis')) + '<span class="n">' + PENGALAMAN.length + '</span></button>' +
      katDipakai().map(function (k) {
        var n = PENGALAMAN.filter(function (e) { return e.kategori === k; }).length;
        return '<button type="button" class="chip-kat" data-kat="' + k + '" aria-pressed="' + (filterKat === k) + '" style="--w:' + warnaKat(k) + '"><i class="titik-warna" aria-hidden="true"></i>' + esc(t('kat.' + k)) + '<span class="n">' + n + '</span></button>';
      }).join('');
    var grup = kampungAktif().map(function (k) {
      var ee = pengalamanDi(k.id);
      return '<section class="grup-kampung" data-kampung="' + esc(k.id) + '"><h3><button type="button" class="kepala-grup" data-ke-kampung="' + esc(k.id) + '">' +
        '<span>Kampung ' + esc(k.nama) + '</span><span class="n">' + ee.length + '</span>' + IK.peta + '</button></h3>' +
        '<div class="daftar-pengalaman">' + ee.map(barisPengalaman).join('') + '</div></section>';
    }).join('');
    var g = CFG.peta || {};
    var k = namaKontak(), wa = waTujuan();
    return kepalaHalaman('kepala-jelajah', t('jelajah.label') + ' · ' + t('hero.atas').split(',')[0], t('jelajah.judul'), t('jelajah.sub', { w: w }),
      '<ol class="alur-pesan">' + [1, 2, 3].map(function (n) {
        return '<li><span class="no" aria-hidden="true">' + (n === 3 && wa ? IK.wa : n) + '</span><div><b>' + esc(t('alur.' + n + 'j')) + '</b><span>' + esc(t('alur.' + n, { k: k, w: w })) + '</span></div></li>';
      }).join('') + '</ol>') +
      hUnggulan(true) +
      '<div class="wrap"><section class="bagian bagian-peta" id="bagian-peta">' +
      '<div class="kepala-bagian"><div><h2>' + esc(t('jelajah.petaJudul')) + '</h2><p>' + esc(t('jelajah.petaSub', { n: PENGALAMAN.length, k: kampungAktif().length })) + '</p></div></div>' +
      '<div class="saring-kat" role="group" aria-label="' + esc(t('filter.label')) + '">' + chips + '</div>' +
      '<div class="jelajah-tata"><div class="daftar-kampung" id="daftar-jelajah">' + grup + '</div>' +
      '<div class="peta-kolom"><div class="peta-bingkai" id="peta-bingkai"><div class="peta" id="peta" role="region" aria-label="' + esc(t('peta.label')) + '"></div>' +
      '<div class="peta-alat"><div class="lapisan" role="group" id="lapisan" hidden><button type="button" data-lapisan="peta" aria-pressed="true">' + esc(t('peta.jalan')) + '</button><button type="button" data-lapisan="satelit" aria-pressed="false">' + esc(t('peta.satelit')) + '</button></div>' +
      '<div class="peta-zoom" id="peta-zoom" hidden><button type="button" data-zoom="1" aria-label="' + esc(t('peta.perbesar')) + '" title="' + esc(t('peta.perbesar')) + '">' + IK.plus + '</button><button type="button" data-zoom="-1" aria-label="' + esc(t('peta.perkecil')) + '" title="' + esc(t('peta.perkecil')) + '">' + IK.minus + '</button><button type="button" data-zoom="0" aria-label="' + esc(t('peta.semua')) + '" title="' + esc(t('peta.semua')) + '">' + IK.pusat + '</button></div></div>' +
      (g.perjalanan ? '<div class="peta-sorong" id="peta-sorong">' + IK.pesawat + '<span><b>' + esc(t('peta.dariSorong')) + '</b> ' + esc(L(g.perjalanan)) + '</span></div>' : '') +
      '</div><p class="sumber-peta">' + esc(t('peta.sumberTitik')) + ' ' + esc(t('peta.sumber')) + '.</p></div></div></section>' +
      '<section class="bagian info-jelajah"><div class="dua-kolom">' +
      '<div class="kartu-info"><div class="kepala-info"><span class="ikon-info" aria-hidden="true">' + IK.pesawat + '</span><h2 class="subjudul">' + esc(t('info.cara')) + '</h2></div><ol class="daftar-langkah">' + L(INFO.cara).map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ol></div>' +
      '<div class="kartu-info"><div class="kepala-info"><span class="ikon-info" aria-hidden="true">' + IK.hati + '</span><h2 class="subjudul">' + esc(t('info.etika')) + '</h2></div><ul class="daftar-titik">' + L(INFO.etika).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '</div></section>' +
      '<section class="bagian faq-jelajah"><div class="faq-tata"><div><h2 class="subjudul">' + esc(t('info.faq')) + '</h2><div class="faq-daftar">' +
      faq.map(function (x) { return '<details class="lipat"><summary>' + esc(x[0]) + '</summary><div class="dalam"><p>' + esc(x[1].replace('{w}', w).replace('{k}', k).replace('{wa}', formatWA(wa))) + '</p></div></details>'; }).join('') +
      '</div></div>' +
      (wa ? '<aside class="kartu-tanya"><span class="ikon-wa" aria-hidden="true">' + IK.wa + '</span><h3>' + esc(t('faq.tanyaJudul')) + '</h3><p>' + esc(t('faq.tanyaIsi', { k: k, w: w })) + '</p>' +
        '<a class="tombol wa" href="' + esc(tautanWA(t('kontak.tanyaUmum', { k: k }))) + '" target="_blank" rel="noopener">' + IK.wa + esc(t('berhasil.wa')) + '</a><span class="nomor tnum">' + esc(formatWA(wa)) + '</span></aside>' : '') +
      '</div></section></div>';
  }
  function ikatJelajah() {
    $$('.chip-kat').forEach(function (b) { b.addEventListener('click', function () { aturFilter(b.getAttribute('data-kat') || '', true); }); });
    $$('[data-ke-kampung]').forEach(function (b) { b.addEventListener('click', function () { pergi('#kampung-' + b.getAttribute('data-ke-kampung')); }); });
    Peta.pasang($('#peta-bingkai'));
    aturFilter(filterKat, false);
  }
  function lolosFilter(e) { return !filterKat || e.kategori === filterKat; }
  function aturFilter(k, terbang) {
    filterKat = k || '';
    $$('.chip-kat').forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-kat') || '') === filterKat)); });
    $$('#daftar-jelajah .baris-pengalaman').forEach(function (a) { a.hidden = !!filterKat && a.getAttribute('data-kat') !== filterKat; });
    $$('#daftar-jelajah .grup-kampung').forEach(function (s) { s.hidden = !$$('.baris-pengalaman', s).some(function (a) { return !a.hidden; }); });
    var sel = Peta.sel && cariPengalaman(Peta.sel);
    if (sel && !lolosFilter(sel)) pergi('#jelajah', true);
    Peta.saring(terbang);
  }

  /* ---------- map controller */
  var LF = null; /* Leaflet library (window.L); L() is the language helper */
  var Peta = {
    bingkai: null, map: null, mode: '', sel: null, kartu: null, lapisan: {}, aktifLapisan: 'peta', posisi: {}, penanda: {}, lapisPin: null, labelMk: [], garisJalan: [],
    pasang: function (bingkai) {
      this.lepas();
      this.bingkai = bingkai; this.sel = null; this.aktifLapisan = 'peta';
      LF = window.L;
      if (LF && LF.map) { try { this.leaflet(); return; } catch (e) { if (window.console) console.warn(e); this.lepas(true); } }
      this.svg();
    },
    lepas: function (simpanBingkai) {
      if (this.ro) { this.ro.disconnect(); this.ro = null; }
      if (this.map) { try { this.map.remove(); } catch (e) { /* already removed */ } }
      this.map = null; this.kartu = null; this.mode = ''; this.posisi = {}; this.penanda = {}; this.lapisPin = null; this.labelMk = []; this.garisJalan = [];
      if (!simpanBingkai) this.bingkai = null;
    },
    warna: function () {
      var cs = window.getComputedStyle(this.bingkai);
      function v(n, d) { return (cs.getPropertyValue(n) || '').trim() || d; }
      return {
        air: v('--peta-air', '#6FA9C0'), jalan: v('--peta-jalan', '#FBFCF6'), tepi: v('--peta-jalan-tepi', '#AFBB93'),
        utama: v('--peta-jalan-utama', '#F0C25A'), utamaTepi: v('--peta-jalan-utama-tepi', '#A9802E'), tanah: v('--peta-jalan-tanah', '#8E7C58'), mukim: v('--peta-permukiman', '#E9DFC6')
      };
    },
    jarak: function () {
      var sempit = this.bingkai.clientWidth < 700;
      return sempit ? { paddingTopLeft: [36, 96], paddingBottomRight: [30, 64] } : { paddingTopLeft: [80, 110], paddingBottomRight: [80, 100] };
    },
    leaflet: function () {
      var self = this, el = $('#peta', this.bingkai), D = petaDasar(), W = this.warna();
      el.innerHTML = ''; el.classList.add('vektor');
      var m = LF.map(el, {
        zoomControl: false, attributionControl: true, minZoom: 11.5, maxZoom: 18, zoomSnap: 0.25, zoomDelta: 0.5, wheelPxPerZoomLevel: 100,
        maxBounds: LF.latLngBounds([[-1.215, 131.34], [-1.02, 131.61]]), maxBoundsViscosity: 0.8, tap: false
      });
      this.map = m; this.mode = 'leaflet';
      m.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
      m.attributionControl.addAttribution('<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a>');
      LF.control.scale({ imperial: false, position: 'bottomright', maxWidth: 110 }).addTo(m);

      /* styled vector base map: settlements, water, roads (drawn on one canvas) */
      var rnd = LF.canvas({ padding: 0.5 }), dasar = LF.layerGroup();
      D.bangunan.forEach(function (b) {
        LF.circle([b[0], b[1]], { renderer: rnd, radius: Math.min(115, 42 + 15 * Math.sqrt(b[2])), stroke: false, fillColor: W.mukim, fillOpacity: 1, interactive: false }).addTo(dasar);
      });
      var gaya = {
        S: [{ color: W.air, weight: 1.6, opacity: 0.85 }],
        R: [{ color: W.air, weight: 4.6 }],
        k: [{ color: W.tanah, weight: 1.6, dashArray: '4 5', opacity: 0.85 }],
        s: [{ color: W.tepi, weight: 3.4 }, { color: W.jalan, weight: 1.9 }],
        r: [{ color: W.tepi, weight: 4.4 }, { color: W.jalan, weight: 2.8 }],
        u: [{ color: W.tepi, weight: 6.2 }, { color: W.jalan, weight: 4.2 }],
        t: [{ color: W.utamaTepi, weight: 8.4 }, { color: W.utama, weight: 5.8 }]
      };
      D.garis.filter(function (g) { return g.j === 'W'; }).forEach(function (g) {
        LF.polygon(g.p, { renderer: rnd, stroke: false, fillColor: W.air, fillOpacity: 1, interactive: false }).addTo(dasar);
      });
      ['S', 'R', 'k', 's', 'r', 'u', 't'].forEach(function (j) {
        var gg = D.garis.filter(function (g) { return g.j === j; });
        gaya[j].forEach(function (st) {
          gg.forEach(function (g) {
            var l = LF.polyline(g.p, { renderer: rnd, color: st.color, weight: st.weight, opacity: st.opacity || 1, dashArray: st.dashArray || null, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(dasar);
            self.garisJalan.push({ l: l, w: st.weight });
          });
        });
      });
      this.lapisan.peta = dasar;

      /* optional satellite imagery (needs internet access to Esri) */
      var citra = LF.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, maxNativeZoom: 18, attribution: 'Citra © Esri, Maxar, Earthstar Geographics' });
      var muat = 0, galat = 0;
      citra.on('tileload', function () { muat++; });
      citra.on('tileerror', function () { galat++; if (muat === 0 && galat >= 4 && self.aktifLapisan === 'satelit') { self.gantiLapisan('peta'); self.info(t('peta.satelitGagal')); } });
      this.lapisan.satelit = citra;
      dasar.addTo(m);

      /* place names */
      this.labelMk = D.label.map(function (l) {
        var mk = LF.marker([l[1], l[2]], { icon: LF.divIcon({ className: 'label-tempat t' + l[3], html: '<span>' + esc(l[0]) + '</span>', iconSize: [0, 0] }), interactive: false, keyboard: false, zIndexOffset: -1000 });
        mk._klm = { nama: String(l[0]), t: l[3] };
        return mk;
      });
      if (D.keSorong) {
        var arah = LF.marker(D.keSorong, { icon: LF.divIcon({ className: 'label-tempat arah', html: '<span>' + IK.pesawat + esc(t('peta.keSorong')) + '</span>', iconSize: [0, 0] }), interactive: false, keyboard: false, zIndexOffset: -900 });
        arah._klm = { nama: '✈ ' + t('peta.keSorong'), t: 0 };
        this.labelMk.unshift(arah);
      }
      LF.layerGroup(this.labelMk).addTo(m);

      this.lapisPin = LF.layerGroup().addTo(m);
      this.batas = LF.latLngBounds(PENGALAMAN.map(function (e) { return e.koordinat; }));
      m.fitBounds(this.batas, this.jarak());
      m.on('zoomend', function () { self.tebal(); self.susun(); });
      m.on('move zoom resize', function () { self.posisiKartu(); });
      m.on('click', function () { if (self.sel) pergi('#jelajah', true); });
      /* page scrolling should not zoom the map: wheel zoom switches on after a click or focus */
      m.scrollWheelZoom.disable();
      m.on('click focus', function () { m.scrollWheelZoom.enable(); });
      m.on('mouseout blur', function () { m.scrollWheelZoom.disable(); });

      $('#peta-zoom', this.bingkai).hidden = false;
      /* the Map/Satellite switch only appears once a test tile actually loads: some hosts (such as the
         claude.ai preview) block images from other servers, and a button that always fails is worse than none */
      var tombolLapisan = $('#lapisan', this.bingkai);
      if (Peta.satelitBisa === true) tombolLapisan.hidden = false;
      else if (Peta.satelitBisa !== false) {
        var uji = new Image();
        uji.onload = function () { Peta.satelitBisa = true; if (tombolLapisan.isConnected) tombolLapisan.hidden = false; };
        uji.onerror = function () { Peta.satelitBisa = false; };
        uji.src = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/12/2060/3543';
      }
      $$('[data-lapisan]', this.bingkai).forEach(function (b) { b.addEventListener('click', function () { self.gantiLapisan(b.getAttribute('data-lapisan')); }); });
      $$('[data-zoom]', this.bingkai).forEach(function (b) {
        b.addEventListener('click', function () {
          var dz = Number(b.getAttribute('data-zoom'));
          if (dz === 0) self.semua(); else m.setZoom(m.getZoom() + dz);
        });
      });
      this.tebal(); this.susun();
      setTimeout(function () { if (self.map) { self.map.invalidateSize(); self.susun(); } }, 80);
      if (window.ResizeObserver) { this.ro = new ResizeObserver(function () { if (self.map) self.map.invalidateSize({ pan: false }); }); this.ro.observe(this.bingkai); }
    },
    semua: function () {
      if (this.mode !== 'leaflet') return;
      var ee = PENGALAMAN.filter(lolosFilter);
      if (!ee.length) ee = PENGALAMAN;
      var o = this.jarak(); o.maxZoom = 15.5; o.duration = 0.8;
      this.map.flyToBounds(LF.latLngBounds(ee.map(function (e) { return e.koordinat; })), o);
    },
    saring: function (terbang) {
      if (this.mode === 'leaflet') { this.susun(); if (terbang) this.semua(); }
      else if (this.mode === 'svg') $$('.simpul[data-kat]', this.bingkai).forEach(function (g) { g.style.display = !filterKat || g.getAttribute('data-kat') === filterKat ? '' : 'none'; });
    },
    tebal: function () {
      if (!this.map) return;
      var f = Math.max(0.55, Math.min(1.75, 0.8 + (this.map.getZoom() - 13.5) * 0.3));
      this.garisJalan.forEach(function (o) { o.l.setStyle({ weight: o.w * f }); });
    },
    /* group nearby points into clusters for the current zoom; the featured experience always stays visible */
    susun: function () {
      var self = this, m = this.map; if (!m || !this.lapisPin) return;
      this.lapisPin.clearLayers(); this.posisi = {}; this.penanda = {};
      var z = m.getZoom(), R = z >= 17 ? 0 : 46;
      var ung = null, grup = [];
      PENGALAMAN.filter(lolosFilter).forEach(function (e) {
        var o = { e: e, p: m.project(e.koordinat, z) };
        if (e === UNGGULAN) { ung = o; return; }
        var g = null;
        for (var i = 0; i < grup.length && R; i++) if (grup[i].p.distanceTo(o.p) < R) { g = grup[i]; break; }
        if (g) { g.anggota.push(o); var n = g.anggota.length; g.p = LF.point((g.p.x * (n - 1) + o.p.x) / n, (g.p.y * (n - 1) + o.p.y) / n); }
        else grup.push({ p: o.p.clone(), anggota: [o] });
      });
      /* greedy grouping can leave two markers overlapping (a cluster is 50px wide): merge those until none overlap */
      for (var gabung = true; gabung && R;) {
        gabung = false;
        for (var a = 0; a < grup.length && !gabung; a++) for (var c = a + 1; c < grup.length && !gabung; c++) {
          var ga = grup[a], gc = grup[c], min = (ga.anggota.length > 1 || gc.anggota.length > 1) ? 56 : R;
          if (ga.p.distanceTo(gc.p) < min) {
            var na = ga.anggota.length, nc = gc.anggota.length;
            ga.p = LF.point((ga.p.x * na + gc.p.x * nc) / (na + nc), (ga.p.y * na + gc.p.y * nc) / (na + nc));
            ga.anggota = ga.anggota.concat(gc.anggota); grup.splice(c, 1); gabung = true;
          }
        }
      }
      if (ung) grup.forEach(function (g) {
        var dx = g.p.x - ung.p.x, dy = g.p.y - ung.p.y, d = Math.sqrt(dx * dx + dy * dy), min = 54;
        if (d < min) { if (d < 1) { dx = 1; dy = 0.5; d = Math.sqrt(1.25); } g.p = LF.point(ung.p.x + dx / d * min, ung.p.y + dy / d * min); }
      });
      var detail = z >= 14.75, kotak = [];
      if (ung) {
        this.tambahPin(ung.e, ung.p, true, true);
        var lu = Math.min(240, L(ung.e.judul).length * 7.4 + 34);
        kotak.push([ung.p.x - 34, ung.p.y - 66, ung.p.x - 34 + Math.max(lu, 64), ung.p.y + 30]); /* featured name sits above-right of its pin */
      }
      /* every marker circle is an obstacle; a single pin shows its name only where the name has room */
      grup.forEach(function (g) { kotak.push([g.p.x - 24, g.p.y - 24, g.p.x + 24, g.p.y + 24]); });
      function bebas(b, kecuali) {
        for (var i = 0; i < kotak.length; i++) { if (i === kecuali) continue; var o = kotak[i]; if (b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]) return false; }
        return true;
      }
      var awal = kotak.length - grup.length;
      grup.forEach(function (g, i) {
        var tunggal = g.anggota.length === 1, lw = tunggal ? Math.min(190, L(g.anggota[0].e.judul).length * 7 + 18) : 90;
        var b = [g.p.x - lw / 2, g.p.y + 24, g.p.x + lw / 2, g.p.y + 48];
        var adaRuang = bebas(b, awal + i);
        if (tunggal) self.tambahPin(g.anggota[0].e, g.p, false, detail && adaRuang);
        else self.tambahKlaster(g, adaRuang);
        if ((tunggal && detail && adaRuang) || (!tunggal && adaRuang)) kotak.push(b);
      });
      this.susunLabel(kotak);
    },
    kotakPin: function (p, r, lebarLabel) {
      var lw = Math.max(r * 2, lebarLabel || 0) / 2;
      return [p.x - lw, p.y - r, p.x + lw, p.y + r + (lebarLabel ? 26 : 0)];
    },
    tambahPin: function (e, p, unggul, berlabel) {
      var self = this, ll = this.map.unproject(p, this.map.getZoom());
      var html = '<div class="pin' + (unggul ? ' unggul' : '') + (e.status !== 'buka' ? ' persiapan' : '') + (berlabel ? ' berlabel' : '') + (this.sel === e.id ? ' aktif' : '') + '" data-id="' + esc(e.id) + '" style="--w:' + warnaKat(e.kategori) + '">' +
        '<span class="bulat">' + ikonE(e) + '</span><span class="nama">' + (unggul ? IK.bintang : '') + esc(L(e.judul)) + '</span></div>';
      var mk = LF.marker(ll, { icon: LF.divIcon({ className: 'pin-wadah', html: html, iconSize: [0, 0] }), title: L(e.judul) + ' (Kampung ' + e.kampung + ')', alt: L(e.judul), keyboard: true, riseOnHover: true, zIndexOffset: unggul ? 800 : 0 }).addTo(this.lapisPin);
      mk.on('click', function () { pergi('#x-' + e.id); });
      this.posisi[e.id] = ll; this.penanda[e.id] = mk;
      if (this.sel === e.id) mk.setZIndexOffset(1000);
      return mk;
    },
    tambahKlaster: function (g, berlabel) {
      var self = this, ee = g.anggota.map(function (o) { return o.e; }), n = ee.length, kamp = [];
      ee.forEach(function (e) { if (kamp.indexOf(e.kampung) < 0) kamp.push(e.kampung); });
      var urut = ee.slice().sort(function (a, b) { return URUT_KAT.indexOf(a.kategori) - URUT_KAT.indexOf(b.kategori); });
      var cincin = urut.map(function (e, i) { return warnaKat(e.kategori) + ' ' + (i / n * 360).toFixed(1) + 'deg ' + ((i + 1) / n * 360).toFixed(1) + 'deg'; }).join(',');
      var nama = kamp.length === 1 ? kamp[0] : kamp[0] + ' +' + (kamp.length - 1);
      var ll = this.map.unproject(g.p, this.map.getZoom());
      var html = '<div class="klaster' + (berlabel === false ? ' tanpa-label' : '') + '"><span class="bulat" style="background:conic-gradient(' + cincin + ')"><b>' + n + '</b></span><span class="nama">' + esc(nama) + '</span></div>';
      var mk = LF.marker(ll, { icon: LF.divIcon({ className: 'pin-wadah', html: html, iconSize: [0, 0] }), title: t('peta.klaster', { n: n, k: kamp.join(', ') }), keyboard: true, riseOnHover: true }).addTo(this.lapisPin);
      mk.on('click', function () {
        var o = self.jarak(); o.maxZoom = 17.5; o.duration = 0.7;
        self.map.flyToBounds(LF.latLngBounds(ee.map(function (e) { return e.koordinat; })), o);
      });
      ee.forEach(function (e) { self.posisi[e.id] = ll; });
    },
    /* hide or nudge place names that would sit under a pin or another name */
    susunLabel: function (kotak) {
      var m = this.map, z = m.getZoom(), dipakai = kotak.slice();
      function tabrak(b) { for (var i = 0; i < dipakai.length; i++) { var o = dipakai[i]; if (b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]) return true; } return false; }
      this.labelMk.slice().sort(function (a, b) { return (a._klm.t || 9) - (b._klm.t || 9); }).forEach(function (mk) {
        var info = mk._klm, el = mk.getElement(); if (!el) return;
        var span = el.firstChild, p = m.project(mk.getLatLng(), z);
        var w = info.nama.length * (info.t === 1 ? 9.2 : 7.2) + 12, h = 18, pos = null;
        if (info.t !== 2 || z >= 13.25) {
          [0, -26, 26].some(function (dy) { var b = [p.x - w / 2, p.y + dy - h / 2, p.x + w / 2, p.y + dy + h / 2]; if (!tabrak(b)) { pos = dy; dipakai.push(b); return true; } return false; });
        }
        el.classList.toggle('sembunyi', pos === null);
        if (span) span.style.setProperty('--dy', (pos || 0) + 'px');
      });
    },
    gantiLapisan: function (n) {
      if (!this.map || n === this.aktifLapisan || !this.lapisan[n]) return;
      this.map.removeLayer(this.lapisan[this.aktifLapisan]); this.lapisan[n].addTo(this.map); this.aktifLapisan = n;
      $('#peta', this.bingkai).classList.toggle('satelit', n === 'satelit');
      $$('[data-lapisan]', this.bingkai).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lapisan') === n)); });
    },
    info: function (teks) {
      var lama = $('.peta-info', this.bingkai); if (lama) lama.remove();
      var info = document.createElement('div'); info.className = 'peta-info'; info.setAttribute('role', 'status'); info.textContent = teks;
      this.bingkai.appendChild(info);
      setTimeout(function () { if (info.parentNode) info.remove(); }, 6000);
    },
    /* fallback when Leaflet cannot load: a static drawing of the same base map */
    svg: function () {
      var el = $('#peta', this.bingkai);
      this.mode = 'svg';
      el.className = 'peta peta-svg'; el.removeAttribute('style'); el.removeAttribute('tabindex');
      el.innerHTML = petaSVG();
      $$('.simpul', el).forEach(function (g) {
        var id = g.getAttribute('data-id');
        g.addEventListener('click', function () { pergi('#x-' + id); });
        g.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pergi('#x-' + id); } });
      });
      ['#lapisan', '#peta-zoom'].forEach(function (s) { var x = $(s, this.bingkai); if (x) x.hidden = true; }, this);
      var info = document.createElement('div'); info.className = 'peta-info'; info.textContent = t('peta.fallback');
      this.bingkai.appendChild(info);
    },
    titik: function (id) {
      if (this.mode === 'leaflet') { var ll = this.posisi[id]; return ll ? this.map.latLngToContainerPoint(ll) : null; }
      var g = this.bingkai && $('.simpul[data-id="' + id + '"]', this.bingkai);
      if (!g) return null;
      var svg = g.ownerSVGElement, r = svg.getBoundingClientRect(), br = this.bingkai.getBoundingClientRect(), vb = svg.viewBox.baseVal;
      var sk = Math.min(r.width / vb.width, r.height / vb.height), offX = (r.width - vb.width * sk) / 2, offY = (r.height - vb.height * sk) / 2;
      return { x: r.left - br.left + offX + Number(g.getAttribute('data-x')) * sk, y: r.top - br.top + offY + Number(g.getAttribute('data-y')) * sk };
    },
    sorotKampung: function (id) {
      $$('#daftar-jelajah .grup-kampung').forEach(function (s) { s.classList.toggle('sorot', !!id && s.getAttribute('data-kampung') === id); });
    },
    keKampung: function (id) {
      var ee = pengalamanDi(id); if (!ee.length || !this.bingkai) return;
      if (filterKat && !ee.some(lolosFilter)) aturFilter('', false);
      this.sorotKampung(id);
      if (this.mode === 'leaflet') {
        var o = this.jarak(); o.maxZoom = ee.length > 1 ? 16.5 : 15.5; o.duration = 0.9;
        this.map.flyToBounds(LF.latLngBounds(ee.map(function (e) { return e.koordinat; })), o);
      }
      this.gulirDaftar($('#daftar-jelajah .grup-kampung[data-kampung="' + id + '"]'));
      var top = this.bingkai.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) this.bingkai.scrollIntoView({ block: 'start', behavior: 'smooth' });
    },
    /* on wide screens the village list scrolls on its own beside the map */
    gulirDaftar: function (el) {
      var daftar = $('#daftar-jelajah');
      if (!el || !daftar || daftar.scrollHeight <= daftar.clientHeight + 4) return;
      var atas = el.offsetTop - 8, r = el.getBoundingClientRect(), rd = daftar.getBoundingClientRect();
      if (r.top < rd.top || r.bottom > rd.bottom || el.classList.contains('grup-kampung')) daftar.scrollTo({ top: Math.max(0, atas), behavior: 'smooth' });
    },
    pilih: function (id) {
      if (!this.bingkai) return;
      var e = id ? cariPengalaman(id) : null;
      if (e && !lolosFilter(e)) aturFilter('', false);
      this.sel = e ? id : null;
      $$('#daftar-jelajah .baris-pengalaman').forEach(function (a) { a.classList.toggle('aktif', a.getAttribute('data-pilih') === id); });
      $$('.pin[data-id]', this.bingkai).forEach(function (p) { p.classList.toggle('aktif', p.getAttribute('data-id') === id); });
      $$('.simpul', this.bingkai).forEach(function (g) { g.classList.toggle('aktif', g.getAttribute('data-id') === id); });
      if (this.kartu) { this.kartu.remove(); this.kartu = null; }
      if (this.bingkai.classList.contains('ada-kartu') !== !!e) { this.bingkai.classList.toggle('ada-kartu', !!e); if (this.map) this.map.invalidateSize({ pan: false }); }
      if (!e) return;
      this.sorotKampung(e.kampungId);
      this.gulirDaftar($('#daftar-jelajah .baris-pengalaman[data-pilih="' + id + '"]'));
      var sempit = this.bingkai.clientWidth < 700;
      if (this.mode === 'leaflet') {
        if (!this.penanda[id]) this.map.setView(e.koordinat, Math.max(this.map.getZoom(), 16), { animate: false });
        if (!this.penanda[id]) this.map.setView(e.koordinat, 17.5, { animate: false });
        if (this.penanda[id]) this.penanda[id].setZIndexOffset(1000);
      }
      var k = document.createElement('div');
      k.className = 'kartu-peta' + (e === UNGGULAN ? ' unggul' : ''); k.setAttribute('role', 'dialog'); k.setAttribute('aria-label', L(e.judul));
      k.innerHTML = kartuPetaHTML(e);
      this.bingkai.appendChild(k); this.kartu = k;
      $('[data-tutup-kartu]', k).addEventListener('click', function () { pergi('#jelajah', true); });
      if (this.mode === 'leaflet' && this.posisi[id]) {
        var ll = this.posisi[id];
        if (sempit) {
          var Hs = this.bingkai.clientHeight, ty = Math.max(46, (Hs - k.offsetHeight - 8) / 2);
          this.map.panTo(ll, { animate: false }); this.map.panBy([0, Hs / 2 - ty], { animate: false });
        }
        else {
          /* keep the pin clear of the card: if it does not fit beside the pin, move the pin into the free space */
          var Wb = this.bingkai.clientWidth, Hb = this.bingkai.clientHeight, wk = k.offsetWidth, pt = this.map.latLngToContainerPoint(ll);
          var muat = (pt.x + 40 + wk <= Wb - 12) || (pt.x - 40 - wk >= 12);
          if (!muat || pt.y < 80 || pt.y > Hb - 50 || pt.x < 40 || pt.x > Wb - 40) this.map.panBy([pt.x - Math.max(70, (Wb - wk - 52) / 2), pt.y - Hb / 2], { duration: 0.45 });
        }
      }
      this.posisiKartu();
      var bingkaiTop = this.bingkai.getBoundingClientRect().top;
      if (bingkaiTop < 0 || bingkaiTop > window.innerHeight * 0.6) this.bingkai.scrollIntoView({ block: 'start', behavior: 'smooth' });
    },
    posisiKartu: function () {
      var k = this.kartu; if (!k || !this.sel) return;
      if (this.bingkai.clientWidth < 700) { k.style.left = ''; k.style.top = ''; k.style.maxHeight = ''; return; }
      var p = this.titik(this.sel); if (!p) return;
      var W = this.bingkai.clientWidth, H = this.bingkai.clientHeight, w = k.offsetWidth, h = k.offsetHeight;
      var kiri = p.x + 40; if (kiri + w > W - 12) kiri = p.x - 40 - w; if (kiri < 12) kiri = Math.max(12, Math.min(W - w - 12, p.x - w / 2));
      var atas = Math.max(12, Math.min(H - h - 12, p.y - h / 2));
      k.style.left = kiri + 'px'; k.style.top = atas + 'px'; k.style.maxHeight = (H - atas - 12) + 'px';
      k.style.transformOrigin = (p.x - kiri) + 'px ' + (p.y - atas) + 'px';
    }
  };
  function petaSVG() {
    var D = petaDasar(), Wd = 960, Hd = 600;
    var lats = PENGALAMAN.map(function (e) { return e.koordinat[0]; }), lons = PENGALAMAN.map(function (e) { return e.koordinat[1]; });
    var cLat = (Math.min.apply(null, lats) + Math.max.apply(null, lats)) / 2, cLon = (Math.min.apply(null, lons) + Math.max.apply(null, lons)) / 2;
    var kx = Math.cos(cLat * Math.PI / 180), spanX = Math.max(0.02, (Math.max.apply(null, lons) - Math.min.apply(null, lons)) * kx * 1.25);
    var sk = Wd / spanX, x0 = cLon, y0 = cLat;
    function xy(p) { return [Wd / 2 + (p[1] - x0) * kx * sk, Hd / 2 - (p[0] - y0) * sk]; }
    function jalur(pp) { return 'M' + pp.map(function (p) { var q = xy(p); return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L'); }
    var px = sk / 111320; /* svg units per metre */
    var mukim = D.bangunan.map(function (b) { var q = xy(b); return '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + (Math.min(115, 42 + 15 * Math.sqrt(b[2])) * px).toFixed(1) + '"/>'; }).join('');
    var lebar = { S: 1.4, R: 4, k: 1.2, s: 1.6, r: 2.4, u: 3.4, t: 5 };
    var garis = ['S', 'R', 'k', 's', 'r', 'u', 't'].map(function (j) {
      var d = D.garis.filter(function (g) { return g.j === j; }).map(function (g) { return jalur(g.p); }).join('');
      return d ? '<path class="g-' + j + '" d="' + d + '" stroke-width="' + lebar[j] + '"/>' : '';
    }).join('');
    var dipakai = [];
    var label = D.label.filter(function (l) { return l[3] === 1; }).map(function (l) {
      var q = xy([l[1], l[2]]), w = String(l[0]).length * 10 + 8, b = [q[0] - w / 2, q[1] - 30, q[0] + w / 2, q[1] - 12];
      if (dipakai.some(function (o) { return b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]; })) return '';
      dipakai.push(b);
      return '<text class="nama-tempat" x="' + q[0].toFixed(1) + '" y="' + (q[1] - 18).toFixed(1) + '" text-anchor="middle">' + esc(l[0]) + '</text>';
    }).join('');
    var simpul = PENGALAMAN.map(function (e) {
      var q = xy(e.koordinat), u = e === UNGGULAN, r = u ? 15 : 9;
      return '<g class="simpul' + (u ? ' unggul' : '') + '" data-id="' + esc(e.id) + '" data-kat="' + esc(e.kategori) + '" data-x="' + q[0].toFixed(1) + '" data-y="' + q[1].toFixed(1) + '" tabindex="0" role="link" aria-label="' + esc(L(e.judul) + ', Kampung ' + e.kampung) + '">' +
        '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + r + '" fill="' + (u ? '#B6D167' : warnaKat(e.kategori)) + '"/></g>';
    }).join('');
    return '<svg viewBox="0 0 ' + Wd + ' ' + Hd + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + esc(t('peta.label')) + '"><rect class="darat" width="' + Wd + '" height="' + Hd + '"/>' +
      '<g class="mukim">' + mukim + '</g><g class="garis">' + garis + '</g>' + label + simpul + '</svg>';
  }
  function kartuPetaHTML(e) {
    var ket = L(e.fotoKet);
    var gambar = e.foto ? '<img src="' + esc(e.foto) + '" alt="' + esc(ket) + '"' + (ket ? ' title="' + esc(ket) + '"' : '') + (e.fotoPosisi ? ' style="object-position:' + esc(e.fotoPosisi) + '"' : '') + '>' : '<div class="ilustrasi" style="--w:' + warnaKat(e.kategori) + '">' + pola('pola') + ikonE(e).replace('<svg ', '<svg class="ik" ') + '</div>';
    var buka = e.status === 'buka', unggul = e === UNGGULAN;
    var catatan = L(e.catatan), fakta = unggul && e.unggulan && e.unggulan.fakta ? e.unggulan.fakta : [];
    return '<div class="gambar">' + gambar + (unggul ? '<span class="cap-unggulan kecil">' + IK.bintang + esc(t('ung.lencana')) + '</span>' : '') + '<button class="tutup" type="button" data-tutup-kartu aria-label="' + esc(t('tutup')) + '">' + IK.tutup + '</button></div>' +
      '<div class="isi"><div class="kampung"><b>Kampung ' + esc(e.kampung) + '</b><span class="tag kat" style="--w:' + warnaKat(e.kategori) + '">' + esc(t('kat.' + e.kategori)) + '</span>' + (e.event ? '<span class="tag event">' + IK.kalender + esc(L(e.event)) + '</span>' : '') + (buka ? '' : '<span class="tag">' + esc(t('status.' + e.status)) + '</span>') + '</div>' +
      '<h3>' + esc(L(e.judul)) + '</h3><p>' + esc(L(e.ringkas)) + '</p>' +
      (fakta.length ? '<ul class="fakta-mini">' + fakta.map(function (f) { return '<li><b>' + esc(L(f.angka)) + '</b> ' + esc(L(f.ket)) + '</li>'; }).join('') + '</ul>' : '') +
      hAtraksi(e, 'kartu') +
      '<div><b style="font-size:.85rem">' + esc(t('kartu.aktivitas')) + '</b><ul>' + L(e.aktivitas).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '<dl class="fakta"><dt>' + esc(t('kartu.durasi')) + '</dt><dd>' + esc(L(e.durasi)) + '</dd><dt>' + esc(t('kartu.kontak')) + '</dt><dd>' + (waTujuan() ? '<a class="ig-kecil" href="' + esc(tautanWA(t('kontak.tanya', { k: namaKontak(), p: L(e.judul) }))) + '" target="_blank" rel="noopener">' + IK.wa + esc(namaKontak()) + '</a>' : esc(namaKontak())) + '</dd>' +
      (akunIG(e) ? '<dt>Instagram</dt><dd><a class="ig-kecil" href="' + esc(tautanIG(akunIG(e))) + '" target="_blank" rel="noopener">' + IK.instagram + '@' + esc(akunIG(e)) + '</a></dd>' : '') + '</dl>' +
      (catatan ? '<p class="muted" style="font-size:.85rem">' + esc(catatan) + '</p>' : '') +
      '<a class="tautan-kisah" href="#p-menjelajahi-klamono">' + IK.buku + esc(t('kartu.baca')) + IK.panah + '</a></div>' +
      '<div class="aksi">' + (e.event ? tombolEvent(e, 'kecil') : '<a class="tombol kecil" href="#pesan-' + esc(e.id) + '">' + esc(buka ? t('kartu.pesan') : t('kartu.minat')) + '</a>') +
      '</div>';
  }

  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (Peta.mode === 'leaflet' && Peta.bingkai) { var s = Peta.sel, b = Peta.bingkai; Peta.pasang(b); aturFilter(filterKat, false); Peta.pilih(s); }
    });
  } catch (e) { /* older browsers: map keeps its colours until reload */ }

  /* ---------- pustaka */
  var filterTanaman = { q: '', keg: '', bag: '', pakai: '', urut: 'buku' };
  function hPustaka(tab, r) {
    if (tab === 'buku' && r && r.buku) return hPembacaBuku(cariBuku(r.buku));
    var n = { tanaman: TANAMAN.length, pengetahuan: BAB.length, kamus: KAMUS.length, kisah: ARTIKEL.length, buku: BUKU.length };
    var tabs = ['tanaman', 'pengetahuan', 'kamus', 'kisah', 'buku'].map(function (x) {
      return '<a href="#' + x + '"' + (x === tab ? ' aria-current="page"' : '') + '>' + esc(t('tab.' + x)) + '<span class="n">' + n[x] + '</span></a>';
    }).join('');
    var isi = tab === 'tanaman' ? hTabTanaman() : tab === 'pengetahuan' ? hTabPengetahuan() : tab === 'kamus' ? hTabKamus() : tab === 'buku' ? hTabBuku() : hTabKisah();
    return kepalaHalaman('kepala-pustaka', t('pustaka.label'), t('pustaka.judul'), t('pustaka.sub'),
        deretAngka([[TANAMAN.length, t('hero.angkaTanaman')], [BAB.length, t('angka.bab')], [KAMUS.length, t('angka.istilah')], [BUKU.length, t('angka.buku')]])) +
      '<div class="wrap"><nav class="tab-pustaka" aria-label="' + esc(t('pustaka.judul')) + '">' + tabs + '</nav>' + isi +
      '<p class="muted" style="margin-top:36px;font-size:.88rem;max-width:72ch">' + esc(t('pustaka.milik')) + '</p></div>';
  }
  function hTabTanaman() {
    var kegs = ['nyeri', 'demam', 'luka', 'cerna', 'napas', 'ibu', 'darah', 'tulang', 'lain', 'adat'];
    var bags = ['daun', 'akar', 'batang', 'kayu', 'kulit-kayu', 'buah', 'getah', 'pati', 'pucuk', 'seluruh'];
    var pakais = ['minum', 'luar', 'makan'];
    var hit = function (k) { return TANAMAN.filter(function (p) { return p.kegunaan.indexOf(k) > -1; }).length; };
    return '<div class="alat">' +
      '<div class="alat-baris"><div class="kolom-cari">' + IK.cari + '<input type="search" id="q-tanaman" value="' + esc(filterTanaman.q) + '" placeholder="' + esc(t('tanaman.cari')) + '" aria-label="' + esc(t('tanaman.cari')) + '"></div>' +
      '<select class="pilih" id="f-bagian" aria-label="' + esc(t('filter.labelBagian')) + '"><option value="">' + esc(t('filter.bagian')) + '</option>' + bags.map(function (b) { return '<option value="' + b + '"' + (filterTanaman.bag === b ? ' selected' : '') + '>' + esc(t('bag.' + b)) + '</option>'; }).join('') + '</select>' +
      '<select class="pilih" id="f-pakai" aria-label="' + esc(t('filter.labelPakai')) + '"><option value="">' + esc(t('filter.pakai')) + '</option>' + pakais.map(function (b) { return '<option value="' + b + '"' + (filterTanaman.pakai === b ? ' selected' : '') + '>' + esc(t('pakai.' + b)) + '</option>'; }).join('') + '</select>' +
      '<select class="pilih" id="f-urut" aria-label="' + esc(t('filter.labelUrut')) + '"><option value="buku">' + esc(t('urut.buku')) + '</option><option value="az"' + (filterTanaman.urut === 'az' ? ' selected' : '') + '>' + esc(t('urut.az')) + '</option></select></div>' +
      '<div class="chips" role="group" aria-label="' + esc(t('filter.semua')) + '"><button class="chip" type="button" data-keg="" aria-pressed="' + (!filterTanaman.keg) + '">' + esc(t('filter.semua')) + '</button>' +
      kegs.map(function (k) { return '<button class="chip" type="button" data-keg="' + k + '" aria-pressed="' + (filterTanaman.keg === k) + '">' + esc(t('keg.' + k)) + ' <span class="n">' + hit(k) + '</span></button>'; }).join('') + '</div>' +
      '<div class="peringatan" role="note">' + IK.awas + '<p>' + esc(t('tanaman.peringatan')) + '</p></div>' +
      '<details class="lipat"><summary>' + esc(t('tanaman.tentang')) + '</summary><div class="dalam prosa" style="font-size:1rem">' + blokHTML(KLM.pengantarKatalog || []) + '</div></details>' +
      '<div class="hitung" id="hitung-tanaman" aria-live="polite"></div></div>' +
      '<div class="grid-herbarium" id="grid-tanaman"></div>';
  }
  function saringTanaman() {
    var f = filterTanaman, daftar;
    if (f.q.trim()) {
      var skor = {}; cari(f.q, 'tanaman').forEach(function (h) { skor[h.e.id] = h.s; });
      daftar = TANAMAN.filter(function (p) { return skor[p.id]; });
      if (f.urut === 'buku') daftar.sort(function (a, b) { return skor[b.id] - skor[a.id]; });
    } else daftar = TANAMAN.slice();
    if (f.keg) daftar = daftar.filter(function (p) { return p.kegunaan.indexOf(f.keg) > -1; });
    if (f.bag) daftar = daftar.filter(function (p) { return p.bagian.indexOf(f.bag) > -1; });
    if (f.pakai) daftar = daftar.filter(function (p) { return p.pakai.indexOf(f.pakai) > -1; });
    if (f.urut === 'az') daftar.sort(function (a, b) { return a.nama.localeCompare(b.nama, 'id'); });
    return daftar;
  }
  function gambarTanaman() {
    var grid = $('#grid-tanaman'); if (!grid) return;
    var d = saringTanaman();
    $('#hitung-tanaman').textContent = t('hitung.tanaman', { n: d.length, t: TANAMAN.length });
    grid.innerHTML = d.length ? d.map(function (p) { return kartuTanaman(p, false, filterTanaman.q); }).join('') :
      '<div class="kosong" style="grid-column:1/-1"><b>' + esc(t('kosong.tanaman')) + '</b><button class="tombol halus kecil" type="button" id="hapus-filter" style="margin-top:10px">' + esc(t('hapusFilter')) + '</button></div>';
    var hf = $('#hapus-filter');
    if (hf) hf.addEventListener('click', function () { filterTanaman = { q: '', keg: '', bag: '', pakai: '', urut: filterTanaman.urut }; rute(true); });
  }
  function hTabPengetahuan() {
    return '<section class="bagian" style="padding-top:28px"><div class="kepala-bagian"><div><h2>' + esc(t('peng.bab')) + '</h2></div></div>' +
      '<div class="grid-bab">' + BAB.map(kartuBab).join('') + '</div></section>' +
      '<p class="ke-kamus"><a class="tombol halus kecil" href="#kamus">' + IK.istilah + esc(t('tab.kamus')) + ' · ' + KAMUS.length + IK.panah + '</a></p>' +
      '<details class="lipat"><summary>' + esc(t('rujukan')) + '</summary><div class="dalam"><ol style="display:grid;gap:8px;padding-left:20px;font-size:.92rem">' +
      (KLM.rujukan || []).map(function (r) { return '<li style="overflow-wrap:anywhere">' + rich(r) + '</li>'; }).join('') + '</ol></div></details>';
  }
  /* glossary: its own tab so it is not buried under the chapters */
  function hTabKamus() {
    var huruf = {}; KAMUS.forEach(function (k) { huruf[k.istilah.charAt(0).toUpperCase()] = true; });
    var abjad = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function (h) { return huruf[h] ? '<a href="#kamus-' + h + '" data-gulir="kamus-' + h + '">' + h + '</a>' : '<span aria-hidden="true">' + h + '</span>'; }).join('');
    var sebelum = '';
    var kamus = KAMUS.map(function (k) {
      var h = k.istilah.charAt(0).toUpperCase(), jangkar = '';
      if (h !== sebelum) { jangkar = ' id="kamus-' + h + '"'; sebelum = h; }
      var bab = BAB.filter(function (b) { return b.id === k.bab; })[0];
      var cariTeks = (k.istilah + ' ' + (k.alias || '') + ' ' + L(k.arti)).toLowerCase();
      return '<div class="istilah"' + jangkar + ' data-istilah="' + esc(k.id) + '" data-teks="' + esc(cariTeks) + '"><dt>' + esc(k.istilah) + (k.alias ? '<small>' + esc(k.alias) + '</small>' : '') + '</dt><dd>' + esc(L(k.arti)) +
        (bab ? ' <a href="#p-' + esc(bab.id) + '">' + esc(t('kamus.baca', { b: L(bab.judul) })) + '</a>' : '') + '</dd></div>';
    }).join('');
    return '<section class="bagian" id="kamus" style="padding-top:28px"><div class="kepala-bagian"><div><h2>' + esc(t('peng.kamus')) + '</h2><p>' + esc(t('peng.kamusSub')) + '</p></div></div>' +
      '<div class="alat kamus-alat"><div class="kolom-cari">' + IK.cari + '<input type="search" id="q-kamus" placeholder="' + esc(t('kamus.cari')) + '" aria-label="' + esc(t('kamus.cari')) + '"></div>' +
      '<div class="hitung" id="hitung-kamus" aria-live="polite">' + esc(t('kamus.hitung', { n: KAMUS.length, t: KAMUS.length })) + '</div></div>' +
      '<nav class="abjad" aria-label="A–Z">' + abjad + '</nav><dl class="kamus">' + kamus + '</dl>' +
      '<div class="kosong" id="kamus-kosong" hidden><b>' + esc(t('kamus.kosong')) + '</b></div></section>';
  }
  /* ---------- pocket books: shelf and page-by-page reader */
  function cariBuku(id) { for (var i = 0; i < BUKU.length; i++) if (BUKU[i].id === id) return BUKU[i]; return null; }
  function gambarHal(b, h) { return b.folder + ('00' + h).slice(-3) + '.webp'; }
  function tautanBuku(id, h) {
    var b = cariBuku(id); if (!b || !h) return '';
    return ' <a class="ke-buku" href="#buku-' + esc(b.id) + '/' + h + '">' + IK.buku + esc(t('buku.lihat', { n: h })) + '</a>';
  }
  function kartuBuku(b) {
    var url = '#buku-' + esc(b.id);
    return '<article class="kartu-buku"><a class="sampul-buku" href="' + url + '" tabindex="-1" aria-hidden="true"><img src="' + esc(gambarHal(b, 1)) + '" alt="" width="991" height="1406" loading="lazy"></a>' +
      '<div class="isi"><p class="meta">' + esc(t('buku.hal', { n: b.halaman })) + ' · PDF ' + esc(b.ukuranPdf) + '</p>' +
      '<h3><a href="' + url + '">' + esc(L(b.judul)) + '</a></h3><p>' + esc(L(b.ringkas)) + '</p>' +
      '<div class="aksi"><a class="tombol kecil" href="' + url + '">' + IK.buku + esc(t('buku.baca')) + '</a>' +
      '<a class="tombol halus kecil" href="' + esc(b.pdf) + '" download>' + IK.unduh + esc(t('buku.unduh', { s: b.ukuranPdf })) + '</a></div></div></article>';
  }
  function hTabBuku() {
    return '<section class="bagian" style="padding-top:28px"><p class="muted" style="margin-bottom:24px;max-width:64ch">' + esc(t('buku.sub')) + '</p>' +
      '<div class="rak-buku">' + BUKU.map(kartuBuku).join('') + '</div></section>';
  }
  function hPembacaBuku(b) {
    if (!b) return '<div class="wrap"><header class="judul-halaman"><h1>' + esc(t('tab.buku')) + '</h1></header>' + hTabBuku() + '</div>';
    return '<section class="pembaca-buku" aria-labelledby="pb-judul"><div class="wrap">' +
      '<a class="pb-kembali" href="#buku">' + IK.kiri + esc(t('buku.kembali')) + '</a>' +
      '<div class="pb-kepala"><div><p class="pb-atas">' + esc(t('buku.atas')) + ' · ' + esc(t('buku.hal', { n: b.halaman })) + '</p><h1 id="pb-judul">' + esc(L(b.judul)) + '</h1>' +
      (lang === 'en' ? '<p class="pb-catatan">' + esc(t('buku.bahasa')) + '</p>' : '') + '</div>' +
      '<div class="pb-aksi"><a class="tombol" href="' + esc(b.pdf) + '" download>' + IK.unduh + esc(t('buku.unduh', { s: b.ukuranPdf })) + '</a>' +
      '<a class="tombol sekunder" href="' + esc(b.teks) + '">' + IK.cari + esc(t('buku.teks')) + '</a></div></div>' +
      '<div class="pb-panggung" id="pb-panggung"><button type="button" class="pb-nav kiri" data-arah="-1" aria-label="' + esc(t('buku.sebelum')) + '" title="' + esc(t('buku.sebelum')) + '">' + IK.kiri + '</button>' +
      '<div class="pb-lembar" id="pb-lembar"></div>' +
      '<button type="button" class="pb-nav kanan" data-arah="1" aria-label="' + esc(t('buku.berikut')) + '" title="' + esc(t('buku.berikut')) + '">' + IK.panah + '</button></div>' +
      '<div class="pb-kontrol"><span id="pb-posisi" class="tnum" aria-live="polite"></span><input type="range" id="pb-geser" min="1" max="' + b.halaman + '" value="1" aria-label="' + esc(t('buku.geser')) + '"></div>' +
      '<p class="pb-petunjuk">' + esc(t('buku.geserHP')) + '</p>' +
      '</div></section>';
  }
  /* page-curl library (StPageFlip, MIT, vendored in assets/js/vendor), loaded only when a book is opened */
  var PF = { status: '', antre: [] };
  function muatPageFlip(cb) {
    if (window.St && window.St.PageFlip) { cb(true); return; }
    if (PF.status === 'gagal') { cb(false); return; }
    PF.antre.push(cb);
    if (PF.status === 'muat') return;
    PF.status = 'muat';
    var s = document.createElement('script');
    function selesai(ok) { PF.status = ok ? 'siap' : 'gagal'; var a = PF.antre; PF.antre = []; a.forEach(function (f) { f(ok); }); }
    s.src = 'assets/js/vendor/page-flip.js';
    s.onload = function () { selesai(!!(window.St && window.St.PageFlip)); };
    s.onerror = function () { selesai(false); };
    document.head.appendChild(s);
  }
  function geraknyaDikurangi() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  var Buku = {
    b: null, hal: 1, besar: false, pf: null, pfUkuran: '',
    ganda: function () { return window.matchMedia('(min-width: 900px)').matches; },
    tampil: function (n) {
      if (this.besar || !this.ganda() || n === 1) return [n];
      var kiri = n % 2 === 0 ? n : n - 1;
      return kiri + 1 <= this.b.halaman ? [kiri, kiri + 1] : [kiri];
    },
    url: function (n) { return '#buku-' + this.b.id + '/' + n; },
    pasang: function (r) {
      var self = this;
      this.hancurkanLipat();
      this.b = cariBuku(r.buku); this.hal = 0; this.besar = false; this.tampilTerakhir = null; this.anim = null;
      if (!this.b) return;
      document.title = L(this.b.pendek) + ' · Jelajah Klamono';
      $$('[data-arah]').forEach(function (x) { x.addEventListener('click', function () { self.geser(Number(x.getAttribute('data-arah'))); }); });
      var g = $('#pb-geser');
      g.addEventListener('input', function () {
        var n = Number(g.value);
        if (self.pf) { self.hal = n; try { self.pf.turnToPage(n - 1); } catch (e) { /* ignore */ } self.isiGambar(n); self.kontrol(n); }
        else self.render(n, true);
      });
      g.addEventListener('change', function () { pergi(self.url(Number(g.value)), true); });
      var p = $('#pb-panggung'), x0 = null, y0 = 0, kx = 0, ky = 0;
      /* click a page to see it large (one page, full width); click again to go back.
         A drag that turns the page also ends in a click, so moved pointers and running turns are ignored. */
      $('#pb-lembar').addEventListener('pointerdown', function (e) { kx = e.clientX; ky = e.clientY; });
      $('#pb-lembar').addEventListener('click', function (e) {
        if (!self.ganda() || Math.abs(e.clientX - kx) > 6 || Math.abs(e.clientY - ky) > 6) return;
        var el = e.target.closest('[data-h]'); if (!el) return;
        if (self.pf && self.pf.getState() !== 'read') return;
        var h = Number(el.getAttribute('data-h')) || self.hal;
        self.besar = !self.besar;
        if (self.besar) { self.hancurkanLipat(); self.hal = h; self.render(h, true); pergi(self.url(h), true); $('#pb-panggung').scrollIntoView({ block: 'start', behavior: 'smooth' }); }
        else { self.hal = h; self.render(h, true); pergi(self.url(h), true); self.siapkanLipat(); }
      });
      p.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' && !self.pf) { x0 = e.clientX; y0 = e.clientY; } });
      p.addEventListener('pointercancel', function () { x0 = null; });
      p.addEventListener('pointerup', function (e) {
        if (x0 === null || self.pf) { x0 = null; return; }
        var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) self.geser(dx < 0 ? 1 : -1);
      });
      this.siapkanLipat();
    },
    /* ---- realistic page curl (StPageFlip). Falls back to the simple renderer when unavailable. */
    siapkanLipat: function () {
      var self = this, b = this.b;
      if (!b || this.besar || geraknyaDikurangi()) return;
      muatPageFlip(function (ok) { if (ok && self.b === b && !self.besar && $('#pb-lembar')) self.bangunLipat(); });
    },
    ukuranLipat: function () {
      var panggung = $('#pb-panggung'); if (!panggung) return null;
      var ganda = this.ganda(), rasio = 991 / 1406, w;
      var lebar = panggung.clientWidth - (ganda ? 2 * (50 + 14) : 0);
      if (ganda) {
        var kepala = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
        var tinggi = Math.min(window.innerHeight - kepala - 250, 940);
        w = Math.floor(Math.min(lebar / 2, Math.max(tinggi, 260) * rasio));
      } else w = Math.floor(lebar);
      if (w < 120) return null;
      return { ganda: ganda, w: w, h: Math.round(w / rasio), kunci: ganda + ':' + w };
    },
    bangunLipat: function () {
      var self = this, b = this.b, lembar = $('#pb-lembar');
      if (!b || !lembar || this.besar || !(window.St && window.St.PageFlip)) return;
      var u = this.ukuranLipat(); if (!u) return;
      this.hancurkanLipat();
      if (this.anim) { try { this.anim.cancel(); } catch (e) { /* ignore */ } this.anim = null; }
      var n = Math.max(1, Math.min(b.halaman, this.hal || 1));
      lembar.className = 'pb-lembar kurl' + (u.ganda ? ' ganda' : ' tunggal');
      lembar.innerHTML = '';
      var wadah = document.createElement('div'); wadah.className = 'pb-buku';
      lembar.appendChild(wadah);
      var daun = [];
      for (var i = 1; i <= b.halaman; i++) {
        var d = document.createElement('div');
        d.className = 'pb-hal ' + (i % 2 === 0 ? 'kiri' : 'kanan');
        d.setAttribute('data-h', i);
        if (u.ganda) d.title = t('buku.perbesar');
        d.innerHTML = '<img alt="' + esc(t('buku.altHal', { n: i })) + '" data-src="' + esc(gambarHal(b, i)) + '" width="991" height="1406" decoding="async" draggable="false">';
        daun.push(d);
      }
      var pf;
      try {
        pf = new window.St.PageFlip(wadah, {
          width: u.w, height: u.h, size: 'fixed', usePortrait: !u.ganda, showCover: true, startPage: n - 1,
          flippingTime: 760, maxShadowOpacity: 0.45, drawShadow: true, showPageCorners: u.ganda,
          disableFlipByClick: u.ganda, mobileScrollSupport: true, swipeDistance: 30, autoSize: true
        });
        this.pf = pf; this.pfUkuran = u.kunci;
        this.isiGambar(n, daun);
        pf.loadFromHTML(daun);
      } catch (e) { this.pf = null; this.render(n, true); return; }
      wadah.style.width = (u.ganda ? 2 * u.w : u.w) + 'px';
      wadah.style.maxWidth = '100%';
      pf.on('flip', function (e) {
        if (self.pf !== pf) return;
        var h = Math.max(1, Math.min(b.halaman, Number(e.data) + 1));
        self.hal = h; self.isiGambar(h); self.kontrol(h);
        if (location.hash !== self.url(h)) pergi(self.url(h), true);
      });
      pf.on('changeState', function (e) { if (self.pf === pf && e.data !== 'read') self.isiGambar(self.hal); });
      this.hal = n; this.kontrol(n);
    },
    hancurkanLipat: function () {
      var pf = this.pf; this.pf = null; this.pfUkuran = '';
      if (pf) { try { pf.destroy(); } catch (e) { /* already detached */ } }
    },
    /* load the images of the pages around page n (the rest wait until they are close) */
    isiGambar: function (n, daun) {
      var b = this.b; if (!b) return;
      var cari = daun ? function (h) { return daun[h - 1]; } : function (h) { return document.querySelector('.pb-buku [data-h="' + h + '"]') || document.querySelector('.pb-hal[data-h="' + h + '"]'); };
      for (var h = n - 3; h <= n + 5; h++) {
        if (h < 1 || h > b.halaman) continue;
        var el = cari(h), img = el && el.querySelector('img[data-src]');
        if (img && !img.getAttribute('src')) img.setAttribute('src', img.getAttribute('data-src'));
      }
      [n - 4, n + 6, n + 7].forEach(function (h) { if (h >= 1 && h <= b.halaman) { var im = new Image(); im.src = gambarHal(b, h); } });
    },
    /* counter, slider and arrow buttons */
    kontrol: function (n) {
      var b = this.b; if (!b || !$('#pb-posisi')) return;
      var hh = this.tampil(n);
      $('#pb-posisi').textContent = t('buku.posisi', { a: hh.join('–'), n: b.halaman });
      $('#pb-geser').value = n;
      $$('[data-arah="-1"]').forEach(function (x) { x.disabled = hh[0] <= 1; });
      $$('[data-arah="1"]').forEach(function (x) { x.disabled = hh[hh.length - 1] >= b.halaman; });
    },
    /* rebuild after a layout change (window size, two-page breakpoint) */
    segarkan: function () {
      if (!this.b || !$('#pb-lembar')) return;
      if (this.pf) { var u = this.ukuranLipat(); if (u && u.kunci !== this.pfUkuran) this.bangunLipat(); }
      else this.render(this.hal, true);
    },
    geser: function (arah) {
      if (!this.b) return;
      if (this.pf) { try { if (arah > 0) this.pf.flipNext('bottom'); else this.pf.flipPrev('bottom'); } catch (e) { /* ignore */ } return; }
      var n = this.hal || 1, N = this.b.halaman, tujuan;
      if (this.ganda() && !this.besar) {
        var kiri = n === 1 ? 1 : (n % 2 === 0 ? n : n - 1);
        tujuan = arah > 0 ? (kiri === 1 ? 2 : kiri + 2) : (kiri <= 2 ? 1 : kiri - 2);
      } else tujuan = n + arah;
      tujuan = Math.max(1, Math.min(N, tujuan));
      if (tujuan !== n) pergi(this.url(tujuan), true);
    },
    ke: function (n) {
      if (!this.b || !$('#pb-lembar')) return;
      this.hal = Math.max(1, Math.min(this.b.halaman, n || 1));
      if (this.pf) {
        try {
          var kol = this.pf.getPageCollection(), tuju = kol.getSpreadIndexByPage(this.hal - 1);
          if (tuju !== null && tuju !== kol.getCurrentSpreadIndex()) { this.isiGambar(this.hal); this.pf.flip(this.hal - 1, 'bottom'); }
        } catch (e) { /* ignore */ }
        this.kontrol(this.hal);
        return;
      }
      this.render(this.hal);
    },
    imgHTML: function (h) {
      var judulKlik = this.ganda() ? t(this.besar ? 'buku.kecilkan' : 'buku.perbesar') : '';
      return '<img src="' + esc(gambarHal(this.b, h)) + '" alt="' + esc(t('buku.altHal', { n: h })) + '" data-h="' + h + '" width="991" height="1406" decoding="async"' + (judulKlik ? ' title="' + esc(judulKlik) + '"' : '') + '>';
    },
    pasangHalaman: function (hh, pudar) {
      var lembar = $('#pb-lembar'); if (!lembar) return;
      lembar.className = 'pb-lembar' + (hh.length === 2 ? ' ganda' : '') + (this.besar ? ' besar' : '') + (pudar ? ' muncul' : '');
      lembar.innerHTML = hh.map(this.imgHTML, this).join('');
    },
    /* which page-turn animation fits this change (empty = no turn, just show) */
    jenisBalik: function (a, bb) {
      if (!a || this.besar) return '';
      try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return ''; } catch (e) { /* ignore */ }
      if (!document.createElement('div').animate) return '';
      if (a.length === 2 && bb.length === 2) { if (bb[0] === a[0] + 2) return 'maju2'; if (bb[0] === a[0] - 2) return 'mundur2'; }
      if (a.length === 1 && bb.length === 1 && !this.ganda()) { if (bb[0] === a[0] + 1) return 'maju1'; if (bb[0] === a[0] - 1) return 'mundur1'; }
      return '';
    },
    /* turn a page like paper: a leaf with the old page on its front and the new page on its back swings over the spine */
    balik: function (jenis, a, bb) {
      var self = this, b = this.b, lembar = $('#pb-lembar'), imgs = $$('img', lembar);
      var lr = lembar.getBoundingClientRect();
      function kotak(el) { var r = el.getBoundingClientRect(); return { l: r.left - lr.left, t: r.top - lr.top, w: r.width, h: r.height }; }
      function ganti(img, h) { img.src = gambarHal(b, h); img.alt = t('buku.altHal', { n: h }); img.setAttribute('data-h', h); }
      var k, muka, punggung = null, asal = 'left center', dari = 0, ke, lama = 760;
      if (jenis === 'maju2') { k = kotak(imgs[1]); ganti(imgs[1], bb[1]); muka = a[1]; punggung = bb[0]; ke = -180; }
      else if (jenis === 'mundur2') { k = kotak(imgs[0]); ganti(imgs[0], bb[0]); muka = a[0]; punggung = bb[1]; asal = 'right center'; ke = 180; }
      else if (jenis === 'maju1') { k = kotak(imgs[0]); ganti(imgs[0], bb[0]); muka = a[0]; ke = -105; lama = 560; }
      else { k = kotak(imgs[0]); muka = bb[0]; dari = -105; ke = 0; lama = 560; }
      var daun = document.createElement('div');
      daun.className = 'pb-daun';
      daun.style.cssText = 'left:' + k.l + 'px;top:' + k.t + 'px;width:' + k.w + 'px;height:' + k.h + 'px;transform-origin:' + asal + ';transform:rotateY(' + dari + 'deg)';
      daun.innerHTML = '<div class="sisi muka"><img src="' + esc(gambarHal(b, muka)) + '" alt=""><span class="bayang"></span></div>' +
        (punggung ? '<div class="sisi punggung"><img src="' + esc(gambarHal(b, punggung)) + '" alt=""><span class="bayang"></span></div>' : '');
      lembar.appendChild(daun);
      var anim = daun.animate([{ transform: 'rotateY(' + dari + 'deg)' }, { transform: 'rotateY(' + ke + 'deg)' }],
        { duration: lama, easing: 'cubic-bezier(.42, .05, .28, 1)', fill: 'forwards' });
      $$('.bayang', daun).forEach(function (x) {
        x.animate([{ opacity: 0 }, { opacity: .55, offset: .5 }, { opacity: 0 }], { duration: lama, easing: 'ease-in-out', fill: 'forwards' });
      });
      this.anim = anim;
      anim.onfinish = function () { if (self.anim !== anim) return; self.anim = null; self.pasangHalaman(bb, false); };
    },
    render: function (n, tanpaAnimasi) {
      var b = this.b, lembar = $('#pb-lembar'); if (!b || !lembar) return;
      if (this.anim) { var lagi = this.anim; this.anim = null; try { lagi.cancel(); } catch (e) { /* ignore */ } if (this.tampilTerakhir) this.pasangHalaman(this.tampilTerakhir, false); }
      var hh = this.tampil(n), sebelum = this.tampilTerakhir || null;
      var jenis = tanpaAnimasi ? '' : this.jenisBalik(sebelum, hh);
      if (jenis) this.balik(jenis, sebelum, hh);
      else this.pasangHalaman(hh, !!sebelum && sebelum.join() !== hh.join());
      this.tampilTerakhir = hh;
      this.kontrol(n);
      [hh[0] - 2, hh[0] - 1, hh[hh.length - 1] + 1, hh[hh.length - 1] + 2, hh[hh.length - 1] + 3].forEach(function (h) {
        if (h >= 1 && h <= b.halaman) { var im = new Image(); im.src = gambarHal(b, h); }
      });
    }
  };
  document.addEventListener('keydown', function (e) {
    var r = ruteSebelum;
    if (!r || r.tab !== 'buku' || !r.buku || Lapis.el || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); Buku.geser(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); Buku.geser(-1); }
  });
  try { window.matchMedia('(min-width: 900px)').addEventListener('change', function () { if (Buku.b && $('#pb-lembar')) { if (Buku.pf) Buku.bangunLipat(); else Buku.render(Buku.hal); } }); } catch (e) { /* older browsers */ }
  (function () {
    var jeda = null;
    window.addEventListener('resize', function () {
      clearTimeout(jeda);
      jeda = setTimeout(function () {
        if (Buku.pf && !$('#pb-lembar')) { Buku.hancurkanLipat(); return; }
        if (Buku.pf) Buku.segarkan();
      }, 220);
    });
  })();

  /* gentle 3D tilt and a soft glare on cards that follow the pointer */
  (function () {
    var SEL = '.herbarium, .kartu-bab, .kartu-buku, .anggota, .kartu-info, .unggulan-atraksi li, .alur-pesan li, .daftar-terima li, .kartu-tanya, .kaca-jalur, .galeri figure, .kamus-kecil';
    var bisa = false;
    try { bisa = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* ignore */ }
    if (!bisa) return;
    var kini = null;
    function lepas(el) { if (!el) return; el.classList.remove('miring'); el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); }
    document.addEventListener('pointermove', function (e) {
      var el = e.target && e.target.closest ? e.target.closest(SEL) : null;
      if (el !== kini) { lepas(kini); kini = el; }
      if (!el) return;
      var r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      var kuat = r.width > 600 ? 2.5 : 7;
      if (!el.querySelector(':scope > .kilap')) { var k = document.createElement('span'); k.className = 'kilap'; k.setAttribute('aria-hidden', 'true'); el.appendChild(k); }
      el.classList.add('miring');
      el.style.setProperty('--rx', ((0.5 - y) * kuat).toFixed(2) + 'deg');
      el.style.setProperty('--ry', ((x - 0.5) * kuat).toFixed(2) + 'deg');
      el.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    }, { passive: true });
    document.addEventListener('pointerleave', function () { lepas(kini); kini = null; });
  })();
  function hTabKisah() {
    return '<section class="bagian" style="padding-top:28px"><p class="muted" style="margin-bottom:20px;max-width:60ch">' + esc(t('kisah.sub')) + '</p>' +
      '<div class="grid-bab">' + ARTIKEL.map(kartuArtikel).join('') + '</div>' +
      '<div class="lipat" style="margin-top:28px;padding:20px"><h2 class="subjudul" style="margin-bottom:8px">' + esc(t('kisah.kirimJ')) + '</h2><p>' + esc(t('kisah.kirim', { email: EMAIL })) + '</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><a class="tombol kecil" href="mailto:' + esc(EMAIL) + '">' + IK.surat + esc(t('tulisEmail')) + '</a><button class="tombol halus kecil" type="button" data-salin="' + esc(EMAIL) + '" data-ok="' + esc(t('emailDisalin')) + '">' + IK.salin + esc(t('salinEmail')) + '</button></div></div></section>';
  }
  function ikatPustaka(tab, r) {
    if (tab === 'buku' && r && r.buku) { Buku.pasang(r); return; }
    var nav = $('.tab-pustaka'), akt = nav && $('[aria-current]', nav);
    if (akt && akt.offsetLeft + akt.offsetWidth > nav.clientWidth) nav.scrollLeft = akt.offsetLeft - 16;
    if (tab === 'tanaman') {
      gambarTanaman();
      var q = $('#q-tanaman'), timer;
      q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { filterTanaman.q = q.value; gambarTanaman(); }, 120); });
      $('#f-bagian').addEventListener('change', function () { filterTanaman.bag = this.value; gambarTanaman(); });
      $('#f-pakai').addEventListener('change', function () { filterTanaman.pakai = this.value; gambarTanaman(); });
      $('#f-urut').addEventListener('change', function () { filterTanaman.urut = this.value; gambarTanaman(); });
      $$('[data-keg]').forEach(function (b) {
        b.addEventListener('click', function () {
          filterTanaman.keg = b.getAttribute('data-keg');
          $$('[data-keg]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          gambarTanaman();
        });
      });
    }
    if (tab === 'kamus') {
      var qk = $('#q-kamus'), semua = $$('.kamus .istilah');
      if (qk) qk.addEventListener('input', function () {
        var kata = qk.value.trim().toLowerCase(), n = 0;
        semua.forEach(function (el) { var cocok = !kata || el.getAttribute('data-teks').indexOf(kata) > -1; el.hidden = !cocok; if (cocok) n++; });
        $('#hitung-kamus').textContent = t('kamus.hitung', { n: n, t: semua.length });
        $('#kamus-kosong').hidden = n > 0;
        $('.abjad').classList.toggle('redup', !!kata);
      });
    }
    $$('[data-gulir]').forEach(function (a) {
      a.addEventListener('click', function (ev) { ev.preventDefault(); var el = document.getElementById(a.getAttribute('data-gulir')); if (el) el.scrollIntoView({ behavior: 'smooth' }); });
    });
  }
  function blokHTML(blok) {
    var out = '', daftar = [];
    function tutupDaftar() { if (daftar.length) { out += '<ul>' + daftar.join('') + '</ul>'; daftar = []; } }
    blok.forEach(function (b) {
      if (b.li) { daftar.push('<li>' + rich(L(b.li)) + '</li>'); return; }
      tutupDaftar();
      if (b.h) out += '<h3>' + rich(L(b.h)) + '</h3>';
      else if (b.p) out += '<p>' + rich(L(b.p)) + '</p>';
      else if (b.fig) out += '<figure><img src="' + esc(b.fig) + '" alt="' + esc(L(b.cap)) + '" loading="lazy"><figcaption><span>' + esc(L(b.cap)) + '</span>' + (b.kredit ? '<span class="kredit">' + IK.kamera + esc(t('kredit.foto')) + '</span>' : '') + '</figcaption></figure>';
    });
    tutupDaftar();
    return out;
  }

  /* ---------- modals for library items */
  function bukaModal(r) {
    var dasar = { t: 'tanaman', p: 'pengetahuan', k: 'kamus', a: 'kisah' }[r.modal];
    var html = '', kelas = 'lembar';
    if (r.modal === 't') {
      var i = TANAMAN.findIndex(function (p) { return p.id === r.id; }); if (i < 0) return pergi('#tanaman', true);
      html = detailTanaman(TANAMAN[i], TANAMAN[i - 1], TANAMAN[i + 1]); kelas += ' tanaman';
    } else if (r.modal === 'p') {
      var j = BAB.findIndex(function (b) { return b.id === r.id; }); if (j < 0) return pergi('#pengetahuan', true);
      html = pembacaBab(BAB[j], BAB[j - 1], BAB[j + 1]); kelas += ' baca bab2';
    } else if (r.modal === 'a') {
      var a = ARTIKEL.filter(function (x) { return x.id === r.id; })[0]; if (!a) return pergi('#kisah', true);
      html = pembacaArtikel(a); kelas += ' baca bab2';
    } else if (r.modal === 'k') {
      var k = KAMUS.filter(function (x) { return x.id === r.id; })[0]; if (!k) return pergi('#pengetahuan', true);
      html = detailIstilah(k); kelas += ' kecil';
    }
    var judul = { t: t('tab.tanaman'), p: t('tab.pengetahuan'), k: t('peng.kamus'), a: t('tab.kisah') }[r.modal];
    var tautan = location.href.split('#')[0] + '#' + { t: 't-', p: 'p-', k: 'k-', a: 'a-' }[r.modal] + r.id;
    var wadah = Lapis.buka('<div class="' + kelas + '" role="dialog" aria-modal="true" aria-label="' + esc(judul) + '">' +
      '<div class="lembar-kepala"><span class="judul-kecil">' + esc(judul) + '</span>' +
      '<button class="tombol-ikon" type="button" data-salin="' + esc(tautan) + '" data-ok="' + esc(t('tautanDisalin')) + '">' + IK.salin + '<span class="label">' + esc(t('salinTautan')) + '</span></button>' +
      '<button class="tombol-ikon" type="button" data-tutup aria-label="' + esc(t('tutup')) + '">' + IK.tutup + '</button>' +
      (/bab2/.test(kelas) ? '<span class="b2-maju" aria-hidden="true"><i></i></span>' : '') + '</div>' +
      '<div class="lembar-isi">' + html + '</div></div>', '', { jenis: 'pustaka', onClose: function () { tutupRute(dasar); } });
    $$('[data-ganti]', wadah).forEach(function (a) { a.addEventListener('click', function (ev) { ev.preventDefault(); pergi(a.getAttribute('href'), true); }); });
    var lembar = $('.lembar', wadah); if (lembar) lembar.scrollTop = 0;
    /* reading progress: a thin line under the sheet header */
    var maju = lembar && $('.b2-maju i', lembar);
    if (maju) {
      var ukur = function () { var h = lembar.scrollHeight - lembar.clientHeight; maju.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, lembar.scrollTop / h) : 0) + ')'; };
      lembar.addEventListener('scroll', ukur, { passive: true }); ukur();
    }
  }
  function navDetail(prev, next, pref, nama) {
    return '<nav class="navigasi-detail">' +
      (prev ? '<a href="#' + pref + prev.id + '" data-ganti><small>' + esc(t('d.sebelum')) + '</small><b>' + esc(nama(prev)) + '</b></a>' : '<span></span>') +
      (next ? '<a class="berikut" href="#' + pref + next.id + '" data-ganti><small>' + esc(t('d.berikut')) + '</small><b>' + esc(nama(next)) + '</b></a>' : '') + '</nav>';
  }
  /* plant sheet: a herbarium page — photo with its number, the names as tiles, quick facts, then the text */
  function navTanaman(prev, next) {
    function kartu(x, kelas, label) {
      return '<a class="dt-nav ' + kelas + '" href="#t-' + esc(x.id) + '" data-ganti><span class="dt-nav-foto">' + (x.foto ? '<img src="' + esc(x.foto) + '" alt="" loading="lazy">' : IK.tunas) + '</span>' +
        '<span class="dt-nav-teks"><small>' + esc(label) + '</small><b>' + esc(x.nama) + '</b></span></a>';
    }
    return '<nav class="dt-navigasi">' + (prev ? kartu(prev, 'sebelum', t('d.sebelum')) : '<span></span>') + (next ? kartu(next, 'berikut', t('d.berikut')) : '') + '</nav>';
  }
  function detailTanaman(p, prev, next) {
    var no = String(p.no).padStart(2, '0');
    var tags = p.kegunaan.map(function (k) { return '<a class="tag' + (k === 'adat' ? ' merah' : '') + '" href="#tanaman" data-keg-set="' + k + '">' + esc(t('keg.' + k)) + '</a>'; }).join(' ');
    var bagian = p.bagian.map(function (b) { return t('bag.' + b); }).join(', '), pakai = p.pakai.map(function (b) { return t('pakai.' + b); }).join(', ');
    var nama = [['moi', t('d.moi'), p.moi]];
    if (p.alias) nama.push(['lain', t('d.lain'), p.alias]);
    if (p.lokal) nama.push(['lokal', t('d.lokal'), p.lokal]);
    if (lang === 'en' && p.gloss) nama.push(['en', t('d.en'), p.gloss]);
    var cara = L(p.pengolahan), desk = L(p.deskripsi);
    function kreditFotoTanaman(p) {
      if (!p.foto) return '';
      var k = p.fotoKredit;
      if (!k) return '<figcaption>' + IK.kamera + esc(t('kredit.foto')) + '</figcaption>';
      /* a species photo from Wikimedia Commons: name the author, link the file page and licence, say it was cropped */
      return '<figcaption class="kredit-luar">' + IK.kamera + '<span>' + esc(t('kredit.ilustrasi')) + ': <a href="' + esc(k.sumber) + '" target="_blank" rel="noopener">' + esc(k.oleh) + '</a>, Wikimedia Commons · <a href="' + esc(k.lisensiUrl) + '" target="_blank" rel="noopener license">' + esc(k.lisensi) + '</a> · ' + esc(t('kredit.dipotong')) + '</span></figcaption>';
    }
    return '<article class="detail-tanaman dt2">' +
      '<figure class="dt-foto">' + fotoAtauKosong(p.foto, p.nama, false) +
        '<span class="dt-no tnum" aria-hidden="true">' + no + '</span>' +
        kreditFotoTanaman(p) + '</figure>' +
      '<div class="dt-isi">' +
        '<header class="dt-kepala"><p class="dt-atas"><span class="tnum">' + esc(t('no')) + ' ' + no + '</span><span class="titik" aria-hidden="true"></span><span>' + esc(t('kel.' + p.kelompok)) + '</span></p>' +
        '<h2>' + esc(p.nama) + '</h2>' +
        '<p class="dt-latin">' + (p.latin ? '<i>' + esc(p.latin) + '</i>' : '<span class="muted">' + esc(t('d.latin')) + ': ' + esc(t('d.belum')) + '</span>') + '</p></header>' +
        '<dl class="dt-nama">' + nama.map(function (n) { return '<div class="' + n[0] + '"><dt>' + esc(n[1]) + '</dt><dd>' + (n[2] ? esc(n[2]) : '<span class="belum">' + esc(t('d.belum')) + '</span>') + '</dd></div>'; }).join('') + '</dl>' +
        '<div class="dt-guna"><span class="dt-label">' + esc(t('d.untuk')) + '</span><div class="baris-tag">' + tags + '</div></div>' +
        '<dl class="dt-fakta"><div><span class="ik" aria-hidden="true">' + IK.tunas + '</span><dt>' + esc(t('d.bagian')) + '</dt><dd>' + esc(bagian) + '</dd></div>' +
        '<div><span class="ik" aria-hidden="true">' + IK.olahan + '</span><dt>' + esc(t('d.pakai')) + '</dt><dd>' + esc(pakai) + '</dd></div></dl>' +
        '<div class="prosa dt-prosa">' + desk.map(function (x, i) { return '<p' + (i === 0 ? ' class="lead"' : '') + '>' + rich(x) + '</p>'; }).join('') + '</div>' +
        (cara.length ? '<section class="blok-cara dt-cara"><h3>' + IK.olahan + esc(t('d.cara')) + '</h3>' + cara.map(function (x) { return '<p>' + rich(x) + '</p>'; }).join('') + '</section>' : '') +
        (p.catatan ? '<p class="catatan-redaksi"><b>' + esc(t('d.catatan')) + ':</b> ' + esc(L(p.catatan)) + '</p>' : '') +
        (p.kegunaan[0] !== 'adat' ? '<div class="peringatan">' + IK.awas + '<p>' + esc(t('tanaman.peringatan')) + '</p></div>' : '') +
        '<p class="dt-sumber">' + esc(t('d.sumberTanaman')) + tautanBuku('tanaman-obat', cariBuku('tanaman-obat') && p.no ? cariBuku('tanaman-obat').tanamanMulai + p.no : 0) + '</p>' +
        navTanaman(prev, next) + '</div></article>';
  }
  /* reading sheet (chapters and stories): a cover with the title on it, then a calm text column with a drop cap,
     and closing cards for terms, source and the previous/next chapter */
  /* the cover: the photo blurred as a backdrop with the photo itself framed beside the title (small photos stay sharp);
     a map stays a faint texture (it is shown in full in the text); no photo → the card gradient with a big letter */
  function sampulBaca(o) {
    var jenis = !o.foto ? 'gradasi' : o.redup ? 'redup' : 'foto';
    var teks = '<div class="b2-sampul-teks"><p class="b2-atas">' + o.atas + '</p><h2>' + esc(o.judul) + '</h2></div>';
    var bingkai = jenis === 'foto' ? '<figure class="b2-foto"><img src="' + esc(o.foto) + '" alt="' + esc(o.alt || '') + '">' +
      (o.alt || o.kredit ? '<figcaption>' + (o.alt ? '<span>' + esc(o.alt) + '</span>' : '') + (o.kredit ? '<span class="kredit">' + IK.kamera + esc(o.kredit) + '</span>' : '') + '</figcaption>' : '') + '</figure>' : '';
    return '<header class="b2-sampul ' + jenis + '" style="' + gradasiUntuk(o.id) + '">' +
      (jenis === 'gradasi' ? pola('pola') + '<span class="b2-huruf" aria-hidden="true">' + (o.ikon || esc(o.judul.charAt(0))) + '</span>' : '<img class="b2-latar" src="' + esc(o.foto) + '" alt="" aria-hidden="true">') +
      '<div class="b2-sampul-dalam">' + teks + bingkai + '</div></header>';
  }
  function metaBaca(daftar) {
    return '<ul class="b2-meta">' + daftar.filter(Boolean).map(function (m) { return '<li>' + m[0] + '<span>' + esc(m[1]) + '</span></li>'; }).join('') + '</ul>';
  }
  function navBab(prev, next) {
    function kartu(x, kelas, label) {
      var gb = x.sampul ? '<img src="' + esc(x.sampul) + '" alt="" loading="lazy">' : '<span class="b2-nav-huruf" style="' + gradasiUntuk(x.id) + '">' + esc(L(x.judul).charAt(0)) + '</span>';
      return '<a class="dt-nav ' + kelas + '" href="#p-' + esc(x.id) + '" data-ganti><span class="dt-nav-foto">' + gb + '</span>' +
        '<span class="dt-nav-teks"><small>' + esc(label) + '</small><b>' + esc(L(x.judul)) + '</b></span></a>';
    }
    return '<nav class="dt-navigasi b2-nav">' + (prev ? kartu(prev, 'sebelum', t('bab.sebelum')) : '<span></span>') + (next ? kartu(next, 'berikut', t('bab.berikut')) : '') + '</nav>';
  }
  function pembacaBab(b, prev, next) {
    var terkait = KAMUS.filter(function (k) { return k.bab === b.id; });
    var no = BAB.indexOf(b) + 1, blok = b.blok, kredit = '', alt = '';
    /* the cover photo is usually also the chapter's first figure: show it once, as the cover, keeping its credit */
    if (b.sampul && !b.sampulDiTeks && blok.length && blok[0].fig === b.sampul) {
      alt = L(blok[0].cap); if (blok[0].kredit) kredit = t('kredit.foto');
      blok = blok.slice(1);
    } else if (b.sampul && !b.sampulDiTeks) {
      blok = blok.filter(function (x) { if (x.fig === b.sampul) { alt = L(x.cap); if (x.kredit) kredit = t('kredit.foto'); return false; } return true; });
    }
    var bk = cariBuku(b.sumber === 'tanaman' ? 'tanaman-obat' : 'sejarah-klamono');
    return '<article class="pembaca bab2">' +
      sampulBaca({ id: b.id, foto: b.sampul, redup: b.sampulDiTeks, alt: alt, kredit: kredit, judul: L(b.judul),
        atas: '<span class="b2-pil">' + esc(t('bab.ke', { n: String(no).padStart(2, '0'), t: BAB.length })) + '</span><span class="b2-pil halus">' + esc(t('bab.' + b.kategori)) + '</span>' }) +
      '<div class="b2-kolom">' +
        metaBaca([[IK.buku, t(b.sumber === 'tanaman' ? 'buku.pendekTanaman' : 'buku.pendekKlamono')], [IK.jam, t('menitBaca', { m: menitBaca(b) })], terkait.length ? [IK.istilah, t('bab.nIstilah', { n: terkait.length })] : null]) +
        '<p class="b2-lead">' + esc(L(b.ringkas)) + '</p>' +
        '<div class="prosa b2-prosa">' + blokHTML(blok) + '</div>' +
        (terkait.length ? '<section class="b2-kartu b2-istilah"><h3>' + IK.istilah + esc(t('bab.istilah')) + '</h3><div class="chips">' + terkait.map(function (k) { return '<a class="chip" href="#k-' + esc(k.id) + '" data-ganti>' + esc(k.istilah) + '</a>'; }).join('') + '</div></section>' : '') +
        '<section class="b2-sumber"><span class="b2-sumber-ik" aria-hidden="true">' + IK.buku + '</span><div><small>' + esc(t('bab.sumberJudul')) + '</small><p>' + esc(t(b.sumber === 'tanaman' ? 'd.sumberTanaman' : 'd.sumberKlamono').replace(/^(Sumber|Source):\s*/, '')) + '</p>' + (bk ? tautanBuku(bk.id, (bk.babHalaman || {})[b.id]) : '') + '</div></section>' +
        navBab(prev, next) +
      '</div></article>';
  }
  function pembacaArtikel(a) {
    return '<article class="pembaca bab2">' +
      sampulBaca({ id: a.id, foto: a.foto, judul: L(a.judul), ikon: IK.buku,
        atas: '<span class="b2-pil">' + esc(t('art.' + a.kategori)) + '</span>' }) +
      '<div class="b2-kolom">' +
        metaBaca([[IK.kalender, tanggal(a.tanggal)], [IK.orang, t('oleh', { p: a.penulis })]]) +
        '<p class="b2-lead">' + esc(L(a.ringkas)) + '</p>' +
        '<div class="prosa b2-prosa">' + L(a.isi).map(function (x) { return '<p>' + rich(x) + '</p>'; }).join('') + '</div>' +
        (a.tautan && a.tautan.length ? '<div class="tautan-artikel">' + a.tautan.map(function (x, i) {
          return '<a class="tombol' + (i ? ' halus' : '') + ' kecil" href="' + esc(x.url) + '"' + (x.luar ? ' target="_blank" rel="noopener"' : '') + '>' + (x.luar ? '' : IK.buku) + esc(L(x.teks)) + (x.luar ? IK.panah : '') + '</a>';
        }).join('') + '</div>' : '') +
      '</div></article>';
  }
  function detailIstilah(k) {
    var bab = BAB.filter(function (b) { return b.id === k.bab; })[0];
    return '<article class="pembaca"><div class="kategori"><span class="tag daun">' + esc(t('peng.kamus')) + '</span></div><h2 style="font-size:2.4rem">' + esc(k.istilah) + '</h2>' +
      (k.alias ? '<p class="muted" style="margin:-6px 0 14px">' + esc(k.alias) + '</p>' : '') +
      '<div class="prosa"><p>' + esc(L(k.arti)) + '</p></div>' +
      (bab ? '<p style="margin-top:20px"><a class="tombol kecil" href="#p-' + esc(bab.id) + '" data-ganti>' + IK.buku + esc(t('kamus.baca', { b: L(bab.judul) })) + '</a></p>' : '') + '</article>';
  }
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest('[data-keg-set]');
    if (a) { ev.preventDefault(); filterTanaman = { q: '', keg: a.getAttribute('data-keg-set'), bag: '', pakai: '', urut: 'buku' }; Lapis.tutup(); pergi('#tanaman', true); rute(true); }
  });

  /* ---------- about */
  function hTentang() {
    var tim = TIM.map(function (m, i) {
      var potret = m.foto ? '<img src="' + esc(m.foto) + '" alt="' + esc(m.nama) + '" width="720" height="793" loading="lazy">' : '<span class="inisial-besar" aria-hidden="true">' + esc(inisial(m.nama)) + '</span>';
      return '<div class="anggota' + (i === 0 ? ' ketua' : '') + '"><div class="potret' + (m.foto ? ' ada-foto' : '') + '">' + potret + '</div><div><h3>' + esc(m.nama) + '</h3><p class="peran">' + esc(L(m.peran)) + ', ' + esc(L(m.bidang)) + (m.instansi ? '<br>' + esc(m.instansi) : '') + '</p></div><p class="keahlian">' + esc(L(m.keahlian)) + '</p></div>';
    }).join('');
    var galeri = (KLM.galeri || []).map(function (g) { return '<figure' + (g.lebar ? ' class="lebar"' : '') + '><img src="' + esc(g.foto) + '" alt="' + esc(L(g.ket)) + '" loading="lazy"><figcaption>' + esc(L(g.ket)) + '</figcaption></figure>'; }).join('');
    /* thanks section: see hTerima */
    var akronim = [['N', 'Nature', 'noken.N1'], ['O', 'Origin', 'noken.O'], ['K', 'Knowledge', 'noken.K'], ['E', 'Empowerment', 'noken.E'], ['N', 'Networking', 'noken.N2']];
    return kepalaHalaman('kepala-tentang', t('tentang.label'), t('tentang.judul'), t('tentang.sub'),
        deretAngka([[TIM.length, t('angka.peneliti')], [kampungAktif().length, t('angka.kampungMitra')], [BUKU.length, t('angka.buku')]])) +
      '<section class="pita noken-model berombak" aria-labelledby="noken-judul"><div class="wrap">' +
      '<div class="noken-kepala"><p class="noken-label">' + esc(t('noken.label')) + '</p><h2 id="noken-judul">' + esc(t('noken.judul')) + '</h2><p>' + esc(t('noken.sub')) + '</p></div>' +
      '<ol class="noken-akronim">' + akronim.map(function (a) { return '<li><span class="huruf" aria-hidden="true">' + a[0] + '</span><span class="kata">' + a[1] + '</span><p>' + esc(t(a[2])) + '</p></li>'; }).join('') + '</ol></div></section>' +
      '<div class="wrap">' +
      '<section class="bagian"><div class="kepala-bagian"><h2>' + esc(t('tentang.tim')) + '</h2></div><div class="grid-tim">' + tim + '</div></section>' +
      '<section class="bagian"><div class="kepala-bagian"><h2>' + esc(t('tentang.galeri')) + '</h2></div><div class="galeri">' + galeri + '</div></section>' +
      '<section class="bagian bagian-terima" aria-labelledby="terima-judul">' + hTerima() + '</section>' +
      '<section class="bagian bagian-kontak"><span class="cahaya c1" aria-hidden="true"></span><div class="kepala-bagian"><div><h2>' + esc(t('tentang.kontak')) + '</h2><p>' + esc(t('tentang.kontakSub')) + '</p></div></div>' +
      '<div class="kontak-jalur">' +
      (waTujuan() ? '<div class="kontak-kotak wisata"><span class="kontak-ikon" aria-hidden="true">' + IK.wa + '</span><h3>' + esc(t('kontak.wisataJudul')) + '</h3><p>' + esc(t('kontak.wisataIsi')) + '</p>' +
        '<a class="tombol wa" href="' + esc(tautanWA(t('kontak.tanyaUmum', { k: namaKontak() }))) + '" target="_blank" rel="noopener">' + IK.wa + 'WhatsApp ' + esc(formatWA(waTujuan())) + '</a></div>' : '') +
      '<div class="kontak-kotak tulisan"><span class="kontak-ikon" aria-hidden="true">' + IK.surat + '</span><h3>' + esc(t('kontak.tulisanJudul')) + '</h3><p>' + esc(t('kontak.tulisanIsi')) + '</p>' +
        '<p class="alamat">' + esc(EMAIL) + '</p>' +
        '<div class="kontak-tombol"><a class="tombol" href="mailto:' + esc(EMAIL) + '">' + IK.surat + esc(t('tulisEmail')) + '</a><button class="tombol halus" type="button" data-salin="' + esc(EMAIL) + '" data-ok="' + esc(t('emailDisalin')) + '">' + IK.salin + esc(t('salinEmail')) + '</button>' +
        (namaIG(CFG.instagram) ? '<a class="tombol halus" href="' + esc(tautanIG(namaIG(CFG.instagram))) + '" target="_blank" rel="noopener">' + IK.instagram + '@' + esc(namaIG(CFG.instagram)) + '</a>' : '') + '</div></div>' +
      '</div></section>' +
      '<section class="bagian"><div class="kepala-bagian"><h2>' + esc(t('tentang.pendukung')) + '</h2></div><div class="logo-pendukung">' +
      (KLM.pendukung || []).map(function (p) { return '<figure><img src="' + esc(p.logo) + '" alt="" loading="lazy"><figcaption>' + esc(p.nama) + '</figcaption></figure>'; }).join('') + '</div></section></div>';
  }

  /* thank-you panel: the host villages drawn as one line from west to east, like the river on the map */
  function hTerima() {
    var tk = KLM.terimaKasih || {}, daftar = tk.daftar || [];
    var jalur = daftar.filter(function (d) { return d.jalurKampung; })[0], lain = daftar.filter(function (d) { return !d.jalurKampung; });
    var kampung = (KLM.kampung || []).map(function (k) { return k.nama; });
    return '<div class="terima-panel">' +
      '<div class="terima-atas"><p class="terima-label"><span class="titik" aria-hidden="true"></span>' + esc(t('terima.label')) + '</p>' +
      '<h2 id="terima-judul">' + esc(t('terima.judul')) + '<em>Klamono Raya</em>.</h2>' +
      '<p class="terima-kasih">' + esc(L(tk.pesan)) + '</p></div>' +
      (jalur && kampung.length ? '<figure class="terima-jalur" style="--n:' + kampung.length + '"><figcaption><b>' + esc(t('terima.kampung', { n: kampung.length })) + '</b><span>' + esc(L(jalur.peran)) + '</span></figcaption>' +
        '<ol aria-label="' + esc(jalur.nama) + '">' + kampung.map(function (n) { return '<li><span class="simpul" aria-hidden="true"></span><span class="nama">' + esc(n) + '</span></li>'; }).join('') + '</ol>' +
        '<p class="arah" aria-hidden="true"><span>' + esc(t('terima.barat')) + '</span><span>' + esc(t('terima.timur')) + '</span></p></figure>' : '') +
      lain.map(function (d) { return '<p class="terima-moi"><span class="ikon-terima" aria-hidden="true">' + (IK[d.ikon] || IK.daun) + '</span><span><b>' + esc(d.nama) + '</b><span>' + esc(L(d.peran)) + '</span></span></p>'; }).join('') +
      '</div>';
  }

  /* ------------------------------------------------------------ search overlay */
  var Cari = {
    tipe: 'semua', q: '', pilih: 0,
    buka: function (pertahankan, awal) {
      var self = this;
      if (!pertahankan) { this.q = awal || ''; this.tipe = 'semua'; }
      var tipe = ['semua', 'tanaman', 'bab', 'istilah', 'artikel', 'pengalaman'];
      var wadah = Lapis.buka('<div class="kotak-cari" role="dialog" aria-modal="true" aria-label="' + esc(t('cari')) + '">' +
        '<div class="atas">' + IK.cari + '<input type="search" id="q-global" value="' + esc(this.q) + '" placeholder="' + esc(t('cari.ph')) + '" aria-label="' + esc(t('cari')) + '" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="hasil-global">' +
        '<button class="tombol-ikon" type="button" data-tutup aria-label="' + esc(t('cari.tutup')) + '">' + IK.tutup + '</button></div>' +
        '<div class="filter" role="group">' + tipe.map(function (x) { return '<button class="chip" type="button" data-tipe="' + x + '" aria-pressed="' + (self.tipe === x) + '">' + esc(t('tipe.' + x)) + '</button>'; }).join('') + '</div>' +
        '<div class="hasil" id="hasil-global" role="listbox"></div>' +
        '<div class="kaki-cari"><span>' + esc(t('cari.navigasi')) + '</span><span>' + esc(t('cari.enter')) + '</span><span>' + esc(t('cari.esc')) + '</span></div></div>', '', { cari: true, jenis: 'cari', fokus: '#q-global' });
      var q = $('#q-global', wadah);
      q.addEventListener('input', function () { self.q = q.value; self.pilih = 0; self.gambar(); });
      q.addEventListener('keydown', function (ev) {
        var item = $$('#hasil-global a');
        if (ev.key === 'ArrowDown') { ev.preventDefault(); self.pilih = Math.min(item.length - 1, self.pilih + 1); self.sorot(); }
        else if (ev.key === 'ArrowUp') { ev.preventDefault(); self.pilih = Math.max(0, self.pilih - 1); self.sorot(); }
        else if (ev.key === 'Enter') { ev.preventDefault(); if (item[self.pilih]) item[self.pilih].click(); }
      });
      $$('[data-tipe]', wadah).forEach(function (b) {
        b.addEventListener('click', function () {
          self.tipe = b.getAttribute('data-tipe'); self.pilih = 0;
          $$('[data-tipe]', wadah).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          self.gambar(); q.focus();
        });
      });
      $('#hasil-global', wadah).addEventListener('click', function (ev) {
        var a = ev.target.closest('a[href]'); if (!a) return;
        var b = ev.target.closest('[data-saran]');
        if (b) return;
        ev.preventDefault(); Lapis.tutup(); var h = a.getAttribute('href');
        if (location.hash === h) rute(true); else location.hash = h;
      });
      $('#hasil-global', wadah).addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-saran]'); if (!b) return;
        q.value = self.q = b.getAttribute('data-saran'); self.gambar(); q.focus();
      });
      this.gambar();
      try { q.setSelectionRange(q.value.length, q.value.length); } catch (e) { /* search inputs in some browsers */ }
    },
    gambar: function () {
      var wadah = $('#hasil-global'); if (!wadah) return;
      var q = this.q.trim();
      if (!q) {
        var saran = lang === 'id' ? ['malaria', 'luka', 'egek', 'sagu', 'noken', 'Bambu Tui', 'NNGPM', 'Klawana'] : ['malaria', 'wound', 'egek', 'sago', 'noken', 'Bambu Tui', 'NNGPM', 'birds'];
        wadah.innerHTML = '<div class="saran"><b class="muted" style="font-size:.85rem">' + esc(t('cari.coba')) + '</b><div class="chips">' + saran.map(function (s) { return '<button class="chip" type="button" data-saran="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div></div>';
        return;
      }
      var hasil = cari(q, this.tipe).slice(0, 40);
      if (!hasil.length) { wadah.innerHTML = '<div class="kosong" style="margin:12px"><b>' + esc(t('cari.kosong', { q: q })) + '</b>' + esc(t('cari.kosongSaran')) + '</div>'; return; }
      var grup = {}, urutan = [];
      hasil.forEach(function (h) { if (!grup[h.e.tipe]) { grup[h.e.tipe] = []; urutan.push(h.e.tipe); } grup[h.e.tipe].push(h); });
      var html = '', i = 0;
      urutan.forEach(function (g) {
        html += '<div class="grup">' + esc(t('tipe.' + g)) + '</div>';
        grup[g].forEach(function (h) {
          var jh = judulHasil(h.e), o = h.e.obj;
          var gb = h.e.tipe === 'tanaman' && o.foto ? '<img src="' + esc(o.foto) + '" alt="">' : h.e.tipe === 'bab' && o.sampul ? '<img src="' + esc(o.sampul) + '" alt="">' : h.e.tipe === 'artikel' && o.foto ? '<img src="' + esc(o.foto) + '" alt="">' :
            (h.e.tipe === 'pengalaman' ? ikonE(o) : h.e.tipe === 'istilah' ? IK.istilah : h.e.tipe === 'tanaman' ? IK.daun.replace('stroke-width="2.5"', 'stroke-width="6"') : IK.buku);
          html += '<a href="' + esc(h.e.href) + '" role="option" id="h' + i + '" aria-selected="' + (i === 0) + '"><span class="gb">' + gb + '</span><span style="min-width:0"><b>' + tandai(jh.j, q) + '</b>' +
            (jh.s ? '<span class="sub">' + tandai(jh.s, q) + '</span>' : '') + '<span class="cuplik">' + cuplikan(teksPanjang(h.e), q) + '</span></span></a>';
          i++;
        });
      });
      wadah.innerHTML = html; this.sorot();
    },
    sorot: function () {
      var self = this;
      $$('#hasil-global a').forEach(function (a, i) { a.setAttribute('aria-selected', String(i === self.pilih)); if (i === self.pilih) { a.scrollIntoView({ block: 'nearest' }); var q = $('#q-global'); if (q) q.setAttribute('aria-activedescendant', a.id); } });
    }
  };

  /* ------------------------------------------------------------ booking */
  var NEGARA = 'ID AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW'.split(' ');
  function namaNegara(kode, l) {
    try { return new Intl.DisplayNames([l || lang], { type: 'region' }).of(kode) || kode; } catch (e) { return kode; }
  }
  function hariIni() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  var Pesan = {
    d: null, langkah: 1, status: '', galatJenis: '',
    baru: function (id) {
      this.d = { pengalaman: id || (PENGALAMAN[0] && PENGALAMAN[0].id) || '', tanggal: '', fleksibel: false, durasi: '1', dewasa: 2, anak: 0, jemput: false, nama: '', email: '', telepon: '', negara: lang === 'id' ? 'ID' : '', pemandu: lang === 'id' ? '0' : '1', kebutuhan: '', pesan: '', setuju: false, website: '' };
      this.langkah = 1; this.status = ''; this.kode = '';
    },
    buka: function (id, baru) {
      if (!this.d || (id && this.d.pengalaman !== id && this.status !== '') || this.status === 'berhasil') this.baru(id);
      else if (id && !this.d.nama && this.langkah === 1) this.d.pengalaman = id;
      this.gambar();
    },
    gambar: function () {
      var self = this, e = cariPengalaman(this.d.pengalaman) || PENGALAMAN[0];
      var w = L(CFG.pemesanan && CFG.pemesanan.waktuBalasan) || '1–3 hari';
      var isi;
      if (this.status === 'berhasil') isi = this.hBerhasil(e);
      else if (this.status === 'gagal') isi = this.hGagal(e);
      else isi = '<ol class="langkah-langkah" aria-label="' + esc(t('pesan.judul')) + '">' + [1, 2, 3].map(function (n) { return '<li class="' + (n < self.langkah ? 'selesai' : n === self.langkah ? 'kini' : '') + '"' + (n === self.langkah ? ' aria-current="step"' : '') + '>' + n + '. ' + esc(t('pesan.l' + n)) + '</li>'; }).join('') + '</ol>' +
        '<form id="form-pesan" novalidate>' + (this.langkah === 1 ? this.hL1() : this.langkah === 2 ? this.hL2() : this.hL3(e)) + '</form>';
      var samping = '<aside class="samping-pesan"><div class="blok"><b>' + esc(t('samping.judul')) + '</b><ol style="margin:0;padding-left:18px;display:grid;gap:6px"><li>' + esc(t('samping.1')) + '</li><li>' + esc(t(CFG.pemesanan && CFG.pemesanan.urlGoogleScript ? 'samping.2' : 'samping.2wa')) + '</li><li>' + esc(t('samping.3', { w: w, k: namaKontak() })) + '</li></ol></div>' +
        '<div class="blok"><b>' + esc(t('samping.data')) + '</b><p>' + esc(t('samping.dataIsi')) + '</p></div></aside>';
      var html = '<div class="lembar" role="dialog" aria-modal="true" aria-label="' + esc(t('pesan.judul')) + '"><div class="lembar-kepala"><span class="judul-kecil">' + esc(t('pesan.judul')) + (e ? ': ' + esc(e.kampung) : '') + '</span>' +
        '<button class="tombol-ikon" type="button" data-tutup aria-label="' + esc(t('tutup')) + '">' + IK.tutup + '</button></div>' +
        '<div class="lembar-isi">' + (this.status ? isi : '<div class="pesan-tata"><div style="min-width:0">' + isi + '</div>' + samping + '</div>') + '</div></div>';
      var wadah = Lapis.buka(html, '', { jenis: 'pesan', onClose: function () { var sel = self.d.pengalaman; if (self.status === 'berhasil') self.d = null; tutupRute('x-' + sel); }, fokus: this.status ? '.lembar' : '#form-pesan input, #form-pesan select' });
      this.ikat(wadah);
    },
    pratinjau: function (e) {
      if (!e) return '';
      return '<span class="ikon-kat" style="--w:' + warnaKat(e.kategori) + '">' + ikonE(e) + '</span><span class="min"><b>' + esc(L(e.judul)) + '</b><small>Kampung ' + esc(e.kampung) + ' · ' + esc(t('kat.' + e.kategori)) + ' · ' + esc(L(e.durasi)) + '</small></span>' +
        (e === UNGGULAN ? '<span class="tag unggul">' + IK.bintang + esc(t('ung.lencana')) + '</span>' : '');
    },
    hL1: function () {
      var d = this.d;
      var pil = '<select id="f-pengalaman" name="pengalaman">' + kampungAktif().map(function (k) {
        return '<optgroup label="Kampung ' + esc(k.nama) + '">' + pengalamanDi(k.id).map(function (e) {
          return '<option value="' + esc(e.id) + '"' + (d.pengalaman === e.id ? ' selected' : '') + '>' + esc(L(e.judul)) + (e === UNGGULAN ? ' ★' : '') + (e.status !== 'buka' ? ' (' + esc(t('status.' + e.status)) + ')' : '') + '</option>';
        }).join('') + '</optgroup>';
      }).join('') + '</select><div class="pratinjau-pengalaman" id="pratinjau-pengalaman">' + this.pratinjau(cariPengalaman(d.pengalaman) || PENGALAMAN[0]) + '</div>';
      var dur = [0, 1, 2, 3, 4].map(function (n) { return '<option value="' + n + '"' + (String(d.durasi) === String(n) ? ' selected' : '') + '>' + esc(t('durasi.' + n)) + '</option>'; }).join('');
      return '<div class="form-grid"><fieldset class="isian" style="border:0;padding:0;margin:0"><legend class="lbl" style="margin-bottom:6px"><label for="f-pengalaman">' + esc(t('f.pengalaman')) + '</label></legend><div class="pilihan-pengalaman">' + pil + '</div></fieldset>' +
        '<div class="form-grid dua"><div class="isian" data-isian="tanggal"><label for="f-tanggal">' + esc(t('f.tanggal')) + '</label><input type="date" id="f-tanggal" min="' + hariIni() + '" value="' + esc(d.tanggal) + '"><label class="cek" style="font-weight:500"><input type="checkbox" id="f-fleksibel"' + (d.fleksibel ? ' checked' : '') + '>' + esc(t('f.fleksibel')) + '</label></div>' +
        '<div class="isian"><label for="f-durasi">' + esc(t('f.durasi')) + '</label><select id="f-durasi">' + dur + '</select></div></div>' +
        '<div class="form-grid dua"><div class="isian" data-isian="dewasa"><span class="lbl" id="l-dewasa">' + esc(t('f.dewasa')) + '</span>' + this.penghitung('dewasa', d.dewasa) + '</div>' +
        '<div class="isian"><span class="lbl" id="l-anak">' + esc(t('f.anak')) + '</span>' + this.penghitung('anak', d.anak) + '</div></div>' +
        '<label class="cek"><input type="checkbox" id="f-jemput"' + (d.jemput ? ' checked' : '') + '>' + esc(t('f.jemput')) + '</label></div>' +
        '<div class="aksi-form"><span></span><button class="tombol" type="submit">' + esc(t('btn.lanjut')) + IK.panah + '</button></div>';
    },
    penghitung: function (n, v) {
      return '<div class="penghitung" role="group" aria-labelledby="l-' + n + '"><button type="button" data-hitung="' + n + '" data-d="-1" aria-label="' + esc(t('f.kurang')) + '">−</button><output id="o-' + n + '" aria-live="polite">' + v + '</output><button type="button" data-hitung="' + n + '" data-d="1" aria-label="' + esc(t('f.tambah')) + '">+</button></div>';
    },
    hL2: function () {
      var d = this.d;
      var negara = NEGARA.map(function (k) { return { k: k, n: namaNegara(k) }; });
      var id0 = negara.shift();
      negara.sort(function (a, b) { return a.n.localeCompare(b.n, lang); });
      var opsi = '<option value="">' + esc(t('f.pilih')) + '</option><option value="ID"' + (d.negara === 'ID' ? ' selected' : '') + '>' + esc(id0.n) + '</option>' + negara.map(function (x) { return '<option value="' + x.k + '"' + (d.negara === x.k ? ' selected' : '') + '>' + esc(x.n) + '</option>'; }).join('');
      var pem = [0, 1, 2].map(function (n) { return '<option value="' + n + '"' + (String(d.pemandu) === String(n) ? ' selected' : '') + '>' + esc(t('pemandu.' + n)) + '</option>'; }).join('');
      return '<div class="form-grid"><div class="isian" data-isian="nama"><label for="f-nama">' + esc(t('f.nama')) + '</label><input type="text" id="f-nama" autocomplete="name" value="' + esc(d.nama) + '" required></div>' +
        '<div class="form-grid dua"><div class="isian" data-isian="email"><label for="f-email">' + esc(t('f.email')) + '</label><input type="email" id="f-email" autocomplete="email" inputmode="email" value="' + esc(d.email) + '" required><span class="bantu">' + esc(t('f.emailBantu')) + '</span></div>' +
        '<div class="isian" data-isian="telepon"><label for="f-telepon">' + esc(t('f.telp')) + '</label><input type="tel" id="f-telepon" autocomplete="tel" inputmode="tel" value="' + esc(d.telepon) + '" placeholder="+62 812 3456 7890" required><span class="bantu">' + esc(t('f.telpBantu')) + '</span></div></div>' +
        '<div class="form-grid dua"><div class="isian" data-isian="negara"><label for="f-negara">' + esc(t('f.negara')) + '</label><select id="f-negara" autocomplete="country" required>' + opsi + '</select></div>' +
        '<div class="isian"><label for="f-pemandu">' + esc(t('f.bahasaPemandu')) + '</label><select id="f-pemandu">' + pem + '</select></div></div>' +
        '<div class="isian"><label for="f-kebutuhan">' + esc(t('f.kebutuhan')) + '</label><textarea id="f-kebutuhan" rows="2">' + esc(d.kebutuhan) + '</textarea><span class="bantu">' + esc(t('f.kebutuhanBantu')) + '</span></div>' +
        '<div class="isian"><label for="f-pesan">' + esc(t('f.pesan')) + '</label><textarea id="f-pesan" rows="3">' + esc(d.pesan) + '</textarea></div>' +
        '<div style="position:absolute;left:-9999px" aria-hidden="true"><label for="f-website">Website</label><input type="text" id="f-website" tabindex="-1" autocomplete="off" value=""></div></div>' +
        '<div class="aksi-form"><button class="tombol halus" type="button" data-mundur>' + IK.kiri + esc(t('btn.kembali')) + '</button><button class="tombol" type="submit">' + esc(t('btn.lanjut')) + IK.panah + '</button></div>';
    },
    ringkasHTML: function (e) {
      var d = this.d;
      var orang = t('r.dewasa', { n: d.dewasa }) + (d.anak ? ', ' + t('r.anak', { n: d.anak }) : '');
      var tgl = d.tanggal ? tanggal(d.tanggal) + (d.fleksibel ? ' (' + t('r.fleksibel') + ')' : '') : (d.fleksibel ? t('r.fleksibel') : t('r.belum'));
      return '<dl class="ringkasan"><dt>' + esc(t('r.pengalaman')) + '</dt><dd>' + esc(L(e.judul)) + ', Kampung ' + esc(e.kampung) + '</dd>' +
        '<dt>' + esc(t('r.tanggal')) + '</dt><dd>' + esc(tgl) + '</dd><dt>' + esc(t('r.durasi')) + '</dt><dd>' + esc(t('durasi.' + d.durasi)) + '</dd>' +
        '<dt>' + esc(t('r.orang')) + '</dt><dd>' + esc(orang) + '</dd><dt>' + esc(t('r.jemput')) + '</dt><dd>' + esc(d.jemput ? t('r.ya') : t('r.tidak')) + '</dd>' +
        '<dt>' + esc(t('r.kontak')) + '</dt><dd>' + esc(d.nama) + '<br>' + esc(d.email) + '<br>' + esc(d.telepon) + '</dd>' +
        '<dt>' + esc(t('r.negara')) + '</dt><dd>' + esc(namaNegara(d.negara)) + '</dd><dt>' + esc(t('r.pemandu')) + '</dt><dd>' + esc(t('pemandu.' + d.pemandu)) + '</dd>' +
        ((d.kebutuhan || d.pesan) ? '<dt>' + esc(t('r.catatan')) + '</dt><dd>' + esc([d.kebutuhan, d.pesan].filter(Boolean).join(' / ')) + '</dd>' : '') + '</dl>';
    },
    hL3: function (e) {
      return this.ringkasHTML(e) +
        '<div class="isian" data-isian="setuju" style="margin-top:18px"><label class="cek" style="font-weight:500"><input type="checkbox" id="f-setuju"' + (this.d.setuju ? ' checked' : '') + '>' + esc(t('f.setuju')) + '</label></div>' +
        '<div class="aksi-form"><button class="tombol halus" type="button" data-mundur>' + IK.kiri + esc(t('btn.kembali')) + '</button><button class="tombol" type="submit" id="btn-kirim">' + esc(t('btn.kirim')) + '</button></div>';
    },
    teks: function (e) {
      var d = this.d, baris = [
        t('teks.salam'), '',
        t('r.pengalaman') + ': ' + L(e.judul) + ' (Kampung ' + e.kampung + ')',
        t('r.tanggal') + ': ' + (d.tanggal || t('r.belum')) + (d.fleksibel ? ' (' + t('r.fleksibel') + ')' : ''),
        t('r.durasi') + ': ' + t('durasi.' + d.durasi),
        t('r.orang') + ': ' + t('r.dewasa', { n: d.dewasa }) + (d.anak ? ', ' + t('r.anak', { n: d.anak }) : ''),
        t('r.jemput') + ': ' + (d.jemput ? t('r.ya') : t('r.tidak')),
        t('f.nama') + ': ' + d.nama, t('f.email') + ': ' + d.email, t('f.telp') + ': ' + d.telepon,
        t('r.negara') + ': ' + namaNegara(d.negara), t('r.pemandu') + ': ' + t('pemandu.' + d.pemandu)
      ];
      if (d.kebutuhan) baris.push(t('f.kebutuhan') + ': ' + d.kebutuhan);
      if (d.pesan) baris.push(t('f.pesan') + ': ' + d.pesan);
      if (this.kode) baris.push('', 'Kode: ' + this.kode);
      return baris.join('\n');
    },
    hBerhasil: function (e) {
      var wa = waTujuan(), d = this.d, k = namaKontak();
      var orang = t('r.dewasa', { n: d.dewasa }) + (d.anak ? ', ' + t('r.anak', { n: d.anak }) : '');
      var pesanWA = lang === 'id'
        ? 'Halo ' + k + ', saya ' + d.nama + ' (kode ' + this.kode + '). Saya baru mengirim permintaan untuk “' + L(e.judul) + '” di Kampung ' + e.kampung + (d.tanggal ? ', rencana tanggal ' + d.tanggal : '') + ', ' + orang + '.'
        : 'Hello ' + k + ', I am ' + d.nama + ' (code ' + this.kode + '). I have just sent a request for “' + L(e.judul) + '” in ' + e.kampung + (d.tanggal ? ', planned for ' + d.tanggal : '') + ', ' + orang + '.';
      return '<div class="berhasil"><span class="centang">' + IK.centang + '</span><h2>' + esc(t('berhasil.judul')) + '</h2><p class="muted" style="max-width:52ch">' + esc(t('berhasil.sub', { email: d.email })) + '</p>' +
        '<span class="kode tnum">' + esc(this.kode) + '</span>' +
        (wa ? '<b style="margin-top:8px">' + esc(t('berhasil.lanjut')) + '</b>' +
          '<div class="kontak-kampung"><span class="inisial wa-bulat">' + IK.wa + '</span><span><b>' + esc(k) + '</b><br><span class="muted tnum">' + esc(formatWA(wa)) + '</span></span></div>' : '') +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px">' +
        (wa ? '<a class="tombol wa" href="' + esc(tautanWA(pesanWA)) + '" target="_blank" rel="noopener">' + IK.wa + esc(t('berhasil.wa')) + '</a>' : '') +
        '<button class="tombol halus" type="button" data-tutup>' + esc(t('btn.selesai')) + '</button></div></div>';
    },
    hGagal: function (e) {
      var wa = waTujuan(), teks = this.teks(e), belum = this.galatJenis === 'belum';
      var subjek = (lang === 'id' ? 'Permintaan pemesanan: ' : 'Booking request: ') + L(e.judul) + ' (' + this.kode + ')';
      return '<div style="display:grid;gap:14px;max-width:680px;margin:0 auto"><h2 class="subjudul" style="margin:0">' + esc(t(belum && wa ? 'gagal.satuLangkah' : 'gagal.judul')) + '</h2>' +
        '<p>' + esc(belum && wa ? t('gagal.belumAktif', { k: namaKontak() }) : t('gagal.jaringan')) + '</p>' +
        '<label class="sr-only" for="teks-pesan">' + esc(t('btn.salin')) + '</label><textarea class="teks-salin" id="teks-pesan" readonly>' + esc(teks) + '</textarea>' +
        '<p class="muted" style="font-size:.9rem">' + (wa ? 'WhatsApp ' + esc(formatWA(wa)) + ' · ' : '') + esc(EMAIL) + '</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
        (wa ? '<a class="tombol wa" href="' + esc(tautanWA(teks)) + '" target="_blank" rel="noopener">' + IK.wa + esc(t('berhasil.wa')) + '</a>' : '') +
        '<a class="tombol' + (wa ? ' halus' : '') + '" href="mailto:' + esc(EMAIL) + '?subject=' + encodeURIComponent(subjek) + '&body=' + encodeURIComponent(teks) + '">' + IK.surat + esc(t('btn.email')) + '</a>' +
        '<button class="tombol halus" type="button" id="btn-salin-pesan">' + IK.salin + esc(t('btn.salin')) + '</button>' +
        (this.galatJenis !== 'belum' ? '<button class="tombol sekunder" type="button" id="btn-coba">' + esc(t('btn.cobaLagi')) + '</button>' : '') + '</div>' +
        '<button class="tombol halus kecil" type="button" data-mundur-ke-3 style="justify-self:start">' + IK.kiri + esc(t('btn.kembali')) + '</button></div>';
    },
    baca: function (wadah) {
      var d = this.d, v = function (id) { var el = $('#' + id, wadah); return el ? el : null; };
      if (this.langkah === 1) {
        var r = $('#f-pengalaman', wadah); if (r && r.value) d.pengalaman = r.value;
        d.tanggal = v('f-tanggal').value; d.fleksibel = v('f-fleksibel').checked; d.durasi = v('f-durasi').value; d.jemput = v('f-jemput').checked;
      } else if (this.langkah === 2) {
        d.nama = v('f-nama').value.trim(); d.email = v('f-email').value.trim(); d.telepon = v('f-telepon').value.trim(); d.negara = v('f-negara').value;
        d.pemandu = v('f-pemandu').value; d.kebutuhan = v('f-kebutuhan').value.trim(); d.pesan = v('f-pesan').value.trim(); d.website = v('f-website').value;
      } else if (this.langkah === 3) { d.setuju = v('f-setuju').checked; }
    },
    periksa: function (wadah) {
      var d = this.d, galat = {};
      if (this.langkah === 1) {
        if (d.tanggal && d.tanggal < hariIni()) galat.tanggal = t('err.tanggal');
        if (d.dewasa < 1) galat.dewasa = t('err.orang');
      } else if (this.langkah === 2) {
        if (!d.nama) galat.nama = t('err.wajib');
        if (!d.email) galat.email = t('err.wajib'); else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) galat.email = t('err.email');
        if (!d.telepon) galat.telepon = t('err.wajib'); else if (d.telepon.replace(/\D/g, '').length < 8) galat.telepon = t('err.telp');
        if (!d.negara) galat.negara = t('err.wajib');
      } else if (this.langkah === 3) { if (!d.setuju) galat.setuju = t('err.setuju'); }
      $$('.isian', wadah).forEach(function (x) { x.classList.remove('salah'); var s = $('.pesan-salah', x); if (s) s.remove(); });
      var pertama = null;
      Object.keys(galat).forEach(function (k) {
        var box = $('[data-isian="' + k + '"]', wadah); if (!box) return;
        box.classList.add('salah');
        var s = document.createElement('span'); s.className = 'pesan-salah'; s.setAttribute('role', 'alert'); s.textContent = galat[k]; box.appendChild(s);
        var inp = $('input, select', box); if (inp) inp.setAttribute('aria-invalid', 'true');
        if (!pertama) pertama = inp;
      });
      if (pertama) pertama.focus();
      return !pertama;
    },
    ikat: function (wadah) {
      var self = this;
      var form = $('#form-pesan', wadah);
      $$('[data-hitung]', wadah).forEach(function (b) {
        b.addEventListener('click', function () {
          var n = b.getAttribute('data-hitung'), min = n === 'dewasa' ? 1 : 0;
          self.d[n] = Math.max(min, Math.min(30, self.d[n] + Number(b.getAttribute('data-d'))));
          $('#o-' + n, wadah).textContent = self.d[n];
        });
      });
      if (form) form.addEventListener('submit', function (ev) {
        ev.preventDefault(); self.baca(wadah);
        if (!self.periksa(wadah)) return;
        if (self.langkah < 3) { self.langkah++; self.gambar(); } else self.kirim(wadah);
      });
      $$('[data-mundur]', wadah).forEach(function (b) { b.addEventListener('click', function () { self.baca(wadah); self.langkah--; self.gambar(); }); });
      var m3 = $('[data-mundur-ke-3]', wadah); if (m3) m3.addEventListener('click', function () { self.status = ''; self.langkah = 3; self.gambar(); });
      var sp = $('#btn-salin-pesan', wadah); if (sp) sp.addEventListener('click', function () { salin($('#teks-pesan', wadah).value, t('disalin'), $('#teks-pesan', wadah)); });
      var cb = $('#btn-coba', wadah); if (cb) cb.addEventListener('click', function () { self.status = ''; self.langkah = 3; self.gambar(); self.kirim(Lapis.el); });
      // remember choice of experience while on step 1
      var fp = $('#f-pengalaman', wadah);
      if (fp) fp.addEventListener('change', function () {
        self.d.pengalaman = fp.value; var e = cariPengalaman(fp.value), j = $('.judul-kecil', wadah), pv = $('#pratinjau-pengalaman', wadah);
        if (j && e) j.textContent = t('pesan.judul') + ': ' + e.kampung;
        if (pv && e) pv.innerHTML = self.pratinjau(e);
      });
    },
    kirim: function (wadah) {
      var self = this, d = this.d, e = cariPengalaman(d.pengalaman);
      if (d.website) { this.status = 'berhasil'; this.kode = 'KLM-0000'; this.gambar(); return; }
      var t0 = new Date();
      this.kode = this.kode || ('KLM-' + String(t0.getFullYear()).slice(2) + String(t0.getMonth() + 1).padStart(2, '0') + String(t0.getDate()).padStart(2, '0') + '-' + String(Math.floor(1000 + Math.random() * 9000)));
      var url = CFG.pemesanan && CFG.pemesanan.urlGoogleScript;
      if (!url) { this.status = 'gagal'; this.galatJenis = 'belum'; this.gambar(); return; }
      var tombol = $('#btn-kirim', wadah); if (tombol) { tombol.disabled = true; tombol.textContent = t('btn.mengirim'); }
      var data = new URLSearchParams({
        kode: this.kode, bahasa: lang, pengalamanId: e.id, kampungId: e.kampungId, pengalaman: L(e.judul), kampung: e.kampung, kontakNama: namaKontak(),
        kontakWhatsapp: waTujuan(), tanggal: d.tanggal, fleksibel: d.fleksibel ? 'ya' : 'tidak', durasi: t('durasi.' + d.durasi), dewasa: String(d.dewasa), anak: String(d.anak),
        jemput: d.jemput ? 'ya' : 'tidak', nama: d.nama, email: d.email, telepon: d.telepon, negara: namaNegara(d.negara, 'id') + ' (' + d.negara + ')',
        bahasaPemandu: t('pemandu.' + d.pemandu), kebutuhan: d.kebutuhan, pesan: d.pesan, halaman: location.href.split('#')[0], website: d.website
      });
      var ctrl = window.AbortController ? new AbortController() : null, batas = setTimeout(function () { if (ctrl) ctrl.abort(); }, 25000);
      fetch(url, { method: 'POST', body: data, signal: ctrl ? ctrl.signal : undefined, redirect: 'follow' })
        .then(function (res) { return res.text().then(function (txt) { var j = {}; try { j = JSON.parse(txt); } catch (er) { j = { ok: res.ok }; } return j; }); })
        .then(function (j) { clearTimeout(batas); if (j && j.ok) { self.status = 'berhasil'; } else { self.status = 'gagal'; self.galatJenis = 'jaringan'; } self.gambar(); })
        .catch(function () { clearTimeout(batas); self.status = 'gagal'; self.galatJenis = 'jaringan'; self.gambar(); });
    }
  };

  /* The host may add its own small badge in the bottom corner (Netlify free plan). It is left as it is;
     on phones the bottom tab bar just grows a strip underneath so the badge sits there instead of over the menu. */
  function pantauBadge() {
    var html = document.documentElement;
    function cek() {
      var f = document.getElementById('nl-badge-frame');
      var r = f && f.getBoundingClientRect();
      var ada = !!(r && r.height > 0 && r.bottom > window.innerHeight - 4);
      html.classList.toggle('ada-badge', ada);
      if (ada) html.style.setProperty('--badge-h', Math.ceil(window.innerHeight - r.top + 4) + 'px');
    }
    try { new MutationObserver(cek).observe(document.body, { childList: true }); } catch (e) {}
    window.addEventListener('resize', cek);
    setTimeout(cek, 800); setTimeout(cek, 3000); cek();
  }

  /* ------------------------------------------------------------ start */
  function mulai() {
    var simpanan = simpan.get('klm-bahasa');
    lang = simpanan === 'en' || simpanan === 'id' ? simpanan : 'id';
    bangunIndeks();
    renderChrome();
    rute();
    pantauBadge();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mulai); else mulai();
})();
