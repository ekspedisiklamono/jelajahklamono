# Builds index.html (deployable website) and _pratinjau/index.html (Claude artifact preview)
import os, base64, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAV = "data:image/svg+xml," + "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%231F3B26'/%3E%3Cpath d='M5 16L16 5l11 11-11 11z' fill='none' stroke='%23B6D167' stroke-width='1.6'/%3E%3Cpath d='M10.5 10.5l11 11M21.5 10.5l-11 11' stroke='%23B6D167' stroke-width='1.6'/%3E%3Ccircle cx='16' cy='16' r='3.2' fill='%23B6D167'/%3E%3C/svg%3E"
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap">'
BODY = '''<div id="spanduk" class="spanduk-bahasa" hidden></div>
<header id="kepala" class="kepala"></header>
<main id="isi" tabindex="-1"><noscript><div class="wrap" style="padding:48px 16px"><h1>Klamono</h1><p>Website ini memerlukan JavaScript. Aktifkan JavaScript di browser Anda. / This website needs JavaScript.</p></div></noscript></main>
<footer id="kaki" class="kaki"></footer>
<nav id="nav-bawah" class="nav-bawah" aria-label="Menu"></nav>'''
SCRIPTS = '''<script src="pengaturan.js"></script>
<script src="konten/tanaman.js"></script>
<script src="konten/pengetahuan.js"></script>
<script src="konten/artikel.js"></script>
<script src="konten/peta.js"></script>
<script src="konten/buku.js"></script>
<script src="assets/js/app.js"></script>'''
LEAFLET_JS = '<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>\n<script>window.L || document.write(\'<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\\/script>\')</script>'
DESC = 'Pesan pengalaman wisata langsung dari kampung-kampung di Klamono, Sorong, Papua Barat Daya, dan pelajari pengetahuan lokal Suku Moi: tanaman obat, sejarah, adat, dan seni.'

# ---- search engines (production only) ----
import json, subprocess, datetime
URL = 'https://jelajahklamono.com/'
JUDUL = 'Jelajah Klamono — Wisata & Tanaman Obat Suku Moi di Sorong'
DESC_SEO = 'Wisata kampung di Klamono, Sorong, Papua Barat Daya: trekking Hutan Klawosom, tokok sagu, tari Moi, dan pustaka 34 tanaman obat Suku Moi.'
GAMBAR = URL + 'assets/img/foto/koba-koba-warga.jpg'
_data = json.loads(subprocess.run(['node', '-e', 'global.window=global;window.KLM={};require(process.argv[1]+"/pengaturan.js");console.log(JSON.stringify({p:KLM.pengalaman,s:KLM.pengaturan}))', R],
                                  capture_output=True, text=True, check=True).stdout)
_atraksi = [{'@type': 'TouristAttraction', 'name': e['judul']['id'] if isinstance(e['judul'], dict) else e['judul'],
             'geo': {'@type': 'GeoCoordinates', 'latitude': e['koordinat'][0], 'longitude': e['koordinat'][1]}}
            for e in _data['p'] if e.get('koordinat')]
_ig = (_data['s'] or {}).get('instagram') or ''
LD = {'@context': 'https://schema.org', '@graph': [
  {'@type': 'WebSite', '@id': URL + '#situs', 'url': URL, 'name': 'Jelajah Klamono', 'description': DESC_SEO, 'inLanguage': ['id', 'en'], 'publisher': {'@id': URL + '#tim'}},
  {'@type': 'Organization', '@id': URL + '#tim', 'name': 'Tim Ekspedisi Patriot 20 Universitas Brawijaya', 'url': URL,
   'email': (_data['s'] or {}).get('emailTim') or None, 'sameAs': ['https://www.instagram.com/' + _ig.strip('@') + '/'] if _ig and not _ig.startswith('http') else ([_ig] if _ig else [])},
  {'@type': 'TouristDestination', '@id': URL + '#klamono', 'name': 'Distrik Klamono', 'url': URL, 'image': GAMBAR,
   'description': 'Kawasan hutan dan kampung Suku Moi di Kabupaten Sorong, Papua Barat Daya, dengan wisata berbasis komunitas: trekking hutan, pengamatan burung, tokok sagu, kerajinan, tari, dan budidaya ikan.',
   'geo': {'@type': 'GeoCoordinates', 'latitude': -1.1251, 'longitude': 131.4856},
   'address': {'@type': 'PostalAddress', 'addressLocality': 'Klamono', 'addressRegion': 'Papua Barat Daya', 'addressCountry': 'ID'},
   'containedInPlace': {'@type': 'AdministrativeArea', 'name': 'Kabupaten Sorong'},
   'touristType': ['Ekowisata', 'Wisata budaya', 'Wisata edukasi'], 'includesAttraction': _atraksi}]}
LD['@graph'][1] = {k: v for k, v in LD['@graph'][1].items() if v}
SEO = f"""<link rel="canonical" href="{URL}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:site_name" content="Jelajah Klamono">
<meta property="og:url" content="{URL}">
<meta property="og:locale" content="id_ID">
<meta property="og:locale:alternate" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{json.dumps(LD, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')}</script>"""
site = f'''<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{JUDUL}</title>
<meta name="description" content="{DESC_SEO}">
<meta name="theme-color" content="#1F3B26">
<meta property="og:type" content="website">
<meta property="og:title" content="{JUDUL}">
<meta property="og:description" content="{DESC_SEO}">
<meta property="og:image" content="{GAMBAR}">
{SEO}
<link rel="icon" href="{FAV}">
{FONTS}
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css">
<link rel="stylesheet" href="assets/css/gaya.css">
</head>
<body>
{BODY}
{LEAFLET_JS}
{SCRIPTS}
</body>
</html>
'''
NOSCRIPT = ('<noscript><div class="wrap" style="padding:48px 16px"><h1>Jelajah Klamono</h1>'
  '<p>Wisata berbasis komunitas di Distrik Klamono, Kabupaten Sorong, Papua Barat Daya, dan pustaka pengetahuan lokal Suku Moi.</p>'
  '<h2>Pengalaman wisata</h2><ul>' + ''.join('<li>' + a['name'] + '</li>' for a in _atraksi) + '</ul>'
  '<p>Pustaka: 34 tanaman obat Suku Moi, sejarah lokal Klamono, kamus istilah Moi, serta dua buku saku: '
  '<a href="assets/buku/buku-saku-tanaman-obat-klamono-raya.pdf">Tanaman Obat Klamono Raya (PDF)</a> dan '
  '<a href="assets/buku/buku-saku-sejarah-lokal-klamono-raya.pdf">Sejarah Lokal Klamono Raya (PDF)</a>.</p>'
  '<h2>Halaman</h2><ul><li><a href="wisata/">Wisata di Klamono</a></li><li><a href="tanaman/">34 tanaman obat Suku Moi</a></li>'
  '<li><a href="pengetahuan/">Sejarah dan budaya Klamono</a></li><li><a href="kamus/">Kamus istilah Moi</a></li><li><a href="kisah/">Kisah dan berita</a></li></ul>'
  '<p>Website ini memerlukan JavaScript. / This website needs JavaScript.</p></div></noscript>')
site = site.replace('<noscript><div class="wrap" style="padding:48px 16px"><h1>Klamono</h1><p>Website ini memerlukan JavaScript. Aktifkan JavaScript di browser Anda. / This website needs JavaScript.</p></div></noscript>', NOSCRIPT)
import hashlib
def _versi(m):
    f = os.path.join(R, m.group(2))
    return m.group(1) + m.group(2) + ('?v=' + hashlib.sha1(open(f, 'rb').read()).hexdigest()[:8] if os.path.isfile(f) else '') + m.group(3)
site = re.sub(r'((?:src|href)=")((?:assets|konten)/[^"?]+\.(?:js|css)|pengaturan\.js)(")', _versi, site)
open(R + '/index.html', 'w').write(site)
hari = datetime.date.today().isoformat()
open(R + '/robots.txt', 'w').write('User-agent: *\nAllow: /\n\nSitemap: ' + URL + 'sitemap.xml\n')
# one static page per plant, chapter, experience and story, plus sitemap.xml
subprocess.run(['python3', os.path.join(R, '_alat', 'halaman.py')], check=True)
os.makedirs(R + '/_pratinjau', exist_ok=True)
art = f'''<title>Klamono</title>
<meta name="claude:viewport-fit-sides" content="cover">
{FONTS}
<link rel="stylesheet" href="assets/css/leaflet-inti.css">
<link rel="stylesheet" href="assets/css/gaya.css">
{BODY}
{LEAFLET_JS}
{SCRIPTS}
'''
open(R + '/_pratinjau/index.html', 'w').write(art)
print('ok')
