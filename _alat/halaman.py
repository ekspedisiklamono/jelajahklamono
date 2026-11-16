#!/usr/bin/env python3
"""Static, crawlable pages for search engines (and for visitors arriving from a search).

The main site is a single page whose views live behind #hash links, so Google sees it as one page.
This script writes one real page per medicinal plant, chapter, experience and story, plus index pages
and a glossary, all from the same data files the app uses, then rewrites sitemap.xml.

    python3 _alat/halaman.py        (bangun.py runs it automatically)
"""
import datetime, html, json, os, re, shutil, subprocess

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'https://jelajahklamono.com'
HARI = datetime.date.today().isoformat()
TERBIT = '2026-11-10'

_raw = json.loads(subprocess.run(['node', os.path.join(R, '_alat', 'data.js'), R], capture_output=True, text=True, check=True).stdout)
KLM, T, LOGO = _raw['KLM'], _raw['TEKS'], _raw['logo']
CFG = KLM['pengaturan']
TANAMAN = KLM['tanaman']
BAB = KLM['bab']
KAMUS = KLM['kamus']
WISATA = KLM['pengalaman']
KISAH = sorted(KLM['artikel'], key=lambda a: a['tanggal'], reverse=True)
KAMPUNG = {k['id']: k['nama'] for k in KLM['kampung']}
DISTRIK = {k['id']: k.get('distrik', 'Klamono') for k in KLM['kampung']}
BUKU = {b['id']: b for b in KLM['buku']}

e = lambda s: html.escape(str(s or ''), quote=True)


def L(o):
    if isinstance(o, dict):
        v = o.get('id')
        return v if v not in (None, '') else o.get('en', '')
    return o if o is not None else ''


def rich(s):
    return re.sub(r'\*([^*]+)\*', r'<em>\1</em>', e(s))


def potong(s, n=158):
    s = re.sub(r'\s+', ' ', re.sub(r'\*', '', str(s))).strip()
    if len(s) <= n:
        return s
    s = s[:n - 1]
    return s[:s.rfind(' ')].rstrip(',;:–—- ') + '…'


def tgl(s):
    bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    y, m, d = s.split('-')
    return f'{int(d)} {bulan[int(m) - 1]} {y}'


def gambar(p):
    return URL + '/' + p.lstrip('/') if p else URL + '/assets/img/foto/koba-koba-warga.jpg'


def ld(*objek):
    data = {'@context': 'https://schema.org', '@graph': list(objek)}
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + '</script>'


def remah(*langkah):
    """breadcrumb: [(nama, path or None)] → (html, json-ld)"""
    semua = [('Beranda', '/')] + list(langkah)
    h = '<nav class="hal-remah" aria-label="Lokasi halaman"><ol>' + ''.join(
        f'<li><a href="{e(p)}">{e(n)}</a></li>' if p else f'<li aria-current="page">{e(n)}</li>' for n, p in semua) + '</ol></nav>'
    j = {'@type': 'BreadcrumbList', 'itemListElement': [
        dict({'@type': 'ListItem', 'position': i + 1, 'name': n}, **({'item': URL + p} if p else {})) for i, (n, p) in enumerate(semua)]}
    return h, j


NAV = [('/', 'Beranda'), ('/wisata/', 'Wisata'), ('/tanaman/', 'Tanaman obat'), ('/pengetahuan/', 'Pengetahuan'), ('/kisah/', 'Kisah')]
CSSV = None


def halaman(path, judul, desk, isi, *, gambar_og=None, jenis='article', jsonld='', aktif=''):
    global CSSV
    if CSSV is None:
        import hashlib
        CSSV = hashlib.sha1(open(os.path.join(R, 'assets/css/gaya.css'), 'rb').read() + open(os.path.join(R, 'assets/css/halaman.css'), 'rb').read()).hexdigest()[:8]
    nav = ''.join(f'<a href="{h}"' + (' aria-current="page"' if h == aktif else '') + f'>{e(n)}</a>' for h, n in NAV)
    doc = f'''<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(judul)}</title>
<meta name="description" content="{e(desk)}">
<link rel="canonical" href="{URL}{path}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#1F3B26">
<meta property="og:type" content="{jenis}">
<meta property="og:site_name" content="Jelajah Klamono">
<meta property="og:locale" content="id_ID">
<meta property="og:url" content="{URL}{path}">
<meta property="og:title" content="{e(judul)}">
<meta property="og:description" content="{e(desk)}">
<meta property="og:image" content="{e(gambar_og or gambar(None))}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%231F3B26'/%3E%3Cpath d='M5 16L16 5l11 11-11 11z' fill='none' stroke='%23B6D167' stroke-width='1.6'/%3E%3Cpath d='M10.5 10.5l11 11M21.5 10.5l-11 11' stroke='%23B6D167' stroke-width='1.6'/%3E%3Ccircle cx='16' cy='16' r='3.2' fill='%23B6D167'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/css/gaya.css?v={CSSV}">
<link rel="stylesheet" href="/assets/css/halaman.css?v={CSSV}">
{jsonld}
</head>
<body class="hal">
<a class="hal-lewati" href="#isi">Langsung ke isi</a>
<header class="hal-kepala"><div class="hal-wrap">
<a class="hal-merek" href="/">{LOGO}<span><b>Jelajah Klamono</b><small>Jejaring wisata &amp; pustaka Moi</small></span></a>
<nav class="hal-nav" aria-label="Menu utama">{nav}</nav>
</div></header>
<main id="isi" class="hal-wrap hal-utama">
{isi}
</main>
<footer class="hal-kaki"><div class="hal-wrap">
<div><p class="hal-kaki-merek">Jelajah Klamono</p><p>{e(T['kaki.tentang'])}</p>
<p><a class="tombol" href="/#jelajah">Pesan pengalaman wisata</a></p></div>
<nav aria-label="Indeks"><p class="hal-kaki-judul">Jelajahi</p><ul>
<li><a href="/wisata/">Wisata di Klamono</a></li><li><a href="/tanaman/">Tanaman obat Suku Moi</a></li><li><a href="/pengetahuan/">Sejarah &amp; budaya Klamono</a></li>
<li><a href="/kamus/">Kamus istilah Moi</a></li><li><a href="/kisah/">Kisah &amp; berita</a></li></ul></nav>
<div><p class="hal-kaki-judul">Kontak</p><ul>
<li><a href="mailto:{e(CFG['emailTim'])}">{e(CFG['emailTim'])}</a></li>
<li><a href="https://www.instagram.com/{e(CFG['instagram'])}/" rel="noopener">Instagram @{e(CFG['instagram'])}</a></li>
<li>Distrik Klamono, Kabupaten Sorong, Papua Barat Daya</li></ul></div>
<p class="hal-hak">Pengetahuan lokal di situs ini milik masyarakat adat Moi. Disusun oleh Tim Ekspedisi Patriot 20 Universitas Brawijaya bersama warga Klamono Raya, 2026.</p>
</div></footer>
</body>
</html>
'''
    berkas = os.path.join(R, path.strip('/'), 'index.html')
    os.makedirs(os.path.dirname(berkas), exist_ok=True)
    with open(berkas, 'w', encoding='utf-8') as f:
        f.write(doc)
    return path


TIM = {'@type': 'Organization', 'name': 'Tim Ekspedisi Patriot 20 Universitas Brawijaya', 'url': URL + '/'}
SITUS = {'@type': 'WebSite', '@id': URL + '/#situs', 'name': 'Jelajah Klamono', 'url': URL + '/'}


def foto_html(src, alt, kelas='hal-foto-isi', lazy=True):
    if not src:
        return f'<span class="hal-foto-kosong {kelas}" aria-hidden="true">{LOGO}</span>'
    return f'<img class="{kelas}" src="/{e(src)}" alt="{e(alt)}"' + (' loading="lazy"' if lazy else '') + ' decoding="async">'


# ---------------------------------------------------------------- medicinal plants
def label_kegunaan(k): return T.get('keg.' + k, k)


def kartu_tanaman(p):
    nama_lain = ' · '.join(x for x in [('Moi: ' + p['moi']) if p.get('moi') else '', p.get('alias') or ''] if x)
    return (f'<a class="hal-kartu" href="/tanaman/{e(p["id"])}/">'
            f'<span class="hal-kartu-foto">{foto_html(p.get("foto"), p["nama"])}<span class="hal-no">{p["no"]:02d}</span></span>'
            f'<span class="hal-kartu-teks"><b>{e(p["nama"])}</b>'
            + (f'<i>{e(p["latin"])}</i>' if p.get('latin') else '')
            + (f'<small>{e(nama_lain)}</small>' if nama_lain else '')
            + f'<span>{e(L(p["ringkas"]))}</span></span></a>')


def kredit_tanaman(p):
    k = p.get('fotoKredit')
    if not p.get('foto'):
        return ''
    if not k:
        return '<figcaption>' + e(T['kredit.foto']) + '</figcaption>'
    return (f'<figcaption>Foto ilustrasi: <a href="{e(k["sumber"])}" rel="noopener">{e(k["oleh"])}</a>, Wikimedia Commons · '
            f'<a href="{e(k["lisensiUrl"])}" rel="noopener license">{e(k["lisensi"])}</a> · dipotong</figcaption>')


def buat_tanaman():
    urls = []
    bk = BUKU['tanaman-obat']
    for i, p in enumerate(TANAMAN):
        path = f'/tanaman/{p["id"]}/'
        latin = p.get('latin') or ''
        judul_seo = f'{p["nama"]}' + (f' ({latin})' if latin else '') + ': Tanaman Obat Suku Moi di Klamono'
        desk = potong(f'{p["nama"]}' + (f', dalam bahasa Moi disebut {p["moi"]}' if p.get('moi') else '') + f'. {L(p["ringkas"])} Pengetahuan lokal Suku Moi, Klamono, Papua Barat Daya.')
        h_remah, j_remah = remah(('Tanaman obat', '/tanaman/'), (p['nama'], None))
        nama = [('Nama Moi', p.get('moi')), ('Nama lain', p.get('alias')), ('Nama setempat', p.get('lokal'))]
        nama_html = ''.join(f'<div><dt>{e(a)}</dt><dd>{e(b)}</dd></div>' for a, b in nama if b)
        guna = ''.join(f'<a class="tag{" merah" if k == "adat" else ""}" href="/tanaman/#{e(k)}">{e(label_kegunaan(k))}</a>' for k in p['kegunaan'])
        bagian = ', '.join(T.get('bag.' + b, b) for b in p['bagian'])
        pakai = ', '.join(T.get('pakai.' + b, b) for b in p['pakai'])
        desk_p = L(p['deskripsi']) or []
        cara = L(p.get('pengolahan')) or []
        sebelum, sesudah = TANAMAN[i - 1] if i > 0 else None, TANAMAN[i + 1] if i + 1 < len(TANAMAN) else None
        mirip = [q for q in TANAMAN if q is not p and set(q['kegunaan']) & set(p['kegunaan'])][:6]
        halaman_buku = (bk.get('tanamanMulai') or 0) + p['no']
        isi = f'''{h_remah}
<article class="hal-tanaman">
<figure class="hal-foto">{foto_html(p.get("foto"), f"{p['nama']} ({latin})" if latin else p['nama'], lazy=False)}{kredit_tanaman(p)}</figure>
<div class="hal-teks">
<p class="hal-atas">No. {p["no"]:02d} · {e(T.get("kel." + p["kelompok"], ""))}</p>
<h1>{e(p["nama"])}</h1>
{f'<p class="hal-latin"><i>{e(latin)}</i></p>' if latin else '<p class="hal-latin hal-redup">Nama latin belum tercatat</p>'}
{f'<dl class="hal-nama">{nama_html}</dl>' if nama_html else ''}
<p class="hal-lead">{e(L(p["ringkas"]))}</p>
<dl class="hal-fakta"><div><dt>Dipakai untuk</dt><dd class="baris-tag">{guna}</dd></div><div><dt>Bagian dipakai</dt><dd>{e(bagian)}</dd></div><div><dt>Cara pakai</dt><dd>{e(pakai)}</dd></div></dl>
<div class="hal-prosa">{''.join(f'<p>{rich(x)}</p>' for x in desk_p)}</div>
{f'<section class="hal-cara"><h2>Cara pengolahan {e(p["nama"])}</h2>' + ''.join(f'<p>{rich(x)}</p>' for x in cara) + '</section>' if cara else ''}
{f'<p class="hal-catatan"><b>Catatan redaksi:</b> {e(L(p["catatan"]))}</p>' if p.get("catatan") else ''}
{f'<p class="hal-peringatan">{e(T["tanaman.peringatan"])}</p>' if p["kegunaan"][0] != "adat" else ''}
<p class="hal-sumber">{e(T["d.sumberTanaman"])} <a href="/{e(bk["pdf"])}">Unduh buku saku (PDF, {e(bk.get("ukuranPdf", ""))})</a></p>
<p class="hal-aksi"><a class="tombol" href="/#t-{e(p["id"])}">Buka di pustaka interaktif</a> <a class="tombol halus" href="/tanaman/">Semua 34 tanaman obat</a></p>
</div>
</article>
{f'<section class="hal-terkait"><h2>Tanaman obat lain untuk {e(label_kegunaan(p["kegunaan"][0]).lower())}</h2><div class="hal-grid">' + ''.join(kartu_tanaman(q) for q in mirip) + '</div></section>' if mirip else ''}
<nav class="hal-sebelah" aria-label="Tanaman lain">{f'<a rel="prev" href="/tanaman/{e(sebelum["id"])}/"><small>Sebelumnya</small><b>{e(sebelum["nama"])}</b></a>' if sebelum else '<span></span>'}{f'<a rel="next" href="/tanaman/{e(sesudah["id"])}/"><small>Berikutnya</small><b>{e(sesudah["nama"])}</b></a>' if sesudah else ''}</nav>'''
        artikel = {'@type': 'Article', '@id': URL + path + '#artikel', 'headline': judul_seo[:110], 'description': desk, 'inLanguage': 'id',
                   'image': [gambar(p.get('foto'))] if p.get('foto') else [gambar(None)], 'author': TIM, 'publisher': SITUS, 'isPartOf': {'@id': URL + '/tanaman/#koleksi'},
                   'mainEntityOfPage': URL + path, 'datePublished': TERBIT, 'dateModified': HARI,
                   'about': {'@type': 'Taxon', 'name': latin or p['nama'], 'alternateName': [x for x in [p['nama'], p.get('moi'), p.get('alias'), p.get('lokal')] if x]},
                   'keywords': ', '.join(x for x in [p['nama'], p.get('moi'), latin, 'tanaman obat', 'Suku Moi', 'Klamono', 'Papua'] if x)}
        urls.append(halaman(path, judul_seo, desk, isi, gambar_og=gambar(p.get('foto')) if p.get('foto') else None, jsonld=ld(artikel, j_remah), aktif='/tanaman/'))

    # index
    h_remah, j_remah = remah(('Tanaman obat', None))
    kelompok = []
    for k in ['demam', 'nyeri', 'luka', 'cerna', 'napas', 'ibu', 'darah', 'tulang', 'lain', 'adat']:
        isi_k = [p for p in TANAMAN if k in p['kegunaan']]
        if isi_k:
            kelompok.append((k, isi_k))
    loncat = ''.join(f'<a class="tag" href="#{k}">{e(label_kegunaan(k))} <span class="hal-redup">{len(v)}</span></a>' for k, v in kelompok)
    pengantar = ''.join(f'<p>{rich(L(x["p"]))}</p>' for x in KLM.get('pengantarKatalog', [])[:2] if x.get('p'))
    isi = f'''{h_remah}
<header class="hal-kepala-hal">
<p class="hal-atas">Pustaka Klamono · 34 tanaman</p>
<h1>Tanaman Obat Suku Moi di Klamono</h1>
<p class="hal-lead">Katalog 34 tanaman obat yang dipakai Suku Moi di Distrik Klamono, Kabupaten Sorong, Papua Barat Daya: nama Moi, nama latin, bagian yang dipakai, dan cara pengolahannya.</p>
<div class="hal-prosa">{pengantar}</div>
<p class="hal-peringatan">{e(T["tanaman.peringatan"])}</p>
<p class="hal-aksi"><a class="tombol" href="/#tanaman">Cari &amp; saring di pustaka interaktif</a> <a class="tombol halus" href="/{e(BUKU["tanaman-obat"]["pdf"])}">Unduh buku saku (PDF)</a></p>
<nav class="hal-loncat baris-tag" aria-label="Kelompok kegunaan">{loncat}</nav>
</header>
<section class="hal-semua"><h2>Semua tanaman (urut buku saku)</h2><div class="hal-grid">{''.join(kartu_tanaman(p) for p in TANAMAN)}</div></section>
{''.join(f'<section class="hal-kelompok" id="{k}"><h2>{e(label_kegunaan(k))}</h2><ul class="hal-daftar">' + ''.join(f'<li><a href="/tanaman/{e(p["id"])}/">{e(p["nama"])}</a>' + (f' <i>{e(p["latin"])}</i>' if p.get("latin") else '') + (f' <span class="hal-redup">· Moi: {e(p["moi"])}</span>' if p.get("moi") else '') + '</li>' for p in v) + '</ul></section>' for k, v in kelompok)}'''
    koleksi = {'@type': 'CollectionPage', '@id': URL + '/tanaman/#koleksi', 'name': 'Tanaman Obat Suku Moi di Klamono', 'inLanguage': 'id', 'isPartOf': SITUS,
               'mainEntity': {'@type': 'ItemList', 'numberOfItems': len(TANAMAN), 'itemListElement': [
                   {'@type': 'ListItem', 'position': j + 1, 'url': f'{URL}/tanaman/{p["id"]}/', 'name': p['nama']} for j, p in enumerate(TANAMAN)]}}
    urls.insert(0, halaman('/tanaman/', '34 Tanaman Obat Suku Moi di Klamono, Papua: Nama, Khasiat & Cara Olah',
                           'Katalog 34 tanaman obat Suku Moi di Klamono, Sorong, Papua Barat Daya: nama Moi dan latin, khasiat, bagian yang dipakai, dan cara pengolahannya.',
                           isi, jenis='website', jsonld=ld(koleksi, j_remah), aktif='/tanaman/'))
    return urls


# ---------------------------------------------------------------- chapters (history & culture)
def buat_pengetahuan():
    urls = []
    for i, b in enumerate(BAB):
        path = f'/pengetahuan/{b["id"]}/'
        judul = L(b['judul'])
        desk = potong(f'{L(b["ringkas"])} Sejarah dan budaya Klamono, Papua Barat Daya.')
        h_remah, j_remah = remah(('Pengetahuan', '/pengetahuan/'), (judul, None))
        blok, sampul_cap, sampul_kredit = b['blok'], '', ''
        if b.get('sampul') and not b.get('sampulDiTeks'):  # the cover is usually also a figure in the text: show it once, on top
            for x in blok:
                if x.get('fig') == b['sampul']:
                    sampul_cap, sampul_kredit = L(x.get('cap')), (T['kredit.foto'] if x.get('kredit') else '')
            blok = [x for x in blok if x.get('fig') != b['sampul']]
        out, daftar = [], []
        def tutup():
            if daftar:
                out.append('<ul>' + ''.join(daftar) + '</ul>'); daftar.clear()
        for x in blok:
            if x.get('li'):
                daftar.append(f'<li>{rich(L(x["li"]))}</li>'); continue
            tutup()
            if x.get('h'): out.append(f'<h2>{rich(L(x["h"]))}</h2>')
            elif x.get('p'): out.append(f'<p>{rich(L(x["p"]))}</p>')
            elif x.get('fig'): out.append(f'<figure><img src="/{e(x["fig"])}" alt="{e(L(x.get("cap")))}" loading="lazy" decoding="async"><figcaption>{e(L(x.get("cap")))}' + (f' {e(T["kredit.foto"])}.' if x.get('kredit') else '') + '</figcaption></figure>')
        tutup()
        istilah = [k for k in KAMUS if k.get('bab') == b['id']]
        sumber = T['d.sumberTanaman'] if b.get('sumber') == 'tanaman' else T['d.sumberKlamono']
        bk = BUKU['tanaman-obat' if b.get('sumber') == 'tanaman' else 'sejarah-klamono']
        sebelum, sesudah = BAB[i - 1] if i > 0 else None, BAB[i + 1] if i + 1 < len(BAB) else None
        isi = f'''{h_remah}
<article class="hal-bab">
<header class="hal-kepala-hal"><p class="hal-atas">Bab {i + 1:02d} dari {len(BAB)} · {e(T.get("bab." + b.get("kategori", ""), ""))}</p>
<h1>{e(judul)}</h1><p class="hal-lead">{e(L(b["ringkas"]))}</p></header>
{f'<figure class="hal-foto hal-foto-lebar"><img src="/{e(b["sampul"])}" alt="{e(sampul_cap or judul)}" decoding="async">' + (f'<figcaption>{e(sampul_cap)}' + (f' {e(sampul_kredit)}.' if sampul_kredit else '') + '</figcaption>' if sampul_cap or sampul_kredit else '') + '</figure>' if b.get("sampul") and not b.get("sampulDiTeks") else ''}
<div class="hal-prosa hal-kolom">{''.join(out)}</div>
{f'<section class="hal-kartu-isi hal-kolom"><h2>Istilah dalam bab ini</h2><dl class="hal-istilah">' + ''.join(f'<div id="{e(k["id"])}"><dt>{e(k["istilah"])}</dt><dd>{e(L(k["arti"]))}</dd></div>' for k in istilah) + '</dl><p><a href="/kamus/">Kamus istilah lengkap</a></p></section>' if istilah else ''}
<p class="hal-sumber hal-kolom">{e(sumber)} <a href="/{e(bk["pdf"])}">Unduh buku saku (PDF)</a></p>
<p class="hal-aksi hal-kolom"><a class="tombol" href="/#p-{e(b["id"])}">Baca di pustaka interaktif</a> <a class="tombol halus" href="/pengetahuan/">Semua bab</a></p>
</article>
<nav class="hal-sebelah" aria-label="Bab lain">{f'<a rel="prev" href="/pengetahuan/{e(sebelum["id"])}/"><small>Bab sebelumnya</small><b>{e(L(sebelum["judul"]))}</b></a>' if sebelum else '<span></span>'}{f'<a rel="next" href="/pengetahuan/{e(sesudah["id"])}/"><small>Bab berikutnya</small><b>{e(L(sesudah["judul"]))}</b></a>' if sesudah else ''}</nav>'''
        artikel = {'@type': 'Article', 'headline': judul, 'description': desk, 'inLanguage': 'id', 'author': TIM, 'publisher': SITUS,
                   'image': [gambar(b.get('sampul'))], 'mainEntityOfPage': URL + path, 'datePublished': TERBIT, 'dateModified': HARI,
                   'about': {'@type': 'Place', 'name': 'Distrik Klamono, Kabupaten Sorong, Papua Barat Daya'}}
        urls.append(halaman(path, f'{judul} | Sejarah & Budaya Klamono', desk, isi, gambar_og=gambar(b.get('sampul')) if b.get('sampul') else None,
                            jsonld=ld(artikel, j_remah), aktif='/pengetahuan/'))
    h_remah, j_remah = remah(('Pengetahuan', None))
    daftar = ''.join(f'<li><a class="hal-baris" href="/pengetahuan/{e(b["id"])}/"><span class="hal-no">{i + 1:02d}</span><span><b>{e(L(b["judul"]))}</b><span>{e(L(b["ringkas"]))}</span></span></a></li>' for i, b in enumerate(BAB))
    isi = f'''{h_remah}
<header class="hal-kepala-hal"><p class="hal-atas">Pustaka Klamono · {len(BAB)} bab</p>
<h1>Sejarah dan Budaya Klamono</h1>
<p class="hal-lead">Pengetahuan lokal Klamono Raya yang dicatat bersama warga: dari penemuan minyak pertama di Tanah Papua pada 1936, asal-usul Suku Moi, hubungan mereka dengan hutan, sampai ritus, seni, dan wisata tiap kampung.</p>
<p class="hal-aksi"><a class="tombol" href="/#pengetahuan">Baca di pustaka interaktif</a> <a class="tombol halus" href="/kamus/">Kamus istilah Moi</a></p></header>
<ol class="hal-bab-daftar">{daftar}</ol>'''
    urls.insert(0, halaman('/pengetahuan/', 'Sejarah dan Budaya Klamono, Papua Barat Daya | Pustaka Suku Moi',
                           'Sejarah Klamono dan budaya Suku Moi: minyak 1936, asal-usul Moi, hutan, ritus, seni, dan kampung-kampung di Distrik Klamono, Sorong.',
                           isi, jenis='website', jsonld=ld({'@type': 'CollectionPage', 'name': 'Sejarah dan Budaya Klamono', 'isPartOf': SITUS}, j_remah), aktif='/pengetahuan/'))
    return urls


# ---------------------------------------------------------------- glossary
def buat_kamus():
    h_remah, j_remah = remah(('Kamus istilah', None))
    urut = sorted(KAMUS, key=lambda k: k['istilah'].lower())
    isi = f'''{h_remah}
<header class="hal-kepala-hal"><p class="hal-atas">Pustaka Klamono · {len(KAMUS)} istilah</p>
<h1>Kamus Istilah Moi dan Klamono</h1>
<p class="hal-lead">Istilah adat, tempat, dan sejarah yang sering muncul saat mengenal Klamono dan Suku Moi, beserta artinya.</p></header>
<dl class="hal-istilah hal-kolom">{''.join(f'<div id="{e(k["id"])}"><dt>{e(k["istilah"])}' + (f' <span class="hal-redup">({e(k["alias"])})</span>' if k.get("alias") else '') + f'</dt><dd>{e(L(k["arti"]))}' + (f' <a href="/pengetahuan/{e(k["bab"])}/">Baca babnya</a>' if k.get("bab") else '') + '</dd></div>' for k in urut)}</dl>'''
    himpunan = {'@type': 'DefinedTermSet', '@id': URL + '/kamus/#kamus', 'name': 'Kamus Istilah Moi dan Klamono', 'inLanguage': 'id',
                'hasDefinedTerm': [{'@type': 'DefinedTerm', 'name': k['istilah'], 'description': L(k['arti']), 'url': f'{URL}/kamus/#{k["id"]}'} for k in urut]}
    return [halaman('/kamus/', 'Kamus Istilah Moi dan Klamono | Jelajah Klamono',
                    'Arti istilah adat Suku Moi, nama tempat, dan sejarah Klamono, Papua Barat Daya: dari egek dan sasi sampai NNGPM.',
                    isi, jenis='website', jsonld=ld(himpunan, j_remah), aktif='/pengetahuan/')]


# ---------------------------------------------------------------- experiences
def buat_wisata():
    urls = []
    for w in WISATA:
        path = f'/wisata/{w["id"]}/'
        judul = L(w['judul'])
        kampung = KAMPUNG.get(w['kampung'], w['kampung'])
        distrik = DISTRIK.get(w['kampung'], 'Klamono')
        desk = potong(f'{judul} di Kampung {kampung}, Distrik {distrik}, Sorong. {L(w["ringkas"])}')
        h_remah, j_remah = remah(('Wisata', '/wisata/'), (judul, None))
        aktivitas = L(w.get('aktivitas')) or []
        atraksi = w.get('atraksi') or []
        ung = w.get('unggulan') or {}
        fakta = ''.join(f'<div><dt>{e(L(f["angka"]))}</dt><dd>{e(L(f["ket"]))}</dd></div>' for f in ung.get('fakta') or [])
        sorotan = L(ung.get('sorotan')) or []
        ket_foto = L(ung.get('fotoKet')) or L(w.get('fotoKet'))
        posisi = f' style="object-position:{e(w["fotoPosisi"])}"' if w.get('fotoPosisi') else ''
        foto = foto_html(w.get('foto'), ket_foto or judul, lazy=False).replace('<img ', f'<img{posisi} ', 1) if w.get('foto') else foto_html(None, judul)
        isi = f'''{h_remah}
<article class="hal-wisata">
<figure class="hal-foto hal-foto-lebar">{foto}{f'<figcaption>{e(ket_foto)}</figcaption>' if ket_foto else ''}</figure>
<div class="hal-teks hal-kolom">
<p class="hal-atas">{e(T.get("kat." + w["kategori"], ""))} · Kampung {e(kampung)}, Distrik {e(distrik)}</p>
<h1>{e(judul)}</h1>
{f'<p class="hal-sorot">{e(L(w["event"]))}</p>' if w.get("event") else ''}
<p class="hal-lead">{e(L(w["ringkas"]))}</p>
{f'<dl class="hal-angka">{fakta}</dl>' if fakta else ''}
{('<h2>Kenapa layak dikunjungi</h2><ul>' + ''.join(f'<li>{e(x)}</li>' for x in sorotan) + '</ul>') if sorotan else ''}
{('<h2>Yang bisa kamu lakukan</h2><ul>' + ''.join(f'<li>{e(a)}</li>' for a in aktivitas) + '</ul>') if aktivitas else ''}
{('<h2>Atraksi</h2><dl class="hal-istilah">' + ''.join(f'<div><dt>{e(L(a["judul"]))}</dt><dd>{e(L(a.get("ket")))}</dd></div>' for a in atraksi) + '</dl>') if atraksi else ''}
<dl class="hal-fakta">{f'<div><dt>Durasi</dt><dd>{e(L(w["durasi"]))}</dd></div>' if w.get("durasi") else ''}<div><dt>Lokasi</dt><dd>Kampung {e(kampung)}, Distrik {e(distrik)}, Kabupaten Sorong, Papua Barat Daya</dd></div>{f'<div><dt>Yang perlu dibawa</dt><dd>{e(L(ung["bawa"]))}</dd></div>' if ung.get("bawa") else ''}</dl>
{f'<p class="hal-catatan">{e(L(w["catatan"]))}</p>' if L(w.get("catatan")) else ''}
<p class="hal-aksi"><a class="tombol" href="/#pesan-{e(w["id"])}">Pesan pengalaman ini</a> <a class="tombol halus" href="/#x-{e(w["id"])}">Lihat detail &amp; peta</a></p>
</div>
</article>'''
        tempat = {'@type': 'TouristAttraction', 'name': judul, 'description': L(w['ringkas']), 'url': URL + path, 'image': gambar(w.get('foto')),
                  'address': {'@type': 'PostalAddress', 'addressLocality': f'Kampung {kampung}, Distrik {distrik}', 'addressRegion': 'Papua Barat Daya', 'addressCountry': 'ID'},
                  'containedInPlace': {'@type': 'Place', 'name': 'Klamono Raya, Kabupaten Sorong'}}
        if w.get('koordinat'):
            tempat['geo'] = {'@type': 'GeoCoordinates', 'latitude': w['koordinat'][0], 'longitude': w['koordinat'][1]}
        urls.append(halaman(path, f'{judul} | Wisata Kampung {kampung}, Klamono, Sorong', desk, isi,
                            gambar_og=gambar(w.get('foto')) if w.get('foto') else None, jsonld=ld(tempat, j_remah), aktif='/wisata/'))
    h_remah, j_remah = remah(('Wisata', None))
    per_kampung = {}
    for w in WISATA:
        per_kampung.setdefault(w['kampung'], []).append(w)
    bagian = ''.join(f'<section class="hal-kelompok"><h2>Kampung {e(KAMPUNG.get(k, k))}</h2><div class="hal-grid">' + ''.join(
        f'<a class="hal-kartu" href="/wisata/{e(w["id"])}/"><span class="hal-kartu-foto">{foto_html(w.get("foto"), L(w["judul"]))}</span>'
        f'<span class="hal-kartu-teks"><small>{e(T.get("kat." + w["kategori"], ""))}</small><b>{e(L(w["judul"]))}</b><span>{e(L(w["ringkas"]))}</span></span></a>' for w in ws) + '</div></section>'
        for k, ws in per_kampung.items())
    isi = f'''{h_remah}
<header class="hal-kepala-hal"><p class="hal-atas">Distrik Klamono · {len(WISATA)} pengalaman</p>
<h1>Wisata di Klamono, Sorong</h1>
<p class="hal-lead">Pengalaman wisata berbasis kampung di Distrik Klamono, Kabupaten Sorong, Papua Barat Daya: trekking Hutan Klawosom, mengamati burung, tokok sagu, kerajinan dan tari Moi, budidaya ikan, sampai sumur minyak bersejarah. Dikelola bersama warga; pesan langsung ke kampung.</p>
<p class="hal-aksi"><a class="tombol" href="/#jelajah">Buka peta &amp; pesan</a></p></header>
{bagian}'''
    urls.insert(0, halaman('/wisata/', 'Wisata Klamono, Sorong: Hutan Klawosom, Tokok Sagu & Budaya Moi',
                           'Wisata kampung di Klamono, Sorong, Papua Barat Daya: trekking Hutan Klawosom, birdwatching, tokok sagu, tari dan kerajinan Moi. Pesan langsung ke kampung.',
                           isi, jenis='website', jsonld=ld({'@type': 'CollectionPage', 'name': 'Wisata di Klamono', 'isPartOf': SITUS}, j_remah), aktif='/wisata/'))
    return urls


# ---------------------------------------------------------------- stories & news
def buat_kisah():
    urls = []
    for a in KISAH:
        path = f'/kisah/{a["id"]}/'
        judul = L(a['judul'])
        desk = potong(L(a['ringkas']))
        h_remah, j_remah = remah(('Kisah & berita', '/kisah/'), (judul, None))
        tautan = ''.join(f'<a class="tombol{" halus" if j else ""}" href="{e(x["url"] if x.get("luar") else "/" + x["url"].lstrip("/"))}"' + (' rel="noopener"' if x.get('luar') else '') + f'>{e(L(x["teks"]))}</a> ' for j, x in enumerate(a.get('tautan') or []))
        isi = f'''{h_remah}
<article class="hal-bab">
<header class="hal-kepala-hal"><p class="hal-atas">{e(T.get("art." + a["kategori"], ""))} · <time datetime="{e(a["tanggal"])}">{e(tgl(a["tanggal"]))}</time> · Oleh {e(a["penulis"])}</p>
<h1>{e(judul)}</h1><p class="hal-lead">{e(L(a["ringkas"]))}</p></header>
{f'<figure class="hal-foto hal-foto-lebar">{foto_html(a["foto"], judul, lazy=False)}</figure>' if a.get("foto") else ''}
<div class="hal-prosa hal-kolom">{''.join(f'<p>{rich(x)}</p>' for x in (L(a["isi"]) or []))}</div>
{f'<p class="hal-aksi hal-kolom">{tautan}</p>' if tautan else ''}
</article>'''
        tulisan = {'@type': 'NewsArticle' if a['kategori'] == 'berita' else 'Article', 'headline': judul[:110], 'description': desk, 'inLanguage': 'id',
                   'datePublished': a['tanggal'], 'dateModified': HARI, 'author': {'@type': 'Person', 'name': re.sub(r'\s*\(.*\)$', '', a['penulis'])},
                   'publisher': SITUS, 'image': [gambar(a.get('foto'))], 'mainEntityOfPage': URL + path}
        urls.append(halaman(path, judul if len(judul) > 52 else f'{judul} | Jelajah Klamono', desk, isi, gambar_og=gambar(a.get('foto')) if a.get('foto') else None,
                            jsonld=ld(tulisan, j_remah), aktif='/kisah/'))
    h_remah, j_remah = remah(('Kisah & berita', None))
    daftar = ''.join(f'<li><a class="hal-baris" href="/kisah/{e(a["id"])}/"><span class="hal-tgl"><time datetime="{e(a["tanggal"])}">{e(tgl(a["tanggal"]))}</time></span><span><b>{e(L(a["judul"]))}</b><span>{e(L(a["ringkas"]))}</span></span></a></li>' for a in KISAH)
    isi = f'''{h_remah}
<header class="hal-kepala-hal"><p class="hal-atas">Kabar dari Klamono</p><h1>Kisah dan Berita Klamono</h1>
<p class="hal-lead">Cerita, berita, dan program seputar wisata kampung dan pengetahuan lokal Suku Moi di Klamono, Sorong.</p></header>
<ol class="hal-bab-daftar">{daftar}</ol>'''
    urls.insert(0, halaman('/kisah/', 'Kisah dan Berita Klamono, Sorong | Jelajah Klamono',
                           'Berita dan cerita dari Klamono, Sorong, Papua Barat Daya: wisata kampung, Hutan Klawosom, pengetahuan Suku Moi, dan kegiatan Tim Ekspedisi Patriot.',
                           isi, jenis='website', jsonld=ld({'@type': 'CollectionPage', 'name': 'Kisah dan Berita Klamono', 'isPartOf': SITUS}, j_remah), aktif='/kisah/'))
    return urls


def main():
    for d in ['tanaman', 'pengetahuan', 'wisata', 'kisah', 'kamus']:
        shutil.rmtree(os.path.join(R, d), ignore_errors=True)
    urls = buat_wisata() + buat_tanaman() + buat_pengetahuan() + buat_kamus() + buat_kisah()
    prior = {'/': '1.0', '/tanaman/': '0.9', '/wisata/': '0.9', '/pengetahuan/': '0.8', '/kisah/': '0.6', '/kamus/': '0.6'}
    semua = ['/'] + urls + ['/' + BUKU['tanaman-obat']['pdf'], '/' + BUKU['sejarah-klamono']['pdf']]
    with open(os.path.join(R, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for u in semua:
            p = prior.get(u, '0.5' if u.endswith('.pdf') else '0.7')
            f.write(f'  <url><loc>{URL}{u}</loc><lastmod>{HARI}</lastmod><priority>{p}</priority></url>\n')
        f.write('</urlset>\n')
    print(f'{len(urls)} halaman statis + sitemap ({len(semua)} URL)')


if __name__ == '__main__':
    main()
