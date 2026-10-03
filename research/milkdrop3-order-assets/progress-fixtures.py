from pathlib import Path
import sys
src=(Path(__file__).parent.parent/'milkdrop3-reference-assets/inputs/Hex reference mask zoom.milk2').read_text()
out=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).parent/'generated-progress'
out.mkdir(parents=True,exist_ok=True)
for i,p in enumerate([0,.1,.25,.5,.75,1,1.5,2,3]):
 (out/(f'{i+1:02}-zoom-progress-{p:g}.milk2')).write_text(src.replace('blending_progress=0.5','blending_progress='+str(p)))
for i,p in enumerate([0,.25,.5,.75,1],10):
 (out/(f'{i:02}-cercle-progress-{p:g}.milk2')).write_text(src.replace('blending_progress=0.5','blending_progress='+str(p)).replace('blending_pattern=zoom','blending_pattern=cercle'))
print(len(list(out.iterdir())),'progress fixtures')
