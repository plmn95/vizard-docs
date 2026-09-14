#!/usr/bin/env python3
"""Assemble frozen release assets after building the current site."""
import hashlib
import html
import json
from pathlib import Path, PurePosixPath
import re
import subprocess
import tempfile
import zipfile

repo = 'plmn95/vizard-docs'
root = Path('dist')

def gh(*args):
    return subprocess.check_output(['gh', *args], text=True)

def sha(data):
    return hashlib.sha256(data).hexdigest()

pages = json.loads(gh('api', '--paginate', '--slurp', f'repos/{repo}/releases?per_page=100'))
releases = [r for page in pages for r in page if not r['draft']]
links = []
for release in releases:
    version = release['tag_name']
    if not re.fullmatch(r'v[0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9.-]+)?', version):
        continue
    names = {a['name'] for a in release['assets']}
    if not {'manual.zip', 'manual.zip.json'} <= names:
        raise RuntimeError(f'Release {version} is missing its manual. Refusing to remove it from the site.')
    with tempfile.TemporaryDirectory() as tmp:
        for name in ('manual.zip', 'manual.zip.json'):
            gh('release', 'download', version, '--repo', repo, '--pattern', name, '--dir', tmp)
        archive = Path(tmp, 'manual.zip')
        record = json.loads(Path(tmp, 'manual.zip.json').read_text())
        if sha(archive.read_bytes()) != record['sha256'] or record['appVersion'] != version:
            raise RuntimeError(f'Archive checksum/identity mismatch: {version}')
        destination = root / 'releases' / version
        if destination.exists():
            raise RuntimeError(f'Archive path already exists: {destination}; build a clean site first')
        with zipfile.ZipFile(archive) as z:
            seen = set()
            for entry in z.infolist():
                name = entry.filename
                if name in seen or name.startswith('/') or any(p in ('', '.', '..') for p in name.split('/')) or '\\' in name or ':' in name or (entry.external_attr >> 16) & 0o170000 == 0o120000:
                    raise RuntimeError('Unsafe archive entry')
                seen.add(name)
            data = z.read('manifest.json')
            manifest = json.loads(data)
            if sha(data) != record['manifestSha256'] or manifest['docsCommit'] != record['docsCommit'] or manifest['appVersion'] != version or manifest.get('localPreview') or manifest['basePath'] != f'/vizard-docs/releases/{version}/':
                raise RuntimeError(f'Manifest mismatch: {version}')
            if seen != set(manifest['files']) | {'manifest.json'}:
                raise RuntimeError('Archive file inventory mismatch')
            for name, expected in manifest['files'].items():
                if sha(z.read(name)) != expected:
                    raise RuntimeError('File checksum mismatch: ' + name)
            z.extractall(destination)
        links.append(f'<li><a href="../releases/{version}/">Vizard {html.escape(version)}</a></li>')
chooser = root / 'versions'
chooser.mkdir(exist_ok=True)
(chooser / 'index.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vizard documentation versions</title><style>body{font:1rem/1.6 system-ui;max-width:44rem;margin:4rem auto;padding:0 1.5rem;background:#141517;color:#eceef2}a{color:#c0d7ff}li{margin:1rem 0}</style><main><h1>Documentation versions</h1><p>Each release keeps the manual and appearance shipped with the app.</p><ul><li><a href="../">Current documentation</a></li>' + ''.join(links) + '</ul></main></html>')
size = sum(p.stat().st_size for p in root.rglob('*') if p.is_file())
print(f'Published site: {size:,} bytes; {len(links)} frozen manuals')
if size > 950_000_000:
    raise RuntimeError('Site is approaching the GitHub Pages 1 GB limit; change archive hosting before deploying')
