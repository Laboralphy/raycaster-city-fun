const Abstract = require('./Abstract');
const o876 = require('../../../o876');

module.exports = class Brick extends Abstract {

	rect(x, y, w, h, color, noise = null) {
		for (let iy = 0; iy < h; ++iy) {
			for (let ix = 0; ix < w; ++ix) {
				this.pixel(x + ix, y + iy, color, noise);
			}
		}
	}

	fill(color, noise = null) {
		this.rect(0, 0, this._width, this._height, color, noise);
	}

	corner(side, ofs, width, color, noise = null) {
		switch (side) {
			case 0:
				this.rect(ofs, ofs, width, width, color, noise);
				break;

			case 1:
				this.rect(this._width - ofs - width, ofs, width, width, color, noise);
				break;

			case 2:
				this.rect(this._width - ofs - width, this._height - ofs - width, width, width, color, noise);
				break;

			case 3:
				this.rect(ofs, this._height - ofs - width, width, width, color, noise);
				break;
		}
	}


	border(side, ofs, width, color, noise = null) {
		switch (side) {
			case 0:
				this.rect(
					ofs,
					ofs,
					this._width - ofs - ofs,
					width,
					color,
					noise);
				break;

			case 1:
				this.rect(
					this._width - ofs - width,
					ofs,
					width,
					this._height - ofs - ofs,
					color,
					noise);
				break;

			case 2:
				this.rect(
					ofs,
					this._height - ofs - width,
					this._width - ofs - ofs,
					width,
					color,
					noise);
				break;

			case 3:
				this.rect(
					ofs,
					ofs,
					width,
					this._height - ofs - ofs,
					color,
					noise);
				break;
		}
	}
};