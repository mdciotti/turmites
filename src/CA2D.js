import { Tape2D } from './tape.js'
import { lerp } from './util.js'

export default class CA2D {
	constructor(w = 128, h = 128, s = 3) {
		this.tape = new Tape2D(w, h)
		this.automata = []
		// this.add(new Turmite(64, 64))
		this.fps = 20
		this._scale = s
		// this.colors = [
		// 	{ r: 16, g: 16, b: 16, a: 255 },
		// 	{ r: 200, g: 200, b: 200, a: 255 }
		// ]
		this.color1 = { r: 16, g: 16, b: 16, a: 255 }
		this.color2 = { r: 200, g: 200, b: 200, a: 255 }
		this.colors = 2

		this.frame = 0
		this.animator = null
		this.canvas = document.createElement('canvas')
		this.ctx = this.canvas.getContext('2d')
		this.canvas.width = this.tape.width
		this.canvas.height = this.tape.height
		this.ctx.imageSmoothingEnabled = false
		this.canvas.style.imageRendering = 'crisp-edges';
		this.canvas.style.imageRendering = 'pixelated';
		this.scale = this._scale

		this.onclick = function (x, y) {}

		this.canvas.addEventListener('click', e => {
			let x = Math.floor((e.clientX - this.canvas.offsetLeft) / this._scale)
			let y = Math.floor((e.clientY - this.canvas.offsetTop) / this._scale)
			this.dispatch('click', [x, y])
		})

		this.events = {}
		this.dispatch('create')
	}

	set scale(s) {
		// this._scale = s
		this.canvas.style.width = `${s * this.tape.width}px`
		this.canvas.style.height = `${s * this.tape.height}px`
	}

	get paused() { return this.animator === null }

	add(t) {
		if (this.dispatch('add')) return
		t.tape = this.tape
		this.automata.push(t)
		this.colors = Math.max(this.colors, t.transitions[0].length)
	}

	getImageData() {
		let pixel = new ImageData(this.tape.width, this.tape.height)

		for (let i = 0, j = 0, n = this.tape.width * this.tape.height; i < n; i++) {
			let t = this.tape.data[i] / (this.colors - 1)
			pixel.data[j++] = Math.floor(lerp(this.color1.r, this.color2.r, t))
			pixel.data[j++] = Math.floor(lerp(this.color1.g, this.color2.g, t))
			pixel.data[j++] = Math.floor(lerp(this.color1.b, this.color2.b, t))
			pixel.data[j++] = Math.floor(lerp(this.color1.a, this.color2.a, t))
		}

		return pixel
	}

	draw() {
		if (this.dispatch('draw')) return
		let pixels = this.getImageData()

		// Paint automata red
		for (let t = 0; t < this.automata.length; t++) {
			let turmite = this.automata[t]
			let i = turmite.y * this.tape.width * 4 + turmite.x * 4
			pixels.data[i] = 255
			pixels.data[i+1] = 0
			pixels.data[i+2] = 0
			pixels.data[i+3] = 255
		}

		// Draw pixels to canvas
		this.ctx.putImageData(pixels, 0, 0)
	}

	clear() {
		if (this.dispatch('clear')) return
		let w = this.tape.width
		let h = this.tape.height
		this.tape = new Tape2D(w, h)

		for (let t = 0; t < this.automata.length; t++) {
			this.automata[t].tape = this.tape
		}
	}

	step() {
		if (this.dispatch('step')) return
		for (let t = 0; t < this.automata.length; t++) {
			this.automata[t].step()
		}
		this.dispatch('step')
		++this.frame
	}

	loop() {
		this.animator = setTimeout(this.loop.bind(this), 1000 / this.fps)
		this.step()
		this.draw()
	}

	pause() {
		if (this.dispatch('pause')) return
		clearTimeout(this.animator)
		this.animator = null
	}

	resume() {
		if (this.dispatch('resume')) return
		this.loop()
	}

	stop() {
		if (this.dispatch('stop')) return
		this.pause()
		this.automata.length = 0
		this.colors = 2
		this.draw()
	}

	start() {
		if (this.dispatch('start')) return
		this.frame = 0
		this.resume()
	}

	toggle() {
		if (this.paused) this.resume()
		else this.pause()
	}

	on(e, fn) {
		let key = Symbol()
		if (!this.events.hasOwnProperty(e)) {
			this.events[e] = new Map()
		}
		this.events[e].set(key, fn)
		return key
	}

	dispatch(e, args) {
		let cancel = false
		if (this.events.hasOwnProperty(e)) {
			let listeners = Array.from(this.events[e].values())
			cancel = listeners.reduce((prev, fn) => { return prev || fn.apply(this, args) }, cancel)
		}
		return cancel
	}
}
