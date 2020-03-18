(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dyws"] = factory();
	else
		root["dyws"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/buffercoder.js":
/*!****************************!*\
  !*** ./src/buffercoder.js ***!
  \****************************/
/*! exports provided: BufferCoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BufferCoder", function() { return BufferCoder; });
/* buffer layer 
arraybuffer <-> string
*/
class BufferCoder {
  constructor() {
    this.buffer = new ArrayBuffer(0);
    this.decoder = new TextDecoder();
    this.encoder = new TextEncoder();
    this.littleEndian = !0;
    this.readLength = 0;
  }

  concat() {
    for (var e = [], len = 0; len < arguments.length; len++) {
      e[len] = arguments[len];
    }

    return e.reduce(function (e, t) {
      var r = t instanceof ArrayBuffer ? new Uint8Array(t) : t,
          n = new Uint8Array(e.length + r.length);
      n.set(e, 0);
      n.set(r, e.length);
      return n;
    }, new Uint8Array(0));
  }
  /* notice: buffer coder will decode data as straming ,
      so one raw block will generate 0 to multiple messages
      */


  decode(raw, callback, isLittle) {
    void 0 === isLittle && (isLittle = this.littleEndian);
    this.buffer = this.concat(this.buffer, raw).buffer;

    for (this.buffer && this.buffer.byteLength > 0;;) {
      if (0 === this.readLength) {
        if (this.buffer.byteLength < 4) return;
        this.readLength = new DataView(this.buffer).getUint32(0, isLittle);
        this.buffer = this.buffer.slice(4);
      }

      if (this.buffer.byteLength < this.readLength) return;
      var text = this.decoder.decode(this.buffer.slice(8, this.readLength - 1));
      this.buffer = this.buffer.slice(this.readLength);
      this.readLength = 0;
      callback(text);
    }
  }

  encode(text, isLittle) {
    void 0 === isLittle && (isLittle = this.littleEndian);
    text = this.concat(this.encoder.encode(text), Uint8Array.of(0));
    var value = 8 + text.length;
    var result = new DataView(new ArrayBuffer(value + 4));
    var offset = 0;
    result.setUint32(offset, value, isLittle);
    offset += 4;
    result.setUint32(offset, value, isLittle);
    offset += 4;
    result.setInt16(offset, 689, isLittle);
    offset += 2;
    result.setInt8(offset, 0);
    offset += 1;
    result.setInt8(offset, 0);
    offset += 1;
    new Uint8Array(result.buffer).set(text, offset);
    return result.buffer;
  }

}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: createDYWebsocket */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDYWebsocket", function() { return createDYWebsocket; });
/* harmony import */ var _msgcoder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./msgcoder */ "./src/msgcoder.js");
/* harmony import */ var _buffercoder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./buffercoder */ "./src/buffercoder.js");


/*
roomId: douyu room id, number
handler: hadnler object, must have onMessage method
options(optional): 
  url(optional): websocket url, default is wss://danmuproxy.douyu.com:8501
  grouop(optional): join group, default is -9999
  keepLiveIntervalSecond(optional): send keep alive message every n seconds
*/

function createDYWebsocket(roomId, handler, options) {
  if (options === undefined) {
    options = {};
  } // buffer coder instance for websocket


  const bc = new _buffercoder__WEBPACK_IMPORTED_MODULE_1__["BufferCoder"]();

  function encode(msg) {
    const payload = _msgcoder__WEBPACK_IMPORTED_MODULE_0__["MsgCoder"].encode(msg);
    const data = bc.encode(payload);
    return data;
  }

  function decode(data, callback) {
    bc.decode(data, function (payload) {
      const msg = _msgcoder__WEBPACK_IMPORTED_MODULE_0__["MsgCoder"].decode(payload);
      return callback(null, msg);
    });
  }

  const url = options.url || "wss://danmuproxy.douyu.com:8501";
  let websocket = new WebSocket(url); // deafult onmessage data type is 'bolb'
  // change it to arraybuffer

  websocket.binaryType = "arraybuffer";
  let keepliveTimer = null;

  websocket.onopen = function (evt) {
    // login request
    const loginreqCommand = {
      type: "loginreq",
      roomid: roomId
    };
    websocket.send(encode(loginreqCommand)); // start keepalive routine

    const intervalSecond = options.keepLiveIntervalSecond || 45;
    keepliveTimer = setInterval(function () {
      const keepliveCommand = {
        type: "mrkl"
      };
      websocket.send(encode(keepliveCommand));
    }, intervalSecond * 1000);
  };

  websocket.onclose = function (evt) {
    // stop interval
    if (keepliveTimer !== null) {
      clearInterval(keepliveTimer);
    }

    if (handler.onClose !== undefined) {
      handler.onClose();
    }
  };

  websocket.onmessage = function (evt) {
    decode(evt.data, function (err, msg) {
      handler.onMessage(msg);

      if (msg.type === "loginres") {
        // join group
        const joinGroupCommand = {
          type: "joingroup",
          rid: roomId,
          gid: options.group || "-9999"
        };
        websocket.send(encode(joinGroupCommand));
      }
    });
  };

  websocket.onerror = function (evt) {};

  return websocket;
}

/***/ }),

/***/ "./src/msgcoder.js":
/*!*************************!*\
  !*** ./src/msgcoder.js ***!
  \*************************/
/*! exports provided: MsgCoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MsgCoder", function() { return MsgCoder; });
/* message layer: like JSON protocol
string <-> object
*/
class MsgCoder {
  static encode(e, t) {
    if ("string" === typeof e) return e;
    var r = Object.prototype.toString.call(e);
    var n = "[object Array]" === r;
    var o = "[object Object]" === r && (null === Object.getPrototypeOf(e) || Object === e.constructor);
    return n || o ? Object.keys(e).reduce(function (t, r) {
      return t + (n ? "" : r.replace(/@|\//g, function (e) {
        return "@" + ("@" === e ? "A" : "S");
      }) + "@=") + MsgCoder.encode(e[r], !0).replace(/@|\//g, function (e) {
        return "@" + ("@" === e ? "A" : "S");
      }) + "/";
    }, "") : (t || console.error("%c [@shark/net - encode]: Illegal parameter!\n  The argument must be a valid string, a plain object or a array!!!", "color: #f0f; font-size: 20px;", e), t ? String(e) : "");
  }

  static decode(text) {
    var n, u;

    if ("string" === typeof text && text) {
      for (var source = "/" !== text.charAt(text.length - 1) ? text.concat("/") : text, length = source.length, result = /@=/g.test(source) ? {} : [], pos = 0, o = "", s = ""; pos < length;) {
        var a = source.charAt(pos);

        if ("/" === a) {
          if (Array.isArray(result)) {
            result.push(s);
          } else {
            result[o] = s;
            o = (n = ["", ""])[0];
            s = n[1];
          }
        } else if ("@" === a) {
          pos += 1;

          switch (source.charAt(pos)) {
            case "A":
              s += "@";
              break;

            case "S":
              s += "/";
              break;

            case "=":
              o = (u = [s, ""])[0];
              s = u[1];
              break;

            default:
              break;
          }
        } else s += a;

        pos += 1;
      }

      return result;
    }

    console.error("%c [@shark/net - decode]: Illegal parameter!\n  The argument must be a valid string!!!", "color: #f0f; font-size: 20px;", text);
  }

}

/***/ })

/******/ });
});