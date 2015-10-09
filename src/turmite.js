import TuringMachine from './turing-machine.js'
import { mod } from './util.js'
import Specifier from './specifier.js'

let Dir = { N: 0, E: 1, S: 2, W: 3 }
let Turn = { N: 1, R: 2, U: 4, L: 8 }

export default class Turmite extends TuringMachine {
	constructor(x, y, spec) {
		super()
		this.x = x
		this.y = y
		// Directions: 0 = North, 1 = East, 2 = South, 3 = West
		// Turns: 1 = forward, 2 = right, 4 = back, 8 = left
		this.dir = 0
		// Transition table: rows correspond to internal states,
		// columns correspond to external states
		this.transitions = null
		this.setSpecies(spec)
	}

	setSpecies(spec) {
		this._specifier = spec
		this.transitions = Specifier.parse(this._specifier)
	}

	getTransition() {
		let s = this.state
		let c = this.tape.read(this.x, this.y)
		return this.transitions[s][c]
	}

	step() {
		let t = this.getTransition()

		// Turn
		switch (t.turn) {
			case Turn.N: this.dir = mod(this.dir + 0, 4); break
			case Turn.R: this.dir = mod(this.dir + 1, 4); break
			case Turn.U: this.dir = mod(this.dir + 2, 4); break
			case Turn.L: this.dir = mod(this.dir + 3, 4); break
		}

		// Write
		this.tape.write(this.x, this.y, t.write)
		
		// Move
		switch (this.dir) {
			case Dir.N: this.y = mod(this.y - 1, this.tape.height); break
			case Dir.E: this.x = mod(this.x + 1, this.tape.width); break
			case Dir.S: this.y = mod(this.y + 1, this.tape.height); break
			case Dir.W: this.x = mod(this.x - 1, this.tape.width); break
		}

		// Update state
		this.state = t.next
	}
}
