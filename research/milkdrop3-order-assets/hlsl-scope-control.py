import ctypes,json
from ctypes import wintypes as W
compiler=ctypes.WinDLL('d3dcompiler_47')
compile=compiler.D3DCompile
compile.argtypes=[ctypes.c_void_p,ctypes.c_size_t,ctypes.c_char_p,ctypes.c_void_p,ctypes.c_void_p,ctypes.c_char_p,ctypes.c_char_p,W.UINT,W.UINT,ctypes.POINTER(ctypes.c_void_p),ctypes.POINTER(ctypes.c_void_p)]
compile.restype=ctypes.c_long

def blob_bytes(obj):
 if not obj.value:return b''
 table=ctypes.cast(obj,ctypes.POINTER(ctypes.POINTER(ctypes.c_void_p))).contents
 ptr=ctypes.WINFUNCTYPE(ctypes.c_void_p,ctypes.c_void_p)(table[3])(obj)
 size=ctypes.WINFUNCTYPE(ctypes.c_size_t,ctypes.c_void_p)(table[4])(obj)
 data=ctypes.string_at(ptr,size)
 ctypes.WINFUNCTYPE(W.ULONG,ctypes.c_void_p)(table[2])(obj)
 return data
cases={
'plain':'float4 aspect; float4 main(float2 uv:TEXCOORD0):COLOR0 { float local=aspect.x/aspect.y; return local; }',
'uniform_shadow':'float4 aspect; float4 main(float2 uv:TEXCOORD0):COLOR0 { float aspect=aspect.x/aspect.y; return aspect; }',
'macro_shadow':'float4 _c0;\n#define aspect _c0\nfloat4 main(float2 uv:TEXCOORD0):COLOR0 { float aspect=aspect.x/aspect.y; return aspect; }',
'local_ratio':'float4 aspect; float4 texsize; float4 main(float2 uv:TEXCOORD0):COLOR0 { float aspect=texsize.x/texsize.y; return aspect; }'}
for name,source in cases.items():
 data=source.encode();code=ctypes.c_void_p();error=ctypes.c_void_p();result=compile(data,len(data),name.encode(),None,None,b'main',b'ps_3_0',0,0,ctypes.byref(code),ctypes.byref(error))
 bytecode=blob_bytes(code);message=blob_bytes(error).decode(errors='replace')
 print(json.dumps({'case':name,'hresult':result,'bytecode_bytes':len(bytecode),'diagnostic':message}),flush=True)
