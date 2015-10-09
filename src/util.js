
export function mod(a, n) {
	return a - n * Math.floor(a / n)
}

export function lerp(a, b, t) {
	return t * (b - a) + a
}
