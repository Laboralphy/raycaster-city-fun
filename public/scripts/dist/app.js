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
/******/ 	__webpack_require__.p = "/public/scripts/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const CHAT_ADD_TAB = 'chatAddTab';
/* harmony export (immutable) */ __webpack_exports__["a"] = CHAT_ADD_TAB;

const CHAT_POST_LINE = 'chatPostLine';
/* harmony export (immutable) */ __webpack_exports__["b"] = CHAT_POST_LINE;

const CHAT_SELECT_TAB = 'chatSelectTab';
/* harmony export (immutable) */ __webpack_exports__["c"] = CHAT_SELECT_TAB;


const CLIENT_CONNECT = 'clientConnect';
/* harmony export (immutable) */ __webpack_exports__["d"] = CLIENT_CONNECT;

const CLIENT_DISCONNECT = 'clientDisconnect';
/* harmony export (immutable) */ __webpack_exports__["e"] = CLIENT_DISCONNECT;

const CLIENT_SET_LOCAL = 'clientSetLocal';
/* harmony export (immutable) */ __webpack_exports__["f"] = CLIENT_SET_LOCAL;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store_mutation_types__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_chat_window_vue__ = __webpack_require__(7);
const socket = io();





function main () {

    const app = new Vue({
        el: '#user-interface',
        store: __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */],
        components: {
            'chat-window': __WEBPACK_IMPORTED_MODULE_2__components_chat_window_vue__["a" /* default */]
        },
        methods: {
            init: function() {
                this.$store.dispatch(__WEBPACK_IMPORTED_MODULE_1__store_mutation_types__["a" /* CHAT_ADD_TAB */], {id: 1, caption: "system"});
                this.$store.dispatch(__WEBPACK_IMPORTED_MODULE_1__store_mutation_types__["a" /* CHAT_ADD_TAB */], {id: 2, caption: "global"});
                this.$store.dispatch(__WEBPACK_IMPORTED_MODULE_1__store_mutation_types__["a" /* CHAT_ADD_TAB */], {id: 3, caption: "mission"});
                this.$store.dispatch(__WEBPACK_IMPORTED_MODULE_1__store_mutation_types__["c" /* CHAT_SELECT_TAB */], {id: 1});
                this.$store.dispatch(__WEBPACK_IMPORTED_MODULE_1__store_mutation_types__["d" /* CLIENT_CONNECT */], {id: 10, name: 'Moi'});
                this.$store.dispatch(__WEBPACK_IMPORTED_MODULE_1__store_mutation_types__["f" /* CLIENT_SET_LOCAL */], {id: 10});

                this.$refs.chat.$on('send-message', (function(sMessage) {
                    let oChat = this.$store.state.chat;
                    let idTab = oChat.activeTab.id;
                    this.$store.dispatch(__WEBPACK_IMPORTED_MODULE_1__store_mutation_types__["b" /* CHAT_POST_LINE */], {
                        tab: idTab,
                        client: this.$store.getters.getLocalClient.id,
                        message: sMessage
                    });
                    this.$refs.chat.doScrollDown(idTab);
                }).bind(this));
            }
        },
        mounted: function() {
            this.init();
        }
    });

    window.Application = app;
}

window.addEventListener('load', main);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__state__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mutations__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__getters__ = __webpack_require__(6);






const store = new Vuex.Store({
    state: __WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */],
    mutations: __WEBPACK_IMPORTED_MODULE_2__mutations__["a" /* default */],
    actions: __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */],
    getters: __WEBPACK_IMPORTED_MODULE_3__getters__["a" /* default */]
});


/* harmony default export */ __webpack_exports__["a"] = (store);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mutation_types__ = __webpack_require__(0);


const actions = {
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["a" /* CHAT_ADD_TAB */]]: function({commit}, {id, caption}) {
        commit(__WEBPACK_IMPORTED_MODULE_0__mutation_types__["a" /* CHAT_ADD_TAB */], {id, caption});
    },
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["c" /* CHAT_SELECT_TAB */]]: function({commit}, {id}) {
        commit(__WEBPACK_IMPORTED_MODULE_0__mutation_types__["c" /* CHAT_SELECT_TAB */], {id});
    },
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["b" /* CHAT_POST_LINE */]]: function({commit}, {tab, client, message}) {
        commit(__WEBPACK_IMPORTED_MODULE_0__mutation_types__["b" /* CHAT_POST_LINE */], {tab, client, message});
    },
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["d" /* CLIENT_CONNECT */]]: function({commit}, {id, name}) {
        commit(__WEBPACK_IMPORTED_MODULE_0__mutation_types__["d" /* CLIENT_CONNECT */], {id, name});
    },
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["e" /* CLIENT_DISCONNECT */]]: function({commit}, {id}) {
        commit(__WEBPACK_IMPORTED_MODULE_0__mutation_types__["e" /* CLIENT_DISCONNECT */], {id});
    },
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["f" /* CLIENT_SET_LOCAL */]]: function({commit}, {id}) {
        commit(__WEBPACK_IMPORTED_MODULE_0__mutation_types__["f" /* CLIENT_SET_LOCAL */], {id});
    },

};

/* harmony default export */ __webpack_exports__["a"] = (actions);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    clients: [],
    localClient: null,
    chat: {
        lastLineId: 0,
        tabs: [],
        activeTab: null,
    }
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mutation_types__ = __webpack_require__(0);


const mutations = {
    /**
     * Ajoute un onglet dans la fenetre de discussion
     * @param state
     * @param id {number} identifiant du nouvel onglet
     * @param caption {string} nom de l'onglet, fait référence à une entrée
     * de strings.chat.tabs, sinon affiché tel quel.
     *
     */
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["a" /* CHAT_ADD_TAB */]]: function(state, {id, caption}) {
        state.chat.tabs.push({
            id: id,
            lines: [],
            caption: caption,
            notified: false
        });
    },

    /**
     * Selectionne un nouvel onglet
     * @param state
     * @param id {number} identifiant de l'onglet à selectionner
     */
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["c" /* CHAT_SELECT_TAB */]]: function(state, {id}) {
        state.chat.activeTab = state.chat.tabs.find(t => t.id === id);
        state.chat.activeTab.notified = false;
    },

    /**
     * Ajoute une line dans un onglet de la fenetre de discussion
     * @param state
     * @param tab {number} identifiant de l'onglet
     * @param client {number} id du client
     * @param message {string} contenu du message
     */
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["b" /* CHAT_POST_LINE */]]: function(state, {tab, client, message}) {
        let oChat = state.chat;
        let oTab = oChat.tabs.find(t => t.id === tab);
        if (!oTab) {
            throw new Error('could not find tab #' + tab);
        }
        let oClient = state.clients.find(c => c.id === client);
        if (!oClient) {
            throw new Error('could not find client #' + client);
        }
        oTab.lines.push({
            id: ++oChat.lastLineId,
            user: oClient.name,
            message: message,
            color: 0
        });
        if (tab !== state.chat.activeTab.id) {
            oTab.notified = true;
        }
    },

    /**
     * Ajoute un nouveau client
     * @param state {*} etat
     * @param id {number} identifiant du client
     * @param name {string} nom du client
     */
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["d" /* CLIENT_CONNECT */]]: function(state, {id, name}) {
        state.clients.push({
            id: id,
            name: name
        });
    },

    /**
     * supprime un client
     * @param state
     * @param id {number} identifiant du client qui s'en va
     */
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["e" /* CLIENT_DISCONNECT */]]: function(state, {id}) {
        let iClient = state.clients.findIndex(c => c.id === id);
        if (iClient >= 0) {
            state.clients.splice(iClient, 1);
        }
    },

    /**
     * Il peut y avoir plusieurs clients. Cette methode permet de définir
     * le client local sur lequel est installé l'appli
     * @param state
     * @param id {number} identifiant du client
     */
    [__WEBPACK_IMPORTED_MODULE_0__mutation_types__["f" /* CLIENT_SET_LOCAL */]]: function(state, {id}) {
        state.localClient = state.clients.find(c => c.id === id);
    }
};

/* harmony default export */ __webpack_exports__["a"] = (mutations);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const getters = {
    /**
     * Renvoie ce qu'il faut afficher dans la fenetre de discussion
     */
    chatContent: function(state) {
        return state.chat.activeTab ? state.chat.activeTab.lines : [];
    },


    getTab: function(state) {
        return function(id) {
            return state.chat.tabs.find(t => t.id === id);
        };
    },

    /**
     * Renvoie les données concernant un client
     * @param id {number} identifiant du client
     */
    client: function(state) {
        return function(id) {
            return state.clients.find(c => c.id === id);
        };
    },

    getLocalClient: function(state) {
        return state.localClient;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (getters);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_chat_window_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_63010646_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_chat_window_vue__ = __webpack_require__(15);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(8)
}
var normalizeComponent = __webpack_require__(13)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-63010646"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_chat_window_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_63010646_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_chat_window_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "public/scripts/src/components/chat-window.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-63010646", Component.options)
  } else {
    hotAPI.reload("data-v-63010646", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(11)("91840a9e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-63010646\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./chat-window.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-63010646\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./chat-window.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(undefined);
// imports


// module
exports.push([module.i, "\n.main-window[data-v-63010646] {\n    font-size: 10px;\n    width: 40em;\n    background-color: rgba(0, 0, 0, 0.2);\n    border: solid thin black;\n}\n.main-window > div[data-v-63010646] {\n    background-color: rgba(0, 0, 0, 0.2);\n    border: solid thin black;\n}\n.console[data-v-63010646] {\n    background-color: rgba(0, 0, 0, 0.666);\n}\ninput[data-v-63010646] {\n    background-color: rgba(0, 0, 0, 0.2);\n    color: white;\n    border: solid thin black;\n}\n.console[data-v-63010646] {\n    max-height: 14em;\n    height: 14em;\n    overflow-y: auto;\n}\n", ""]);

// exports


/***/ }),
/* 10 */
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
/* 11 */
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

var listToStyles = __webpack_require__(12)

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

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

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
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

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
/* 12 */
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
/* 13 */
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
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__chat_line_vue__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__chat_channels_vue__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__store_mutation_types__ = __webpack_require__(0);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({
    name: "chat-window",
    components: {
        ChatChannels: __WEBPACK_IMPORTED_MODULE_1__chat_channels_vue__["a" /* default */],
        ChatLine: __WEBPACK_IMPORTED_MODULE_0__chat_line_vue__["a" /* default */],
    },
    data: function() {
        return {
            inputText: '',
            pleaseScrollDown: true,
        };
    },
    computed: {
        consoleContent: function() {
            return this.$store.getters.chatContent;
        }
    },
    methods: {

        /**
         * Si le canal qu'on consulte actuellement recoit un nouveau message
         * on doit l'afficher en scrollant jusqu'en bas
         * @param idTab
         */
        doScrollDown: function(idTab) {
            if (idTab === this.$store.state.chat.activeTab.id) {
                this.pleaseScrollDown = true;
            }
        },

    },

    updated: function() {
        if (this.pleaseScrollDown) {
            this.pleaseScrollDown = false;
            this.$refs.lastItem.scrollIntoView();
        }
    },

    mounted: function() {
        this.$refs.channels.$on('select', (function(item) {
            this.$store.dispatch(__WEBPACK_IMPORTED_MODULE_2__store_mutation_types__["c" /* CHAT_SELECT_TAB */], {id: item.id})
            this.doScrollDown(item.id);
        }).bind(this));
        this.$refs.formInput.addEventListener('submit', event => event.preventDefault());
        // temporaire
        this.$refs.input.addEventListener('keypress', (function(event) {
            switch (event.key) {
                case 'Enter':
                    this.$emit('send-message', this.inputText);
                    this.inputText = '';
                    break;

                case 'Escape':
                    this.inputText = '';
                    break;
            }
        }).bind(this));
    }
});


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "main-window" }, [
    _c("div", { staticClass: "row" }, [
      _c(
        "div",
        { staticClass: "col lg-12" },
        [_c("chat-channels", { ref: "channels" })],
        1
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "row" }, [
      _c("div", { staticClass: "col lg-12" }, [
        _c(
          "div",
          { staticClass: "console" },
          [
            _vm._l(_vm.consoleContent, function(line) {
              return _c("chat-line", {
                key: line.id,
                attrs: {
                  "def-user": line.user,
                  "def-color": line.color,
                  "def-message": line.message
                }
              })
            }),
            _vm._v(" "),
            _c("br", { ref: "lastItem" })
          ],
          2
        )
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "row" }, [
      _c("div", { staticClass: "col lg-12 input" }, [
        _c("form", { ref: "formInput" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.inputText,
                expression: "inputText"
              }
            ],
            ref: "input",
            attrs: { type: "text" },
            domProps: { value: _vm.inputText },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.inputText = $event.target.value
              }
            }
          })
        ])
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-63010646", esExports)
  }
}

/***/ }),
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_chat_line_vue__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_186b0fca_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_chat_line_vue__ = __webpack_require__(27);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(24)
}
var normalizeComponent = __webpack_require__(13)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-186b0fca"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_chat_line_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_186b0fca_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_chat_line_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "public/scripts/src/components/chat-line.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-186b0fca", Component.options)
  } else {
    hotAPI.reload("data-v-186b0fca", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(11)("a8787364", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-186b0fca\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./chat-line.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-186b0fca\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./chat-line.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(undefined);
// imports


// module
exports.push([module.i, "\n.user-name[data-v-186b0fca] {\n    font-weight: bold;\n}\nspan[data-v-186b0fca] {\n    text-shadow: 1px 1px 0 #000;\n}\n.color-0[data-v-186b0fca] {\n    color: #cccccc;\n}\n.color-1[data-v-186b0fca] {\n    color: #5cff4e;\n}\n.color-2[data-v-186b0fca] {\n    color: #ff646b;\n}\n.color-3[data-v-186b0fca] {\n    color: #fff967;\n}\n.color-4[data-v-186b0fca] {\n    color: #ff63fa;\n}\n.color-5[data-v-186b0fca] {\n    color: #62f8ff;\n}\n.color-6[data-v-186b0fca] {\n    color: #9a9ce4;\n}\n\n", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    name: "chat-line",
    props: ['defUser', 'defColor', 'defMessage'],
    data: function() {
        return {
            user: this.defUser,
            color: this.defColor,
            message: this.defMessage
        }
    }
});


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _vm.user
      ? _c("span", { class: "user-name color-" + _vm.color }, [
          _vm._v(_vm._s(_vm.user) + " : ")
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.message
      ? _c("span", { class: "message color-" + _vm.color }, [
          !_vm.user
            ? _c("i", [_vm._v(_vm._s(_vm.message))])
            : _c("span", [_vm._v(_vm._s(_vm.message))])
        ])
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-186b0fca", esExports)
  }
}

/***/ }),
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const STRINGS = {
    fr: {
        chat: {
            tabs: {
                system: 'Système',
                global: 'Global',
                mission: 'Mission'
            }
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (STRINGS.fr);

/***/ }),
/* 33 */,
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_chat_channels_vue__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_247566a6_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_chat_channels_vue__ = __webpack_require__(38);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(35)
}
var normalizeComponent = __webpack_require__(13)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-247566a6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_chat_channels_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_247566a6_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_chat_channels_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "public/scripts/src/components/chat-channels.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-247566a6", Component.options)
  } else {
    hotAPI.reload("data-v-247566a6", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(36);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(11)("419e9960", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-247566a6\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./chat-channels.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-247566a6\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./chat-channels.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(undefined);
// imports


// module
exports.push([module.i, "\nbutton[data-v-247566a6] {\n    border: solid 2px transparent;\n}\nbutton.selected[data-v-247566a6] {\n    border-color: black\n}\nbutton.notify[data-v-247566a6] {\n    background-color: #080;\n}\n", ""]);

// exports


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_strings__ = __webpack_require__(32);
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
    name: "links",
    computed: {
        getTabList: function() {
            return this.$store.state.chat.tabs;
        },

        getActiveTab: function() {
            return this.$store.state.chat.activeTab;
        }
    },
    methods: {
    	add: function(id, sCaption) {
    		if (this.find(id)) {
    			throw new Error('tab id #' + id + ' is already defined');
            }
    		this.items.push({
                id: id,
                caption: __WEBPACK_IMPORTED_MODULE_0__data_strings__["a" /* default */].chat.tabs[sCaption],
                selected: false,
                notified: false
            });
        },

        find: function(id) {
    		return this.items.find(i => i.id === id);
        },

        select: function(id, bSelected = true) {
    	    this.items.forEach(t => t.selected = false);
    	    let oTab = this.find(id);
    	    oTab.selected = bSelected;
    	    oTab.notified = false;
        },

        clickHandler: function(item) {
            this.$emit('select', item);
        }
    }
});


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("nav", [
    _c(
      "ul",
      _vm._l(_vm.getTabList, function(item) {
        return _c("li", [
          _c(
            "button",
            {
              key: item.id,
              class:
                (item.id === _vm.getActiveTab.id ? "selected" : "") +
                " " +
                (item.notified ? "notify" : ""),
              attrs: { type: "button" },
              on: {
                click: function($event) {
                  _vm.clickHandler(item)
                }
              }
            },
            [_vm._v(_vm._s(item.caption) + "\n            ")]
          )
        ])
      })
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-247566a6", esExports)
  }
}

/***/ })
/******/ ]);