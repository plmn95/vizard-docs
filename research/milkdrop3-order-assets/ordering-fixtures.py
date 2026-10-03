from pathlib import Path
import sys
out=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).parent/'generated-ordering'
out.mkdir(parents=True,exist_ok=True)
base=['MILKDROP_PRESET_VERSION=201','PSVERSION=3','PSVERSION_WARP=3','PSVERSION_COMP=3','[preset00]','fDecay=1','fGammaAdj=1','fWaveAlpha=0','fVideoEchoAlpha=0','bMotionVectorsOn=0','ob_size=0','ib_size=0','zoom=1','zoomexp=1','rot=0','warp=0','cx=0.5','cy=0.5','dx=0','dy=0','sx=1','sy=1','blur1_min=0','blur1_max=1','blur2_min=0','blur2_max=1','blur3_min=0','blur3_max=1','blur1_edge_darken=0','per_frame_init_1=framecounter=0;','per_frame_1=framecounter=framecounter+1; q1=framecounter; q2=framecounter-2*int(framecounter/2);']
def preset(warp='ret=float3(0,0,0);',comp='ret=tex2D(sampler_main,uv).xyz;',extras=[],shaderless=False):
 lines=base.copy()+extras
 if shaderless:lines=[p for p in lines if not p.startswith('PSVERSION')]
 else:
  for kind,body in [('warp',warp),('comp',comp)]:
   for n,line in enumerate(['shader_body','{',body,'}'],1):lines.append(f'{kind}_{n}=`{line}')
 return '\n'.join(lines)+'\n'
def shape(c,alpha=1):
 pairs=dict(enabled=1,sides=4,x=.5,y=.5,rad=1.2,ang=.785398,additive=0,textured=0,r=c[0],g=c[1],b=c[2],a=alpha,r2=c[0],g2=c[1],b2=c[2],a2=alpha,border_a=0)
 return [f'shapecode_0_{k}={v}' for k,v in pairs.items()]
wave=['wavecode_0_enabled=1','wavecode_0_samples=64','wavecode_0_r=1','wavecode_0_g=0','wavecode_0_b=0','wavecode_0_a=1','wavecode_0_bDrawThick=1','wave_0_per_point1=x=sample; y=0.5;']
header='blending_pattern=cercle\nblending_progress=0.5\nblending_direction=1\nrandom_1=0.2\nrandom_2=0.4\nrandom_3=0.6\nrandom_4=0.8\nrandom_5=0.5\n'
def double(a,b,pattern='cercle'):return header.replace('cercle',pattern)+'[PRESET1_BEGIN]\n'+a+'[PRESET1_END]\n[PRESET2_BEGIN]\n'+b+'[PRESET2_END]\n'
black='ret=float3(0,0,0);';detect='ret=float3(0,tex2D(sampler_main,uv).r,0);'
a=preset(comp=black,extras=shape((1,0,0)));b=preset(comp=detect)
cases={
'01-shape-classic-visible.milk':preset(extras=shape((1,0,0))),
'02-shape-classic-hidden.milk':a,
'03-shape-cross-detect.milk2':double(a,b),
'04-shapes-overlap.milk2':double(preset(extras=shape((1,0,0))),preset(extras=shape((0,0,1)))),
'05-shapes-halfalpha.milk2':double(preset(extras=shape((1,0,0),.5)),preset(extras=shape((0,0,1),.5))),
'06-wave-classic-visible.milk':preset(extras=wave),
'07-wave-cross-detect.milk2':double(preset(comp=black,extras=wave),b),
'08-blur-classic-parity.milk':preset(warp='ret=float3(q2,0,0);',comp='ret=float3(tex2D(sampler_main,uv).r,GetBlur1(uv).r,0.2);'),
'09-blur-double-parity.milk2':double(preset(warp='ret=float3(q2,0,0);',comp=black),preset(comp='ret=float3(tex2D(sampler_main,uv).r,GetBlur1(uv).r,0.2);')),
'10-blur-shape-classic.milk':preset(comp='ret=float3(0,GetBlur1(uv).r,0);',extras=shape((1,0,0))),
'11-blur-shape-double.milk2':double(a,preset(comp='ret=float3(0,GetBlur1(uv).r,0);')),
'12-shaderless-shapes.milk2':double(preset(extras=shape((1,0,0)),shaderless=True),preset(extras=shape((0,0,1)),shaderless=True)),
'13-shapes-vertical.milk2':double(preset(extras=shape((1,0,0))),preset(extras=shape((0,0,1))),'vertical'),
'14-shapes-horizontal.milk2':double(preset(extras=shape((1,0,0))),preset(extras=shape((0,0,1))),'horizontal'),
}
for name,text in cases.items():(out/name).write_text(text)
print('Generated',len(cases),'owned ordering controls')
parityshape=shape((1,0,0))+['shape_0_per_frame1=a=q2; a2=q2;']
extra={
'15-blur-shape-parity.milk':preset(comp='ret=float3(tex2D(sampler_main,uv).r,GetBlur1(uv).r,0.2);',extras=parityshape),
'16-blur-shape-parity-double.milk2':double(preset(comp=black,extras=parityshape),preset(comp='ret=float3(tex2D(sampler_main,uv).r,GetBlur1(uv).r,0.2);')),
'17-shape-100.milk':preset(extras=[line.replace('rad=1.2','rad=0.8').replace('sides=4','sides=100') for line in shape((1,0,0))]),
'18-shape-500.milk':preset(extras=[line.replace('rad=1.2','rad=0.8').replace('sides=4','sides=500') for line in shape((1,0,0))]),
}
for name,text in extra.items():(out/name).write_text(text)
