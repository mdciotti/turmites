/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/frame.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _tapeJs = __webpack_require__(/*! ./tape.js */ 1);
	
	var _turmiteJs = __webpack_require__(/*! ./turmite.js */ 2);
	
	var _turmiteJs2 = _interopRequireDefault(_turmiteJs);
	
	// Generate frame for provided species
	onmessage = function (e) {
		// if (e.data === '')
		var species = e.data;
		console.log('Generating frame at step ' + species.frame + ' for species ' + species.name);
	
		var tape = new _tapeJs.Tape2D(128, 128);
		var turmite = new _turmiteJs2['default'](64, 64, species.specifier);
		turmite.tape = tape;
	
		for (var i = 0; i <= species.frame; i++) {
			turmite.step();
		}postMessage(tape);
	};

/***/ },
/* 1 */
/*!*********************!*\
  !*** ./src/tape.js ***!
  \*********************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Tape = (function () {
		function Tape(len) {
			_classCallCheck(this, Tape);
	
			this.length = len;
			this.data = new Int8Array(len);
		}
	
		_createClass(Tape, [{
			key: "read",
			value: function read(i) {
				return this.data[i];
			}
		}, {
			key: "write",
			value: function write(i, v) {
				this.data[i] = v;
			}
		}]);
	
		return Tape;
	})();
	
	exports.Tape = Tape;
	
	var Tape2D = (function (_Tape) {
		_inherits(Tape2D, _Tape);
	
		function Tape2D(w, h) {
			_classCallCheck(this, Tape2D);
	
			_get(Object.getPrototypeOf(Tape2D.prototype), "constructor", this).call(this, w * h);
			this.width = w;
			this.height = h;
	
			for (var i = 0, n = this.width * this.height; i < n; i++) {
				this.data[i] = 0;
			}
		}
	
		_createClass(Tape2D, [{
			key: "read",
			value: function read(x, y) {
				return this.data[y * this.width + x];
			}
		}, {
			key: "write",
			value: function write(x, y, v) {
				this.data[y * this.width + x] = v;
			}
		}]);
	
		return Tape2D;
	})(Tape);
	
	exports.Tape2D = Tape2D;

/***/ },
/* 2 */
/*!************************!*\
  !*** ./src/turmite.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _turingMachineJs = __webpack_require__(/*! ./turing-machine.js */ 3);
	
	var _turingMachineJs2 = _interopRequireDefault(_turingMachineJs);
	
	var _utilJs = __webpack_require__(/*! ./util.js */ 4);
	
	var _specifierJs = __webpack_require__(/*! ./specifier.js */ 6);
	
	var _specifierJs2 = _interopRequireDefault(_specifierJs);
	
	var Dir = { N: 0, E: 1, S: 2, W: 3 };
	var Turn = { N: 1, R: 2, U: 4, L: 8 };
	
	var Turmite = (function (_TuringMachine) {
		_inherits(Turmite, _TuringMachine);
	
		function Turmite(x, y, spec) {
			_classCallCheck(this, Turmite);
	
			_get(Object.getPrototypeOf(Turmite.prototype), 'constructor', this).call(this);
			this.x = x;
			this.y = y;
			// Directions: 0 = North, 1 = East, 2 = South, 3 = West
			// Turns: 1 = forward, 2 = right, 4 = back, 8 = left
			this.dir = 0;
			// Transition table: rows correspond to internal states,
			// columns correspond to external states
			this.transitions = null;
			this.setSpecies(spec);
		}
	
		_createClass(Turmite, [{
			key: 'setSpecies',
			value: function setSpecies(spec) {
				this._specifier = spec;
				this.transitions = _specifierJs2['default'].parse(this._specifier);
			}
		}, {
			key: 'getTransition',
			value: function getTransition() {
				var s = this.state;
				var c = this.tape.read(this.x, this.y);
				return this.transitions[s][c];
			}
		}, {
			key: 'step',
			value: function step() {
				var t = this.getTransition();
	
				// Turn
				switch (t.turn) {
					case Turn.N:
						this.dir = (0, _utilJs.mod)(this.dir + 0, 4);break;
					case Turn.R:
						this.dir = (0, _utilJs.mod)(this.dir + 1, 4);break;
					case Turn.U:
						this.dir = (0, _utilJs.mod)(this.dir + 2, 4);break;
					case Turn.L:
						this.dir = (0, _utilJs.mod)(this.dir + 3, 4);break;
				}
	
				// Write
				this.tape.write(this.x, this.y, t.write);
	
				// Move
				switch (this.dir) {
					case Dir.N:
						this.y = (0, _utilJs.mod)(this.y - 1, this.tape.height);break;
					case Dir.E:
						this.x = (0, _utilJs.mod)(this.x + 1, this.tape.width);break;
					case Dir.S:
						this.y = (0, _utilJs.mod)(this.y + 1, this.tape.height);break;
					case Dir.W:
						this.x = (0, _utilJs.mod)(this.x - 1, this.tape.width);break;
				}
	
				// Update state
				this.state = t.next;
			}
		}]);
	
		return Turmite;
	})(_turingMachineJs2['default']);
	
	exports['default'] = Turmite;
	module.exports = exports['default'];

/***/ },
/* 3 */
/*!*******************************!*\
  !*** ./src/turing-machine.js ***!
  \*******************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TuringMachine = function TuringMachine() {
		_classCallCheck(this, TuringMachine);
	
		this.position = 0;
		this.state = 0;
		this.tape = null;
		this.transitions = [[{ next: 1 }, { next: 0 }], [{ next: 0 }, { next: 1 }]];
	};
	
	exports["default"] = TuringMachine;
	module.exports = exports["default"];

/***/ },
/* 4 */
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.mod = mod;
	exports.lerp = lerp;
	
	function mod(a, n) {
		return a - n * Math.floor(a / n);
	}
	
	function lerp(a, b, t) {
		return t * (b - a) + a;
	}

/***/ },
/* 5 */,
/* 6 */
/*!**************************!*\
  !*** ./src/specifier.js ***!
  \**************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var Specifier = (function () {
		function Specifier() {
			_classCallCheck(this, Specifier);
		}
	
		_createClass(Specifier, null, [{
			key: 'parse',
			value: function parse(spec) {
				var tmp = spec.replace(/\s/g, '');
				var stack = [];
				var cur = null;
				var prev = null;
				var j = 0;
	
				for (var i = 0; i < tmp.length; i++) {
					var tok = tmp.charAt(i);
					switch (tok) {
						case '{':
							var l = stack.push(cur);
							if (l < 3) cur = [];else cur = {};
							j = 0;
							break;
						case '}':
							prev = cur;
							cur = stack.pop();
							if (cur === null) return prev;
							cur.push(prev);
							break;
						case '0':
						case '1':
						case '2':
						case '3':
						case '4':
						case '5':
						case '6':
						case '7':
						case '8':
						case '9':
							if (j === 0) cur.write = parseInt(tok);else if (j === 1) cur.turn = parseInt(tok);else if (j === 2) cur.next = parseInt(tok);
							++j;
							break;
					}
				}
			}
		}, {
			key: 'stringify',
			value: function stringify(transitions) {
				var specifier = '{';
	
				for (var r = 0; r < transitions.length; r++) {
					var row = transitions[r];
					specifier += r === 0 ? '{' : ', {';
	
					for (var c = 0; c < row.length; c++) {
						var cell = row[c];
						specifier += c === 0 ? '{' : ', {';
						specifier += cell.write + ', ';
						specifier += cell.turn + ', ';
						specifier += cell.next + '}';
					}
					specifier += '}';
				}
				specifier += '}';
	
				return specifier;
			}
		}]);
	
		return Specifier;
	})();
	
	exports['default'] = Specifier;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=frame.js.map