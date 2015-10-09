
export default class TuringMachine {
	constructor() {
		this.position = 0
		this.state = 0
		this.tape = null
		this.transitions = [
			[{ next: 1 }, { next: 0 }],
			[{ next: 0 }, { next: 1 }]
		]
	}
}
