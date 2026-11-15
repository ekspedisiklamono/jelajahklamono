/**
 * ==================================================================
 *  LAYANAN PEMESANAN — WEBSITE KLAMONO
 * ------------------------------------------------------------------
 *  Kode ini menerima permintaan booking dari website, menyimpannya
 *  di Google Sheet, lalu mengirim:
 *    1. Email konfirmasi otomatis ke wisatawan (Indonesia / Inggris)
 *    2. Email notifikasi ke tim (dan ke koordinator kampung bila emailnya diisi)
 *
 *  CARA PAKAI SINGKAT (lihat panduan lengkap):
 *    a. Buka Google Sheet baru dengan akun ekspedisiklamono@gmail.com
 *    b. Menu Ekstensi > Apps Script, hapus isi yang ada, tempel SEMUA kode ini
 *    c. Simpan, pilih fungsi  siapkan  di atas, klik Jalankan, izinkan akses
 *    d. Terapkan > Deployment baru > jenis: Aplikasi web
 *         Jalankan sebagai: Saya     Siapa yang memiliki akses: Siapa saja
 *    e. Salin URL aplikasi web, tempel di pengaturan.js → urlGoogleScript
 * ================================================================== */

var PENGATURAN = {
  EMAIL_TIM: 'ekspedisiklamono@gmail.com',
  NAMA_PENGIRIM: 'Jejaring Wisata Klamono',
  WAKTU_BALASAN: { id: '1–3 hari', en: '1–3 days' },
  TAB_PEMESANAN: 'Pemesanan',
  TAB_KONTAK: 'Kontak Kampung',
  BATAS_PER_JAM: 5          // batas permintaan dari satu alamat email per jam (anti-spam)
};

var KOLOM = ['Waktu masuk', 'Kode', 'Status', 'Pengalaman', 'Kampung', 'Rencana tanggal', 'Tanggal fleksibel', 'Lama kunjungan',
  'Dewasa', 'Anak', 'Bantuan transport', 'Nama', 'Email', 'Telepon / WA', 'Kewarganegaraan', 'Bahasa pemandu',
  'Kebutuhan khusus', 'Pesan', 'Bahasa website', 'Halaman'];

/** Jalankan SEKALI setelah menempel kode: membuat tab, judul kolom, dan meminta izin email. */
function siapkan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(PENGATURAN.TAB_PEMESANAN) || ss.insertSheet(PENGATURAN.TAB_PEMESANAN);
  sh.getRange(1, 1, 1, KOLOM.length).setValues([KOLOM]).setFontWeight('bold').setBackground('#DFE7CD');
  sh.setFrozenRows(1);
  var aturan = SpreadsheetApp.newDataValidation().requireValueInList(['Baru', 'Sudah dihubungi', 'Terkonfirmasi', 'Selesai', 'Batal'], true).build();
  sh.getRange(2, 3, 1000, 1).setDataValidation(aturan);

  var kt = ss.getSheetByName(PENGATURAN.TAB_KONTAK);
  if (!kt) {
    kt = ss.insertSheet(PENGATURAN.TAB_KONTAK);
    kt.getRange(1, 1, 1, 5).setValues([['ID kampung (jangan diubah)', 'Kampung', 'Nama koordinator', 'WhatsApp (contoh 6281234567890)', 'Email koordinator (boleh kosong)']])
      .setFontWeight('bold').setBackground('#DFE7CD');
    var daftarKampung = [['klawosom', 'Klawosom'], ['mlais', 'Mlais'], ['wariyau', 'Wariyau'], ['klawana', 'Klawana'],
      ['klalomon', 'Klalomon'], ['klamono', 'Klamono'], ['posa', 'Posa'], ['klamono-oil', 'Klamono Olie']];
    kt.getRange(2, 1, daftarKampung.length, 2).setValues(daftarKampung);
    kt.setFrozenRows(1);
    kt.autoResizeColumns(1, 5);
  }
  MailApp.sendEmail(PENGATURAN.EMAIL_TIM, 'Layanan pemesanan Klamono sudah siap',
    'Halo tim,\n\nJika email ini sampai, Google Sheet dan email otomatis sudah tersambung.\n' +
    'Langkah berikutnya: Terapkan > Deployment baru > Aplikasi web, lalu tempel URL-nya di pengaturan.js.\n\nSalam,\nLayanan pemesanan Klamono');
}

/** Membuka URL aplikasi web di browser akan menampilkan pesan ini. */
function doGet() {
  return ContentService.createTextOutput('Layanan pemesanan Klamono aktif. Kirim permintaan melalui website.');
}

/** Menerima data dari formulir website. */
function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p.website) return jawab({ ok: true });                                   // perangkap robot spam
    if (!p.nama || !p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email)) return jawab({ ok: false, error: 'data' });

    var cache = CacheService.getScriptCache(), kunci = 'b_' + p.email.toLowerCase();
    var jumlah = Number(cache.get(kunci) || 0);
    if (jumlah >= PENGATURAN.BATAS_PER_JAM) return jawab({ ok: false, error: 'batas' });
    cache.put(kunci, String(jumlah + 1), 3600);

    var kode = String(p.kode || ('KLM-' + new Date().getTime())).slice(0, 24);
    var kunciKunci = LockService.getScriptLock();
    kunciKunci.waitLock(20000);
    try {
      var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PENGATURAN.TAB_PEMESANAN);
      if (!sh) { siapkanTanpaEmail_(); sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PENGATURAN.TAB_PEMESANAN); }
      sh.appendRow([new Date(), kode, 'Baru', p.pengalaman, p.kampung, p.tanggal || '-', p.fleksibel, p.durasi, Number(p.dewasa) || 0, Number(p.anak) || 0,
        p.jemput, p.nama, p.email, "'" + (p.telepon || ''), p.negara, p.bahasaPemandu, p.kebutuhan, p.pesan, p.bahasa, p.halaman].map(bersihSel_));
    } finally { kunciKunci.releaseLock(); }

    var kontak = cariKontak_(p.kampungId) || cariKontak_(p.pengalamanId) || {};
    if (!kontak.nama) kontak.nama = p.kontakNama || '';
    if (!kontak.wa) kontak.wa = (p.kontakWhatsapp || '').replace(/\D/g, '');
    // Wisatawan dihubungkan ke WhatsApp yang dipilih website (operator distrik, atau WhatsApp resmi tim).
    // Email koordinator kampung dari tab "Kontak Kampung" tetap dipakai untuk tembusan ke tim.
    var kontakWisatawan = { nama: p.kontakNama || kontak.nama, wa: (p.kontakWhatsapp || '').replace(/\D/g, '') || kontak.wa };
    p.kode = kode;
    kirimKeWisatawan_(p, kontakWisatawan);
    kirimKeTim_(p, kontak);
    return jawab({ ok: true, kode: kode });
  } catch (err) {
    console.error(err);
    return jawab({ ok: false, error: String(err) });
  }
}

/* ---------------------------------------------------------------- bantuan */
function jawab(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function bersihSel_(v) {
  // cegah teks yang diawali = + - @ dibaca sebagai rumus
  v = v == null ? '' : v;
  if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}
function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
}
function siapkanTanpaEmail_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.insertSheet(PENGATURAN.TAB_PEMESANAN);
  sh.getRange(1, 1, 1, KOLOM.length).setValues([KOLOM]).setFontWeight('bold');
}
function cariKontak_(id) {
  var kt = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PENGATURAN.TAB_KONTAK);
  if (!kt || !id) return null;
  var data = kt.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === String(id).toLowerCase()) {
      return { nama: String(data[i][2] || '').trim(), wa: String(data[i][3] || '').replace(/\D/g, ''), email: String(data[i][4] || '').trim() };
    }
  }
  return null;
}
function barisTabel_(label, isi) {
  return '<tr><td style="padding:6px 12px 6px 0;color:#4B5B4A;vertical-align:top;white-space:nowrap">' + esc_(label) + '</td><td style="padding:6px 0;font-weight:600">' + esc_(isi) + '</td></tr>';
}
function bungkus_(isi) {
  return '<div style="background:#EBF0E0;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#162117">' +
    '<div style="max-width:560px;margin:0 auto;background:#F8FAF1;border-radius:14px;overflow:hidden;border:1px solid #C3CEAE">' +
    '<div style="background:#B6D167;padding:18px 24px;font-family:Georgia,serif;font-size:26px;color:#14281A">Klamono</div>' +
    '<div style="padding:24px;font-size:15px;line-height:1.6">' + isi + '</div>' +
    '<div style="padding:14px 24px;background:#1F3B26;color:#E6EED5;font-size:12px">Tim Ekspedisi Patriot 20 Universitas Brawijaya · ' + esc_(PENGATURAN.EMAIL_TIM) + '</div></div></div>';
}

/* ---------------------------------------------------------------- email ke wisatawan */
function kirimKeWisatawan_(p, kontak) {
  var en = p.bahasa === 'en';
  var namaKontak = kontak.nama || (en ? 'the village coordinator' : 'koordinator kampung');
  var tabel = '<table style="border-collapse:collapse;font-size:14px;margin:12px 0 18px">' +
    barisTabel_(en ? 'Booking code' : 'Kode pemesanan', p.kode) +
    barisTabel_(en ? 'Experience' : 'Pengalaman', p.pengalaman + ' (Kampung ' + p.kampung + ')') +
    barisTabel_(en ? 'Planned date' : 'Rencana tanggal', (p.tanggal || (en ? 'Not set yet' : 'Belum ditentukan')) + (p.fleksibel === 'ya' ? (en ? ' (flexible)' : ' (fleksibel)') : '')) +
    barisTabel_(en ? 'Length' : 'Lama', p.durasi) +
    barisTabel_(en ? 'Group' : 'Jumlah orang', (p.dewasa || 0) + (en ? ' adult(s)' : ' dewasa') + (Number(p.anak) ? ', ' + p.anak + (en ? ' child(ren)' : ' anak') : '')) +
    barisTabel_(en ? 'Transport from Sorong' : 'Transportasi dari Sorong', p.jemput === 'ya' ? (en ? 'Help needed' : 'Perlu dibantu') : (en ? 'Arranging my own' : 'Atur sendiri')) +
    '</table>';
  var teksWA = (en ? 'Hello, I am ' + p.nama + ' (code ' + p.kode + ').' : 'Halo, saya ' + p.nama + ' (kode ' + p.kode + ').');
  var wa = kontak.wa ? '<p><a href="https://wa.me/' + esc_(kontak.wa) + '?text=' + encodeURIComponent(teksWA) + '" style="display:inline-block;background:#1F7A4D;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">WhatsApp ' + esc_(namaKontak) + '</a></p>' : '';
  var isi = en
    ? '<p>Hello ' + esc_(p.nama) + ',</p><p>Thank you. We have received your request to visit Klamono. <b>This is not a payment and nothing has been charged.</b></p>' + tabel +
      '<p><b>What happens next</b><br>' + esc_(namaKontak) + ' will contact you by WhatsApp or email within ' + PENGATURAN.WAKTU_BALASAN.en + ' to agree dates, guides and costs. Please quote your booking code.</p>' + wa +
      '<p><b>Before you travel</b><br>Ask before photographing people or customary places. Bamboo tied with red cloth is a customary sign: do not enter or take anything from that area. Do not enter rivers without your guide.</p>' +
      '<p>Questions? Simply reply to this email.</p><p>Warm regards,<br>Tim Ekspedisi Patriot and the people of Klamono</p>'
    : '<p>Halo ' + esc_(p.nama) + ',</p><p>Terima kasih. Permintaan kunjungan Anda ke Klamono sudah kami terima. <b>Ini bukan pembayaran dan belum ada biaya yang ditagih.</b></p>' + tabel +
      '<p><b>Langkah berikutnya</b><br>' + esc_(namaKontak) + ' akan menghubungi Anda lewat WhatsApp atau email dalam ' + PENGATURAN.WAKTU_BALASAN.id + ' untuk menyepakati tanggal, pemandu, dan biaya. Sebutkan kode pemesanan Anda.</p>' + wa +
      '<p><b>Sebelum berangkat</b><br>Minta izin sebelum memotret orang atau tempat adat. Bambu berikat kain merah adalah tanda adat: jangan masuk atau mengambil apa pun di area itu. Jangan turun ke sungai tanpa pemandu.</p>' +
      '<p>Ada pertanyaan? Cukup balas email ini.</p><p>Salam hangat,<br>Tim Ekspedisi Patriot dan masyarakat Klamono</p>';
  MailApp.sendEmail({
    to: p.email,
    subject: (en ? 'We received your request: ' : 'Permintaan Anda kami terima: ') + p.pengalaman + ' (' + p.kode + ')',
    htmlBody: bungkus_(isi),
    name: PENGATURAN.NAMA_PENGIRIM,
    replyTo: PENGATURAN.EMAIL_TIM
  });
}

/* ---------------------------------------------------------------- email ke tim & koordinator */
function kirimKeTim_(p, kontak) {
  var tabel = '<table style="border-collapse:collapse;font-size:14px">' +
    barisTabel_('Kode', p.kode) + barisTabel_('Pengalaman', p.pengalaman + ' (Kampung ' + p.kampung + ')') +
    barisTabel_('Tanggal', (p.tanggal || 'Belum ditentukan') + (p.fleksibel === 'ya' ? ' (fleksibel)' : '')) + barisTabel_('Lama', p.durasi) +
    barisTabel_('Orang', (p.dewasa || 0) + ' dewasa, ' + (p.anak || 0) + ' anak') + barisTabel_('Bantuan transport', p.jemput) +
    barisTabel_('Nama', p.nama) + barisTabel_('Email', p.email) + barisTabel_('Telepon / WA', p.telepon) + barisTabel_('Kewarganegaraan', p.negara) +
    barisTabel_('Bahasa pemandu', p.bahasaPemandu) + barisTabel_('Kebutuhan khusus', p.kebutuhan || '-') + barisTabel_('Pesan', p.pesan || '-') + '</table>';
  var telp = String(p.telepon || '').replace(/\D/g, '');
  var tombolWA = telp ? '<p><a href="https://wa.me/' + esc_(telp) + '" style="display:inline-block;background:#1F7A4D;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">Hubungi wisatawan lewat WhatsApp</a></p>' : '';
  var isi = '<p><b>Permintaan booking baru</b> untuk ' + esc_(p.kampung) + '.</p>' + tabel + tombolWA +
    '<p>Mohon hubungi wisatawan dalam ' + PENGATURAN.WAKTU_BALASAN.id + ', lalu ubah kolom Status di Google Sheet.</p>';
  var opsi = { to: PENGATURAN.EMAIL_TIM, subject: '[Booking baru] ' + p.kampung + ': ' + p.nama + ' (' + p.kode + ')', htmlBody: bungkus_(isi), name: PENGATURAN.NAMA_PENGIRIM, replyTo: p.email };
  if (kontak.email) opsi.cc = kontak.email;
  MailApp.sendEmail(opsi);
}
