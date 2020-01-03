(function () {
  'use strict';

  var name = "as-bind";
  var description = "Library to handle passing high-level data structures between AssemblyScript and JavaScript 🤝🚀";
  var version = "0.0.1";
  var main = "dist/asbind.cjs.js";
  var module = "dist/asbind.esm.js";
  var browser = "dist/asbind.iife.js";
  var scripts = {
  	build: "run-s lib:wasm:build lib:js:build",
  	dev: "run-p lib:watch lib:test:watch",
  	serve: "serve dist -p 8080",
  	test: "mocha",
  	lint: "prettier --write **/*.js **/*.ts **/*.json !build/**/* !dist/**/*",
  	"lib:watch": "chokidar --initial \"lib/**/*\" -c \"run-s lib:wasm:build lib:js:build:dev test\"",
  	"lib:test:watch": "chokidar \"test/**/*.js\" \"test/**/*.ts\" -c \"run-s lib:test:build test\"",
  	"lib:wasm:build": "run-s lib:wasm:build:debug lib:wasm:build:optimized lib:wasm:build:cp",
  	"lib:wasm:build:debug": "asc lib/assembly/asbind.ts -b dist/asbind.debug.wasm -t dist/asbind.debug.wat --sourceMap --validate --debug --runtime full",
  	"lib:wasm:build:optimized": "asc lib/assembly/asbind.ts -b dist/asbind.wasm --sourceMap dist/asbind.wasm.map -t dist/asbind.wat --sourceMap --validate --runtime full -O3",
  	"lib:wasm:build:cp": "cpy 'lib/assembly/**/*' dist",
  	"lib:js:build": "rollup -c --environment LIB,PROD",
  	"lib:js:build:dev": "rollup -c --environment LIB,DEV",
  	"lib:test:build": "asc test/assembly/test.ts -b test/assembly/test.wasm --validate --runtime full --debug",
  	"lib:deploy": "np",
  	"md:build": "run-s md:wasm:build md:ts:build md:js:build",
  	"md:dev": "run-p lib:watch md:wasm:watch md:js:watch serve",
  	"md:wasm:watch": "chokidar --initial \"examples/markdown-parser/assembly/**/*\" -c \"run-s md:wasm:build\"",
  	"md:js:watch": "chokidar --initial \"examples/markdown-parser/**/*\" -c \"rollup -c --environment MD,DEV\"",
  	"md:wasm:build": "asc examples/markdown-parser/assembly/index.ts -b dist/examples/markdown-parser/index.wasm --sourceMap dist/examples/markdown-parser/index.wasm.map --validate --runtime stub",
  	"md:ts:build": "tsc --project examples/markdown-parser/assembly/ --outDir dist/ --module \"es2015\"",
  	"md:js:build": "rollup -c --environment MD,PROD",
  	"md:deploy": "run-s build md:build md:deploy:gh-pages",
  	"md:deploy:gh-pages": "gh-pages -d dist/examples/markdown-parser"
  };
  var husky = {
  	hooks: {
  		"pre-commit": "pretty-quick --staged"
  	}
  };
  var devDependencies = {
  	"@ampproject/rollup-plugin-closure-compiler": "^0.10.0",
  	"@babel/core": "^7.5.5",
  	"@babel/plugin-proposal-class-properties": "^7.5.5",
  	"@babel/plugin-proposal-export-default-from": "^7.5.2",
  	"@babel/plugin-proposal-object-rest-spread": "^7.5.5",
  	"@babel/plugin-transform-react-jsx": "^7.3.0",
  	assemblyscript: "^0.8.0",
  	"babel-preset-es2015-rollup": "^3.0.0",
  	"chokidar-cli": "^2.0.0",
  	"cpy-cli": "^2.0.0",
  	"gh-pages": "^2.1.1",
  	husky: "^3.0.5",
  	mkdirp: "^0.5.1",
  	mocha: "^6.2.0",
  	"normalize.css": "^8.0.1",
  	np: "^5.2.1",
  	"npm-run-all": "^4.1.5",
  	"postcss-import": "^12.0.1",
  	preact: "^8.5.2",
  	prettier: "1.18.2",
  	"pretty-quick": "^1.11.1",
  	rollup: "^1.20.2",
  	"rollup-plugin-babel": "^4.3.3",
  	"rollup-plugin-bundle-size": "^1.0.3",
  	"rollup-plugin-commonjs": "^10.1.0",
  	"rollup-plugin-copy": "^3.1.0",
  	"rollup-plugin-delete": "^1.1.0",
  	"rollup-plugin-hash": "^1.3.0",
  	"rollup-plugin-json": "^4.0.0",
  	"rollup-plugin-node-resolve": "^5.2.0",
  	"rollup-plugin-postcss": "^2.0.3",
  	"sakura.css": "^1.0.0",
  	serve: "^11.2.0"
  };
  var repository = {
  	type: "git",
  	url: "git+https://github.com/torch2424/asbind.git"
  };
  var keywords = [
  	"assemblyscript",
  	"wasm",
  	"bindgen",
  	"bind",
  	"type",
  	"loader",
  	"load",
  	"strings",
  	"object",
  	"arrays",
  	"assembly",
  	"script",
  	"typescript"
  ];
  var author = "Aaron Turner";
  var license = "MIT";
  var bugs = {
  	url: "https://github.com/torch2424/asbind/issues"
  };
  var homepage = "https://github.com/torch2424/asbind#readme";
  var dependencies = {
  	typescript: "^3.7.3"
  };
  var packageJson = {
  	name: name,
  	description: description,
  	version: version,
  	main: main,
  	module: module,
  	browser: browser,
  	scripts: scripts,
  	husky: husky,
  	devDependencies: devDependencies,
  	repository: repository,
  	keywords: keywords,
  	author: author,
  	license: license,
  	bugs: bugs,
  	homepage: homepage,
  	dependencies: dependencies
  };

  // Runtime header offsets
  const ID_OFFSET = -8;
  const SIZE_OFFSET = -4;

  // Runtime ids
  const ARRAYBUFFER_ID = 0;
  const STRING_ID = 1;

  // Runtime type information
  const ARRAYBUFFERVIEW = 1 << 0;
  const ARRAY = 1 << 1;
  const VAL_ALIGN_OFFSET = 5;
  const VAL_SIGNED = 1 << 10;
  const VAL_FLOAT = 1 << 11;
  const VAL_MANAGED = 1 << 13;

  // Array(BufferView) layout
  const ARRAYBUFFERVIEW_BUFFER_OFFSET = 0;
  const ARRAYBUFFERVIEW_DATASTART_OFFSET = 4;
  const ARRAYBUFFERVIEW_DATALENGTH_OFFSET = 8;
  const ARRAYBUFFERVIEW_SIZE = 12;
  const ARRAY_LENGTH_OFFSET = 12;
  const ARRAY_SIZE = 16;

  const BIGINT = typeof BigUint64Array !== "undefined";
  const THIS = Symbol();
  const CHUNKSIZE = 1024;

  /** Gets a string from an U32 and an U16 view on a memory. */
  function getStringImpl(buffer, ptr) {
    const U32 = new Uint32Array(buffer);
    const U16 = new Uint16Array(buffer);
    var length = U32[(ptr + SIZE_OFFSET) >>> 2] >>> 1;
    var offset = ptr >>> 1;
    if (length <= CHUNKSIZE) return String.fromCharCode.apply(String, U16.subarray(offset, offset + length));
    const parts = [];
    do {
      const last = U16[offset + CHUNKSIZE - 1];
      const size = last >= 0xD800 && last < 0xDC00 ? CHUNKSIZE - 1 : CHUNKSIZE;
      parts.push(String.fromCharCode.apply(String, U16.subarray(offset, offset += size)));
      length -= size;
    } while (length > CHUNKSIZE);
    return parts.join("") + String.fromCharCode.apply(String, U16.subarray(offset, offset + length));
  }

  /** Prepares the base module prior to instantiation. */
  function preInstantiate(imports) {
    const baseModule = {};

    function getString(memory, ptr) {
      if (!memory) return "<yet unknown>";
      return getStringImpl(memory.buffer, ptr);
    }

    // add common imports used by stdlib for convenience
    const env = (imports.env = imports.env || {});
    env.abort = env.abort || function abort(mesg, file, line, colm) {
      const memory = baseModule.memory || env.memory; // prefer exported, otherwise try imported
      throw Error("abort: " + getString(memory, mesg) + " at " + getString(memory, file) + ":" + line + ":" + colm);
    };
    env.trace = env.trace || function trace(mesg, n) {
      const memory = baseModule.memory || env.memory;
      console.log("trace: " + getString(memory, mesg) + (n ? " " : "") + Array.prototype.slice.call(arguments, 2, 2 + n).join(", "));
    };
    imports.Math = imports.Math || Math;
    imports.Date = imports.Date || Date;

    return baseModule;
  }

  /** Prepares the final module once instantiation is complete. */
  function postInstantiate(baseModule, instance) {
    const rawExports = instance.exports;
    const memory = rawExports.memory;
    const table = rawExports.table;
    const alloc = rawExports["__alloc"];
    const retain = rawExports["__retain"];
    const rttiBase = rawExports["__rtti_base"] || ~0; // oob if not present

    /** Gets the runtime type info for the given id. */
    function getInfo(id) {
      const U32 = new Uint32Array(memory.buffer);
      const count = U32[rttiBase >>> 2];
      if ((id >>>= 0) >= count) throw Error("invalid id: " + id);
      return U32[(rttiBase + 4 >>> 2) + id * 2];
    }

    /** Gets the runtime base id for the given id. */
    function getBase(id) {
      const U32 = new Uint32Array(memory.buffer);
      const count = U32[rttiBase >>> 2];
      if ((id >>>= 0) >= count) throw Error("invalid id: " + id);
      return U32[(rttiBase + 4 >>> 2) + id * 2 + 1];
    }

    /** Gets the runtime alignment of a collection's values. */
    function getValueAlign(info) {
      return 31 - Math.clz32((info >>> VAL_ALIGN_OFFSET) & 31); // -1 if none
    }

    /** Allocates a new string in the module's memory and returns its retained pointer. */
    function __allocString(str) {
      const length = str.length;
      const ptr = alloc(length << 1, STRING_ID);
      const U16 = new Uint16Array(memory.buffer);
      for (var i = 0, p = ptr >>> 1; i < length; ++i) U16[p + i] = str.charCodeAt(i);
      return ptr;
    }

    baseModule.__allocString = __allocString;

    /** Reads a string from the module's memory by its pointer. */
    function __getString(ptr) {
      const buffer = memory.buffer;
      const id = new Uint32Array(buffer)[ptr + ID_OFFSET >>> 2];
      if (id !== STRING_ID) throw Error("not a string: " + ptr);
      return getStringImpl(buffer, ptr);
    }

    baseModule.__getString = __getString;

    /** Gets the view matching the specified alignment, signedness and floatness. */
    function getView(alignLog2, signed, float) {
      const buffer = memory.buffer;
      if (float) {
        switch (alignLog2) {
          case 2: return new Float32Array(buffer);
          case 3: return new Float64Array(buffer);
        }
      } else {
        switch (alignLog2) {
          case 0: return new (signed ? Int8Array : Uint8Array)(buffer);
          case 1: return new (signed ? Int16Array : Uint16Array)(buffer);
          case 2: return new (signed ? Int32Array : Uint32Array)(buffer);
          case 3: return new (signed ? BigInt64Array : BigUint64Array)(buffer);
        }
      }
      throw Error("unsupported align: " + alignLog2);
    }

    /** Allocates a new array in the module's memory and returns its retained pointer. */
    function __allocArray(id, values) {
      const info = getInfo(id);
      if (!(info & (ARRAYBUFFERVIEW | ARRAY))) throw Error("not an array: " + id + " @ " + info);
      const align = getValueAlign(info);
      const length = values.length;
      const buf = alloc(length << align, ARRAYBUFFER_ID);
      const arr = alloc(info & ARRAY ? ARRAY_SIZE : ARRAYBUFFERVIEW_SIZE, id);
      const U32 = new Uint32Array(memory.buffer);
      U32[arr + ARRAYBUFFERVIEW_BUFFER_OFFSET >>> 2] = retain(buf);
      U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2] = buf;
      U32[arr + ARRAYBUFFERVIEW_DATALENGTH_OFFSET >>> 2] = length << align;
      if (info & ARRAY) U32[arr + ARRAY_LENGTH_OFFSET >>> 2] = length;
      const view = getView(align, info & VAL_SIGNED, info & VAL_FLOAT);
      if (info & VAL_MANAGED) {
        for (let i = 0; i < length; ++i) view[(buf >>> align) + i] = retain(values[i]);
      } else {
        view.set(values, buf >>> align);
      }
      return arr;
    }

    baseModule.__allocArray = __allocArray;

    /** Gets a view on the values of an array in the module's memory. */
    function __getArrayView(arr) {
      const U32 = new Uint32Array(memory.buffer);
      const id = U32[arr + ID_OFFSET >>> 2];
      const info = getInfo(id);
      if (!(info & ARRAYBUFFERVIEW)) throw Error("not an array: " + id);
      const align = getValueAlign(info);
      var buf = U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];
      const length = info & ARRAY
        ? U32[arr + ARRAY_LENGTH_OFFSET >>> 2]
        : U32[buf + SIZE_OFFSET >>> 2] >>> align;
      return getView(align, info & VAL_SIGNED, info & VAL_FLOAT)
            .subarray(buf >>>= align, buf + length);
    }

    baseModule.__getArrayView = __getArrayView;

    /** Reads (copies) the values of an array from the module's memory. */
    function __getArray(arr) {
      const input = __getArrayView(arr);
      const len = input.length;
      const out = new Array(len);
      for (let i = 0; i < len; i++) out[i] = input[i];
      return out;
    }

    baseModule.__getArray = __getArray;

    /** Reads (copies) the data of an ArrayBuffer from the module's memory. */
    function __getArrayBuffer(ptr) {
      const buffer = memory.buffer;
      const length = new Uint32Array(buffer)[ptr + SIZE_OFFSET >>> 2];
      return buffer.slice(ptr, ptr + length);
    }

    baseModule.__getArrayBuffer = __getArrayBuffer;

    function getTypedArrayImpl(Type, alignLog2, ptr) {
      const buffer = memory.buffer;
      const U32 = new Uint32Array(buffer);
      const bufPtr = U32[ptr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];
      return new Type(buffer, bufPtr, U32[bufPtr + SIZE_OFFSET >>> 2] >>> alignLog2);
    }

    /** Gets a view on the values of a known-to-be Int8Array in the module's memory. */
    baseModule.__getInt8Array = getTypedArrayImpl.bind(null, Int8Array, 0);
    /** Gets a view on the values of a known-to-be Uint8Array in the module's memory. */
    baseModule.__getUint8Array = getTypedArrayImpl.bind(null, Uint8Array, 0);
    /** Gets a view on the values of a known-to-be Uint8ClampedArray in the module's memory. */
    baseModule.__getUint8ClampedArray = getTypedArrayImpl.bind(null, Uint8ClampedArray, 0);
    /** Gets a view on the values of a known-to-be Int16Array in the module's memory. */
    baseModule.__getInt16Array = getTypedArrayImpl.bind(null, Int16Array, 1);
    /** Gets a view on the values of a known-to-be Uint16Array in the module's memory. */
    baseModule.__getUint16Array = getTypedArrayImpl.bind(null, Uint16Array, 1);
    /** Gets a view on the values of a known-to-be Int32Array in the module's memory. */
    baseModule.__getInt32Array = getTypedArrayImpl.bind(null, Int32Array, 2);
    /** Gets a view on the values of a known-to-be Uint32Array in the module's memory. */
    baseModule.__getUint32Array = getTypedArrayImpl.bind(null, Uint32Array, 2);
    if (BIGINT) {
      /** Gets a view on the values of a known-to-be-Int64Array in the module's memory. */
      baseModule.__getInt64Array = getTypedArrayImpl.bind(null, BigInt64Array, 3);
      /** Gets a view on the values of a known-to-be-Uint64Array in the module's memory. */
      baseModule.__getUint64Array = getTypedArrayImpl.bind(null, BigUint64Array, 3);
    }
    /** Gets a view on the values of a known-to-be Float32Array in the module's memory. */
    baseModule.__getFloat32Array = getTypedArrayImpl.bind(null, Float32Array, 2);
    /** Gets a view on the values of a known-to-be Float64Array in the module's memory. */
    baseModule.__getFloat64Array = getTypedArrayImpl.bind(null, Float64Array, 3);

    /** Tests whether an object is an instance of the class represented by the specified base id. */
    function __instanceof(ptr, baseId) {
      const U32 = new Uint32Array(memory.buffer);
      var id = U32[(ptr + ID_OFFSET) >>> 2];
      if (id <= U32[rttiBase >>> 2]) {
        do if (id == baseId) return true;
        while (id = getBase(id));
      }
      return false;
    }

    baseModule.__instanceof = __instanceof;

    // Pull basic exports to baseModule so code in preInstantiate can use them
    baseModule.memory = baseModule.memory || memory;
    baseModule.table  = baseModule.table  || table;

    // Demangle exports and provide the usual utility on the prototype
    return demangle(rawExports, baseModule);
  }

  /** Wraps a WebAssembly function while also taking care of variable arguments. */
  function wrapFunction(fn, setargc) {
    var wrap = (...args) => {
      setargc(args.length);
      return fn(...args);
    };
    wrap.original = fn;
    return wrap;
  }

  function isResponse(o) {
    return typeof Response !== "undefined" && o instanceof Response;
  }

  /** Asynchronously instantiates an AssemblyScript module from anything that can be instantiated. */
  async function instantiate(source, imports) {
    if (isResponse(source = await source)) return instantiateStreaming(source, imports);
    return postInstantiate(
      preInstantiate(imports || (imports = {})),
      await WebAssembly.instantiate(
        source instanceof WebAssembly.Module
          ? source
          : await WebAssembly.compile(source),
        imports
      )
    );
  }

  var instantiate_1 = instantiate;

  /** Asynchronously instantiates an AssemblyScript module from a response, i.e. as obtained by `fetch`. */
  async function instantiateStreaming(source, imports) {
    if (!WebAssembly.instantiateStreaming) {
      return instantiate(
        isResponse(source = await source)
          ? source.arrayBuffer()
          : source,
        imports
      );
    }
    return postInstantiate(
      preInstantiate(imports || (imports = {})),
      (await WebAssembly.instantiateStreaming(source, imports)).instance
    );
  }

  var instantiateStreaming_1 = instantiateStreaming;

  /** Demangles an AssemblyScript module's exports to a friendly object structure. */
  function demangle(exports, baseModule) {
    var module = baseModule ? Object.create(baseModule) : {};
    var setargc = exports["__setargc"] || function() {};
    function hasOwnProperty(elem, prop) {
      return Object.prototype.hasOwnProperty.call(elem, prop);
    }
    for (let internalName in exports) {
      if (!hasOwnProperty(exports, internalName)) continue;
      let elem = exports[internalName];
      let parts = internalName.split(".");
      let curr = module;
      while (parts.length > 1) {
        let part = parts.shift();
        if (!hasOwnProperty(curr, part)) curr[part] = {};
        curr = curr[part];
      }
      let name = parts[0];
      let hash = name.indexOf("#");
      if (hash >= 0) {
        let className = name.substring(0, hash);
        let classElem = curr[className];
        if (typeof classElem === "undefined" || !classElem.prototype) {
          let ctor = function(...args) {
            return ctor.wrap(ctor.prototype.constructor(0, ...args));
          };
          ctor.prototype = {
            valueOf: function valueOf() {
              return this[THIS];
            }
          };
          ctor.wrap = function(thisValue) {
            return Object.create(ctor.prototype, { [THIS]: { value: thisValue, writable: false } });
          };
          if (classElem) Object.getOwnPropertyNames(classElem).forEach(name =>
            Object.defineProperty(ctor, name, Object.getOwnPropertyDescriptor(classElem, name))
          );
          curr[className] = ctor;
        }
        name = name.substring(hash + 1);
        curr = curr[className].prototype;
        if (/^(get|set):/.test(name)) {
          if (!hasOwnProperty(curr, name = name.substring(4))) {
            let getter = exports[internalName.replace("set:", "get:")];
            let setter = exports[internalName.replace("get:", "set:")];
            Object.defineProperty(curr, name, {
              get: function() { return getter(this[THIS]); },
              set: function(value) { setter(this[THIS], value); },
              enumerable: true
            });
          }
        } else {
          if (name === 'constructor') {
            curr[name] = wrapFunction(elem, setargc);
          } else { // for methods
            Object.defineProperty(curr, name, {
              value: function (...args) {
                setargc(args.length);
                return elem(this[THIS], ...args);
              }
            });
          }
        }
      } else {
        if (/^(get|set):/.test(name)) {
          if (!hasOwnProperty(curr, name = name.substring(4))) {
            Object.defineProperty(curr, name, {
              get: exports[internalName.replace("set:", "get:")],
              set: exports[internalName.replace("get:", "set:")],
              enumerable: true
            });
          }
        } else if (typeof elem === "function") {
          curr[name] = wrapFunction(elem, setargc);
        } else {
          curr[name] = elem;
        }
      }
    }

    return module;
  }

  // Wrapper around the loader instantiate
  async function asbindInstantiate(source, importObject) {
    let wasmInstanceExports;
    const wasSourceAPromise = source instanceof Promise;

    if (wasSourceAPromise) {
      source = await source;
    } // Use the correct loader instantiation
    // https://github.com/AssemblyScript/assemblyscript/tree/master/lib/loader#api


    if (wasSourceAPromise) {
      wasmInstanceExports = await instantiateStreaming_1(source, importObject);
    } else {
      wasmInstanceExports = await instantiate_1(source, importObject);
    }

    return wasmInstanceExports;
  }

  const RUNTIME_EXPORT_KEYS = ["__alloc", "__allocString", "__retain", "__release"];
  function isReservedExportKey(key) {
    if (key.startsWith("__asbind")) {
      return true;
    } else if (RUNTIME_EXPORT_KEYS.includes(key)) {
      return true;
    }

    return false;
  }

  // Validations to run when binding elements
  function validateExportsAndFunction(exports, exportFunction) {
    // Do some validation
    if (typeof exports !== "object") {
      throw new Error("Did not pass a valid exports object of the WebAssembly Instance");
    }

    if (typeof exportFunction !== "function") {
      throw new Error("Did not pass a valid exported function of the WebAssembly Instance");
    }

    RUNTIME_EXPORT_KEYS.forEach(key => {
      if (!exports[key]) {
        throw new Error('Required Exported AssemblyScript Runtime functions are not present. Runtime must be set to "full" or "stub"');
      }
    });
  }

  const SUPPORTED_REF_TYPES = {
    STRING: {
      isTypeFromArgument: arg => {
        return typeof arg === "string";
      },
      isTypeFromReference: (wasmExports, ref) => {
        return wasmExports.__instanceof(ref, wasmExports.__asbind_String_ID);
      },
      getRef: (wasmExports, arg) => {
        return wasmExports.__retain(wasmExports.__allocString(arg));
      },
      getValueFromRef: (wasmExports, responseRef) => {
        return wasmExports.__getString(responseRef);
      }
    },
    INT8ARRAY: {
      isTypeFromArgument: arg => {
        return arg instanceof Int8Array;
      },
      isTypeFromReference: (wasmExports, ref) => {
        return wasmExports.__instanceof(ref, wasmExports.__asbind_Int8Array_ID);
      },
      getRef: (wasmExports, arg) => {
        return wasmExports.__retain(wasmExports.__allocArray(wasmExports.__asbind_Int8Array_ID, arg));
      },
      getValueFromRef: (wasmExports, responseRef) => {
        return Int8Array.from(wasmExports.__getArray(responseRef));
      }
    },
    UINT8ARRAY: {
      isTypeFromArgument: arg => {
        return arg instanceof Uint8Array;
      },
      isTypeFromReference: (wasmExports, ref) => {
        return wasmExports.__instanceof(ref, wasmExports.__asbind_Uint8Array_ID);
      },
      getRef: (wasmExports, arg) => {
        return wasmExports.__retain(wasmExports.__allocArray(wasmExports.__asbind_Uint8Array_ID, arg));
      },
      getValueFromRef: (wasmExports, responseRef) => {
        return Uint8Array.from(wasmExports.__getArray(responseRef));
      }
    },
    INT16ARRAY: {
      isTypeFromArgument: arg => {
        return arg instanceof Int16Array;
      },
      isTypeFromReference: (wasmExports, ref) => {
        return wasmExports.__instanceof(ref, wasmExports.__asbind_Int16Array_ID);
      },
      getRef: (wasmExports, arg) => {
        return wasmExports.__retain(wasmExports.__allocArray(wasmExports.__asbind_Int16Array_ID, arg));
      },
      getValueFromRef: (wasmExports, responseRef) => {
        return Int16Array.from(wasmExports.__getArray(responseRef));
      }
    },
    UINT16ARRAY: {
      isTypeFromArgument: arg => {
        return arg instanceof Uint16Array;
      },
      isTypeFromReference: (wasmExports, ref) => {
        return wasmExports.__instanceof(ref, wasmExports.__asbind_Uint16Array_ID);
      },
      getRef: (wasmExports, arg) => {
        return wasmExports.__retain(wasmExports.__allocArray(wasmExports.__asbind_Uint16Array_ID, arg));
      },
      getValueFromRef: (wasmExports, responseRef) => {
        return Uint16Array.from(wasmExports.__getArray(responseRef));
      }
    },
    INT32ARRAY: {
      isTypeFromArgument: arg => {
        return arg instanceof Int32Array;
      },
      isTypeFromReference: (wasmExports, ref) => {
        return wasmExports.__instanceof(ref, wasmExports.__asbind_Int32Array_ID);
      },
      getRef: (wasmExports, arg) => {
        return wasmExports.__retain(wasmExports.__allocArray(wasmExports.__asbind_Int32Array_ID, arg));
      },
      getValueFromRef: (wasmExports, responseRef) => {
        return Int32Array.from(wasmExports.__getArray(responseRef));
      }
    },
    UINT32ARRAY: {
      isTypeFromArgument: arg => {
        return arg instanceof Uint32Array;
      },
      isTypeFromReference: (wasmExports, ref) => {
        return wasmExports.__instanceof(ref, wasmExports.__asbind_Uint32Array_ID);
      },
      getRef: (wasmExports, arg) => {
        return wasmExports.__retain(wasmExports.__allocArray(wasmExports.__asbind_Uint32Array_ID, arg));
      },
      getValueFromRef: (wasmExports, responseRef) => {
        return Uint32Array.from(wasmExports.__getArray(responseRef));
      }
    },
    FLOAT32ARRAY: {
      isTypeFromArgument: arg => {
        return arg instanceof Float32Array;
      },
      isTypeFromReference: (wasmExports, ref) => {
        return wasmExports.__instanceof(ref, wasmExports.__asbind_Float32Array_ID);
      },
      getRef: (wasmExports, arg) => {
        return wasmExports.__retain(wasmExports.__allocArray(wasmExports.__asbind_Float32Array_ID, arg));
      },
      getValueFromRef: (wasmExports, responseRef) => {
        return Float32Array.from(wasmExports.__getArray(responseRef));
      }
    },
    FLOAT64ARRAY: {
      isTypeFromArgument: arg => {
        return arg instanceof Float64Array;
      },
      isTypeFromReference: (wasmExports, ref) => {
        return wasmExports.__instanceof(ref, wasmExports.__asbind_Float64Array_ID);
      },
      getRef: (wasmExports, arg) => {
        return wasmExports.__retain(wasmExports.__allocArray(wasmExports.__asbind_Float64Array_ID, arg));
      },
      getValueFromRef: (wasmExports, responseRef) => {
        return Float64Array.from(wasmExports.__getArray(responseRef));
      }
    }
  };

  // (E.g ["env", "myObject", "myFunction"] for {env: myObject: {myFunction: () => {}}})
  // To find the importFunction, wrap it, re-assign it to the improt Object, and allow it to access itself later.

  function bindImportFunction(asbindInstance, importObject, importObjectKeyPathToFunction) {
    const getFunctionFromKeyPath = (baseObject, keys) => {
      const newObjectOrFunction = baseObject[keys[0]];
      keys.shift();

      if (keys.length > 0) {
        return getFunctionFromKeyPath(newObjectOrFunction, keys);
      } // We found the final function from the path


      return newObjectOrFunction;
    };

    const importFunction = getFunctionFromKeyPath(importObject, [...importObjectKeyPathToFunction]);
    const originalImport = importFunction; // Cannot Validate here, as exports will not be set until after instantiation
    // NOTE: Since bound import is being bound to the importObject,
    // the function this, will become the importObject

    let functionThis = importObject;

    const boundImport = function () {
      const exports = asbindInstance.unboundExports; // Get the 'this' of the function

      if (functionThis === importObject) {
        functionThis = getFunctionFromKeyPath(importObject, [...importObjectKeyPathToFunction]);
      } // Get all arguments as an array


      const originalArguments = Array.prototype.slice.call(arguments); // Replace all supported reference types,
      // With their respective references

      const argumentsWithReplacedRefs = [];
      originalArguments.forEach((arg, argIndex) => {
        // Find our supported type, if there is one
        let supportedType = undefined; // Check if we already cached the type

        if (functionThis.shouldCacheTypes && functionThis.cachedArgTypes[argIndex] && functionThis.cachedArgTypes[argIndex].type === "ref") {
          supportedType = SUPPORTED_REF_TYPES[functionThis.cachedArgTypes[argIndex].key];
        } else {
          Object.keys(SUPPORTED_REF_TYPES).some(key => {
            if (SUPPORTED_REF_TYPES[key].isTypeFromReference(exports, arg)) {
              supportedType = SUPPORTED_REF_TYPES[key];

              if (functionThis.shouldCacheTypes) {
                functionThis.cachedArgTypes[argIndex] = {
                  type: "ref",
                  key
                };
              }

              return true;
            }

            return false;
          });
        }

        if (supportedType) {
          argumentsWithReplacedRefs.push(supportedType.getValueFromRef(exports, arg));
        } else {
          // Assume it was meant to be passed a number
          argumentsWithReplacedRefs.push(arg);
        }
      }); // Call the import function

      originalImport.apply(null, argumentsWithReplacedRefs); // TODO: Returning from Import functions is not supported by asbind :(
    }; // Initialize the state of our function


    boundImport.shouldCacheTypes = true;
    boundImport.cachedArgTypes = [];
    return boundImport;
  } // Function that takes in an asbind instance, and the key to the export function on the
  // abindInstance.exports object, to be wrapped and then re-assigned to the asbindInstance.exports.

  function bindExportFunction(asbindInstance, exportFunctionKey) {
    const exports = asbindInstance.unboundExports;
    const originalExport = exports[exportFunctionKey];
    validateExportsAndFunction(exports, originalExport); // NOTE: Since bound export is being bound to the asbindInstance exports,
    // the function this, will become the asbindInstance exports

    let functionThis = asbindInstance.exports;

    const boundExport = function () {
      // Get all arguments as an array
      const originalArguments = Array.prototype.slice.call(arguments); // Get the 'this' of the function

      if (functionThis === asbindInstance.exports) {
        functionThis = asbindInstance.exports[exportFunctionKey];
      } // Replace all supported reference types,
      // With their respective references


      const argumentsWithReplacedRefs = [];
      const refIndexes = [];
      originalArguments.forEach((arg, argIndex) => {
        // WebAssembly supports numbers
        // If a number is being passed, it does not need a reference
        if (typeof arg === "number") {
          argumentsWithReplacedRefs.push(arg);

          if (functionThis.shouldCacheTypes) {
            functionThis.cachedArgTypes[argIndex] = {
              type: "number"
            };
          }

          return;
        } // A supported reference type is being passed,
        // Find our supported type


        let supportedType = undefined; // Check if we already cached the type

        if (functionThis.shouldCacheTypes && functionThis.cachedArgTypes[argIndex] && functionThis.cachedArgTypes[argIndex].type === "ref") {
          supportedType = SUPPORTED_REF_TYPES[functionThis.cachedArgTypes[argIndex].key];
        } else {
          // Find the type, and error if we could not
          Object.keys(SUPPORTED_REF_TYPES).some(key => {
            if (SUPPORTED_REF_TYPES[key].isTypeFromArgument(arg)) {
              supportedType = SUPPORTED_REF_TYPES[key];

              if (functionThis.shouldCacheTypes) {
                functionThis.cachedArgTypes[argIndex] = {
                  type: "ref",
                  key
                };
              }

              return true;
            }

            return false;
          });

          if (!supportedType) {
            throw new Error(`The argument, ${arg}, is not a supported type by asbind`);
          }
        }

        argumentsWithReplacedRefs.push(supportedType.getRef(exports, arg));
        refIndexes.push(argIndex);
      }); // Call the Export
      // NOTE: Super random, but we don't hav to worry about ref conflicts here.
      // Since we can only return a single value, there should be no matching reference
      // if the returned value is not a reference.

      const exportFunctionResponse = originalExport.apply(null, argumentsWithReplacedRefs); // Release all references

      refIndexes.forEach(refIndex => {
        exports.__release(argumentsWithReplacedRefs[refIndex]);
      }); // Get the response item from the returned reference

      let response = undefined;

      if (exportFunctionResponse !== undefined) {
        // Find our supported type
        let supportedType = undefined; // Check if we cached the return type

        if (functionThis.shouldCacheTypes && functionThis.cachedReturnTypes[0]) {
          if (functionThis.cachedReturnTypes[0].type === "ref") {
            supportedType = supportedType = SUPPORTED_REF_TYPES[functionThis.cachedReturnTypes[0].key];
          } // Let it fall through the if and handle the primitive (number) logic

        } else {
          // We need to find / cache the type
          Object.keys(SUPPORTED_REF_TYPES).some(key => {
            if (SUPPORTED_REF_TYPES[key].isTypeFromReference(exports, exportFunctionResponse)) {
              supportedType = SUPPORTED_REF_TYPES[key];

              if (functionThis.shouldCacheTypes) {
                functionThis.cachedReturnTypes[0] = {
                  type: "ref",
                  key
                };
              }

              return true;
            }

            return false;
          });
        }

        if (supportedType) {
          response = supportedType.getValueFromRef(exports, exportFunctionResponse);
        } else if (typeof exportFunctionResponse === "number") {
          response = exportFunctionResponse;

          if (functionThis.shouldCacheTypes) {
            functionThis.cachedReturnTypes[0] = {
              type: "number"
            };
          }
        }
      } // Return the result


      return response;
    }; // Initialize the state of our function


    boundExport.shouldCacheTypes = true;
    boundExport.cachedArgTypes = [];
    boundExport.cachedReturnTypes = []; // Return the bound Export

    return boundExport;
  }

  // Class for asbind instances

  const traverseObjectAndRunCallbackForFunctions = (baseObject, keys, callback) => {
    if (!baseObject) {
      return;
    }

    Object.keys(baseObject).forEach(baseObjectKey => {
      if (typeof baseObject[baseObjectKey] === "function") {
        // Call the callback
        callback(baseObject, keys, baseObjectKey);
      } else if (typeof baseObject[baseObjectKey] === "object") {
        traverseObjectAndRunCallbackForFunctions(baseObject[baseObjectKey], [...keys, baseObjectKey], callback);
      }
    });
  };

  class AsbindInstance {
    constructor() {
      this.unboundExports = {};
      this.exports = {};
      this.importObject = {};
    }

    async instantiate(source, importObject) {
      // Set our import object, as we will need it to store type caching
      this.importObject = importObject; // Need to traverse the importObject and bind all import functions

      traverseObjectAndRunCallbackForFunctions(this.importObject, [], (baseObject, keys, baseObjectKey) => {
        // Wrap the original key, but then expose a new key for the unbound import
        let importFunction = baseObject[baseObjectKey];
        baseObject[`__asbind_unbound_${baseObjectKey}`] = importFunction;
        baseObject[baseObjectKey] = bindImportFunction(this, this.importObject, [...keys, baseObjectKey]);
      }); // Instantiate the module through the loader

      this.unboundExports = await asbindInstantiate(source, this.importObject); // Wrap appropriate the appropriate export functions

      this.exports = {};
      Object.keys(this.unboundExports).forEach(unboundExportKey => {
        if (typeof this.unboundExports[unboundExportKey] === "function" && !isReservedExportKey(unboundExportKey)) {
          // Wrap the export
          this.exports[unboundExportKey] = bindExportFunction(this, unboundExportKey);
        } else {
          this.exports[unboundExportKey] = this.unboundExports[unboundExportKey];
        }
      });
    }

    enableExportFunctionTypeCaching() {
      Object.keys(this.exports).forEach(exportKey => {
        this.exports[exportKey].shouldCacheTypes = true;
      });
    }

    disableExportFunctionTypeCaching() {
      Object.keys(this.exports).forEach(exportKey => {
        this.exports[exportKey].shouldCacheTypes = false;
      });
    }

    enableImportFunctionTypeCaching() {
      // Need to traverse the importObject and bind all import functions
      traverseObjectAndRunCallbackForFunctions(this.importObject, [], (baseObject, keys, baseObjectKey) => {
        // Wrap the original key, but then expose a new key for the unbound import
        let importFunction = baseObject[baseObjectKey];
        importFunction.shouldCacheTypes = true;
      });
    }

    disableImportFunctionTypeCaching() {
      // Need to traverse the importObject and bind all import functions
      traverseObjectAndRunCallbackForFunctions(this.importObject, [], (baseObject, keys, baseObjectKey) => {
        // Wrap the original key, but then expose a new key for the unbound import
        let importFunction = baseObject[baseObjectKey];
        importFunction.shouldCacheTypes = false;
      });
    }

  }

  const asbind = {
    // General asbind versionn
    version: packageJson.version,
    // Our APIs
    instantiate: async (source, importObject) => {
      let asbindInstance = new AsbindInstance();
      await asbindInstance.instantiate(source, importObject);
      return asbindInstance;
    }
  };

  console.log('Hello!');

  const asyncTask = async () => {
    const asBindInstance = await asbind.instantiate(fetch('./assembly/index.wasm'));
    const response = asBindInstance.exports.addWorld('Hello');
    const helloWorldNode = document.createTextNode(response);
    document.body.appendChild(helloWorldNode);
  };
  asyncTask();

}());
