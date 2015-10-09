import CA2D from './CA2D.js'
import Turmite from './turmite.js'

let sim
let species
let currentSpecies

function setCurrentSpecies(spec) {
	currentSpecies = spec
	$('#t-name').val(spec.name)
	$('#t-description').val(spec.description)
	$('#t-author').val(spec.author)
	$('#t-specifier').val(spec.specifier)
	$('#t-frame').val(spec.frame)
}

function renderSpeciesPreview(spec) {
	let $preview = $('#preview')
	let $item = $('<div />', { class: 'item', title: spec.name })
	// let $title = document.createElement('h3')
	// $title.textContent = spec.name
	$preview.append($item)
	let preview = new CA2D(128, 128, 1)
	$item.append(preview.canvas)
	let frameGenerator = new Worker("js/frame.js")
	preview.on('click', () => setCurrentSpecies(spec))

	frameGenerator.onmessage = function (e) {
		// console.log(e.timestamp)
		$item.addClass('loaded')
		preview.tape = e.data
		preview.draw()
		frameGenerator.terminate()
	}
	frameGenerator.postMessage(spec)
}

function setTransitionTable() {
	let n_states = parseInt($('#t-states').val(), 10)
	let n_colors = parseInt($('#t-colors').val(), 10)
	let $table = $('#transition')
	$table.children().remove()

	for (let r = 0; r < n_states; r++) {
		let $row = $('<tr>')
		for (let c = 0; c < n_colors; c++) {
			let $cell = $('<td>')
			$('<input>', { class: 'write', value: 0, type: 'number', min: 0, max: n_colors - 1, step: 1 }).appendTo($cell)
			let $turn = $('<select>', { class: 'turn', value: 1 })
			$('<option>', { value: 1, text: 'N' }).appendTo($turn)
			$('<option>', { value: 2, text: 'R' }).appendTo($turn)
			$('<option>', { value: 4, text: 'U' }).appendTo($turn)
			$('<option>', { value: 8, text: 'L' }).appendTo($turn)
			$turn.appendTo($cell)
			$('<input>', { class: 'next', value: 0, type: 'number', min: 0, max: n_states - 1, step: 1 }).appendTo($cell)
			$row.append($cell)
		}
		$table.append($row)
	}
}

function updateSpecifier() {
	let $table = $('#transition')
	let specifier = '{'

	$table.children().each((r, row) => {
		// $(row).hasClass('')
		specifier += (r === 0) ? '{' : ', {'
		$(row).children().each((c, cell) => {
			let $cell = $(cell)
			specifier += (c === 0) ? '{' : ', {'
			specifier += parseInt($cell.children('.write').val(), 10) + ', '
			specifier += parseInt($cell.children('.turn').val(), 10) + ', '
			specifier += parseInt($cell.children('.next').val(), 10) + '}'
		})
		specifier += '}'
	})
	specifier += '}'
	$('#t-specifier').val(specifier)
}

function genRandomTransitionTable() {
	let n_states = parseInt($('#t-states').val(), 10)
	let n_colors = parseInt($('#t-colors').val(), 10)

	console.log('randomize!')
}

function main() {
	let $sim = $('#sim')
	sim = new CA2D(128, 128, 4)
	$sim.append(sim.canvas)
	sim.fps = 20
	sim.start()

	setCurrentSpecies(species[0])

	$('#fps').val(sim.fps)

	$('#clear').on('click', () => {
		sim.clear()
		sim.draw()
	})
	$('#pause').on('click', () => {
		sim.pause()
		$('#play').removeAttr('disabled')
		$('#pause').attr('disabled', true)
		$('#step').removeAttr('disabled')
		$('#jump').removeAttr('disabled')
	})
	$('#play').on('click', () => {
		sim.resume()
		$('#pause').removeAttr('disabled')
		$('#play').attr('disabled', true)
		$('#step').attr('disabled', true)
		$('#jump').attr('disabled', true)
	})
	$('#stop').on('click', () => {
		sim.stop()
		$('#pause').attr('disabled', true)
		$('#play').attr('disabled', true)
		$('#step').attr('disabled', true)
		$('#jump').attr('disabled', true)
		$('#stop').attr('disabled', true)
		$('#start').removeAttr('disabled')
	})
	$('#start').on('click', () => {
		sim.start()
		$('#pause').removeAttr('disabled')
		$('#play').attr('disabled', true)
		$('#step').attr('disabled', true)
		$('#jump').attr('disabled', true)
		$('#start').attr('disabled', true)
		$('#stop').removeAttr('disabled')
	})
	$('#step').on('click', () => {
		sim.step()
		sim.draw()
	})
	$('#jump').on('click', () => {
		for (let i = 0; i < 100; i++) sim.step()
		sim.draw()
	})
	$('#fps').on('change', (e) => {
		sim.fps = parseInt($('#fps').val(), 10)
	})

	$('#t-states').on('change', setTransitionTable)
	$('#t-colors').on('change', setTransitionTable)

	$('#transition').on('change', 'input, select', updateSpecifier)
	$('#randomize').on('click', genRandomTransitionTable)

	sim.on('step', () => {
		$('#frame').val(sim.frame)
	})

	sim.on('click', (x, y) => {
		let specifier = $('#t-specifier').val()
		sim.add(new Turmite(x, y, specifier))
		if (sim.paused) sim.draw()
	})

	species.forEach(renderSpeciesPreview)
}

window.addEventListener('load', () => {
	$.getJSON('data/species.json', (data) => {
		species = data
		main()
	})
})

window.addEventListener('keyup', e => {
	switch (e.keyCode || e.which) {
		case 27: sim.stop(); break
		case 32: sim.toggle(); break
	}
})
