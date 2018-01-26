/**
 * Génère une texture aléatoire
 */

const PNG = require('pngjs').PNG;
const fs = require('fs');
const o876 = require('../../../o876');

module.exports = class Abstract {
	constructor(width, height) {
		this._width = width;
		this._height = height;
		this._random = new o876.Random();
		this._rainbow = o876.Rainbow;
		this._png = new PNG({
			filterType: 4,
			width,
			height
		});
	}

	async save(sFilename) {
		return new Promise((resolve) => {
			this._png.pack().pipe(fs.createWriteStream(sFilename));
			process.nextTick(() => resolve())
		});
	}

	png() {
		return this._png;
	}

	pixel(x, y, color, {prob = 0, amp = 1}) {
		let s;
		if (this._random.rand() < prob) {
			s = this._rainbow.brightness(color, 1 - this._random.rand() * amp);
		} else {
			s = o876.Rainbow.parse(color);
		}
		let p = this._png.data;
		let ofs = (y * this._width + x) << 2;
		p[ofs] = s.r;
		p[ofs + 1] = s.g;
		p[ofs + 2] = s.b;
		p[ofs + 3] = ('a' in s) ? (s.a * 255 | 0) : 255;
	}
};