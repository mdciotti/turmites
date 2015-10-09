
export class Tape {
	constructor(len) {
		this.length = len
		this.data = new Int8Array(len)
	}

	read(i) {
		return this.data[i]
	}

	write(i, v) {
		this.data[i] = v
	}
}

export class Tape2D extends Tape {
	constructor(w, h) {
		super(w * h)
		this.width = w
		this.height = h

		for (let i = 0, n = this.width * this.height; i < n; i++) {
			this.data[i] = 0
		}
	}

	read(x, y) {
		return this.data[y * this.width + x]
	}

	write(x, y, v) {
		this.data[y * this.width + x] = v
	}
}
