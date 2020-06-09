define(["@grafana/data","@grafana/ui","react"], function(__WEBPACK_EXTERNAL_MODULE__grafana_data__, __WEBPACK_EXTERNAL_MODULE__grafana_ui__, __WEBPACK_EXTERNAL_MODULE_react__) { return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./module.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/tslib/tslib.es6.js":
/*!******************************************!*\
  !*** ../node_modules/tslib/tslib.es6.js ***!
  \******************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ "./ConfigEditor.tsx":
/*!**************************!*\
  !*** ./ConfigEditor.tsx ***!
  \**************************/
/*! exports provided: ConfigEditor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigEditor", function() { return ConfigEditor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__);



var FormField = _grafana_ui__WEBPACK_IMPORTED_MODULE_2__["LegacyForms"].FormField;

var ConfigEditor =
/** @class */
function (_super) {
  Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(ConfigEditor, _super);

  function ConfigEditor() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.onAPIKeyChange = function (event) {
      var _a = _this.props,
          onOptionsChange = _a.onOptionsChange,
          options = _a.options;

      var jsonData = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options.jsonData), {
        apiKey: event.target.value,
        auth: 'Basic ' + btoa("apikey:" + event.target.value)
      });

      onOptionsChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options), {
        jsonData: jsonData
      }));
    };

    _this.onURLChange = function (event) {
      var _a = _this.props,
          onOptionsChange = _a.onOptionsChange,
          options = _a.options;

      var jsonData = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options.jsonData), {
        url: event.target.value
      });

      onOptionsChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options), {
        jsonData: jsonData
      }));
    };

    return _this;
  }

  ConfigEditor.prototype.componentDidMount = function () {};

  ConfigEditor.prototype.render = function () {
    var options = this.props.options;
    var jsonData = options.jsonData;
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form-group"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(FormField, {
      label: "URL",
      inputWidth: 24,
      labelWidth: 6,
      onChange: this.onURLChange,
      value: jsonData.url || '',
      placeholder: "https://aam.iotopen.se"
    })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(FormField, {
      label: "API Key",
      inputWidth: 24,
      labelWidth: 6,
      onChange: this.onAPIKeyChange,
      value: jsonData.apiKey || '',
      placeholder: "Your API key"
    })));
  };

  return ConfigEditor;
}(react__WEBPACK_IMPORTED_MODULE_1__["PureComponent"]);



/***/ }),

/***/ "./DataSource.ts":
/*!***********************!*\
  !*** ./DataSource.ts ***!
  \***********************/
/*! exports provided: DataSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataSource", function() { return DataSource; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @grafana/data */ "@grafana/data");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_grafana_data__WEBPACK_IMPORTED_MODULE_1__);



var DataSource =
/** @class */
function (_super) {
  Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(DataSource, _super);

  function DataSource(instanceSettings, backendSrv) {
    var _this = _super.call(this, instanceSettings) || this;

    _this.backendSrv = backendSrv;
    _this.settings = instanceSettings;
    return _this;
  }

  DataSource.prototype.distinctiveId = function (input) {
    var tag = new Map();
    return input.filter(function (fn) {
      if (tag.get(fn.id) === undefined) {
        tag.set(fn.id, true);
        return true;
      }

      return false;
    });
  };

  DataSource.prototype.fetchInstallations = function () {
    return this.backendSrv.datasourceRequest({
      method: 'GET',
      url: this.settings.url + "/api/v2/installationinfo"
    }).then(function (result) {
      return result.data;
    });
  };

  DataSource.prototype.fetchFunctions = function (installationId) {
    return this.backendSrv.datasourceRequest({
      method: 'GET',
      url: this.settings.url + "/api/v2/functionx/" + installationId
    }).then(function (result) {
      return result.data;
    });
  };

  DataSource.prototype.fetchFilteredFunctions = function (installationId, filter) {
    var queryParams = filter.map(function (entry) {
      return encodeURIComponent(entry.key) + '=' + encodeURIComponent(entry.value);
    }).join('&');
    return this.backendSrv.datasourceRequest({
      method: 'GET',
      url: this.settings.url + "/api/v2/functionx/" + installationId + "?" + queryParams
    }).then(function (result) {
      return result.data;
    });
  };

  DataSource.prototype.createLogTopicMappings = function (clientId, functions) {
    var fmap = new Map();
    functions.map(function (fn) {
      if (fn.meta['topic_read'] === null) {
        return;
      }

      var topicRead = String(clientId) + '/' + fn.meta['topic_read'];

      if (fmap[topicRead] != null) {
        fmap[topicRead].push(fn);
      } else {
        fmap.set(topicRead, [fn]);
      }
    });
    return fmap;
  };

  DataSource.prototype.fetchLog = function (installationId, from, to, offset, topics) {
    var url = this.settings.url + "/api/v3beta/log/" + installationId;
    var queryParams = {
      from: String(from),
      to: String(to),
      offset: String(offset),
      order: 'asc'
    };

    if (topics) {
      queryParams['topics'] = topics.join(',');
    }

    var queryString = Object.keys(queryParams).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]);
    }).join('&');
    return this.backendSrv.datasourceRequest({
      url: url + "?" + queryString,
      method: 'GET'
    }).then(function (result) {
      return result.data;
    });
  };

  DataSource.prototype.fetchState = function (installationId, topics) {
    var url = this.settings.url + "/api/v2/status/" + installationId;
    var queryParams = {};

    if (topics) {
      queryParams['topics'] = topics.join(',');
    }

    var queryString = '?' + Object.keys(queryParams).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]);
    }).join('&');
    return this.backendSrv.datasourceRequest({
      url: url + "?" + queryString,
      method: 'GET'
    }).then(function (result) {
      return result.data;
    }).then(function (obj) {
      var res = {
        total: obj.length,
        count: obj.length,
        last: 0,
        data: obj.map(function (ent) {
          return {
            timestamp: ent.timestamp,
            client_id: ent.client_id,
            installation_id: ent.installation_id,
            topic: ent.client_id + "/" + ent.topic,
            value: ent.value,
            msg: ent.msg
          };
        })
      };

      if (obj.length > 0) {
        res.last = obj[obj.length - 1].timestamp;
      }

      return [res];
    });
  };

  DataSource.prototype.fetchLogFull = function (installationId, from, to, topics) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, Promise, function () {
      var results, offset, logResult;
      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
        switch (_a.label) {
          case 0:
            results = [];
            offset = 0;
            _a.label = 1;

          case 1:
            if (false) {}
            return [4
            /*yield*/
            , this.fetchLog(installationId, from / 1000, to / 1000, offset, topics)];

          case 2:
            logResult = _a.sent();
            results.push(logResult);
            offset += logResult.count;

            if (offset >= logResult.total) {
              return [3
              /*break*/
              , 3];
            }

            return [3
            /*break*/
            , 1];

          case 3:
            return [2
            /*return*/
            , results];
        }
      });
    });
  };

  DataSource.prototype.fetchQueriedFunctions = function (target) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, Promise, function () {
      var functions, messageMeta, _a, _b, originalFilter, tmp, tmp_1, tmp_1_1, fn;

      var e_1, _c, e_2, _d;

      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_e) {
        switch (_e.label) {
          case 0:
            return [4
            /*yield*/
            , this.fetchFilteredFunctions(target.installationId, target.meta)];

          case 1:
            functions = _e.sent();
            if (!(target.messageFrom !== '' && target.messageFrom !== undefined)) return [3
            /*break*/
            , 3];
            messageMeta = [{
              key: 'type',
              value: target.messageFrom
            }];

            try {
              for (_a = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(target.meta), _b = _a.next(); !_b.done; _b = _a.next()) {
                originalFilter = _b.value;

                if (originalFilter.key !== 'type') {
                  messageMeta.push(originalFilter);
                }
              }
            } catch (e_1_1) {
              e_1 = {
                error: e_1_1
              };
            } finally {
              try {
                if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
              } finally {
                if (e_1) throw e_1.error;
              }
            }

            return [4
            /*yield*/
            , this.fetchFilteredFunctions(target.installationId, messageMeta)];

          case 2:
            tmp = _e.sent();

            try {
              for (tmp_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(tmp), tmp_1_1 = tmp_1.next(); !tmp_1_1.done; tmp_1_1 = tmp_1.next()) {
                fn = tmp_1_1.value;
                functions.push(fn);
              }
            } catch (e_2_1) {
              e_2 = {
                error: e_2_1
              };
            } finally {
              try {
                if (tmp_1_1 && !tmp_1_1.done && (_d = tmp_1["return"])) _d.call(tmp_1);
              } finally {
                if (e_2) throw e_2.error;
              }
            }

            _e.label = 3;

          case 3:
            functions = this.distinctiveId(functions);
            return [2
            /*return*/
            , functions];
        }
      });
    });
  };

  DataSource.prototype.queryTimeSeries = function (target, from, to) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, Promise, function () {
      var seriesList, targetDatapoints, targetDatapointsName, functions, mappings, topics, results, _a, results_1, results_1_1, logResult, _b, _c, logEntry, matchingFunctions, matchingFunctions_1, matchingFunctions_1_1, matchingFunction, group, tmpGroup, dps;

      var e_3, _d, e_4, _e, e_5, _f;

      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_g) {
        switch (_g.label) {
          case 0:
            seriesList = [];
            targetDatapoints = new Map();
            targetDatapointsName = new Map();
            return [4
            /*yield*/
            , this.fetchFilteredFunctions(target.installationId, target.meta)];

          case 1:
            functions = _g.sent();
            mappings = this.createLogTopicMappings(target.clientId, functions);
            topics = Array.from(mappings.keys());

            if (topics.length === 0) {
              return [2
              /*return*/
              , null];
            }

            if (!target.stateOnly) return [3
            /*break*/
            , 3];
            return [4
            /*yield*/
            , this.fetchState(target.installationId, topics)];

          case 2:
            _a = _g.sent();
            return [3
            /*break*/
            , 5];

          case 3:
            return [4
            /*yield*/
            , this.fetchLogFull(target.installationId, from, to, topics)];

          case 4:
            _a = _g.sent();
            _g.label = 5;

          case 5:
            results = _a;

            try {
              for (results_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
                logResult = results_1_1.value;

                try {
                  for (_b = (e_4 = void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(logResult.data)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    logEntry = _c.value;
                    matchingFunctions = mappings.get(logEntry.topic);

                    if (matchingFunctions === undefined) {
                      continue;
                    }

                    try {
                      for (matchingFunctions_1 = (e_5 = void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(matchingFunctions)), matchingFunctions_1_1 = matchingFunctions_1.next(); !matchingFunctions_1_1.done; matchingFunctions_1_1 = matchingFunctions_1.next()) {
                        matchingFunction = matchingFunctions_1_1.value;
                        group = String(matchingFunction.id);

                        if (target.groupBy !== undefined && target.groupBy !== '') {
                          tmpGroup = matchingFunction.meta[target.groupBy];

                          if (target.groupBy === 'type') {
                            tmpGroup = matchingFunction.type;
                          }

                          if (tmpGroup !== undefined) {
                            group = tmpGroup;
                          }
                        }

                        dps = targetDatapoints.get(group);

                        if (dps === undefined) {
                          dps = [];
                          targetDatapoints.set(group, dps);
                        } // Naming


                        if (!target.nameBy || target.nameBy === '') {
                          target.nameBy = 'name';
                        }

                        targetDatapointsName.set(group, matchingFunction.meta[target.nameBy]);
                        dps.push([logEntry.value, logEntry.timestamp * 1000]);
                      }
                    } catch (e_5_1) {
                      e_5 = {
                        error: e_5_1
                      };
                    } finally {
                      try {
                        if (matchingFunctions_1_1 && !matchingFunctions_1_1.done && (_f = matchingFunctions_1["return"])) _f.call(matchingFunctions_1);
                      } finally {
                        if (e_5) throw e_5.error;
                      }
                    }
                  }
                } catch (e_4_1) {
                  e_4 = {
                    error: e_4_1
                  };
                } finally {
                  try {
                    if (_c && !_c.done && (_e = _b["return"])) _e.call(_b);
                  } finally {
                    if (e_4) throw e_4.error;
                  }
                }
              }
            } catch (e_3_1) {
              e_3 = {
                error: e_3_1
              };
            } finally {
              try {
                if (results_1_1 && !results_1_1.done && (_d = results_1["return"])) _d.call(results_1);
              } finally {
                if (e_3) throw e_3.error;
              }
            }

            targetDatapoints.forEach(function (value, key) {
              var name = targetDatapointsName.get(key);

              if (name === undefined) {
                name = key;
              }

              var dp = {
                refId: target.refId,
                target: name,
                datapoints: value
              };
              seriesList.push(dp);
            });
            return [2
            /*return*/
            , seriesList];
        }
      });
    });
  };

  DataSource.prototype.queryTableData = function (target, from, to) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, Promise, function () {
      var targetData, targetDatapoints, targetDatapointsName, columns, metaColumns, functions, mappings, topics, functions_1, functions_1_1, func, key, results, _a, lastMsg, results_2, results_2_1, logResult, _b, _c, logEntry, matchingFunctions, matchingFunctions_2, matchingFunctions_2_1, matchingFunction, msg, link, tmpMsg, group, tmpGroup, dps, dat, row, metaColumns_1, metaColumns_1_1, key;

      var e_6, _d, e_7, _e, e_8, _f, e_9, _g, e_10, _h;

      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_j) {
        switch (_j.label) {
          case 0:
            targetData = [];
            targetDatapoints = new Map();
            targetDatapointsName = new Map();
            columns = [{
              text: 'Time'
            }, {
              text: 'name'
            }, {
              text: 'value'
            }, {
              text: 'msg'
            }];
            metaColumns = [];
            return [4
            /*yield*/
            , this.fetchQueriedFunctions(target)];

          case 1:
            functions = _j.sent();
            mappings = this.createLogTopicMappings(target.clientId, functions);
            topics = Array.from(mappings.keys());

            if (topics.length === 0) {
              return [2
              /*return*/
              , null];
            }

            if (target.metaAsFields) {
              try {
                for (functions_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(functions), functions_1_1 = functions_1.next(); !functions_1_1.done; functions_1_1 = functions_1.next()) {
                  func = functions_1_1.value;

                  for (key in func.meta) {
                    if (key === 'name') {
                      continue;
                    }

                    if (metaColumns.indexOf(key) === -1) {
                      metaColumns.push(key);
                      columns.push({
                        text: key
                      });
                    }
                  }
                }
              } catch (e_6_1) {
                e_6 = {
                  error: e_6_1
                };
              } finally {
                try {
                  if (functions_1_1 && !functions_1_1.done && (_d = functions_1["return"])) _d.call(functions_1);
                } finally {
                  if (e_6) throw e_6.error;
                }
              }
            }

            if (!target.stateOnly) return [3
            /*break*/
            , 3];
            return [4
            /*yield*/
            , this.fetchState(target.installationId, topics)];

          case 2:
            _a = _j.sent();
            return [3
            /*break*/
            , 5];

          case 3:
            return [4
            /*yield*/
            , this.fetchLogFull(target.installationId, from, to, topics)];

          case 4:
            _a = _j.sent();
            _j.label = 5;

          case 5:
            results = _a;
            lastMsg = new Map();

            try {
              for (results_2 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(results), results_2_1 = results_2.next(); !results_2_1.done; results_2_1 = results_2.next()) {
                logResult = results_2_1.value;

                try {
                  for (_b = (e_8 = void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(logResult.data)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    logEntry = _c.value;
                    matchingFunctions = mappings.get(logEntry.topic);

                    if (matchingFunctions === undefined) {
                      continue;
                    }

                    try {
                      for (matchingFunctions_2 = (e_9 = void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(matchingFunctions)), matchingFunctions_2_1 = matchingFunctions_2.next(); !matchingFunctions_2_1.done; matchingFunctions_2_1 = matchingFunctions_2.next()) {
                        matchingFunction = matchingFunctions_2_1.value;
                        msg = logEntry.msg;

                        if (msg === undefined) {
                          msg = '';
                        }

                        link = target.linkKey;

                        if (link === undefined || link === '') {
                          link = 'device_id';
                        }

                        if (target.messageFrom !== undefined && target.messageFrom !== '' && matchingFunction.type === target.messageFrom) {
                          lastMsg.set(matchingFunction.meta[link], logEntry.msg);
                          continue;
                        } else if (target.messageFrom !== undefined && target.messageFrom !== '') {
                          tmpMsg = lastMsg.get(matchingFunction.meta[link]);

                          if (tmpMsg !== undefined) {
                            msg = tmpMsg;
                          } else {
                            continue;
                          }
                        }

                        group = String(matchingFunction.id);

                        if (target.groupBy !== undefined && target.groupBy !== '') {
                          tmpGroup = matchingFunction.meta[target.groupBy];

                          if (target.groupBy === 'type') {
                            tmpGroup = matchingFunction.type;
                          }

                          if (tmpGroup === undefined) {
                            tmpGroup = msg;
                          }

                          group = tmpGroup;
                        } // Naming


                        if (!target.nameBy || target.nameBy === '') {
                          target.nameBy = 'name';
                        }

                        targetDatapointsName.set(group, matchingFunction.meta[target.nameBy]);
                        dps = targetDatapoints.get(group);

                        if (dps === undefined) {
                          dps = [];
                          targetDatapoints.set(group, dps);
                        }

                        dat = new Date(logEntry.timestamp * 1000);
                        row = [dat, matchingFunction.meta[target.nameBy], logEntry.value, msg];

                        if (target.metaAsFields) {
                          try {
                            for (metaColumns_1 = (e_10 = void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(metaColumns)), metaColumns_1_1 = metaColumns_1.next(); !metaColumns_1_1.done; metaColumns_1_1 = metaColumns_1.next()) {
                              key = metaColumns_1_1.value;

                              if (matchingFunction.meta[key]) {
                                row.push(matchingFunction.meta[key]);
                              } else {
                                row.push('');
                              }
                            }
                          } catch (e_10_1) {
                            e_10 = {
                              error: e_10_1
                            };
                          } finally {
                            try {
                              if (metaColumns_1_1 && !metaColumns_1_1.done && (_h = metaColumns_1["return"])) _h.call(metaColumns_1);
                            } finally {
                              if (e_10) throw e_10.error;
                            }
                          }
                        }

                        dps.push(row);
                      }
                    } catch (e_9_1) {
                      e_9 = {
                        error: e_9_1
                      };
                    } finally {
                      try {
                        if (matchingFunctions_2_1 && !matchingFunctions_2_1.done && (_g = matchingFunctions_2["return"])) _g.call(matchingFunctions_2);
                      } finally {
                        if (e_9) throw e_9.error;
                      }
                    }
                  }
                } catch (e_8_1) {
                  e_8 = {
                    error: e_8_1
                  };
                } finally {
                  try {
                    if (_c && !_c.done && (_f = _b["return"])) _f.call(_b);
                  } finally {
                    if (e_8) throw e_8.error;
                  }
                }
              }
            } catch (e_7_1) {
              e_7 = {
                error: e_7_1
              };
            } finally {
              try {
                if (results_2_1 && !results_2_1.done && (_e = results_2["return"])) _e.call(results_2);
              } finally {
                if (e_7) throw e_7.error;
              }
            }

            targetDatapoints.forEach(function (value, key) {
              var dp = {
                name: targetDatapointsName.get(key),
                columns: columns,
                rows: value,
                refId: target.refId
              };
              targetData.push(dp);
            });
            return [2
            /*return*/
            , targetData];
        }
      });
    });
  };

  DataSource.prototype.queryDataFrames = function (target) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, Promise, function () {
      var data, result, df, df2;
      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
        data = [Date.now() - 1000 * 60 * 5, Date.now() - 1000 * 60 * 2];
        result = [];
        df = {
          name: 'MyFrame',
          refId: target.refId,
          length: 2,
          fields: [{
            type: _grafana_data__WEBPACK_IMPORTED_MODULE_1__["FieldType"].time,
            name: '_time_',
            config: {},
            labels: {
              timelabel: 'time1'
            },
            values: new _grafana_data__WEBPACK_IMPORTED_MODULE_1__["ArrayVector"](data)
          }, {
            type: _grafana_data__WEBPACK_IMPORTED_MODULE_1__["FieldType"].number,
            name: 'value',
            config: {
              displayName: 'value'
            },
            labels: {
              valuelabels: 'lol'
            },
            values: new _grafana_data__WEBPACK_IMPORTED_MODULE_1__["ArrayVector"]([1, 2])
          }, {
            type: _grafana_data__WEBPACK_IMPORTED_MODULE_1__["FieldType"].string,
            name: 'msg',
            config: {
              displayName: 'msg'
            },
            labels: {
              valuelabels: 'lol'
            },
            values: new _grafana_data__WEBPACK_IMPORTED_MODULE_1__["ArrayVector"](['hello', 'world'])
          }]
        };
        df2 = {
          name: 'MyData2',
          length: 2,
          refId: target.refId,
          fields: [{
            name: '_time_',
            config: {},
            type: _grafana_data__WEBPACK_IMPORTED_MODULE_1__["FieldType"].time,
            labels: {
              label2: 'helloworld'
            },
            values: new _grafana_data__WEBPACK_IMPORTED_MODULE_1__["ArrayVector"](data)
          }, {
            name: 'value',
            config: {},
            type: _grafana_data__WEBPACK_IMPORTED_MODULE_1__["FieldType"].number,
            labels: {
              level: '3',
              geohash: 'u6sdjpqs0'
            },
            values: new _grafana_data__WEBPACK_IMPORTED_MODULE_1__["ArrayVector"]([3, 1])
          }, {
            type: _grafana_data__WEBPACK_IMPORTED_MODULE_1__["FieldType"].string,
            name: 'msg',
            config: {
              displayName: 'msg'
            },
            labels: {
              valuelabels: 'lol'
            },
            values: new _grafana_data__WEBPACK_IMPORTED_MODULE_1__["ArrayVector"](['hello', 'wow'])
          }]
        };
        result.push(df);
        result.push(df2);
        return [2
        /*return*/
        , result];
      });
    });
  };

  DataSource.prototype.query = function (options) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, Promise, function () {
      var range, from, to, targets, response, jobs, targets_1, targets_1_1, target, job, job, data, data_1, data_1_1, series, series_1, series_1_1, serie;

      var e_11, _a, e_12, _b, e_13, _c;

      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_d) {
        switch (_d.label) {
          case 0:
            range = options.range;

            if (range == null) {
              range = _grafana_data__WEBPACK_IMPORTED_MODULE_1__["DefaultTimeRange"];
            }

            from = range.from.valueOf();
            to = range.to.valueOf();
            targets = options.targets.filter(function (target) {
              return !target.hide;
            });
            response = {
              data: []
            };
            jobs = [];

            try {
              for (targets_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(targets), targets_1_1 = targets_1.next(); !targets_1_1.done; targets_1_1 = targets_1.next()) {
                target = targets_1_1.value; //    const job = this.queryDataFrames(target);
                //    jobs.push(job);

                if (target.tabledata) {
                  job = this.queryTableData(target, from, to);
                  jobs.push(job);
                } else {
                  job = this.queryTimeSeries(target, from, to);
                  jobs.push(job);
                }
              }
            } catch (e_11_1) {
              e_11 = {
                error: e_11_1
              };
            } finally {
              try {
                if (targets_1_1 && !targets_1_1.done && (_a = targets_1["return"])) _a.call(targets_1);
              } finally {
                if (e_11) throw e_11.error;
              }
            }

            return [4
            /*yield*/
            , Promise.all(jobs)];

          case 1:
            data = _d.sent();

            try {
              for (data_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                series = data_1_1.value;

                if (series === null) {
                  continue;
                }

                try {
                  for (series_1 = (e_13 = void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(series)), series_1_1 = series_1.next(); !series_1_1.done; series_1_1 = series_1.next()) {
                    serie = series_1_1.value;
                    response.data.push(serie);
                  }
                } catch (e_13_1) {
                  e_13 = {
                    error: e_13_1
                  };
                } finally {
                  try {
                    if (series_1_1 && !series_1_1.done && (_c = series_1["return"])) _c.call(series_1);
                  } finally {
                    if (e_13) throw e_13.error;
                  }
                }
              }
            } catch (e_12_1) {
              e_12 = {
                error: e_12_1
              };
            } finally {
              try {
                if (data_1_1 && !data_1_1.done && (_b = data_1["return"])) _b.call(data_1);
              } finally {
                if (e_12) throw e_12.error;
              }
            }

            return [2
            /*return*/
            , response];
        }
      });
    });
  };

  DataSource.prototype.testDatasource = function () {
    var _this = this;

    return new Promise(function (resolve, reject) {
      _this.backendSrv.datasourceRequest({
        method: 'GET',
        url: _this.settings.url + "/api/v2/installationinfo"
      }).then(function (result) {
        resolve({
          status: 'success',
          message: 'All good!'
        });
      })["catch"](function (err) {
        reject({
          status: 'error',
          message: err.statusText
        });
      });
    });
  };

  return DataSource;
}(_grafana_data__WEBPACK_IMPORTED_MODULE_1__["DataSourceApi"]);



/***/ }),

/***/ "./QueryEditor.tsx":
/*!*************************!*\
  !*** ./QueryEditor.tsx ***!
  \*************************/
/*! exports provided: QueryEditor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryEditor", function() { return QueryEditor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_FilterEntry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/FilterEntry */ "./components/FilterEntry.tsx");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_3__);




var FormField = _grafana_ui__WEBPACK_IMPORTED_MODULE_3__["LegacyForms"].FormField,
    Switch = _grafana_ui__WEBPACK_IMPORTED_MODULE_3__["LegacyForms"].Switch;

var QueryEditor =
/** @class */
function (_super) {
  Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(QueryEditor, _super);

  function QueryEditor(props) {
    var _this = _super.call(this, props) || this;

    _this.onSelectInstallation = function (selected) {
      var _a = _this.props,
          onChange = _a.onChange,
          query = _a.query;

      if (selected.value == null) {
        return;
      }

      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        installationId: selected.value.id,
        clientId: selected.value.client_id
      }));

      _this.props.datasource.fetchFunctions(Number(selected.value.id)).then(function (functions) {
        if (selected.value !== undefined) {
          console.log(functions);

          _this.setState({
            functions: functions,
            selectedInstallation: selected
          });

          _this.props.onRunQuery();
        }
      });
    };

    _this.addFilter = function () {
      var _a = _this.props,
          onChange = _a.onChange,
          query = _a.query;
      query.meta.push({
        key: '',
        value: ''
      });
      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        meta: query.meta
      }));
    };

    _this.onMetaDelete = function (idx) {
      var _a = _this.props,
          onChange = _a.onChange,
          query = _a.query;
      query.meta = query.meta.filter(function (value, fidx) {
        return !(idx === fidx);
      });
      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        meta: query.meta
      }));

      _this.props.onRunQuery();
    };

    _this.onMetaUpdate = function (idx, key, value) {
      var _a = _this.props,
          onChange = _a.onChange,
          query = _a.query;
      query.meta[idx].key = key;
      query.meta[idx].value = value;
      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        meta: query.meta
      }));

      _this.onRunQuery();
    };

    _this.onMessageChange = function (event) {
      var _a = _this.props,
          onChange = _a.onChange,
          query = _a.query;
      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        messageFrom: event.target.value
      }));

      _this.onRunQuery();
    };

    _this.onGroupByChange = function (event) {
      var _a = _this.props,
          onChange = _a.onChange,
          query = _a.query;
      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        groupBy: event.target.value
      }));

      _this.onRunQuery();
    };

    _this.onNameByChange = function (event) {
      var _a = _this.props,
          onChange = _a.onChange,
          query = _a.query;
      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        nameBy: event.target.value
      }));

      _this.onRunQuery();
    };

    _this.onLinkChange = function (event) {
      var _a = _this.props,
          onChange = _a.onChange,
          query = _a.query;
      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        linkKey: event.target.value
      }));

      _this.onRunQuery();
    };

    _this.onStateOnlyChange = function () {
      var _a = _this.props,
          onChange = _a.onChange,
          query = _a.query;
      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        stateOnly: !query.stateOnly
      }));

      _this.props.onRunQuery();
    };

    _this.onDatatable = function () {
      var _a = _this.props,
          onChange = _a.onChange,
          query = _a.query;
      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        tabledata: !query.tabledata
      }));

      _this.props.onRunQuery();
    };

    _this.onMetaAsFields = function () {
      var _a = _this.props,
          onChange = _a.onChange,
          query = _a.query;
      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        metaAsFields: !query.metaAsFields
      }));

      _this.props.onRunQuery();
    };

    _this.tooltipGroupBy = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, "Group series by some meta key or payload ", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("code", null, "msg"), " field. Defaults to Function ID.");
    _this.tooltipNameBy = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, "This will name series based on some meta key.", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("br", null), "Defaults to ", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("code", null, "name"), ".");
    _this.tooltipMessageFrom = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, "Using this field will join matching functions with the same filter, but the type changed to this field. The msg field will be overwritten by messages matching this type, linked through ", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("code", null, "device_id"), " meta key. Useful for eg. joining positional data. ", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("br", null), "This field is only applied on table data.");
    _this.state = {
      installations: [],
      functions: [],
      selectedInstallation: {
        value: {
          id: 0,
          name: '',
          client_id: 0
        }
      },
      ticker: null,
      loadingInstallations: true
    };
    return _this;
  }

  QueryEditor.prototype.componentDidMount = function () {
    var _this = this;

    this.props.datasource.fetchInstallations().then(function (installations) {
      var selectedInstallation = {
        id: 0,
        client_id: 0,
        name: ''
      };

      if (installations.length > 0) {
        selectedInstallation = installations[0];
      }

      if (_this.props.query.installationId !== 0) {
        var tmp = installations.find(function (x) {
          return x.id === _this.props.query.installationId;
        });

        if (tmp !== undefined) {
          selectedInstallation = tmp;
        } else {//         this.onSelectInstallation({ value: selectedInstallation });
        }
      } else {//        this.onSelectInstallation({ value: selectedInstallation });
        }

      _this.onSelectInstallation({
        value: selectedInstallation
      });

      _this.setState({
        installations: installations,
        loadingInstallations: false,
        selectedInstallation: {
          value: selectedInstallation
        }
      });
    });
  };

  QueryEditor.prototype.onRunQuery = function () {
    var _this = this;

    if (this.state.ticker) {
      clearTimeout(this.state.ticker);
      var tmp = setTimeout(function () {
        _this.props.onRunQuery();
      }, 250);
      this.setState({
        ticker: tmp
      });
    } else {
      var tmp = setTimeout(function () {
        _this.props.onRunQuery();
      }, 250);
      this.setState({
        ticker: tmp
      });
    }
  };

  QueryEditor.prototype.getInstallationOptionLabel = function (input) {
    if (input.value == null) {
      return '';
    }

    return input.value.name;
  };

  QueryEditor.prototype.getMetaKeys = function () {
    var e_1, _a;

    var res = ['id', 'type'];

    try {
      for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this.state.functions), _c = _b.next(); !_c.done; _c = _b.next()) {
        var func = _c.value;

        for (var metaKey in func.meta) {
          if (res.indexOf(metaKey) === -1) {
            res.push(metaKey);
          }
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }

    return res;
  };

  QueryEditor.prototype.getMetaValues = function (key) {
    var e_2, _a;

    var res = [];

    try {
      for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this.state.functions), _c = _b.next(); !_c.done; _c = _b.next()) {
        var func = _c.value;
        var value = func.meta[key];

        if (key === 'type') {
          value = func.type;
        }

        if (key === 'id') {
          value = func.id.toString();
        }

        if (value && res.indexOf(value) === -1) {
          res.push(value);
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    return res;
  };

  QueryEditor.prototype.render = function () {
    var _this = this;

    var query = this.props.query;

    if (query.meta == null) {
      query.installationId = 0;
      query.clientId = 0;
      query.meta = [{
        key: 'type',
        value: ''
      }];
    }

    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: 'section gf-form-group'
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: 'gf-form-inline'
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_3__["Select"], {
      isLoading: this.state.loadingInstallations,
      width: 65,
      getOptionLabel: this.getInstallationOptionLabel,
      options: this.state.installations.map(function (installation) {
        return {
          value: installation
        };
      }),
      onChange: this.onSelectInstallation,
      value: this.state.selectedInstallation
    })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: 'gf-form-inline,ui-list'
    }, query.meta.map(function (value, idx) {
      return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_FilterEntry__WEBPACK_IMPORTED_MODULE_2__["FilterEntry"], {
        idx: idx,
        data: value,
        onDelete: _this.onMetaDelete,
        onUpdate: _this.onMetaUpdate,
        keys: _this.getMetaKeys(),
        values: _this.getMetaValues(value.key)
      });
    })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: 'gf-form-inline',
      style: {
        paddingBottom: 10
      }
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_3__["Button"], {
      onClick: this.addFilter
    }, "Add filter")), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: 'gf-form-inline'
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(FormField, {
      labelWidth: 40,
      label: 'Group by',
      onChange: this.onGroupByChange,
      value: query.groupBy,
      tooltip: this.tooltipGroupBy
    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(FormField, {
      labelWidth: 40,
      label: 'Name by',
      onChange: this.onNameByChange,
      value: query.nameBy,
      tooltip: this.tooltipNameBy
    })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: 'gf-form-inline'
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Switch, {
      label: 'As table data',
      checked: query.tabledata,
      onChange: this.onDatatable
    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      hidden: !query.tabledata
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(FormField, {
      labelWidth: 40,
      label: 'Message from',
      onChange: this.onMessageChange,
      value: query.messageFrom,
      tooltip: this.tooltipMessageFrom
    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(FormField, {
      labelWidth: 40,
      label: 'Linked with',
      onChange: this.onLinkChange,
      value: query.linkKey
    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Switch, {
      label: 'Meta to fields',
      checked: query.metaAsFields,
      onChange: this.onMetaAsFields
    }))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Switch, {
      label: 'Current state only',
      checked: query.stateOnly,
      onChange: this.onStateOnlyChange
    }));
  };

  return QueryEditor;
}(react__WEBPACK_IMPORTED_MODULE_1__["PureComponent"]);



/***/ }),

/***/ "./components/FilterEntry.tsx":
/*!************************************!*\
  !*** ./components/FilterEntry.tsx ***!
  \************************************/
/*! exports provided: FilterEntry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilterEntry", function() { return FilterEntry; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }





var FilterEntry =
/** @class */
function (_super) {
  Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(FilterEntry, _super);

  function FilterEntry(props) {
    var _this = _super.call(this, props) || this;

    _this.onChangeKey = function (event) {
      if (_typeof(event) === _typeof('')) {
        _this.props.onUpdate(_this.props.idx, event, _this.props.data.value);
      } else {
        _this.props.onUpdate(_this.props.idx, event.label, _this.props.data.value);
      }
    };

    _this.onChangeValue = function (event) {
      console.log(event);

      if (_typeof(event) === _typeof('')) {
        _this.props.onUpdate(_this.props.idx, _this.props.data.key, event);
      } else {
        _this.props.onUpdate(_this.props.idx, _this.props.data.key, event.value);
      }
    };

    _this.onDelete = function (event) {
      _this.props.onDelete(_this.props.idx);
    };

    return _this;
  }

  FilterEntry.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
    return true;
  };

  FilterEntry.prototype.render = function () {
    var e_1, _a, e_2, _b;

    var keys = [];
    var values = [];

    if (this.props.keys) {
      try {
        for (var _c = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this.props.keys), _d = _c.next(); !_d.done; _d = _c.next()) {
          var x = _d.value;
          keys.push({
            label: x,
            value: x
          });
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }

    if (this.props.values) {
      try {
        for (var _e = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this.props.values), _f = _e.next(); !_f.done; _f = _e.next()) {
          var x = _f.value;
          values.push({
            label: x,
            value: x
          });
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
    }

    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: 'gf-form-inline'
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: 'gf-form'
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
      className: 'gf-form-label query-keyword'
    }, "key"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["Select"], {
      width: 30,
      options: keys,
      onChange: this.onChangeKey,
      onCreateOption: this.onChangeKey,
      value: {
        label: this.props.data.key,
        value: this.props.data.key
      },
      isSearchable: true,
      allowCustomValue: true,
      placeholder: 'meta key'
    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
      className: 'gf-form-label query-keyword'
    }, "match"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["Select"], {
      width: 30,
      options: values,
      onChange: this.onChangeValue,
      onCreateOption: this.onChangeValue,
      value: {
        label: this.props.data.value,
        value: this.props.data.value
      },
      isSearchable: true,
      allowCustomValue: true,
      placeholder: 'wildcard match'
    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      variant: 'destructive',
      onClick: this.onDelete
    }, "X")));
  };

  return FilterEntry;
}(react__WEBPACK_IMPORTED_MODULE_1__["PureComponent"]);

 //<Select width={30} options={keys} onChange={this.onChangeKey}  value={{label: this.props.data.key}} onCreateOption={this.onChangeKey} isSearchable={true} allowCustomValue={true} />
//<span className={'gf-form-label query-keyword'}>match</span>
//<Select width={30} options={values} onChange={this.onChangeValue} value={{label: this.props.data.value}} onCreateOption={this.onChangeValue} isSearchable={true} allowCustomValue={true} />
//<Input type={'text'} style={{ width: 150 }} value={this.props.data.key} onChange={this.onChangeKey} />
//<span className={'gf-form-label query-keyword'}>match</span>
//<Input type={'text'} style={{ width: 150 }} value={this.props.data.value} onChange={this.onChangeValue} />

/***/ }),

/***/ "./module.ts":
/*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
/*! exports provided: plugin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "plugin", function() { return plugin; });
/* harmony import */ var _DataSource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DataSource */ "./DataSource.ts");
/* harmony import */ var _ConfigEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ConfigEditor */ "./ConfigEditor.tsx");
/* harmony import */ var _QueryEditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./QueryEditor */ "./QueryEditor.tsx");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @grafana/data */ "@grafana/data");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_grafana_data__WEBPACK_IMPORTED_MODULE_3__);




var plugin = new _grafana_data__WEBPACK_IMPORTED_MODULE_3__["DataSourcePlugin"](_DataSource__WEBPACK_IMPORTED_MODULE_0__["DataSource"]).setConfigEditor(_ConfigEditor__WEBPACK_IMPORTED_MODULE_1__["ConfigEditor"]).setQueryEditor(_QueryEditor__WEBPACK_IMPORTED_MODULE_2__["QueryEditor"]);

/***/ }),

/***/ "@grafana/data":
/*!********************************!*\
  !*** external "@grafana/data" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__grafana_data__;

/***/ }),

/***/ "@grafana/ui":
/*!******************************!*\
  !*** external "@grafana/ui" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__grafana_ui__;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_react__;

/***/ })

/******/ })});;
//# sourceMappingURL=module.js.map