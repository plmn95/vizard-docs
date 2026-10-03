from pathlib import Path
from PIL import Image,ImageStat,ImageChops
import subprocess,os,time,json,hashlib
wine='/private/tmp/hex-milk-wine-runtime/Wine Staging.app/Contents/Resources/wine/bin/wine';python='/private/tmp/hex-milk-python-win/python.exe';helper=r'Z:\Users\plamenhadzhiev\repos\others\vizard-docs\research\milkdrop3-win-reference-control.py';env=dict(os.environ,WINEPREFIX='/private/tmp/hex-milk-reference-prefix',WINEDEBUG='-all')
root=Path('/private/tmp/hex-milk-order-reference-valid');root.mkdir(exist_ok=True);rows=[]
for index,source in enumerate(sorted(Path('/private/tmp/hex-milk-order-inputs').iterdir())):
 subprocess.run([wine,python,helper,'load',str(index+1)],env=env,check=True,stdout=subprocess.DEVNULL,timeout=30);time.sleep(2)
 paths=[root/(source.stem+'-'+s+'.png') for s in ['a','b']]
 for p in paths:
  subprocess.run(['/private/tmp/hex-milk-sck-capture-durable',str(p)],check=True,stdout=subprocess.DEVNULL,timeout=20);time.sleep(.25)
 imgs=[Image.open(p).convert('RGB').crop((4,55,596,625)) for p in paths]
 row={'input':source.name,'index':index+1,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'captures':[p.name for p in paths],'max_rgb':[[hi for lo,hi in im.getextrema()] for im in imgs],'mean_rgb':[ImageStat.Stat(im).mean for im in imgs],'center':[im.getpixel((296,285)) for im in imgs],'repeat_max':[hi for lo,hi in ImageChops.difference(*imgs).getextrema()]}
 rows.append(row);(root/'manifest.json').write_text(json.dumps(rows,indent=2));print(row,flush=True)
