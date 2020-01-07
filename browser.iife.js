(function () {
  'use strict';

  let n="undefined"!==typeof BigUint64Array,r=Symbol();function t(a,b){var d=new Uint32Array(a);a=new Uint16Array(a);d=d[b+-4>>>2]>>>1;b>>>=1;if(1024>=d)return String.fromCharCode.apply(String,a.subarray(b,b+d));let c=[];do{var e=a[b+1024-1];e=55296<=e&&56320>e?1023:1024;c.push(String.fromCharCode.apply(String,a.subarray(b,b+=e)));d-=e;}while(1024<d);return c.join("")+String.fromCharCode.apply(String,a.subarray(b,b+d))}
  function u(a){function b(a,b){return a?t(a.buffer,b):"<yet unknown>"}let d={},c=a.env=a.env||{};c.abort=c.abort||function(a,f,g,k){let e=d.memory||c.memory;throw Error("abort: "+b(e,a)+" at "+b(e,f)+":"+g+":"+k);};c.trace=c.trace||function(a,f){console.log("trace: "+b(d.memory||c.memory,a)+(f?" ":"")+Array.prototype.slice.call(arguments,2,2+f).join(", "));};a.Math=a.Math||Math;a.Date=a.Date||Date;return d}
  function v(a,b){function d(a){let b=new Uint32Array(k.buffer),h=b[m>>>2];if((a>>>=0)>=h)throw Error("invalid id: "+a);return b[(m+4>>>2)+2*a]}function c(a){let b=new Uint32Array(k.buffer),h=b[m>>>2];if((a>>>=0)>=h)throw Error("invalid id: "+a);return b[(m+4>>>2)+2*a+1]}function e(a,b,d){let h=k.buffer;if(d)switch(a){case 2:return new Float32Array(h);case 3:return new Float64Array(h)}else switch(a){case 0:return new (b?Int8Array:Uint8Array)(h);case 1:return new (b?Int16Array:Uint16Array)(h);case 2:return new (b?
  Int32Array:Uint32Array)(h);case 3:return new (b?BigInt64Array:BigUint64Array)(h)}throw Error("unsupported align: "+a);}function f(a){let b=new Uint32Array(k.buffer);var h=b[a+-8>>>2];let c=d(h);if(!(c&1))throw Error("not an array: "+h);h=31-Math.clz32(c>>>5&31);var g=b[a+4>>>2];a=c&2?b[a+12>>>2]:b[g+-4>>>2]>>>h;return e(h,c&1024,c&2048).subarray(g>>>=h,g+a)}function g(a,b,d){let h=k.buffer,c=new Uint32Array(h);d=c[d+4>>>2];return new a(h,d,c[d+-4>>>2]>>>b)}b=b.exports;let k=b.memory,l=b.table,p=b.__alloc,
  q=b.__retain,m=b.__rtti_base||-1;a.__allocString=function(a){let b=a.length,h=p(b<<1,1),d=new Uint16Array(k.buffer);for(var c=0,e=h>>>1;c<b;++c)d[e+c]=a.charCodeAt(c);return h};a.__getString=function(a){let b=k.buffer;if(1!==(new Uint32Array(b))[a+-8>>>2])throw Error("not a string: "+a);return t(b,a)};a.__allocArray=function(a,b){var c=d(a);if(!(c&3))throw Error("not an array: "+a+" @ "+c);let h=31-Math.clz32(c>>>5&31),g=b.length,f=p(g<<h,0);a=p(c&2?16:12,a);var m=new Uint32Array(k.buffer);m[a+0>>>
  2]=q(f);m[a+4>>>2]=f;m[a+8>>>2]=g<<h;c&2&&(m[a+12>>>2]=g);m=e(h,c&1024,c&2048);if(c&8192)for(c=0;c<g;++c)m[(f>>>h)+c]=q(b[c]);else m.set(b,f>>>h);return a};a.__getArrayView=f;a.__getArray=function(a){a=f(a);let b=a.length,c=Array(b);for(let d=0;d<b;d++)c[d]=a[d];return c};a.__getArrayBuffer=function(a){let b=k.buffer,c=(new Uint32Array(b))[a+-4>>>2];return b.slice(a,a+c)};a.__getInt8Array=g.bind(null,Int8Array,0);a.__getUint8Array=g.bind(null,Uint8Array,0);a.__getUint8ClampedArray=g.bind(null,Uint8ClampedArray,
  0);a.__getInt16Array=g.bind(null,Int16Array,1);a.__getUint16Array=g.bind(null,Uint16Array,1);a.__getInt32Array=g.bind(null,Int32Array,2);a.__getUint32Array=g.bind(null,Uint32Array,2);n&&(a.__getInt64Array=g.bind(null,BigInt64Array,3),a.__getUint64Array=g.bind(null,BigUint64Array,3));a.__getFloat32Array=g.bind(null,Float32Array,2);a.__getFloat64Array=g.bind(null,Float64Array,3);a.__instanceof=function(a,b){let d=new Uint32Array(k.buffer);a=d[a+-8>>>2];if(a<=d[m>>>2]){do if(a==b)return !0;while(a=c(a))
  }return !1};a.memory=a.memory||k;a.table=a.table||l;return w(b,a)}function x(a,b){var d=(...c)=>{b(c.length);return a(...c)};d.original=a;return d}function y(a){return "undefined"!==typeof Response&&a instanceof Response}async function z(a,b){return y(a=await a)?A(a,b):v(u(b||(b={})),await WebAssembly.instantiate(a instanceof WebAssembly.Module?a:await WebAssembly.compile(a),b))}
  async function A(a,b){return WebAssembly.instantiateStreaming?v(u(b||(b={})),(await WebAssembly.instantiateStreaming(a,b)).instance):z(y(a=await a)?a.arrayBuffer():a,b)}var B=A;
  function w(a,b){function d(a,b){return Object.prototype.hasOwnProperty.call(a,b)}b=b?Object.create(b):{};var c=a.__setargc||function(){};for(let g in a){if(!d(a,g))continue;let k=a[g];var e=g.split(".");let l=b;for(;1<e.length;){var f=e.shift();d(l,f)||(l[f]={});l=l[f];}e=e[0];f=e.indexOf("#");if(0<=f){let b=e.substring(0,f),q=l[b];if("undefined"===typeof q||!q.prototype){let a=function(...b){return a.wrap(a.prototype.constructor(0,...b))};a.prototype={valueOf:function(){return this[r]}};a.wrap=function(b){return Object.create(a.prototype,
  {[r]:{value:b,writable:!1}})};q&&Object.getOwnPropertyNames(q).forEach(b=>Object.defineProperty(a,b,Object.getOwnPropertyDescriptor(q,b)));l[b]=a;}e=e.substring(f+1);l=l[b].prototype;if(/^(get|set):/.test(e)){if(!d(l,e=e.substring(4))){let b=a[g.replace("set:","get:")],c=a[g.replace("get:","set:")];Object.defineProperty(l,e,{get:function(){return b(this[r])},set:function(a){c(this[r],a);},enumerable:!0});}}else"constructor"===e?l[e]=x(k,c):Object.defineProperty(l,e,{value:function(...a){c(a.length);
  return k(this[r],...a)}});}else/^(get|set):/.test(e)?d(l,e=e.substring(4))||Object.defineProperty(l,e,{get:a[g.replace("set:","get:")],set:a[g.replace("get:","set:")],enumerable:!0}):l[e]="function"===typeof k?x(k,c):k;}return b}async function C(a,b){let d=a instanceof Promise;d&&(a=await a);return d?await B(a,b):await z(a,b)}let D=["__alloc","__allocString","__retain","__release"];
  function E(a,b){if("object"!==typeof a)throw Error("Did not pass a valid exports object of the WebAssembly Instance");if("function"!==typeof b)throw Error("Did not pass a valid exported function of the WebAssembly Instance");D.forEach(b=>{if(!a[b])throw Error('Required Exported AssemblyScript Runtime functions are not present. Runtime must be set to "full" or "stub"');});}
  let F={STRING:{isTypeFromArgument:a=>"string"===typeof a,isTypeFromReference:(a,b)=>a.__instanceof(b,a.__asbind_String_ID),getRef:(a,b)=>a.__retain(a.__allocString(b)),getValueFromRef:(a,b)=>a.__getString(b)},INT8ARRAY:{isTypeFromArgument:a=>a instanceof Int8Array,isTypeFromReference:(a,b)=>a.__instanceof(b,a.__asbind_Int8Array_ID),getRef:(a,b)=>a.__retain(a.__allocArray(a.__asbind_Int8Array_ID,b)),getValueFromRef:(a,b)=>a.__getInt8Array(b).slice()},UINT8ARRAY:{isTypeFromArgument:a=>a instanceof Uint8Array,
  isTypeFromReference:(a,b)=>a.__instanceof(b,a.__asbind_Uint8Array_ID),getRef:(a,b)=>a.__retain(a.__allocArray(a.__asbind_Uint8Array_ID,b)),getValueFromRef:(a,b)=>a.__getUint8Array(b).slice()},INT16ARRAY:{isTypeFromArgument:a=>a instanceof Int16Array,isTypeFromReference:(a,b)=>a.__instanceof(b,a.__asbind_Int16Array_ID),getRef:(a,b)=>a.__retain(a.__allocArray(a.__asbind_Int16Array_ID,b)),getValueFromRef:(a,b)=>a.__getInt16Array(b).slice()},UINT16ARRAY:{isTypeFromArgument:a=>a instanceof Uint16Array,
  isTypeFromReference:(a,b)=>a.__instanceof(b,a.__asbind_Uint16Array_ID),getRef:(a,b)=>a.__retain(a.__allocArray(a.__asbind_Uint16Array_ID,b)),getValueFromRef:(a,b)=>a.__getUint16Array(b).slice()},INT32ARRAY:{isTypeFromArgument:a=>a instanceof Int32Array,isTypeFromReference:(a,b)=>a.__instanceof(b,a.__asbind_Int32Array_ID),getRef:(a,b)=>a.__retain(a.__allocArray(a.__asbind_Int32Array_ID,b)),getValueFromRef:(a,b)=>a.__getInt32Array(b).slice()},UINT32ARRAY:{isTypeFromArgument:a=>a instanceof Uint32Array,
  isTypeFromReference:(a,b)=>a.__instanceof(b,a.__asbind_Uint32Array_ID),getRef:(a,b)=>a.__retain(a.__allocArray(a.__asbind_Uint32Array_ID,b)),getValueFromRef:(a,b)=>a.__getUint32Array(b).slice()},FLOAT32ARRAY:{isTypeFromArgument:a=>a instanceof Float32Array,isTypeFromReference:(a,b)=>a.__instanceof(b,a.__asbind_Float32Array_ID),getRef:(a,b)=>a.__retain(a.__allocArray(a.__asbind_Float32Array_ID,b)),getValueFromRef:(a,b)=>a.__getFloat32Array(b).slice()},FLOAT64ARRAY:{isTypeFromArgument:a=>a instanceof
  Float64Array,isTypeFromReference:(a,b)=>a.__instanceof(b,a.__asbind_Float64Array_ID),getRef:(a,b)=>a.__retain(a.__allocArray(a.__asbind_Float64Array_ID,b)),getValueFromRef:(a,b)=>a.__getFloat64Array(b).slice()}};
  function G(a,b,d){function c(){const c=a.unboundExports;g===b&&(g=e(b,[...d]));const l=[];Array.prototype.slice.call(arguments).forEach((a,b)=>{let d=void 0;g.shouldCacheTypes&&g.cachedArgTypes[b]&&"ref"===g.cachedArgTypes[b].type?d=F[g.cachedArgTypes[b].key]:Object.keys(F).some(e=>F[e].isTypeFromReference(c,a)?(d=F[e],g.shouldCacheTypes&&(g.cachedArgTypes[b]={type:"ref",key:e}),!0):!1);d?l.push(d.getValueFromRef(c,a)):l.push(a);});f.apply(null,l);}let e=(a,b)=>{a=a[b[0]];b.shift();return 0<b.length?
  e(a,b):a},f=e(b,[...d]),g=b;c.shouldCacheTypes=!0;c.cachedArgTypes=[];return c}
  function H(a,b){function d(){var d=Array.prototype.slice.call(arguments);f===a.exports&&(f=a.exports[b]);const k=[],l=[];d.forEach((a,b)=>{if("number"===typeof a)k.push(a),f.shouldCacheTypes&&(f.cachedArgTypes[b]={type:"number"});else{var d=void 0;if(f.shouldCacheTypes&&f.cachedArgTypes[b]&&"ref"===f.cachedArgTypes[b].type)d=F[f.cachedArgTypes[b].key];else if(Object.keys(F).some(c=>F[c].isTypeFromArgument(a)?(d=F[c],f.shouldCacheTypes&&(f.cachedArgTypes[b]={type:"ref",key:c}),!0):!1),!d)throw Error(`The argument, ${a}, is not a supported type by asbind`);
  k.push(d.getRef(c,a));l.push(b);}});const p=e.apply(null,k);l.forEach(a=>{c.__release(k[a]);});d=void 0;if(void 0!==p){let a=void 0;f.shouldCacheTypes&&f.cachedReturnTypes[0]?"ref"===f.cachedReturnTypes[0].type&&(a=a=F[f.cachedReturnTypes[0].key]):Object.keys(F).some(b=>F[b].isTypeFromReference(c,p)?(a=F[b],f.shouldCacheTypes&&(f.cachedReturnTypes[0]={type:"ref",key:b}),!0):!1);a?d=a.getValueFromRef(c,p):"number"===typeof p&&(d=p,f.shouldCacheTypes&&(f.cachedReturnTypes[0]={type:"number"}));}return d}
  let c=a.unboundExports,e=c[b];E(c,e);let f=a.exports;d.shouldCacheTypes=!0;d.cachedArgTypes=[];d.cachedReturnTypes=[];return d}let I=(a,b,d)=>{a&&Object.keys(a).forEach(c=>{"function"===typeof a[c]?d(a,b,c):"object"===typeof a[c]&&I(a[c],[...b,c],d);});};
  class J{constructor(){this.unboundExports={};this.exports={};this.importObject={};}async _instantiate(a,b){this.importObject=b;I(this.importObject,[],(a,b,e)=>{a[`__asbind_unbound_${e}`]=a[e];a[e]=G(this,this.importObject,[...b,e]);});this.unboundExports=await C(a,this.importObject);this.exports={};Object.keys(this.unboundExports).forEach(a=>{var b;if(b="function"===typeof this.unboundExports[a])b=a.startsWith("__asbind")?!0:D.includes(a)?!0:!1,b=!b;this.exports[a]=b?H(this,a):this.unboundExports[a];});}enableExportFunctionTypeCaching(){Object.keys(this.exports).forEach(a=>
  {this.exports[a].shouldCacheTypes=!0;});}disableExportFunctionTypeCaching(){Object.keys(this.exports).forEach(a=>{this.exports[a].shouldCacheTypes=!1;});}enableImportFunctionTypeCaching(){I(this.importObject,[],(a,b,d)=>{a[d].shouldCacheTypes=!0;});}disableImportFunctionTypeCaching(){I(this.importObject,[],(a,b,d)=>{a[d].shouldCacheTypes=!1;});}}let K={version:"0.1.1",instantiate:async(a,b)=>{let d=new J;await d._instantiate(a,b);return d}};var AsBind=K;

  const asyncTask = async () => {
    const asBindInstance = await AsBind.instantiate(fetch('./assembly/index.wasm'));
    const response = asBindInstance.exports.addWorld('Hello');
    const helloWorldNode = document.createTextNode(response);
    document.body.appendChild(helloWorldNode);
  };
  asyncTask();

}());
