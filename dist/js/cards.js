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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
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
        }
    }
});

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    methods: {
        /**
         * Human time.
         */
        humanTime: function humanTime(time) {
            return moment.duration(time, "seconds").humanize().replace(/^(.)|\s+(.)/g, function ($1) {
                return $1.toUpperCase();
            });
        },


        /**
         * Determine the time period.
         */
        determinePeriod: function determinePeriod(minutes) {
            return moment.duration(moment().diff(moment().subtract(minutes, "minutes"))).humanize().replace(/^An?/i, '');
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
/* 3 */
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
/* 4 */
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

var listToStyles = __webpack_require__(5)

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
/* 5 */
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    methods: {
        /**
         * Extract the job base name.
         */
        prettyJobName: function prettyJobName(name) {
            if (!name.includes('\\')) {
                return name;
            }

            var parts = name.split('\\');

            return parts[parts.length - 1];
        }
    }
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = ({
    methods: {
        /**
         * Load the jobs for the previous page.
         */
        previousPage: function previousPage() {
            this.fetchRecentJobs((this.page - 2) * this.perPage);

            this.page -= 1;

            this.hasNewEntries = false;
        },


        /**
         * Load the jobs for the next page.
         */
        nextPage: function nextPage() {
            this.fetchRecentJobs(this.page * this.perPage);

            this.page += 1;

            this.hasNewEntries = false;
        }
    }
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(9);
__webpack_require__(53);
module.exports = __webpack_require__(54);


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

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
});

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins_HandlesDates__ = __webpack_require__(2);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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

    mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins_HandlesDates__["a" /* default */]],

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
var update = __webpack_require__(4)("a571a426", content, false, {});
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

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.w-25[data-v-36c92b24]{ width: 25%;\n}\n.bg-gray-100[data-v-36c92b24]{ background: #f7fafc;\n}\n.border-gray-300[data-v-36c92b24]{ border-color: #e2e8f0;\n}\n", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixins_HandlesDates__ = __webpack_require__(2);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    mixins: [__WEBPACK_IMPORTED_MODULE_0__mixins_HandlesDates__["a" /* default */]],

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
  __webpack_require__(66)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(19)
/* template */
var __vue_template__ = __webpack_require__(68)
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    //
});

/***/ }),
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
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
var update = __webpack_require__(4)("33c66800", content, false, {});
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

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.w-25[data-v-a757d92c]{ width: 25%;\n}\n.bg-gray-100[data-v-a757d92c]{ background: #f7fafc;\n}\n.border-gray-300[data-v-a757d92c]{ border-color: #e2e8f0;\n}\n", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixins_HandlesJobs__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins_HandlesDates__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixins_HandlesPages__ = __webpack_require__(7);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    mixins: [__WEBPACK_IMPORTED_MODULE_0__mixins_HandlesJobs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_1__mixins_HandlesDates__["a" /* default */]],

    data: function data() {
        return {
            ready: false,
            searchQuery: '',
            searchTimeout: null,
            loadingNewEntries: false,
            hasNewEntries: false,
            page: 1,
            perPage: 50,
            totalPages: 1,
            jobs: [],
            retryingJobs: []
        };
    },


    /**
     * Mounted.
     */
    mounted: function mounted() {
        this.fetchRecentJobs();

        this.refreshRecentJobsPeriodically();
    },


    /**
     * Destroyed.
     */
    destroyed: function destroyed() {
        clearInterval(this.interval);
    },


    /**
     * Watch.
     */
    watch: {
        searchQuery: function searchQuery() {
            var _this = this;

            clearTimeout(this.searchTimeout);
            clearInterval(this.interval);

            this.searchTimeout = setTimeout(function () {
                _this.fetchRecentJobs();
                _this.refreshRecentJobsPeriodically();
            }, 500);
        }
    },

    methods: {
        /**
         * Load the jobs of the given tag.
         */
        fetchRecentJobs: function fetchRecentJobs() {
            var _this2 = this;

            var starting = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var refreshing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!refreshing) {
                this.ready = false;
            }

            var tagQuery = this.searchQuery ? 'tag=' + this.searchQuery + '&' : '';

            var queryParams = tagQuery + 'starting_at=' + starting + '&limit=' + this.perPage;

            Nova.request().get('/horizon/api/jobs/failed?' + queryParams).then(function (response) {
                if (refreshing && _this2.jobs.length && _.first(response.data.jobs).id !== _.first(_this2.jobs).id) {
                    _this2.hasNewEntries = true;
                } else {
                    _this2.jobs = response.data.jobs;

                    _this2.totalPages = Math.ceil(response.data.total / _this2.perPage);
                }

                _this2.ready = true;
            });
        },


        /**
         * Refresh the jobs every period of time.
         */
        refreshRecentJobsPeriodically: function refreshRecentJobsPeriodically() {
            var _this3 = this;

            this.interval = setInterval(function () {
                _this3.fetchRecentJobs((_this3.page - 1) * _this3.perPage, true);
            }, 3000);
        },


        /**
         * Load new entries.
         */
        loadNewEntries: function loadNewEntries() {
            this.jobs = [];

            this.fetchRecentJobs(0, false);

            this.hasNewEntries = false;
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

            Nova.request().post('/horizon/api/jobs/retry/' + id).then(function (response) {
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
                  ? _c("tr", { staticClass: "bg-gray-100" }, [
                      _c(
                        "td",
                        {
                          staticClass: "text-center p-8",
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
                        _c(
                          "router-link",
                          {
                            staticClass:
                              "no-underline dim text-primary font-bold",
                            attrs: {
                              title: job.name,
                              to: {
                                name: "failed-jobs-preview",
                                params: { jobId: job.id }
                              }
                            }
                          },
                          [
                            _vm._v(
                              "\n                            " +
                                _vm._s(_vm.prettyJobName(job.name)) +
                                "\n                        "
                            )
                          ]
                        ),
                        _vm._v(" "),
                        _c("br"),
                        _vm._v(" "),
                        _c("small", [
                          _c("span", [_vm._v("Queue: " + _vm._s(job.queue))]),
                          _vm._v(" "),
                          job.payload.tags.length
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
          ]),
          _vm._v(" "),
          _vm.ready && _vm.jobs.length
            ? _c("div", { staticClass: "flex justify-between p-3" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-secondary",
                    attrs: { disabled: _vm.page == 1 },
                    on: { click: _vm.previousPage }
                  },
                  [_vm._v("Previous")]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "btn btn-secondary",
                    attrs: { disabled: _vm.page >= _vm.totalPages },
                    on: { click: _vm.nextPage }
                  },
                  [_vm._v("Next")]
                )
              ])
            : _vm._e()
        ])
      : _c(
          "div",
          {
            staticClass:
              "p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100"
          },
          [_vm._v("\n        No failed jobs found.\n    ")]
        )
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins_HandlesDates__ = __webpack_require__(2);
//
//
//
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

    mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins_HandlesDates__["a" /* default */]],

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins_HandlesDates__ = __webpack_require__(2);
//
//
//
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

    mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins_HandlesDates__["a" /* default */]],

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
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 54 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(67);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("00245c2a", content, false, {});
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
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.bg-gray-100[data-v-d19270f0]{ background: #f7fafc;\n}\n.border-gray-300[data-v-d19270f0]{ border-color: #e2e8f0;\n}\n", ""]);

// exports


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("card", { staticClass: "p-8 text-center bg-gray-100" }, [
    _vm._v("\n    Coming soon.\n")
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

/***/ })
/******/ ]);