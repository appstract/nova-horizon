/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['card'],

    /**
     * Data.
     */
    data: function data() {
        return {
            ready: false,
            stats: {}
        };
    },


    /**
     * Mounted.
     */
    mounted: function mounted() {
        this.fetchStatsPeriodically();
    },


    /**
     * Destroyed.
     */
    destroyed: function destroyed() {
        clearTimeout(this.timeout);
    },


    methods: {
        /**
         * Fetch stats from horizon.
         */
        fetchStats: function fetchStats() {
            var _this = this;

            Nova.request().get('/horizon/api/stats').then(function (response) {
                _this.stats = response.data;

                if (_.values(response.data.wait)[0]) {
                    _this.stats.max_wait_time = _.values(response.data.wait)[0];
                    _this.stats.max_wait_queue = _.keys(response.data.wait)[0].split(':')[1];
                }
            });
        },


        /**
         * Fetch stats periodically with Promise and timeout.
         */
        fetchStatsPeriodically: function fetchStatsPeriodically() {
            var _this2 = this;

            Promise.all([this.fetchStats()]).then(function () {
                _this2.ready = true;

                _this2.timeout = setTimeout(function () {
                    _this2.fetchStatsPeriodically();
                }, 10000);
            });
        },


        /**
         * Determine the unit for the given timeframe.
         */
        determinePeriod: function determinePeriod(minutes) {
            return moment.duration(moment().diff(moment().subtract(minutes, "minutes"))).humanize().replace(/^An?/i, '');
        },


        /**
         * @returns {string}
         */
        humanTime: function humanTime(time) {
            return moment.duration(time, "seconds").humanize().replace(/^(.)|\s+(.)/g, function ($1) {
                return $1.toUpperCase();
            });
        }
    }
});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(4)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phpunserialize__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phpunserialize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phpunserialize__);


/* harmony default export */ __webpack_exports__["a"] = ({
    /**
     * Data.
     */
    data: function data() {
        return {
            ready: false,
            hasNewEntries: false,
            loadingNewEntries: false,
            page: 1,
            perPage: 50,
            totalPages: 1,
            jobs: [],
            modal: null
        };
    },


    /**
     * Mounted.
     */
    mounted: function mounted() {
        this.loadJobs();

        this.refreshJobsPeriodically();
    },


    /**
     * Destroyed.
     */
    destroyed: function destroyed() {
        clearInterval(this.interval);
    },


    methods: {
        /**
         * Extract the job base name.
         */
        jobBaseName: function jobBaseName(name) {
            if (!name.includes('\\')) return name;

            var parts = name.split('\\');

            return parts[parts.length - 1];
        },


        /**
         * Pretty print serialized job.
         *
         * @param data
         * @returns {string}
         */
        prettyPrintJob: function prettyPrintJob(data) {
            return data.command && !data.command.includes('CallQueuedClosure') ? __WEBPACK_IMPORTED_MODULE_0_phpunserialize___default()(data.command) : data;
        },


        /**
         * Load the jobs for the previous page.
         */
        previous: function previous() {
            this.loadJobs((this.page - 2) * this.perPage);

            this.page -= 1;

            this.hasNewEntries = false;
        },


        /**
         * Load the jobs for the next page.
         */
        next: function next() {
            this.loadJobs(this.page * this.perPage);

            this.page += 1;

            this.hasNewEntries = false;
        },


        /**
         * Checks if a modal needs to be open.
         */
        visibleModal: function visibleModal(job) {
            return this.modal && this.modal.id == job.id;
        },


        /**
         * Open a modal.
         */
        openModal: function openModal(job) {
            this.modal = job;
        },


        /**
         * Close a modal.
         */
        closeModal: function closeModal() {
            this.modal = null;
        },


        /**
         * Format the given date with respect to timezone.
         */
        formatDate: function formatDate(unixTime) {
            return moment(unixTime * 1000).add(new Date().getTimezoneOffset() / 60);
        },


        /**
         * Convert to human readable timestamp.
         */
        readableTimestamp: function readableTimestamp(timestamp) {
            return this.formatDate(timestamp).format('YYYY-MM-DD HH:mm:ss');
        }
    }
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(65);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(8);
__webpack_require__(72);
module.exports = __webpack_require__(73);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_json_pretty__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_json_pretty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_json_pretty__);


window.NovaHorizon = {
    basePath: '/horizon'
};

Nova.booting(function (Vue, router, store) {
    Vue.component('nova-horizon-card-stats', __webpack_require__(10));
    Vue.component('nova-horizon-card-workload', __webpack_require__(13));
    Vue.component('nova-horizon-card-recent-jobs', __webpack_require__(18));
    Vue.component('nova-horizon-card-failed-jobs', __webpack_require__(24));

    Vue.component('nova-horizon-card-jobs-per-minute', __webpack_require__(29));
    Vue.component('nova-horizon-card-recent-jobs-count', __webpack_require__(32));
    Vue.component('nova-horizon-card-failed-jobs-count', __webpack_require__(35));
    Vue.component('nova-horizon-card-status', __webpack_require__(38));
    Vue.component('nova-horizon-card-total-processes', __webpack_require__(41));
    Vue.component('nova-horizon-card-max-wait-time', __webpack_require__(44));
    Vue.component('nova-horizon-card-max-runtime', __webpack_require__(47));
    Vue.component('nova-horizon-card-max-throughput', __webpack_require__(50));

    Vue.component('nova-horizon-stack-trace', __webpack_require__(53));
    Vue.component('nova-horizon-json-pretty', __WEBPACK_IMPORTED_MODULE_0_vue_json_pretty___default.a);
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.VueJsonPretty=t():e.VueJsonPretty=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=39)}([function(e,t){var n=e.exports={version:"2.6.9"};"number"==typeof __e&&(__e=n)},function(e,t,n){var r=n(25)("wks"),o=n(27),i=n(3).Symbol,s="function"==typeof i;(e.exports=function(e){return r[e]||(r[e]=s&&i[e]||(s?i:o)("Symbol."+e))}).store=r},function(e,t){e.exports=function(e,t,n,r,o,i){var s,a=e=e||{},c=typeof e.default;"object"!==c&&"function"!==c||(s=e,a=e.default);var u="function"==typeof a?a.options:a;t&&(u.render=t.render,u.staticRenderFns=t.staticRenderFns,u._compiled=!0),n&&(u.functional=!0),o&&(u._scopeId=o);var l;if(i?(l=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),r&&r.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(i)},u._ssrRegister=l):r&&(l=r),l){var f=u.functional,d=f?u.render:u.beforeCreate;f?(u._injectStyles=l,u.render=function(e,t){return l.call(t),d(e,t)}):u.beforeCreate=d?[].concat(d,l):[l]}return{esModule:s,exports:a,options:u}}},function(e,t){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(e,t,n){e.exports=!n(9)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(e,t,n){var r=n(3),o=n(0),i=n(19),s=n(6),a=n(10),c=function(e,t,n){var u,l,f,d=e&c.F,p=e&c.G,h=e&c.S,v=e&c.P,b=e&c.B,m=e&c.W,y=p?o:o[t]||(o[t]={}),g=y.prototype,_=p?r:h?r[t]:(r[t]||{}).prototype;p&&(n=t);for(u in n)(l=!d&&_&&void 0!==_[u])&&a(y,u)||(f=l?_[u]:n[u],y[u]=p&&"function"!=typeof _[u]?n[u]:b&&l?i(f,r):m&&_[u]==f?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(f):v&&"function"==typeof f?i(Function.call,f):f,v&&((y.virtual||(y.virtual={}))[u]=f,e&c.R&&g&&!g[u]&&s(g,u,f)))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,e.exports=c},function(e,t,n){var r=n(7),o=n(13);e.exports=n(4)?function(e,t,n){return r.f(e,t,o(1,n))}:function(e,t,n){return e[t]=n,e}},function(e,t,n){var r=n(8),o=n(44),i=n(45),s=Object.defineProperty;t.f=n(4)?Object.defineProperty:function(e,t,n){if(r(e),t=i(t,!0),r(n),o)try{return s(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},function(e,t,n){var r=n(12);e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},function(e,t,n){var r=n(15);e.exports=function(e){return Object(r(e))}},function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},function(e,t,n){var r=n(47),o=n(28);e.exports=Object.keys||function(e){return r(e,o)}},function(e,t){e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},function(e,t){var n=Math.ceil,r=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?r:n)(e)}},function(e,t,n){var r=n(25)("keys"),o=n(27);e.exports=function(e){return r[e]||(r[e]=o(e))}},function(e,t){e.exports={}},function(e,t,n){var r=n(43);e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,o){return e.call(t,n,r,o)}}return function(){return e.apply(t,arguments)}}},function(e,t,n){var r=n(12),o=n(3).document,i=r(o)&&r(o.createElement);e.exports=function(e){return i?o.createElement(e):{}}},function(e,t,n){var r=n(22),o=n(15);e.exports=function(e){return r(o(e))}},function(e,t,n){var r=n(23);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},function(e,t,n){var r=n(16),o=Math.min;e.exports=function(e){return e>0?o(r(e),9007199254740991):0}},function(e,t,n){var r=n(0),o=n(3),i=o["__core-js_shared__"]||(o["__core-js_shared__"]={});(e.exports=function(e,t){return i[e]||(i[e]=void 0!==t?t:{})})("versions",[]).push({version:r.version,mode:n(26)?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},function(e,t){e.exports=!0},function(e,t){var n=0,r=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+r).toString(36))}},function(e,t){e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(e,t,n){"use strict";var r=n(53),o=n.n(r),i=n(31),s=n.n(i),a=n(75),c=n(77),u=n(79),l=n(81),f=n(83),d=n(33);t.a={name:"vue-json-pretty",components:{SimpleText:a.a,VueCheckbox:c.a,VueRadio:u.a,BracketsLeft:l.a,BracketsRight:f.a},props:{data:{},deep:{type:Number,default:1/0},showLength:{type:Boolean,default:!1},showDoubleQuotes:{type:Boolean,default:!0},path:{type:String,default:"root"},selectableType:{type:String,default:""},showSelectController:{type:Boolean,default:!1},showLine:{type:Boolean,default:!0},selectOnClickNode:{type:Boolean,default:!0},value:{type:[Array,String],default:function(){return""}},pathSelectable:{type:Function,default:function(){return!0}},highlightMouseoverNode:{type:Boolean,default:!1},highlightSelectedNode:{type:Boolean,default:!0},collapsedOnClickBrackets:{type:Boolean,default:!0},parentData:{},currentDeep:{type:Number,default:1},currentKey:[Number,String]},data:function(){return{visible:this.currentDeep<=this.deep,isMouseover:!1,currentCheckboxVal:!!Array.isArray(this.value)&&this.value.includes(this.path)}},computed:{model:{get:function(){var e="multiple"===this.selectableType?[]:"single"===this.selectableType?"":null;return this.value||e},set:function(e){this.$emit("input",e)}},lastKey:function(){if(Array.isArray(this.parentData))return this.parentData.length-1;if(this.isObject(this.parentData)){var e=s()(this.parentData);return e[e.length-1]}},notLastKey:function(){return this.currentKey!==this.lastKey},selectable:function(){return this.pathSelectable(this.path,this.data)&&(this.isMultiple||this.isSingle)},isMultiple:function(){return"multiple"===this.selectableType},isSingle:function(){return"single"===this.selectableType},isSelected:function(){return this.isMultiple?this.model.includes(this.path):!!this.isSingle&&this.model===this.path},propsError:function(){return!this.selectableType||this.selectOnClickNode||this.showSelectController?"":"When selectableType is not null, selectOnClickNode and showSelectController cannot be false at the same time, because this will cause the selection to fail."}},methods:{handleValueChange:function(e){var t=this;if(!this.isMultiple||"checkbox"!==e&&"tree"!==e){if(this.isSingle&&("radio"===e||"tree"===e)&&this.model!==this.path){var n=this.model,r=this.path;this.model=r,this.$emit("change",r,n)}}else{var i=this.model.findIndex(function(e){return e===t.path}),s=[].concat(o()(this.model));-1!==i?this.model.splice(i,1):this.model.push(this.path),"checkbox"!==e&&(this.currentCheckboxVal=!this.currentCheckboxVal),this.$emit("change",this.model,s)}},handleClick:function(e){e._uid&&e._uid!==this._uid||(e._uid=this._uid,this.$emit("click",this.path,this.data),this.selectable&&this.selectOnClickNode&&this.handleValueChange("tree"))},handleItemClick:function(e,t){this.$emit("click",e,t)},handleItemChange:function(e,t){this.selectable&&this.$emit("change",e,t)},handleMouseover:function(){this.highlightMouseoverNode&&(this.selectable||""===this.selectableType)&&(this.isMouseover=!0)},handleMouseout:function(){this.highlightMouseoverNode&&(this.selectable||""===this.selectableType)&&(this.isMouseover=!1)},isObject:function(e){return"object"===Object(d.a)(e)},keyFormatter:function(e){return this.showDoubleQuotes?'"'+e+'"':e}},errorCaptured:function(){return!1},watch:{deep:function(e){this.visible=this.currentDeep<=e},propsError:{handler:function(e){if(e)throw new Error("[vue-json-pretty] "+e)},immediate:!0}}}},function(e,t,n){var r=n(7).f,o=n(10),i=n(1)("toStringTag");e.exports=function(e,t,n){e&&!o(e=n?e:e.prototype,i)&&r(e,i,{configurable:!0,value:t})}},function(e,t,n){e.exports={default:n(72),__esModule:!0}},function(e,t,n){"use strict";var r=n(33);t.a={props:{showDoubleQuotes:Boolean,parentData:{},data:{},showComma:Boolean,currentKey:[Number,String]},computed:{dataType:function(){return Object(r.a)(this.data)},parentDataType:function(){return Object(r.a)(this.parentData)}},methods:{textFormatter:function(e){var t=e+"";return"string"===this.dataType&&(t='"'+t+'"'),this.showComma&&(t+=","),t}}}},function(e,t,n){"use strict";function r(e){return Object.prototype.toString.call(e).slice(8,-1).toLowerCase()}t.a=r},function(e,t,n){"use strict";t.a={props:{value:{type:Boolean,default:!1}},data:function(){return{focus:!1}},computed:{model:{get:function(){return this.value},set:function(e){this.$emit("input",e)}}}}},function(e,t,n){"use strict";t.a={props:{path:String,value:{type:String,default:""}},data:function(){return{focus:!1}},computed:{currentPath:function(){return this.path},model:{get:function(){return this.value},set:function(e){this.$emit("input",e)}}},methods:{change:function(){this.$emit("change",this.model)}}}},function(e,t,n){"use strict";var r=n(31),o=n.n(r),i=n(37);t.a={mixins:[i.a],props:{showLength:Boolean},methods:{closedBracketsGenerator:function(e){var t=Array.isArray(e)?"[...]":"{...}";return this.bracketsFormatter(t)},lengthGenerator:function(e){return" // "+(Array.isArray(e)?e.length+" items":o()(e).length+" keys")}}}},function(e,t,n){"use strict";t.a={props:{visible:{required:!0,type:Boolean},data:{required:!0},showComma:Boolean,collapsedOnClickBrackets:Boolean},computed:{dataVisible:{get:function(){return this.visible},set:function(e){this.collapsedOnClickBrackets&&this.$emit("update:visible",e)}}},methods:{toggleBrackets:function(){this.dataVisible=!this.dataVisible},bracketsFormatter:function(e){return this.showComma?e+",":e}}}},function(e,t,n){"use strict";var r=n(37);t.a={mixins:[r.a]}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(40),o=n.n(r),i=n(52),s=n(86);n.n(s);t.default=o()({},i.a,{version:"1.6.2"})},function(e,t,n){e.exports={default:n(41),__esModule:!0}},function(e,t,n){n(42),e.exports=n(0).Object.assign},function(e,t,n){var r=n(5);r(r.S+r.F,"Object",{assign:n(46)})},function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,t,n){e.exports=!n(4)&&!n(9)(function(){return 7!=Object.defineProperty(n(20)("div"),"a",{get:function(){return 7}}).a})},function(e,t,n){var r=n(12);e.exports=function(e,t){if(!r(e))return e;var n,o;if(t&&"function"==typeof(n=e.toString)&&!r(o=n.call(e)))return o;if("function"==typeof(n=e.valueOf)&&!r(o=n.call(e)))return o;if(!t&&"function"==typeof(n=e.toString)&&!r(o=n.call(e)))return o;throw TypeError("Can't convert object to primitive value")}},function(e,t,n){"use strict";var r=n(4),o=n(14),i=n(50),s=n(51),a=n(11),c=n(22),u=Object.assign;e.exports=!u||n(9)(function(){var e={},t={},n=Symbol(),r="abcdefghijklmnopqrst";return e[n]=7,r.split("").forEach(function(e){t[e]=e}),7!=u({},e)[n]||Object.keys(u({},t)).join("")!=r})?function(e,t){for(var n=a(e),u=arguments.length,l=1,f=i.f,d=s.f;u>l;)for(var p,h=c(arguments[l++]),v=f?o(h).concat(f(h)):o(h),b=v.length,m=0;b>m;)p=v[m++],r&&!d.call(h,p)||(n[p]=h[p]);return n}:u},function(e,t,n){var r=n(10),o=n(21),i=n(48)(!1),s=n(17)("IE_PROTO");e.exports=function(e,t){var n,a=o(e),c=0,u=[];for(n in a)n!=s&&r(a,n)&&u.push(n);for(;t.length>c;)r(a,n=t[c++])&&(~i(u,n)||u.push(n));return u}},function(e,t,n){var r=n(21),o=n(24),i=n(49);e.exports=function(e){return function(t,n,s){var a,c=r(t),u=o(c.length),l=i(s,u);if(e&&n!=n){for(;u>l;)if((a=c[l++])!=a)return!0}else for(;u>l;l++)if((e||l in c)&&c[l]===n)return e||l||0;return!e&&-1}}},function(e,t,n){var r=n(16),o=Math.max,i=Math.min;e.exports=function(e,t){return e=r(e),e<0?o(e+t,0):i(e,t)}},function(e,t){t.f=Object.getOwnPropertySymbols},function(e,t){t.f={}.propertyIsEnumerable},function(e,t,n){"use strict";var r=n(29),o=n(85),i=n(2),s=i(r.a,o.a,!1,null,null,null);t.a=s.exports},function(e,t,n){"use strict";t.__esModule=!0;var r=n(54),o=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return(0,o.default)(e)}},function(e,t,n){e.exports={default:n(55),__esModule:!0}},function(e,t,n){n(56),n(65),e.exports=n(0).Array.from},function(e,t,n){"use strict";var r=n(57)(!0);n(58)(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,n=this._i;return n>=t.length?{value:void 0,done:!0}:(e=r(t,n),this._i+=e.length,{value:e,done:!1})})},function(e,t,n){var r=n(16),o=n(15);e.exports=function(e){return function(t,n){var i,s,a=String(o(t)),c=r(n),u=a.length;return c<0||c>=u?e?"":void 0:(i=a.charCodeAt(c),i<55296||i>56319||c+1===u||(s=a.charCodeAt(c+1))<56320||s>57343?e?a.charAt(c):i:e?a.slice(c,c+2):s-56320+(i-55296<<10)+65536)}}},function(e,t,n){"use strict";var r=n(26),o=n(5),i=n(59),s=n(6),a=n(18),c=n(60),u=n(30),l=n(64),f=n(1)("iterator"),d=!([].keys&&"next"in[].keys()),p=function(){return this};e.exports=function(e,t,n,h,v,b,m){c(n,t,h);var y,g,_,x=function(e){if(!d&&e in C)return C[e];switch(e){case"keys":case"values":return function(){return new n(this,e)}}return function(){return new n(this,e)}},k=t+" Iterator",j="values"==v,w=!1,C=e.prototype,O=C[f]||C["@@iterator"]||v&&C[v],S=O||x(v),A=v?j?x("entries"):S:void 0,M="Array"==t?C.entries||O:O;if(M&&(_=l(M.call(new e)))!==Object.prototype&&_.next&&(u(_,k,!0),r||"function"==typeof _[f]||s(_,f,p)),j&&O&&"values"!==O.name&&(w=!0,S=function(){return O.call(this)}),r&&!m||!d&&!w&&C[f]||s(C,f,S),a[t]=S,a[k]=p,v)if(y={values:j?S:x("values"),keys:b?S:x("keys"),entries:A},m)for(g in y)g in C||i(C,g,y[g]);else o(o.P+o.F*(d||w),t,y);return y}},function(e,t,n){e.exports=n(6)},function(e,t,n){"use strict";var r=n(61),o=n(13),i=n(30),s={};n(6)(s,n(1)("iterator"),function(){return this}),e.exports=function(e,t,n){e.prototype=r(s,{next:o(1,n)}),i(e,t+" Iterator")}},function(e,t,n){var r=n(8),o=n(62),i=n(28),s=n(17)("IE_PROTO"),a=function(){},c=function(){var e,t=n(20)("iframe"),r=i.length;for(t.style.display="none",n(63).appendChild(t),t.src="javascript:",e=t.contentWindow.document,e.open(),e.write("<script>document.F=Object<\/script>"),e.close(),c=e.F;r--;)delete c.prototype[i[r]];return c()};e.exports=Object.create||function(e,t){var n;return null!==e?(a.prototype=r(e),n=new a,a.prototype=null,n[s]=e):n=c(),void 0===t?n:o(n,t)}},function(e,t,n){var r=n(7),o=n(8),i=n(14);e.exports=n(4)?Object.defineProperties:function(e,t){o(e);for(var n,s=i(t),a=s.length,c=0;a>c;)r.f(e,n=s[c++],t[n]);return e}},function(e,t,n){var r=n(3).document;e.exports=r&&r.documentElement},function(e,t,n){var r=n(10),o=n(11),i=n(17)("IE_PROTO"),s=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=o(e),r(e,i)?e[i]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?s:null}},function(e,t,n){"use strict";var r=n(19),o=n(5),i=n(11),s=n(66),a=n(67),c=n(24),u=n(68),l=n(69);o(o.S+o.F*!n(71)(function(e){Array.from(e)}),"Array",{from:function(e){var t,n,o,f,d=i(e),p="function"==typeof this?this:Array,h=arguments.length,v=h>1?arguments[1]:void 0,b=void 0!==v,m=0,y=l(d);if(b&&(v=r(v,h>2?arguments[2]:void 0,2)),void 0==y||p==Array&&a(y))for(t=c(d.length),n=new p(t);t>m;m++)u(n,m,b?v(d[m],m):d[m]);else for(f=y.call(d),n=new p;!(o=f.next()).done;m++)u(n,m,b?s(f,v,[o.value,m],!0):o.value);return n.length=m,n}})},function(e,t,n){var r=n(8);e.exports=function(e,t,n,o){try{return o?t(r(n)[0],n[1]):t(n)}catch(t){var i=e.return;throw void 0!==i&&r(i.call(e)),t}}},function(e,t,n){var r=n(18),o=n(1)("iterator"),i=Array.prototype;e.exports=function(e){return void 0!==e&&(r.Array===e||i[o]===e)}},function(e,t,n){"use strict";var r=n(7),o=n(13);e.exports=function(e,t,n){t in e?r.f(e,t,o(0,n)):e[t]=n}},function(e,t,n){var r=n(70),o=n(1)("iterator"),i=n(18);e.exports=n(0).getIteratorMethod=function(e){if(void 0!=e)return e[o]||e["@@iterator"]||i[r(e)]}},function(e,t,n){var r=n(23),o=n(1)("toStringTag"),i="Arguments"==r(function(){return arguments}()),s=function(e,t){try{return e[t]}catch(e){}};e.exports=function(e){var t,n,a;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=s(t=Object(e),o))?n:i?r(t):"Object"==(a=r(t))&&"function"==typeof t.callee?"Arguments":a}},function(e,t,n){var r=n(1)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(e){}e.exports=function(e,t){if(!t&&!o)return!1;var n=!1;try{var i=[7],s=i[r]();s.next=function(){return{done:n=!0}},i[r]=function(){return s},e(i)}catch(e){}return n}},function(e,t,n){n(73),e.exports=n(0).Object.keys},function(e,t,n){var r=n(11),o=n(14);n(74)("keys",function(){return function(e){return o(r(e))}})},function(e,t,n){var r=n(5),o=n(0),i=n(9);e.exports=function(e,t){var n=(o.Object||{})[e]||Object[e],s={};s[e]=t(n),r(r.S+r.F*i(function(){n(1)}),"Object",s)}},function(e,t,n){"use strict";var r=n(32),o=n(76),i=n(2),s=i(r.a,o.a,!1,null,null,null);t.a=s.exports},function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e._t("default"),e._v(" "),n("span",{class:"vjs-value vjs-value__"+e.dataType},[e._v("\n    "+e._s(e.textFormatter(e.data))+"\n  ")])],2)},o=[],i={render:r,staticRenderFns:o};t.a=i},function(e,t,n){"use strict";var r=n(34),o=n(78),i=n(2),s=i(r.a,o.a,!1,null,null,null);t.a=s.exports},function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("label",{class:["vjs-checkbox",e.value?"is-checked":""],on:{click:function(e){e.stopPropagation()}}},[n("span",{staticClass:"vjs-checkbox__inner"}),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"vjs-checkbox__original",attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.model)?e._i(e.model,null)>-1:e.model},on:{change:[function(t){var n=e.model,r=t.target,o=!!r.checked;if(Array.isArray(n)){var i=e._i(n,null);r.checked?i<0&&(e.model=n.concat([null])):i>-1&&(e.model=n.slice(0,i).concat(n.slice(i+1)))}else e.model=o},function(t){return e.$emit("change",e.model)}],focus:function(t){e.focus=!0},blur:function(t){e.focus=!1}}})])},o=[],i={render:r,staticRenderFns:o};t.a=i},function(e,t,n){"use strict";var r=n(35),o=n(80),i=n(2),s=i(r.a,o.a,!1,null,null,null);t.a=s.exports},function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("label",{class:["vjs-radio",e.model===e.currentPath?"is-checked":""],on:{click:function(e){e.stopPropagation()}}},[n("span",{staticClass:"vjs-radio__inner"}),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"vjs-radio__original",attrs:{type:"radio"},domProps:{value:e.currentPath,checked:e._q(e.model,e.currentPath)},on:{change:[function(t){e.model=e.currentPath},e.change],focus:function(t){e.focus=!0},blur:function(t){e.focus=!1}}})])},o=[],i={render:r,staticRenderFns:o};t.a=i},function(e,t,n){"use strict";var r=n(36),o=n(82),i=n(2),s=i(r.a,o.a,!1,null,null,null);t.a=s.exports},function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e._t("default"),e._v(" "),n("span",{directives:[{name:"show",rawName:"v-show",value:e.dataVisible,expression:"dataVisible"}],staticClass:"vjs-tree__brackets",on:{click:function(t){return t.stopPropagation(),e.toggleBrackets(t)}}},[e._v("\n    "+e._s(Array.isArray(e.data)?"[":"{")+"\n  ")]),e._v(" "),n("span",{directives:[{name:"show",rawName:"v-show",value:!e.dataVisible,expression:"!dataVisible"}]},[n("span",{staticClass:"vjs-tree__brackets",on:{click:function(t){return t.stopPropagation(),e.toggleBrackets(t)}}},[e._v("\n      "+e._s(e.closedBracketsGenerator(e.data))+"\n    ")]),e._v(" "),e.showLength?n("span",{staticClass:"vjs-comment"},[e._v("\n      "+e._s(e.lengthGenerator(e.data))+"\n    ")]):e._e()])],2)},o=[],i={render:r,staticRenderFns:o};t.a=i},function(e,t,n){"use strict";var r=n(38),o=n(84),i=n(2),s=i(r.a,o.a,!1,null,null,null);t.a=s.exports},function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{directives:[{name:"show",rawName:"v-show",value:e.dataVisible,expression:"dataVisible"}]},[n("span",{staticClass:"vjs-tree__brackets",on:{click:function(t){return t.stopPropagation(),e.toggleBrackets(t)}}},[e._v("\n    "+e._s(e.bracketsFormatter(Array.isArray(e.data)?"]":"}"))+"\n  ")])])},o=[],i={render:r,staticRenderFns:o};t.a=i},function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{class:{"vjs-tree":!0,"has-selectable-control":e.isMultiple||e.showSelectController,"is-root":1===e.currentDeep,"is-selectable":e.selectable,"is-selected":e.isSelected,"is-highlight-selected":e.isSelected&&e.highlightSelectedNode,"is-mouseover":e.isMouseover},on:{click:e.handleClick,mouseover:function(t){return t.stopPropagation(),e.handleMouseover(t)},mouseout:function(t){return t.stopPropagation(),e.handleMouseout(t)}}},[e.showSelectController&&e.selectable?[e.isMultiple?n("vue-checkbox",{on:{change:function(t){return e.handleValueChange("checkbox")}},model:{value:e.currentCheckboxVal,callback:function(t){e.currentCheckboxVal=t},expression:"currentCheckboxVal"}}):e.isSingle?n("vue-radio",{attrs:{path:e.path},on:{change:function(t){return e.handleValueChange("radio")}},model:{value:e.model,callback:function(t){e.model=t},expression:"model"}}):e._e()]:e._e(),e._v(" "),Array.isArray(e.data)||e.isObject(e.data)?[n("brackets-left",{attrs:{visible:e.visible,data:e.data,"show-length":e.showLength,"collapsed-on-click-brackets":e.collapsedOnClickBrackets,"show-comma":e.notLastKey},on:{"update:visible":function(t){e.visible=t}}},[e.currentDeep>1&&!Array.isArray(e.parentData)?n("span",{staticClass:"vjs-key"},[e._v(e._s(e.keyFormatter(e.currentKey))+":")]):e._e()]),e._v(" "),e._l(e.data,function(t,r){return n("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],key:r,class:{"vjs-tree__content":!0,"has-line":e.showLine}},[n("vue-json-pretty",{attrs:{"parent-data":e.data,data:t,deep:e.deep,"show-length":e.showLength,"show-double-quotes":e.showDoubleQuotes,"show-line":e.showLine,"highlight-mouseover-node":e.highlightMouseoverNode,"highlight-selected-node":e.highlightSelectedNode,path:e.path+(Array.isArray(e.data)?"["+r+"]":"."+r),"path-selectable":e.pathSelectable,"selectable-type":e.selectableType,"show-select-controller":e.showSelectController,"select-on-click-node":e.selectOnClickNode,"collapsed-on-click-brackets":e.collapsedOnClickBrackets,"current-key":r,"current-deep":e.currentDeep+1},on:{click:e.handleItemClick,change:e.handleItemChange},model:{value:e.model,callback:function(t){e.model=t},expression:"model"}})],1)}),e._v(" "),n("brackets-right",{attrs:{visible:e.visible,data:e.data,"collapsed-on-click-brackets":e.collapsedOnClickBrackets,"show-comma":e.notLastKey},on:{"update:visible":function(t){e.visible=t}}})]:n("simple-text",{attrs:{"show-double-quotes":e.showDoubleQuotes,"show-comma":e.notLastKey,"parent-data":e.parentData,data:e.data,"current-key":e.currentKey}},[e.parentData&&e.currentKey&&!Array.isArray(e.parentData)?n("span",{staticClass:"vjs-key"},[e._v("\n      "+e._s(e.keyFormatter(e.currentKey))+":\n    ")]):e._e()])],2)},o=[],i={render:r,staticRenderFns:o};t.a=i},function(e,t,n){var r=n(87);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);n(89)("bfa6fc9c",r,!0,{})},function(e,t,n){t=e.exports=n(88)(!1),t.push([e.i,'.vjs-checkbox{position:absolute;left:-30px;color:#1f2d3d;user-select:none}.vjs-checkbox.is-checked .vjs-checkbox__inner{background-color:#1890ff;border-color:#0076e4}.vjs-checkbox.is-checked .vjs-checkbox__inner:after{transform:rotate(45deg) scaleY(1)}.vjs-checkbox .vjs-checkbox__inner{display:inline-block;position:relative;border:1px solid #bfcbd9;border-radius:2px;vertical-align:middle;box-sizing:border-box;width:16px;height:16px;background-color:#fff;z-index:1;cursor:pointer;transition:border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46)}.vjs-checkbox .vjs-checkbox__inner:after{box-sizing:content-box;content:"";border:2px solid #fff;border-left:0;border-top:0;height:8px;left:4px;position:absolute;top:1px;transform:rotate(45deg) scaleY(0);width:4px;transition:transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;transform-origin:center}.vjs-checkbox .vjs-checkbox__original{opacity:0;outline:none;position:absolute;z-index:-1;top:0;left:0;right:0;bottom:0;margin:0}.vjs-radio{position:absolute;left:-30px;color:#1f2d3d;user-select:none}.vjs-radio.is-checked .vjs-radio__inner{background-color:#1890ff;border-color:#0076e4}.vjs-radio.is-checked .vjs-radio__inner:after{transform:translate(-50%,-50%) scale(1)}.vjs-radio .vjs-radio__inner{border:1px solid #bfcbd9;border-radius:100%;width:16px;height:16px;vertical-align:middle;background-color:#fff;position:relative;cursor:pointer;display:inline-block;box-sizing:border-box}.vjs-radio .vjs-radio__inner:after{width:4px;height:4px;border-radius:100%;background-color:#fff;content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(0);transition:transform .15s ease-in}.vjs-radio .vjs-radio__original{opacity:0;outline:none;position:absolute;z-index:-1;top:0;left:0;right:0;bottom:0;margin:0}.vjs-tree{font-family:Monaco,Menlo,Consolas,Bitstream Vera Sans Mono,monospace;font-size:14px}.vjs-tree.is-root{position:relative}.vjs-tree.is-root.has-selectable-control{margin-left:30px}.vjs-tree.is-mouseover{background-color:#e6f7ff}.vjs-tree.is-highlight-selected{background-color:#ccefff}.vjs-tree .vjs-tree__content{padding-left:1em}.vjs-tree .vjs-tree__content.has-line{border-left:1px dotted #bfcbd9}.vjs-tree .vjs-tree__brackets{cursor:pointer}.vjs-tree .vjs-tree__brackets:hover{color:#1890ff}.vjs-tree .vjs-comment{color:#bfcbd9}.vjs-tree .vjs-value__null{color:#ff4949}.vjs-tree .vjs-value__boolean,.vjs-tree .vjs-value__number{color:#1d8ce0}.vjs-tree .vjs-value__string{color:#13ce66}',""])},function(e,t){function n(e,t){var n=e[1]||"",o=e[3];if(!o)return n;if(t&&"function"==typeof btoa){var i=r(o);return[n].concat(o.sources.map(function(e){return"/*# sourceURL="+o.sourceRoot+e+" */"})).concat([i]).join("\n")}return[n].join("\n")}function r(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var r=n(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<e.length;o++){var s=e[o];"number"==typeof s[0]&&r[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="("+s[2]+") and ("+n+")"),t.push(s))}},t}},function(e,t,n){function r(e){for(var t=0;t<e.length;t++){var n=e[t],r=l[n.id];if(r){r.refs++;for(var o=0;o<r.parts.length;o++)r.parts[o](n.parts[o]);for(;o<n.parts.length;o++)r.parts.push(i(n.parts[o]));r.parts.length>n.parts.length&&(r.parts.length=n.parts.length)}else{for(var s=[],o=0;o<n.parts.length;o++)s.push(i(n.parts[o]));l[n.id]={id:n.id,refs:1,parts:s}}}}function o(){var e=document.createElement("style");return e.type="text/css",f.appendChild(e),e}function i(e){var t,n,r=document.querySelector("style["+m+'~="'+e.id+'"]');if(r){if(h)return v;r.parentNode.removeChild(r)}if(y){var i=p++;r=d||(d=o()),t=s.bind(null,r,i,!1),n=s.bind(null,r,i,!0)}else r=o(),t=a.bind(null,r),n=function(){r.parentNode.removeChild(r)};return t(e),function(r){if(r){if(r.css===e.css&&r.media===e.media&&r.sourceMap===e.sourceMap)return;t(e=r)}else n()}}function s(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=g(t,o);else{var i=document.createTextNode(o),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(i,s[t]):e.appendChild(i)}}function a(e,t){var n=t.css,r=t.media,o=t.sourceMap;if(r&&e.setAttribute("media",r),b.ssrId&&e.setAttribute(m,t.id),o&&(n+="\n/*# sourceURL="+o.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}var c="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!c)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var u=n(90),l={},f=c&&(document.head||document.getElementsByTagName("head")[0]),d=null,p=0,h=!1,v=function(){},b=null,m="data-vue-ssr-id",y="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());e.exports=function(e,t,n,o){h=n,b=o||{};var i=u(e,t);return r(i),function(t){for(var n=[],o=0;o<i.length;o++){var s=i[o],a=l[s.id];a.refs--,n.push(a)}t?(i=u(e,t),r(i)):i=[];for(var o=0;o<n.length;o++){var a=n[o];if(0===a.refs){for(var c=0;c<a.parts.length;c++)a.parts[c]();delete l[a.id]}}}};var g=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},function(e,t){e.exports=function(e,t){for(var n=[],r={},o=0;o<t.length;o++){var i=t[o],s=i[0],a=i[1],c=i[2],u=i[3],l={id:e+":"+o,css:a,media:c,sourceMap:u};r[s]?r[s].parts.push(l):n.push(r[s]={id:s,parts:[l]})}return n}}])});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(11)
/* template */
var __vue_template__ = __webpack_require__(12)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/Stats.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2f578438", Component.options)
  } else {
    hotAPI.reload("data-v-2f578438", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__["a" /* default */],

    computed: {
        recentJobsPeriod: function recentJobsPeriod() {
            return this.ready && this.stats.periods ? 'Past ' + this.determinePeriod(this.stats.periods.recentJobs) : 'Past hour';
        },
        failedJobsPeriod: function failedJobsPeriod() {
            return this.ready && this.stats.periods ? 'Past ' + this.determinePeriod(this.stats.periods.failedJobs) : 'Past 7 days';
        }
    }
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", [
    _c(
      "table",
      { staticClass: "w-full", attrs: { cellpadding: "0", cellspacing: "0" } },
      [
        _c("tr", [
          _c(
            "td",
            { staticClass: "align-top w-1/4 border-r border-b border-50 p-6" },
            [
              _c("h3", { staticClass: "text-base text-80 font-bold mb-4" }, [
                _vm._v(
                  "\n                    Jobs Per Minute\n                "
                )
              ]),
              _vm._v(" "),
              _c("p", { staticClass: "text-4xl" }, [
                _vm._v(
                  "\n                    " +
                    _vm._s(
                      _vm.stats.jobsPerMinute
                        ? _vm.stats.jobsPerMinute.toLocaleString()
                        : 0
                    ) +
                    "\n                "
                )
              ])
            ]
          ),
          _vm._v(" "),
          _c(
            "td",
            { staticClass: "align-top w-1/4 border-r border-b border-50 p-6" },
            [
              _c("h3", { staticClass: "text-base text-80 font-bold mb-4" }, [
                _vm._v("\n                    Recent Jobs ("),
                _c("span", {
                  domProps: { textContent: _vm._s(_vm.recentJobsPeriod) }
                }),
                _vm._v(")\n                ")
              ]),
              _vm._v(" "),
              _c("p", { staticClass: "text-4xl" }, [
                _vm._v(
                  "\n                    " +
                    _vm._s(
                      _vm.stats.recentJobs
                        ? _vm.stats.recentJobs.toLocaleString()
                        : 0
                    ) +
                    "\n                "
                )
              ])
            ]
          ),
          _vm._v(" "),
          _c(
            "td",
            { staticClass: "align-top w-1/4 border-r border-b border-50 p-6" },
            [
              _c("h3", { staticClass: "text-base text-80 font-bold mb-4" }, [
                _vm._v("\n                    Failed Jobs ("),
                _c("span", {
                  domProps: { textContent: _vm._s(_vm.failedJobsPeriod) }
                }),
                _vm._v(")\n                ")
              ]),
              _vm._v(" "),
              _c("p", { staticClass: "text-4xl" }, [
                _vm._v(
                  "\n                    " +
                    _vm._s(
                      _vm.stats.failedJobs
                        ? _vm.stats.failedJobs.toLocaleString()
                        : 0
                    ) +
                    "\n                "
                )
              ])
            ]
          ),
          _vm._v(" "),
          _c(
            "td",
            { staticClass: "align-top w-1/4 border-r border-b border-50 p-6" },
            [
              _c("h3", { staticClass: "text-base text-80 font-bold mb-4" }, [
                _vm._v("\n                    Status\n                ")
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "flex items-center mt-4" }, [
                _vm.stats.status == "running"
                  ? _c(
                      "svg",
                      {
                        staticClass: "fill-success",
                        staticStyle: { width: "1.7rem", height: "1.7rem" },
                        attrs: { viewBox: "0 0 20 20" }
                      },
                      [
                        _c("path", {
                          attrs: {
                            d:
                              "M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"
                          }
                        })
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.stats.status == "paused"
                  ? _c(
                      "svg",
                      {
                        staticClass: "fill-warning",
                        staticStyle: { width: "1.7rem", height: "1.7rem" },
                        attrs: { viewBox: "0 0 20 20" }
                      },
                      [
                        _c("path", {
                          attrs: {
                            d:
                              "M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM7 6h2v8H7V6zm4 0h2v8h-2V6z"
                          }
                        })
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.stats.status == "inactive"
                  ? _c(
                      "svg",
                      {
                        staticClass: "fill-danger",
                        staticStyle: { width: "1.7rem", height: "1.7rem" },
                        attrs: { viewBox: "0 0 20 20" }
                      },
                      [
                        _c("path", {
                          attrs: {
                            d:
                              "M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"
                          }
                        })
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _c("p", { staticClass: "mb-0 ml-2 text-4xl" }, [
                  _vm._v(
                    "\n                        " +
                      _vm._s(
                        {
                          running: "Active",
                          paused: "Paused",
                          inactive: "Inactive"
                        }[_vm.stats.status]
                      ) +
                      "\n                    "
                  )
                ])
              ])
            ]
          )
        ]),
        _vm._v(" "),
        _c("tr", [
          _c("td", { staticClass: "align-top w-1/4 border-r border-50 p-6" }, [
            _c("h3", { staticClass: "text-base text-80 font-bold mb-4" }, [
              _vm._v("\n                    Total Processes\n                ")
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "text-4xl" }, [
              _vm._v(
                "\n                    " +
                  _vm._s(
                    _vm.stats.processes
                      ? _vm.stats.processes.toLocaleString()
                      : 0
                  ) +
                  "\n                "
              )
            ])
          ]),
          _vm._v(" "),
          _c("td", { staticClass: "align-top w-1/4 border-r border-50 p-6" }, [
            _c("h3", { staticClass: "text-base text-80 font-bold mb-4" }, [
              _vm._v("\n                    Max Wait Time\n                ")
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "text-4xl" }, [
              _vm._v(
                "\n                    " +
                  _vm._s(
                    _vm.stats.max_wait_time
                      ? _vm.humanTime(_vm.stats.max_wait_time)
                      : "-"
                  ) +
                  "\n                "
              )
            ])
          ]),
          _vm._v(" "),
          _c("td", { staticClass: "align-top w-1/4 border-r border-50 p-6" }, [
            _c("h3", { staticClass: "text-base text-80 font-bold mb-4" }, [
              _vm._v("\n                    Max Runtime\n                ")
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "text-4xl" }, [
              _vm._v(
                "\n                    " +
                  _vm._s(
                    _vm.stats.queueWithMaxRuntime
                      ? _vm.stats.queueWithMaxRuntime
                      : "-"
                  ) +
                  "\n                "
              )
            ])
          ]),
          _vm._v(" "),
          _c("td", { staticClass: "align-top w-1/4 border-r border-50 p-6" }, [
            _c("h3", { staticClass: "text-base text-80 font-bold mb-4" }, [
              _vm._v("\n                    Max Throughput\n                ")
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "text-4xl" }, [
              _vm._v(
                "\n                    " +
                  _vm._s(
                    _vm.stats.queueWithMaxThroughput
                      ? _vm.stats.queueWithMaxThroughput
                      : "-"
                  ) +
                  "\n                "
              )
            ])
          ])
        ])
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2f578438", module.exports)
  }
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(14)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(16)
/* template */
var __vue_template__ = __webpack_require__(17)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-36c92b24"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/Workload.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-36c92b24", Component.options)
  } else {
    hotAPI.reload("data-v-36c92b24", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("a571a426", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-36c92b24\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Workload.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-36c92b24\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Workload.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "\n.w-25[data-v-36c92b24]{ width: 25%;\n}\n.bg-gray-100[data-v-36c92b24]{ background: #f7fafc;\n}\n.border-gray-300[data-v-36c92b24]{ border-color: #e2e8f0;\n}\n", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            ready: false,
            workload: []
        };
    },


    /**
     * Mounted.
     */
    mounted: function mounted() {
        this.fetchWorkloadPeriodically();
    },


    methods: {
        /**
         * Fetch stats from horizon.
         */
        fetchWorkload: function fetchWorkload() {
            var _this = this;

            Nova.request().get('/horizon/api/workload').then(function (response) {
                _this.workload = response.data;
            });
        },


        /**
         * Fetch stats periodically with Promise and timeout.
         */
        fetchWorkloadPeriodically: function fetchWorkloadPeriodically() {
            var _this2 = this;

            Promise.all([this.fetchWorkload()]).then(function () {
                _this2.ready = true;

                _this2.timeout = setTimeout(function () {
                    _this2.fetchWorkloadPeriodically();
                }, 10000);
            });
        },


        /**
         * @returns {string}
         */
        humanTime: function humanTime(time) {
            return moment.duration(time, "seconds").humanize().replace(/^(.)|\s+(.)/g, function ($1) {
                return $1.toUpperCase();
            });
        }
    }
});

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", [
    _c("div", { staticClass: "p-3 text-base text-80 font-bold" }, [
      _vm._v("\n        Current Workload\n    ")
    ]),
    _vm._v(" "),
    _vm.workload.length
      ? _c("div", { staticClass: "overflow-hidden overflow-x-auto relative" }, [
          _c(
            "table",
            {
              staticClass: "table w-full",
              attrs: { cellpadding: "0", cellspacing: "0" }
            },
            [
              _c("thead", [
                _c("tr", [
                  _c("th", { staticClass: "text-left" }, [_vm._v("Queue")]),
                  _vm._v(" "),
                  _c("th", { staticClass: "text-left" }, [_vm._v("Processes")]),
                  _vm._v(" "),
                  _c("th", { staticClass: "text-left" }, [_vm._v("Jobs")]),
                  _vm._v(" "),
                  _c("th", { staticClass: "text-right" }, [_vm._v("Wait")])
                ])
              ]),
              _vm._v(" "),
              _c(
                "tbody",
                _vm._l(_vm.workload, function(queue) {
                  return _c("tr", [
                    _c("td", { staticClass: "w-25" }, [
                      _vm._v(
                        "\n                        " +
                          _vm._s(queue.name.replace(/,/g, ", ")) +
                          "\n                    "
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", { staticClass: "w-25" }, [
                      _vm._v(
                        "\n                        " +
                          _vm._s(
                            queue.processes
                              ? queue.processes.toLocaleString()
                              : 0
                          ) +
                          "\n                    "
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", { staticClass: "w-25" }, [
                      _vm._v(
                        "\n                        " +
                          _vm._s(
                            queue.length ? queue.length.toLocaleString() : 0
                          ) +
                          "\n                    "
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", { staticClass: "w-25 text-right" }, [
                      _vm._v(
                        "\n                        " +
                          _vm._s(_vm.humanTime(queue.wait)) +
                          "\n                    "
                      )
                    ])
                  ])
                }),
                0
              )
            ]
          )
        ])
      : _c(
          "div",
          {
            staticClass:
              "p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100"
          },
          [_vm._v("\n        Horizon is not active.\n    ")]
        )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-36c92b24", module.exports)
  }
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(19)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(21)
/* template */
var __vue_template__ = __webpack_require__(23)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-d19270f0"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/RecentJobs.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d19270f0", Component.options)
  } else {
    hotAPI.reload("data-v-d19270f0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("00245c2a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d19270f0\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RecentJobs.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d19270f0\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RecentJobs.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "\n.p-8[data-v-d19270f0]{ padding: 2rem;\n}\n.bg-gray-100[data-v-d19270f0]{ background: #f7fafc;\n}\n.border-gray-300[data-v-d19270f0]{ border-color: #e2e8f0;\n}\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_JobsCard__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0__templates_JobsCard__["a" /* default */],

    methods: {
        /**
         * Load the jobs of the given tag.
         */
        loadJobs: function loadJobs() {
            var _this = this;

            var starting = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
            var refreshing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!refreshing) {
                this.ready = false;
            }

            Nova.request().get(NovaHorizon.basePath + '/api/jobs/recent?starting_at=' + starting + '&limit=' + this.perPage).then(function (response) {
                if (!_this.$root.autoLoadsNewEntries && refreshing && _this.jobs.length && _.first(response.data.jobs).id !== _.first(_this.jobs).id) {
                    _this.hasNewEntries = true;
                } else {
                    _this.jobs = response.data.jobs;

                    _this.totalPages = Math.ceil(response.data.total / _this.perPage);
                }

                _this.ready = true;
            });
        },


        /**
         * Load new entries.
         */
        loadNewEntries: function loadNewEntries() {
            this.jobs = [];

            this.loadJobs(-1, false);

            this.hasNewEntries = false;
        },


        /**
         * Refresh the jobs every period of time.
         */
        refreshJobsPeriodically: function refreshJobsPeriodically() {
            var _this2 = this;

            this.interval = setInterval(function () {
                if (_this2.page != 1) {
                    return;
                }

                _this2.loadJobs(-1, true);
            }, 5000);
        }
    }
});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * php-unserialize-js JavaScript Library
 * https://github.com/bd808/php-unserialize-js
 *
 * Copyright 2013 Bryan Davis and contributors
 * Released under the MIT license
 * http://www.opensource.org/licenses/MIT
 */

(function (root, factory) {
  /*global define, exports, module */
  "use strict";

  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.phpUnserialize = factory();
  }
}(this, function () {
  "use strict";

  /**
   * Parse php serialized data into js objects.
   *
   * @param {String} phpstr Php serialized string to parse
   * @return {mixed} Parsed result
   */
  return function (phpstr) {
    var idx = 0
      , refStack = []
      , ridx = 0
      , parseNext // forward declaraton for "use strict"

      , readLength = function () {
          var del = phpstr.indexOf(':', idx)
            , val = phpstr.substring(idx, del);
          idx = del + 2;
          return parseInt(val, 10);
        } //end readLength

      , readInt = function () {
          var del = phpstr.indexOf(';', idx)
            , val = phpstr.substring(idx, del);
          idx = del + 1;
          return parseInt(val, 10);
        } //end readInt

      , parseAsInt = function () {
          var val = readInt();
          refStack[ridx++] = val;
          return val;
        } //end parseAsInt

      , parseAsFloat = function () {
          var del = phpstr.indexOf(';', idx)
            , val = phpstr.substring(idx, del);
          idx = del + 1;
          val = parseFloat(val);
          refStack[ridx++] = val;
          return val;
        } //end parseAsFloat

      , parseAsBoolean = function () {
          var del = phpstr.indexOf(';', idx)
            , val = phpstr.substring(idx, del);
          idx = del + 1;
          val = ("1" === val)? true: false;
          refStack[ridx++] = val;
          return val;
        } //end parseAsBoolean

      , readString = function () {
          var len = readLength()
            , utfLen = 0
            , bytes = 0
            , ch
            , val;
          while (bytes < len) {
            ch = phpstr.charCodeAt(idx + utfLen++);
            if (ch <= 0x007F) {
              bytes++;
            } else if (ch > 0x07FF) {
              bytes += 3;
            } else {
              bytes += 2;
            }
          }
          val = phpstr.substring(idx, idx + utfLen);
          idx += utfLen + 2;
          return val;
        } //end readString

      , parseAsString = function () {
          var val = readString();
          refStack[ridx++] = val;
          return val;
        } //end parseAsString

      , readType = function () {
          var type = phpstr.charAt(idx);
          idx += 2;
          return type;
        } //end readType

      , readKey = function () {
          var type = readType();
          switch (type) {
            case 'i': return readInt();
            case 's': return readString();
            default:
              throw {
                name: "Parse Error",
                message: "Unknown key type '" + type + "' at position " +
                    (idx - 2)
              };
          } //end switch
        }

      , parseAsArray = function () {
          var len = readLength()
            , resultArray = []
            , resultHash = {}
            , keep = resultArray
            , lref = ridx++
            , key
            , val
            , i
            , j
            , alen;

          refStack[lref] = keep;
          for (i = 0; i < len; i++) {
            key = readKey();
            val = parseNext();
            if (keep === resultArray && parseInt(key, 10) === i) {
              // store in array version
              resultArray.push(val);

            } else {
              if (keep !== resultHash) {
                // found first non-sequential numeric key
                // convert existing data to hash
                for (j = 0, alen = resultArray.length; j < alen; j++) {
                  resultHash[j] = resultArray[j];
                }
                keep = resultHash;
                refStack[lref] = keep;
              }
              resultHash[key] = val;
            } //end if
          } //end for

          idx++;
          return keep;
        } //end parseAsArray

      , fixPropertyName = function (parsedName, baseClassName) {
          var class_name
            , prop_name
            , pos;
          if ("\u0000" === parsedName.charAt(0)) {
            // "<NUL>*<NUL>property"
            // "<NUL>class<NUL>property"
            pos = parsedName.indexOf("\u0000", 1);
            if (pos > 0) {
              class_name = parsedName.substring(1, pos);
              prop_name  = parsedName.substr(pos + 1);

              if ("*" === class_name) {
                // protected
                return prop_name;
              } else if (baseClassName === class_name) {
                // own private
                return prop_name;
              } else {
                // private of a descendant
                return class_name + "::" + prop_name;

                // On the one hand, we need to prefix property name with
                // class name, because parent and child classes both may
                // have private property with same name. We don't want
                // just to overwrite it and lose something.
                //
                // On the other hand, property name can be "foo::bar"
                //
                //     $obj = new stdClass();
                //     $obj->{"foo::bar"} = 42;
                //     // any user-defined class can do this by default
                //
                // and such property also can overwrite something.
                //
                // So, we can to lose something in any way.
              }
            }
          } else {
            // public "property"
            return parsedName;
          }
        }

      , parseAsObject = function () {
          var len
            , obj = {}
            , lref = ridx++
            // HACK last char after closing quote is ':',
            // but not ';' as for normal string
            , clazzname = readString()
            , key
            , val
            , i;

          refStack[lref] = obj;
          len = readLength();
          for (i = 0; i < len; i++) {
            key = fixPropertyName(readKey(), clazzname);
            val = parseNext();
            obj[key] = val;
          }
          idx++;
          return obj;
        } //end parseAsObject

      , parseAsCustom = function () {
          var clazzname = readString()
            , content = readString();
          return {
            "__PHP_Incomplete_Class_Name": clazzname,
            "serialized": content
          };
        } //end parseAsCustom

      , parseAsRefValue = function () {
          var ref = readInt()
            // php's ref counter is 1-based; our stack is 0-based.
            , val = refStack[ref - 1];
          refStack[ridx++] = val;
          return val;
        } //end parseAsRefValue

      , parseAsRef = function () {
          var ref = readInt();
          // php's ref counter is 1-based; our stack is 0-based.
          return refStack[ref - 1];
        } //end parseAsRef

      , parseAsNull = function () {
          var val = null;
          refStack[ridx++] = val;
          return val;
        }; //end parseAsNull

      parseNext = function () {
        var type = readType();
        switch (type) {
          case 'i': return parseAsInt();
          case 'd': return parseAsFloat();
          case 'b': return parseAsBoolean();
          case 's': return parseAsString();
          case 'a': return parseAsArray();
          case 'O': return parseAsObject();
          case 'C': return parseAsCustom();

          // link to object, which is a value - affects refStack
          case 'r': return parseAsRefValue();

          // PHP's reference - DOES NOT affect refStack
          case 'R': return parseAsRef();

          case 'N': return parseAsNull();
          default:
            throw {
              name: "Parse Error",
              message: "Unknown type '" + type + "' at position " + (idx - 2)
            };
        } //end switch
      }; //end parseNext

      return parseNext();
  };
}));


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", [
    _c("div", { staticClass: "flex items-center justify-between p-3" }, [
      _c("h5", { staticClass: "text-base text-80 font-bold" }, [
        _vm._v("Recent Jobs")
      ])
    ]),
    _vm._v(" "),
    !_vm.ready
      ? _c(
          "div",
          {
            staticClass:
              "p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100 flex items-center justify-center"
          },
          [
            _c(
              "svg",
              {
                staticClass: "spin mr-2 w-8 fill-primary",
                attrs: {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20"
                }
              },
              [
                _c("path", {
                  attrs: {
                    d:
                      "M12 10a2 2 0 0 1-3.41 1.41A2 2 0 0 1 10 8V0a9.97 9.97 0 0 1 10 10h-8zm7.9 1.41A10 10 0 1 1 8.59.1v2.03a8 8 0 1 0 9.29 9.29h2.02zm-4.07 0a6 6 0 1 1-7.25-7.25v2.1a3.99 3.99 0 0 0-1.4 6.57 4 4 0 0 0 6.56-1.42h2.1z"
                  }
                })
              ]
            ),
            _vm._v(" "),
            _c("span", [_vm._v("Loading...")])
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.ready && _vm.jobs.length == 0
      ? _c(
          "div",
          {
            staticClass:
              "p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100"
          },
          [_c("span", [_vm._v("No recent jobs found.")])]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.ready && _vm.jobs.length > 0
      ? _c("div", { staticClass: "overflow-hidden overflow-x-auto relative" }, [
          _c("table", { staticClass: "table w-full" }, [
            _c("thead", [
              _c("tr", [
                _c("th", { staticClass: "text-left" }, [_vm._v("Job")]),
                _vm._v(" "),
                _c("th", { staticClass: "text-left" }, [_vm._v("Queued At")]),
                _vm._v(" "),
                _c("th", { staticClass: "text-left" }, [_vm._v("Runtime")]),
                _vm._v(" "),
                _c("th", { staticClass: "text-right" }, [_vm._v("Status")])
              ])
            ]),
            _vm._v(" "),
            _c(
              "tbody",
              [
                _vm.hasNewEntries
                  ? _c("tr", { key: "newEntries" }, [
                      _c(
                        "td",
                        {
                          staticClass: "text-center bg-gray-100 p-8",
                          attrs: { colspan: "100" }
                        },
                        [
                          !_vm.loadingNewEntries
                            ? _c(
                                "a",
                                {
                                  staticClass:
                                    "no-underline dim text-primary font-bold",
                                  attrs: { href: "#" },
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      return _vm.loadNewEntries($event)
                                    }
                                  }
                                },
                                [_vm._v("Load New Entries")]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.loadingNewEntries
                            ? _c("small", [_vm._v("Loading...")])
                            : _vm._e()
                        ]
                      )
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _vm._l(_vm.jobs, function(job) {
                  return _c("tr", { key: job.id, attrs: { job: job } }, [
                    _c(
                      "td",
                      [
                        _vm.visibleModal(job)
                          ? _c("modal", [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "bg-white rounded-lg shadow-lg overflow-hidden",
                                  staticStyle: { width: "900px" }
                                },
                                [
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "bg-30 p-4 flex items-center justify-between"
                                    },
                                    [
                                      _c("div", { staticClass: "font-bold" }, [
                                        _vm._v(
                                          "\n                                        " +
                                            _vm._s(_vm.modal.name) +
                                            " (#" +
                                            _vm._s(_vm.modal.id) +
                                            ")\n                                    "
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c(
                                        "button",
                                        {
                                          staticClass:
                                            "btn btn-default btn-danger",
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              return _vm.closeModal($event)
                                            }
                                          }
                                        },
                                        [
                                          _vm._v(
                                            "\n                                        Close\n                                    "
                                          )
                                        ]
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _vm.modal.status == "failed"
                                    ? _c(
                                        "div",
                                        { staticClass: "p-4" },
                                        [
                                          _c("nova-horizon-stack-trace", {
                                            attrs: {
                                              trace: _vm.modal.exception.split(
                                                "\n"
                                              )
                                            }
                                          })
                                        ],
                                        1
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _vm.modal.status == "failed"
                                    ? _c(
                                        "div",
                                        {
                                          staticClass:
                                            "bg-30 p-4 flex items-center justify-between"
                                        },
                                        [
                                          _c(
                                            "span",
                                            { staticClass: "font-bold" },
                                            [_vm._v("Data")]
                                          )
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    { staticClass: "p-4 bg-black text-white" },
                                    [
                                      _c("nova-horizon-json-pretty", {
                                        attrs: {
                                          data: _vm.prettyPrintJob(
                                            _vm.modal.payload.data
                                          )
                                        }
                                      })
                                    ],
                                    1
                                  )
                                ]
                              )
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        _c(
                          "a",
                          {
                            staticClass:
                              "no-underline dim text-primary font-bold",
                            attrs: { title: job.name, href: "#" },
                            on: {
                              click: function($event) {
                                $event.preventDefault()
                                return _vm.openModal(job)
                              }
                            }
                          },
                          [
                            _vm._v(
                              "\n                            " +
                                _vm._s(_vm.jobBaseName(job.name)) +
                                "\n                        "
                            )
                          ]
                        ),
                        _vm._v(
                          "\n\n                        (#" +
                            _vm._s(job.id) +
                            ")\n\n                        "
                        ),
                        _vm.delayed &&
                        (job.status == "reserved" || job.status == "pending")
                          ? _c(
                              "small",
                              {
                                directives: [
                                  {
                                    name: "tooltip",
                                    rawName: "v-tooltip:top",
                                    value: "Delayed for " + _vm.delayed,
                                    expression: "`Delayed for ${delayed}`",
                                    arg: "top"
                                  }
                                ],
                                staticClass: "p-2 fill-info"
                              },
                              [
                                _vm._v(
                                  "\n                            Delayed\n                        "
                                )
                              ]
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        _c("br"),
                        _vm._v(" "),
                        _c("small", { staticClass: "text-muted" }, [
                          _vm._v(
                            "\n                            Queue: " +
                              _vm._s(job.queue) +
                              "\n\n                            "
                          ),
                          job.payload.tags.length
                            ? _c("span", [
                                _vm._v(
                                  "\n                                | Tags: " +
                                    _vm._s(
                                      job.payload.tags &&
                                        job.payload.tags.length
                                        ? job.payload.tags
                                            .slice(0, 3)
                                            .join(", ")
                                        : ""
                                    )
                                ),
                                job.payload.tags.length > 3
                                  ? _c("span", [
                                      _vm._v(
                                        " (" +
                                          _vm._s(job.payload.tags.length - 3) +
                                          " more)"
                                      )
                                    ])
                                  : _vm._e()
                              ])
                            : _vm._e()
                        ])
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c("td", [
                      _vm._v(
                        "\n                        " +
                          _vm._s(_vm.readableTimestamp(job.payload.pushedAt)) +
                          "\n                    "
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c("span", [
                        _vm._v(
                          "\n                            " +
                            _vm._s(
                              job.completed_at
                                ? (job.completed_at - job.reserved_at).toFixed(
                                    2
                                  ) + "s"
                                : "-"
                            ) +
                            "\n                        "
                        )
                      ])
                    ]),
                    _vm._v(" "),
                    _c("td", { staticClass: "text-right" }, [
                      job.status == "completed"
                        ? _c(
                            "svg",
                            {
                              staticClass: "fill-success",
                              staticStyle: {
                                width: "1.5rem",
                                height: "1.5rem"
                              },
                              attrs: { viewBox: "0 0 20 20" }
                            },
                            [
                              _c("path", {
                                attrs: {
                                  d:
                                    "M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"
                                }
                              })
                            ]
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      job.status == "reserved" || job.status == "pending"
                        ? _c(
                            "svg",
                            {
                              staticClass: "fill-warning",
                              staticStyle: {
                                width: "1.5rem",
                                height: "1.5rem"
                              },
                              attrs: { viewBox: "0 0 20 20" }
                            },
                            [
                              _c("path", {
                                attrs: {
                                  d:
                                    "M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM7 6h2v8H7V6zm4 0h2v8h-2V6z"
                                }
                              })
                            ]
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      job.status == "failed"
                        ? _c(
                            "svg",
                            {
                              staticClass: "fill-danger",
                              staticStyle: {
                                width: "1.5rem",
                                height: "1.5rem"
                              },
                              attrs: { viewBox: "0 0 20 20" }
                            },
                            [
                              _c("path", {
                                attrs: {
                                  d:
                                    "M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"
                                }
                              })
                            ]
                          )
                        : _vm._e()
                    ])
                  ])
                })
              ],
              2
            )
          ])
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.ready && _vm.jobs.length
      ? _c("div", { staticClass: "p-3 flex justify-between" }, [
          _c(
            "button",
            {
              staticClass: "btn btn-secondary btn-md",
              attrs: { disabled: _vm.page == 1 },
              on: { click: _vm.previous }
            },
            [_vm._v("Previous")]
          ),
          _vm._v(" "),
          _c(
            "button",
            {
              staticClass: "btn btn-secondary btn-md",
              attrs: { disabled: _vm.page >= _vm.totalPages },
              on: { click: _vm.next }
            },
            [_vm._v("Next")]
          )
        ])
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d19270f0", module.exports)
  }
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(25)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(27)
/* template */
var __vue_template__ = __webpack_require__(28)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-a757d92c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/FailedJobs.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a757d92c", Component.options)
  } else {
    hotAPI.reload("data-v-a757d92c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("33c66800", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a757d92c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./FailedJobs.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a757d92c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./FailedJobs.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "\n.p-8[data-v-a757d92c]{ padding: 2rem;\n}\n.bg-gray-100[data-v-a757d92c]{ background: #f7fafc;\n}\n.border-gray-300[data-v-a757d92c]{ border-color: #e2e8f0;\n}\n", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_JobsCard__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0__templates_JobsCard__["a" /* default */],

    /**
     * The component's data.
     */
    data: function data() {
        return {
            searchQuery: '',
            searchTimeout: null,
            retryingJobs: []
        };
    },


    /**
     * Watch these properties for changes.
     */
    watch: {
        searchQuery: function searchQuery() {
            var _this = this;

            clearTimeout(this.searchTimeout);
            clearInterval(this.interval);

            this.searchTimeout = setTimeout(function () {
                _this.loadJobs();
                _this.refreshJobsPeriodically();
            }, 500);
        }
    },

    methods: {
        /**
         * Load the jobs of the given tag.
         */
        loadJobs: function loadJobs() {
            var _this2 = this;

            var starting = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var refreshing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!refreshing) {
                this.ready = false;
            }

            var tagQuery = this.searchQuery ? 'tag=' + this.searchQuery + '&' : '';

            Nova.request().get(NovaHorizon.basePath + '/api/jobs/failed?' + tagQuery + 'starting_at=' + starting).then(function (response) {
                if (!_this2.$root.autoLoadsNewEntries && refreshing && !response.data.jobs.length) {
                    return;
                }

                if (!_this2.$root.autoLoadsNewEntries && refreshing && _this2.jobs.length && _.first(response.data.jobs).id !== _.first(_this2.jobs).id) {
                    _this2.hasNewEntries = true;
                } else {
                    _this2.jobs = response.data.jobs;

                    _this2.totalPages = Math.ceil(response.data.total / _this2.perPage);
                }

                _this2.ready = true;
            });
        },


        /**
         * Load new entries.
         */
        loadNewEntries: function loadNewEntries() {
            this.jobs = [];

            this.loadJobs(-1, false);

            this.hasNewEntries = false;
        },


        /**
         * Refresh the jobs every period of time.
         */
        refreshJobsPeriodically: function refreshJobsPeriodically() {
            var _this3 = this;

            this.interval = setInterval(function () {
                _this3.loadJobs((_this3.page - 1) * _this3.perPage, true);
            }, 3000);
        },


        /**
         * Retry the given failed job.
         */
        retry: function retry(id) {
            var _this4 = this;

            if (this.isRetrying(id)) {
                return;
            }

            this.retryingJobs.push(id);

            Nova.request().post(NovaHorizon.basePath + '/api/jobs/retry/' + id).then(function (response) {
                setTimeout(function () {
                    _this4.retryingJobs = _.reject(_this4.retryingJobs, function (job) {
                        return job == id;
                    });
                }, 10000);
            });
        },


        /**
         * Determine if the given job is currently retrying.
         */
        isRetrying: function isRetrying(id) {
            return _.includes(this.retryingJobs, id);
        },


        /**
         * Determine if the given job has completed.
         */
        hasCompleted: function hasCompleted(job) {
            return _.find(job.retried_by, function (retry) {
                return retry.status == 'completed';
            });
        }
    }
});

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", [
    _c("div", { staticClass: "flex items-center justify-between p-3" }, [
      _c("h5", { staticClass: "text-base text-80 font-bold" }, [
        _vm._v("Failed Jobs")
      ]),
      _vm._v(" "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.searchQuery,
            expression: "searchQuery"
          }
        ],
        staticClass: "form-control form-input form-input-bordered",
        staticStyle: { width: "200px" },
        attrs: { type: "text", placeholder: "Search Tags" },
        domProps: { value: _vm.searchQuery },
        on: {
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.searchQuery = $event.target.value
          }
        }
      })
    ]),
    _vm._v(" "),
    !_vm.ready
      ? _c(
          "div",
          {
            staticClass:
              "p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100 flex items-center justify-center"
          },
          [
            _c(
              "svg",
              {
                staticClass: "spin mr-2 w-8 fill-primary",
                attrs: {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20"
                }
              },
              [
                _c("path", {
                  attrs: {
                    d:
                      "M12 10a2 2 0 0 1-3.41 1.41A2 2 0 0 1 10 8V0a9.97 9.97 0 0 1 10 10h-8zm7.9 1.41A10 10 0 1 1 8.59.1v2.03a8 8 0 1 0 9.29 9.29h2.02zm-4.07 0a6 6 0 1 1-7.25-7.25v2.1a3.99 3.99 0 0 0-1.4 6.57 4 4 0 0 0 6.56-1.42h2.1z"
                  }
                })
              ]
            ),
            _vm._v(" "),
            _c("span", [_vm._v("Loading...")])
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.ready && _vm.jobs.length == 0
      ? _c(
          "div",
          {
            staticClass:
              "p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100"
          },
          [_c("span", [_vm._v("No failed jobs found.")])]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.jobs.length
      ? _c("div", { staticClass: "overflow-hidden overflow-x-auto relative" }, [
          _c("table", { staticClass: "table w-full" }, [
            _c("thead", [
              _c("tr", [
                _c("th", { staticClass: "text-left" }, [_vm._v("Job")]),
                _vm._v(" "),
                _c("th", { staticClass: "text-left" }, [_vm._v("Runtime")]),
                _vm._v(" "),
                _c("th", { staticClass: "text-left" }, [_vm._v("Failed At")]),
                _vm._v(" "),
                _c("th", { staticClass: "text-right" }, [_vm._v("Retry")])
              ])
            ]),
            _vm._v(" "),
            _c(
              "tbody",
              [
                _vm.hasNewEntries
                  ? _c("tr", { key: "newEntries" }, [
                      _c(
                        "td",
                        {
                          staticClass: "text-center bg-gray-100 p-8",
                          attrs: { colspan: "100" }
                        },
                        [
                          !_vm.loadingNewEntries
                            ? _c(
                                "a",
                                {
                                  staticClass:
                                    "no-underline dim text-primary font-bold",
                                  attrs: { href: "#" },
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      return _vm.loadNewEntries($event)
                                    }
                                  }
                                },
                                [_vm._v("Load New Entries")]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.loadingNewEntries
                            ? _c("small", [_vm._v("Loading...")])
                            : _vm._e()
                        ]
                      )
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _vm._l(_vm.jobs, function(job) {
                  return _c("tr", { key: job.id }, [
                    _c(
                      "td",
                      [
                        _vm.visibleModal(job)
                          ? _c("modal", [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "bg-white rounded-lg shadow-lg overflow-hidden",
                                  staticStyle: { width: "900px" }
                                },
                                [
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "bg-30 p-4 flex items-center justify-between"
                                    },
                                    [
                                      _c("div", { staticClass: "font-bold" }, [
                                        _vm._v(
                                          "\n                                        " +
                                            _vm._s(_vm.modal.name) +
                                            " (#" +
                                            _vm._s(_vm.modal.id) +
                                            ")\n                                    "
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c(
                                        "button",
                                        {
                                          staticClass:
                                            "btn btn-default btn-danger",
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              return _vm.closeModal($event)
                                            }
                                          }
                                        },
                                        [
                                          _vm._v(
                                            "\n                                        Close\n                                    "
                                          )
                                        ]
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    { staticClass: "p-4" },
                                    [
                                      _c("nova-horizon-stack-trace", {
                                        attrs: {
                                          trace: _vm.modal.exception.split("\n")
                                        }
                                      })
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "bg-30 p-4 flex items-center justify-between"
                                    },
                                    [
                                      _c("span", { staticClass: "font-bold" }, [
                                        _vm._v("Data")
                                      ])
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    { staticClass: "p-4 bg-black text-white" },
                                    [
                                      _c("nova-horizon-json-pretty", {
                                        attrs: {
                                          data: _vm.prettyPrintJob(
                                            _vm.modal.payload.data
                                          )
                                        }
                                      })
                                    ],
                                    1
                                  )
                                ]
                              )
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        _c(
                          "a",
                          {
                            staticClass:
                              "no-underline dim text-primary font-bold",
                            attrs: { title: job.name, href: "#" },
                            on: {
                              click: function($event) {
                                $event.preventDefault()
                                return _vm.openModal(job)
                              }
                            }
                          },
                          [
                            _vm._v(
                              "\n                            " +
                                _vm._s(_vm.jobBaseName(job.name)) +
                                "\n                        "
                            )
                          ]
                        ),
                        _vm._v(" "),
                        _c("br"),
                        _vm._v(" "),
                        _c("small", [
                          _vm._v(
                            "\n                            Queue: " +
                              _vm._s(job.queue) +
                              "\n                            "
                          ),
                          job.payload && job.payload.tags.length
                            ? _c("span", [
                                _vm._v(
                                  "\n                                | Tags: " +
                                    _vm._s(
                                      job.payload.tags &&
                                        job.payload.tags.length
                                        ? job.payload.tags.join(", ")
                                        : ""
                                    ) +
                                    "\n                            "
                                )
                              ])
                            : _vm._e()
                        ])
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c("td", [
                      _c("span", [
                        _vm._v(
                          _vm._s(
                            job.failed_at
                              ? String(
                                  (job.failed_at - job.reserved_at).toFixed(2)
                                ) + "s"
                              : "-"
                          )
                        )
                      ])
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _vm._v(
                        "\n                        " +
                          _vm._s(_vm.readableTimestamp(job.failed_at)) +
                          "\n                    "
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", { staticClass: "text-right" }, [
                      !_vm.hasCompleted(job)
                        ? _c(
                            "a",
                            {
                              attrs: { href: "#" },
                              on: {
                                click: function($event) {
                                  $event.preventDefault()
                                  return _vm.retry(job.id)
                                }
                              }
                            },
                            [
                              _c(
                                "svg",
                                {
                                  staticClass: "fill-primary",
                                  class: { spin: _vm.isRetrying(job.id) },
                                  staticStyle: {
                                    width: "1.5rem",
                                    height: "1.5rem"
                                  },
                                  attrs: { viewBox: "0 0 20 20" }
                                },
                                [
                                  _c("path", {
                                    attrs: {
                                      d:
                                        "M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"
                                    }
                                  })
                                ]
                              )
                            ]
                          )
                        : _vm._e()
                    ])
                  ])
                })
              ],
              2
            )
          ])
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.ready && _vm.jobs.length
      ? _c("div", { staticClass: "flex justify-between p-3" }, [
          _c(
            "button",
            {
              staticClass: "btn btn-secondary btn-md",
              attrs: { disabled: _vm.page == 1 },
              on: { click: _vm.previous }
            },
            [_vm._v("Previous")]
          ),
          _vm._v(" "),
          _c(
            "button",
            {
              staticClass: "btn btn-secondary btn-md",
              attrs: { disabled: _vm.page >= _vm.totalPages },
              on: { click: _vm.next }
            },
            [_vm._v("Next")]
          )
        ])
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-a757d92c", module.exports)
  }
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(30)
/* template */
var __vue_template__ = __webpack_require__(31)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/JobsPerMinute.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-538fae74", Component.options)
  } else {
    hotAPI.reload("data-v-538fae74", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__["a" /* default */]
});

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", { staticClass: "px-6 py-6" }, [
    _c("h3", { staticClass: "mr-3 mb-3 text-base text-80 font-bold" }, [
      _vm._v("Jobs")
    ]),
    _vm._v(" "),
    _c("p", { staticClass: "text-4xl mb-3" }, [
      _vm._v(
        "\n        " +
          _vm._s(
            _vm.stats.jobsPerMinute
              ? _vm.stats.jobsPerMinute.toLocaleString()
              : 0
          ) +
          "\n    "
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "text-80" }, [
      _vm._v("\n        Per Minute\n    ")
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-538fae74", module.exports)
  }
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(33)
/* template */
var __vue_template__ = __webpack_require__(34)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/RecentJobsCount.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5f4a8517", Component.options)
  } else {
    hotAPI.reload("data-v-5f4a8517", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__["a" /* default */],

    computed: {
        recentJobsPeriod: function recentJobsPeriod() {
            return this.ready && this.stats.periods ? 'Past ' + this.determinePeriod(this.stats.periods.recentJobs) : 'Past hour';
        }
    }
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", { staticClass: "px-6 py-6" }, [
    _c("h3", { staticClass: "mr-3 mb-3 text-base text-80 font-bold" }, [
      _vm._v("Recent Jobs")
    ]),
    _vm._v(" "),
    _c("p", { staticClass: "text-4xl mb-3" }, [
      _vm._v(
        "\n        " +
          _vm._s(
            _vm.stats.recentJobs ? _vm.stats.recentJobs.toLocaleString() : 0
          ) +
          "\n    "
      )
    ]),
    _vm._v(" "),
    _c("div", {
      staticClass: "text-80",
      domProps: { textContent: _vm._s(_vm.recentJobsPeriod) }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5f4a8517", module.exports)
  }
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(36)
/* template */
var __vue_template__ = __webpack_require__(37)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/FailedJobsCount.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-716b5675", Component.options)
  } else {
    hotAPI.reload("data-v-716b5675", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__["a" /* default */],

    computed: {
        failedJobsPeriod: function failedJobsPeriod() {
            return this.ready && this.stats.periods ? 'Past ' + this.determinePeriod(this.stats.periods.failedJobs) : 'Past 7 days';
        }
    }
});

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", { staticClass: "px-6 py-6" }, [
    _c("h3", { staticClass: "mr-3 mb-3 text-base text-80 font-bold" }, [
      _vm._v("Failed Jobs")
    ]),
    _vm._v(" "),
    _c("p", { staticClass: "text-4xl mb-3" }, [
      _vm._v(
        "\n        " +
          _vm._s(
            _vm.stats.failedJobs ? _vm.stats.failedJobs.toLocaleString() : 0
          ) +
          "\n    "
      )
    ]),
    _vm._v(" "),
    _c("div", {
      staticClass: "text-80",
      domProps: { textContent: _vm._s(_vm.failedJobsPeriod) }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-716b5675", module.exports)
  }
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(39)
/* template */
var __vue_template__ = __webpack_require__(40)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/Status.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7aa355ae", Component.options)
  } else {
    hotAPI.reload("data-v-7aa355ae", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__["a" /* default */]
});

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", { staticClass: "px-6 py-6" }, [
    _c("h3", { staticClass: "mr-3 mb-3 text-base text-80 font-bold" }, [
      _vm._v("Status")
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "flex items-center mt-4" }, [
      _vm.stats.status == "running"
        ? _c(
            "svg",
            {
              staticClass: "fill-success",
              staticStyle: { width: "1.7rem", height: "1.7rem" },
              attrs: { viewBox: "0 0 20 20" }
            },
            [
              _c("path", {
                attrs: {
                  d:
                    "M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"
                }
              })
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.stats.status == "paused"
        ? _c(
            "svg",
            {
              staticClass: "fill-warning",
              staticStyle: { width: "1.7rem", height: "1.7rem" },
              attrs: { viewBox: "0 0 20 20" }
            },
            [
              _c("path", {
                attrs: {
                  d:
                    "M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM7 6h2v8H7V6zm4 0h2v8h-2V6z"
                }
              })
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.stats.status == "inactive"
        ? _c(
            "svg",
            {
              staticClass: "fill-danger",
              staticStyle: { width: "1.7rem", height: "1.7rem" },
              attrs: { viewBox: "0 0 20 20" }
            },
            [
              _c("path", {
                attrs: {
                  d:
                    "M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"
                }
              })
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _c("p", { staticClass: "mb-0 ml-2 text-4xl" }, [
        _vm._v(
          "\n            " +
            _vm._s(
              {
                running: "Active",
                paused: "Paused",
                inactive: "Inactive"
              }[_vm.stats.status]
            ) +
            "\n        "
        )
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7aa355ae", module.exports)
  }
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(42)
/* template */
var __vue_template__ = __webpack_require__(43)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/TotalProcesses.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4fb1d730", Component.options)
  } else {
    hotAPI.reload("data-v-4fb1d730", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__["a" /* default */]
});

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", { staticClass: "px-6 py-6" }, [
    _c("h3", { staticClass: "mr-3 mb-3 text-base text-80 font-bold" }, [
      _vm._v("Total Processes")
    ]),
    _vm._v(" "),
    _c("p", { staticClass: "text-4xl mb-3" }, [
      _vm._v(
        "\n        " +
          _vm._s(
            _vm.stats.processes ? _vm.stats.processes.toLocaleString() : 0
          ) +
          "\n    "
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4fb1d730", module.exports)
  }
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(45)
/* template */
var __vue_template__ = __webpack_require__(46)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/MaxWaitTime.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-32d64a82", Component.options)
  } else {
    hotAPI.reload("data-v-32d64a82", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__["a" /* default */]
});

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", { staticClass: "px-6 py-6" }, [
    _c("h3", { staticClass: "mr-3 mb-3 text-base text-80 font-bold" }, [
      _vm._v("Max Wait Time")
    ]),
    _vm._v(" "),
    _c("p", { staticClass: "text-4xl mb-3" }, [
      _vm._v(
        "\n        " +
          _vm._s(
            _vm.stats.max_wait_time
              ? _vm.humanTime(_vm.stats.max_wait_time)
              : "-"
          ) +
          "\n    "
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-32d64a82", module.exports)
  }
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(48)
/* template */
var __vue_template__ = __webpack_require__(49)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/maxRuntime.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-581bba6b", Component.options)
  } else {
    hotAPI.reload("data-v-581bba6b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__["a" /* default */]
});

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", { staticClass: "px-6 py-6" }, [
    _c("h3", { staticClass: "mr-3 mb-3 text-base text-80 font-bold" }, [
      _vm._v("Max Runtime")
    ]),
    _vm._v(" "),
    _c("p", { staticClass: "text-4xl mb-3" }, [
      _vm._v(
        "\n        " +
          _vm._s(
            _vm.stats.queueWithMaxRuntime ? _vm.stats.queueWithMaxRuntime : "-"
          ) +
          "\n    "
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-581bba6b", module.exports)
  }
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(51)
/* template */
var __vue_template__ = __webpack_require__(52)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Cards/MaxThroughput.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4434cc72", Component.options)
  } else {
    hotAPI.reload("data-v-4434cc72", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0__templates_StatsCard__["a" /* default */]
});

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", { staticClass: "px-6 py-6" }, [
    _c("h3", { staticClass: "mr-3 mb-3 text-base text-80 font-bold" }, [
      _vm._v("Max Throughput")
    ]),
    _vm._v(" "),
    _c("p", { staticClass: "text-4xl mb-3" }, [
      _vm._v(
        "\n        " +
          _vm._s(
            _vm.stats.queueWithMaxThroughput
              ? _vm.stats.queueWithMaxThroughput
              : "-"
          ) +
          "\n    "
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4434cc72", module.exports)
  }
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(54)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(56)
/* template */
var __vue_template__ = __webpack_require__(71)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-51b329c8"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/StackTrace.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-51b329c8", Component.options)
  } else {
    hotAPI.reload("data-v-51b329c8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(55);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("0784ac52", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-51b329c8\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./StackTrace.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-51b329c8\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./StackTrace.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "\n.table td[data-v-51b329c8]{\n    background: transparent !important;\n    height: auto;\n    padding-top: 0.75rem;\n    padding-bottom: 0.75rem;\n}\n", ""]);

// exports


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_take__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_take___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_take__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['trace'],

    /**
     * The component's data.
     */
    data: function data() {
        return {
            minimumLines: 5,
            showAll: false
        };
    },


    computed: {
        lines: function lines() {
            return this.showAll ? __WEBPACK_IMPORTED_MODULE_0_lodash_take___default()(this.trace, 1000) : __WEBPACK_IMPORTED_MODULE_0_lodash_take___default()(this.trace, this.minimumLines);
        }
    }
});

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(58),
    toInteger = __webpack_require__(59);

/**
 * Creates a slice of `array` with `n` elements taken from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.take([1, 2, 3]);
 * // => [1]
 *
 * _.take([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.take([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.take([1, 2, 3], 0);
 * // => []
 */
function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = take;


/***/ }),
/* 58 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var toFinite = __webpack_require__(60);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(61);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(62),
    isSymbol = __webpack_require__(63);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),
/* 62 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(64),
    isObjectLike = __webpack_require__(70);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(6),
    getRawTag = __webpack_require__(68),
    objectToString = __webpack_require__(69);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(66);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(67)))

/***/ }),
/* 67 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(6);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 69 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 70 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("table", { staticClass: "table mb-0" }, [
    _c(
      "tbody",
      [
        _vm._l(_vm.lines, function(line) {
          return _c("tr", [
            _c("td", [
              _vm._v("\n                " + _vm._s(line) + "\n            ")
            ])
          ])
        }),
        _vm._v(" "),
        !_vm.showAll
          ? _c("tr", [
              _c("td", [
                _c(
                  "a",
                  {
                    staticClass: "no-underline dim text-primary font-bold",
                    attrs: { href: "*" },
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.showAll = true
                      }
                    }
                  },
                  [_vm._v("Show All")]
                )
              ])
            ])
          : _vm._e()
      ],
      2
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-51b329c8", module.exports)
  }
}

/***/ }),
/* 72 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 73 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);