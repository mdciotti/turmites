export default class Specifier {
	static parse(spec) {
		let tmp = spec.replace(/\s/g, '')
		let stack = []
		let cur = null
		let prev = null
		let j = 0

		for (let i = 0; i < tmp.length; i++) {
			let tok = tmp.charAt(i)
			switch (tok) {
				case '{':
					let l = stack.push(cur)
					if (l < 3) cur = []
					else cur = {}
					j = 0
					break
				case '}':
					prev = cur
					cur = stack.pop()
					if (cur === null) return prev
					cur.push(prev)
					break
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
					if (j === 0) cur.write = parseInt(tok)
					else if (j === 1) cur.turn = parseInt(tok)
					else if (j === 2) cur.next = parseInt(tok)
					++j
					break
			}
		}
	}
	
	static stringify(transitions) {
		let specifier = '{'

		for (let r = 0; r < transitions.length; r++) {
			let row = transitions[r]
			specifier += (r === 0) ? '{' : ', {'

			for (let c = 0; c < row.length; c++) {
				let cell = row[c]
				specifier += (c === 0) ? '{' : ', {'
				specifier += cell.write + ', '
				specifier += cell.turn + ', '
				specifier += cell.next + '}'
			}
			specifier += '}'
		}
		specifier += '}'

		return specifier
	}
}
