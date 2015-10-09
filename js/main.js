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
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _CA2DJs = __webpack_require__(/*! ./CA2D.js */ 5);
	
	var _CA2DJs2 = _interopRequireDefault(_CA2DJs);
	
	var _turmiteJs = __webpack_require__(/*! ./turmite.js */ 2);
	
	var _turmiteJs2 = _interopRequireDefault(_turmiteJs);
	
	var sim = undefined;
	var species = undefined;
	var currentSpecies = undefined;
	
	function setCurrentSpecies(spec) {
		currentSpecies = spec;
		$('#t-name').val(spec.name);
		$('#t-description').val(spec.description);
		$('#t-author').val(spec.author);
		$('#t-specifier').val(spec.specifier);
		$('#t-frame').val(spec.frame);
	}
	
	function renderSpeciesPreview(spec) {
		var $preview = $('#preview');
		var $item = $('<div />', { 'class': 'item', title: spec.name });
		// let $title = document.createElement('h3')
		// $title.textContent = spec.name
		$preview.append($item);
		var preview = new _CA2DJs2['default'](128, 128, 1);
		$item.append(preview.canvas);
		var frameGenerator = new Worker("js/frame.js");
		preview.on('click', function () {
			return setCurrentSpecies(spec);
		});
	
		frameGenerator.onmessage = function (e) {
			// console.log(e.timestamp)
			$item.addClass('loaded');
			preview.tape = e.data;
			preview.draw();
			frameGenerator.terminate();
		};
		frameGenerator.postMessage(spec);
	}
	
	function setTransitionTable() {
		var n_states = parseInt($('#t-states').val(), 10);
		var n_colors = parseInt($('#t-colors').val(), 10);
		var $table = $('#transition');
		$table.children().remove();
	
		for (var r = 0; r < n_states; r++) {
			var $row = $('<tr>');
			for (var c = 0; c < n_colors; c++) {
				var $cell = $('<td>');
				$('<input>', { 'class': 'write', value: 0, type: 'number', min: 0, max: n_colors - 1, step: 1 }).appendTo($cell);
				var $turn = $('<select>', { 'class': 'turn', value: 1 });
				$('<option>', { value: 1, text: 'N' }).appendTo($turn);
				$('<option>', { value: 2, text: 'R' }).appendTo($turn);
				$('<option>', { value: 4, text: 'U' }).appendTo($turn);
				$('<option>', { value: 8, text: 'L' }).appendTo($turn);
				$turn.appendTo($cell);
				$('<input>', { 'class': 'next', value: 0, type: 'number', min: 0, max: n_states - 1, step: 1 }).appendTo($cell);
				$row.append($cell);
			}
			$table.append($row);
		}
	}
	
	function updateSpecifier() {
		var $table = $('#transition');
		var specifier = '{';
	
		$table.children().each(function (r, row) {
			// $(row).hasClass('')
			specifier += r === 0 ? '{' : ', {';
			$(row).children().each(function (c, cell) {
				var $cell = $(cell);
				specifier += c === 0 ? '{' : ', {';
				specifier += parseInt($cell.children('.write').val(), 10) + ', ';
				specifier += parseInt($cell.children('.turn').val(), 10) + ', ';
				specifier += parseInt($cell.children('.next').val(), 10) + '}';
			});
			specifier += '}';
		});
		specifier += '}';
		$('#t-specifier').val(specifier);
	}
	
	function genRandomTransitionTable() {
		var n_states = parseInt($('#t-states').val(), 10);
		var n_colors = parseInt($('#t-colors').val(), 10);
	
		console.log('randomize!');
	}
	
	function main() {
		var $sim = $('#sim');
		sim = new _CA2DJs2['default'](128, 128, 4);
		$sim.append(sim.canvas);
		sim.fps = 20;
		sim.start();
	
		setCurrentSpecies(species[0]);
	
		$('#fps').val(sim.fps);
	
		$('#clear').on('click', function () {
			sim.clear();
			sim.draw();
		});
		$('#pause').on('click', function () {
			sim.pause();
			$('#play').removeAttr('disabled');
			$('#pause').attr('disabled', true);
			$('#step').removeAttr('disabled');
			$('#jump').removeAttr('disabled');
		});
		$('#play').on('click', function () {
			sim.resume();
			$('#pause').removeAttr('disabled');
			$('#play').attr('disabled', true);
			$('#step').attr('disabled', true);
			$('#jump').attr('disabled', true);
		});
		$('#stop').on('click', function () {
			sim.stop();
			$('#pause').attr('disabled', true);
			$('#play').attr('disabled', true);
			$('#step').attr('disabled', true);
			$('#jump').attr('disabled', true);
			$('#stop').attr('disabled', true);
			$('#start').removeAttr('disabled');
		});
		$('#start').on('click', function () {
			sim.start();
			$('#pause').removeAttr('disabled');
			$('#play').attr('disabled', true);
			$('#step').attr('disabled', true);
			$('#jump').attr('disabled', true);
			$('#start').attr('disabled', true);
			$('#stop').removeAttr('disabled');
		});
		$('#step').on('click', function () {
			sim.step();
			sim.draw();
		});
		$('#jump').on('click', function () {
			for (var i = 0; i < 100; i++) {
				sim.step();
			}sim.draw();
		});
		$('#fps').on('change', function (e) {
			sim.fps = parseInt($('#fps').val(), 10);
		});
	
		$('#t-states').on('change', setTransitionTable);
		$('#t-colors').on('change', setTransitionTable);
	
		$('#transition').on('change', 'input, select', updateSpecifier);
		$('#randomize').on('click', genRandomTransitionTable);
	
		sim.on('step', function () {
			$('#frame').val(sim.frame);
		});
	
		sim.on('click', function (x, y) {
			var specifier = $('#t-specifier').val();
			sim.add(new _turmiteJs2['default'](x, y, specifier));
			if (sim.paused) sim.draw();
		});
	
		species.forEach(renderSpeciesPreview);
	}
	
	window.addEventListener('load', function () {
		$.getJSON('data/species.json', function (data) {
			species = data;
			main();
		});
	});
	
	window.addEventListener('keyup', function (e) {
		switch (e.keyCode || e.which) {
			case 27:
				sim.stop();break;
			case 32:
				sim.toggle();break;
		}
	});

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
/* 5 */
/*!*********************!*\
  !*** ./src/CA2D.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _tapeJs = __webpack_require__(/*! ./tape.js */ 1);
	
	var _utilJs = __webpack_require__(/*! ./util.js */ 4);
	
	var CA2D = (function () {
		function CA2D() {
			var w = arguments.length <= 0 || arguments[0] === undefined ? 128 : arguments[0];
	
			var _this = this;
	
			var h = arguments.length <= 1 || arguments[1] === undefined ? 128 : arguments[1];
			var s = arguments.length <= 2 || arguments[2] === undefined ? 3 : arguments[2];
	
			_classCallCheck(this, CA2D);
	
			this.tape = new _tapeJs.Tape2D(w, h);
			this.automata = [];
			// this.add(new Turmite(64, 64))
			this.fps = 20;
			this._scale = s;
			// this.colors = [
			// 	{ r: 16, g: 16, b: 16, a: 255 },
			// 	{ r: 200, g: 200, b: 200, a: 255 }
			// ]
			this.color1 = { r: 16, g: 16, b: 16, a: 255 };
			this.color2 = { r: 200, g: 200, b: 200, a: 255 };
			this.colors = 2;
	
			this.frame = 0;
			this.animator = null;
			this.canvas = document.createElement('canvas');
			this.ctx = this.canvas.getContext('2d');
			this.canvas.width = this.tape.width;
			this.canvas.height = this.tape.height;
			this.ctx.imageSmoothingEnabled = false;
			this.canvas.style.imageRendering = 'crisp-edges';
			this.canvas.style.imageRendering = 'pixelated';
			this.scale = this._scale;
	
			this.onclick = function (x, y) {};
	
			this.canvas.addEventListener('click', function (e) {
				var x = Math.floor((e.clientX - _this.canvas.offsetLeft) / _this._scale);
				var y = Math.floor((e.clientY - _this.canvas.offsetTop) / _this._scale);
				_this.dispatch('click', [x, y]);
			});
	
			this.events = {};
			this.dispatch('create');
		}
	
		_createClass(CA2D, [{
			key: 'add',
			value: function add(t) {
				if (this.dispatch('add')) return;
				t.tape = this.tape;
				this.automata.push(t);
				this.colors = Math.max(this.colors, t.transitions[0].length);
			}
		}, {
			key: 'getImageData',
			value: function getImageData() {
				var pixel = new ImageData(this.tape.width, this.tape.height);
	
				for (var i = 0, j = 0, n = this.tape.width * this.tape.height; i < n; i++) {
					var t = this.tape.data[i] / (this.colors - 1);
					pixel.data[j++] = Math.floor((0, _utilJs.lerp)(this.color1.r, this.color2.r, t));
					pixel.data[j++] = Math.floor((0, _utilJs.lerp)(this.color1.g, this.color2.g, t));
					pixel.data[j++] = Math.floor((0, _utilJs.lerp)(this.color1.b, this.color2.b, t));
					pixel.data[j++] = Math.floor((0, _utilJs.lerp)(this.color1.a, this.color2.a, t));
				}
	
				return pixel;
			}
		}, {
			key: 'draw',
			value: function draw() {
				if (this.dispatch('draw')) return;
				var pixels = this.getImageData();
	
				// Paint automata red
				for (var t = 0; t < this.automata.length; t++) {
					var turmite = this.automata[t];
					var i = turmite.y * this.tape.width * 4 + turmite.x * 4;
					pixels.data[i] = 255;
					pixels.data[i + 1] = 0;
					pixels.data[i + 2] = 0;
					pixels.data[i + 3] = 255;
				}
	
				// Draw pixels to canvas
				this.ctx.putImageData(pixels, 0, 0);
			}
		}, {
			key: 'clear',
			value: function clear() {
				if (this.dispatch('clear')) return;
				var w = this.tape.width;
				var h = this.tape.height;
				this.tape = new _tapeJs.Tape2D(w, h);
	
				for (var t = 0; t < this.automata.length; t++) {
					this.automata[t].tape = this.tape;
				}
			}
		}, {
			key: 'step',
			value: function step() {
				if (this.dispatch('step')) return;
				for (var t = 0; t < this.automata.length; t++) {
					this.automata[t].step();
				}
				this.dispatch('step');
				++this.frame;
			}
		}, {
			key: 'loop',
			value: function loop() {
				this.animator = setTimeout(this.loop.bind(this), 1000 / this.fps);
				this.step();
				this.draw();
			}
		}, {
			key: 'pause',
			value: function pause() {
				if (this.dispatch('pause')) return;
				clearTimeout(this.animator);
				this.animator = null;
			}
		}, {
			key: 'resume',
			value: function resume() {
				if (this.dispatch('resume')) return;
				this.loop();
			}
		}, {
			key: 'stop',
			value: function stop() {
				if (this.dispatch('stop')) return;
				this.pause();
				this.automata.length = 0;
				this.colors = 2;
				this.draw();
			}
		}, {
			key: 'start',
			value: function start() {
				if (this.dispatch('start')) return;
				this.frame = 0;
				this.resume();
			}
		}, {
			key: 'toggle',
			value: function toggle() {
				if (this.paused) this.resume();else this.pause();
			}
		}, {
			key: 'on',
			value: function on(e, fn) {
				var key = Symbol();
				if (!this.events.hasOwnProperty(e)) {
					this.events[e] = new Map();
				}
				this.events[e].set(key, fn);
				return key;
			}
		}, {
			key: 'dispatch',
			value: function dispatch(e, args) {
				var _this2 = this;
	
				var cancel = false;
				if (this.events.hasOwnProperty(e)) {
					var listeners = Array.from(this.events[e].values());
					cancel = listeners.reduce(function (prev, fn) {
						return prev || fn.apply(_this2, args);
					}, cancel);
				}
				return cancel;
			}
		}, {
			key: 'scale',
			set: function set(s) {
				// this._scale = s
				this.canvas.style.width = s * this.tape.width + 'px';
				this.canvas.style.height = s * this.tape.height + 'px';
			}
		}, {
			key: 'paused',
			get: function get() {
				return this.animator === null;
			}
		}]);
	
		return CA2D;
	})();
	
	exports['default'] = CA2D;
	module.exports = exports['default'];

/***/ },
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
//# sourceMappingURL=main.js.map