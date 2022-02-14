import ffi from 'ffi-napi';
// import ref from 'ref-napi';


const libpath = "dll/x64/alp42.dll";

const DMD = ffi.Library(libpath,{
    'AlpDevAlloc': ['int',['long','int','pointer']]
});