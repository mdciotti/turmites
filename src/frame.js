import { Tape2D } from './tape.js'
import Turmite from './turmite.js'

// Generate frame for provided species
onmessage = function (e) {
	// if (e.data === '')
	let species = e.data
	console.log(`Generating frame at step ${species.frame} for species ${species.name}`)

	let tape = new Tape2D(128, 128)
	let turmite = new Turmite(64, 64, species.specifier)
	turmite.tape = tape

	for (let i = 0; i <= species.frame; i++) turmite.step()

	postMessage(tape)
}
