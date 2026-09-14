import hashlib
import json
import os
from pathlib import Path
import runpy
import tempfile
import unittest
from unittest.mock import patch
import zipfile

SCRIPT = Path(__file__).with_name('assemble-archives.py')

class ArchiveTest(unittest.TestCase):
    def test_preserves_two_versions_and_rejects_missing_or_changed_assets(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            assets = {}
            releases = []
            for version, style in [('v1.0.0', 'old style'), ('v2.0.0', 'new style')]:
                files = {'index.html': style.encode()}
                manifest = json.dumps({'schemaVersion': 1, 'appVersion': version, 'docsCommit': 'a'*40,
                    'basePath': f'/vizard-docs/releases/{version}/', 'entryPage': 'index.html', 'localPreview': False,
                    'files': {p: hashlib.sha256(b).hexdigest() for p,b in files.items()}}).encode()
                archive = root / (version + '.zip')
                with zipfile.ZipFile(archive, 'w') as z:
                    z.writestr('index.html', style)
                    z.writestr('manifest.json', manifest)
                assets[version] = {'manual.zip': archive.read_bytes(), 'manual.zip.json': json.dumps({
                    'appVersion': version, 'docsCommit': 'a'*40,
                    'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
                    'manifestSha256': hashlib.sha256(manifest).hexdigest()}).encode()}
                releases.append({'draft': False, 'tag_name': version, 'assets': [{'name': n} for n in assets[version]]})
            def gh(args, **kwargs):
                if args[1] == 'api': return json.dumps([releases])
                version = args[3]
                name = args[args.index('--pattern') + 1]
                directory = Path(args[args.index('--dir') + 1])
                (directory / name).write_bytes(assets[version][name])
                return ''
            cwd = Path.cwd()
            try:
                os.chdir(root)
                Path('dist').mkdir()
                with patch('subprocess.check_output', side_effect=gh): runpy.run_path(str(SCRIPT))
                self.assertEqual(Path('dist/releases/v1.0.0/index.html').read_text(), 'old style')
                self.assertEqual(Path('dist/releases/v2.0.0/index.html').read_text(), 'new style')
                chooser = Path('dist/versions/index.html').read_text()
                self.assertIn('v1.0.0', chooser); self.assertIn('v2.0.0', chooser)
                import shutil
                shutil.rmtree('dist'); Path('dist').mkdir()
                releases[0]['assets'] = []
                with patch('subprocess.check_output', side_effect=gh), self.assertRaisesRegex(RuntimeError, 'missing'):
                    runpy.run_path(str(SCRIPT))
                releases[0]['assets'] = [{'name': n} for n in assets['v1.0.0']]
                assets['v1.0.0']['manual.zip'] += b'tampered'
                with patch('subprocess.check_output', side_effect=gh), self.assertRaisesRegex(RuntimeError, 'checksum'):
                    runpy.run_path(str(SCRIPT))
            finally: os.chdir(cwd)

if __name__ == '__main__': unittest.main()
