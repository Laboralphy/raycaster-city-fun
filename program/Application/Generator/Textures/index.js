const Brick = require('./Brick');


function main() {
	console.time('brick');
	let b = new Brick(24, 16);
	let params = {
		colors: {
			prim: 'rgb(255, 0, 0)',
			light: '#F44',
			dark: '#800'
		},
		noise: {
			amp: 0.25,
			prob: 0.5
		}
	};

	b.fill(params.colors.prim, params.noise);

	b.border(3, 0, 1, params.colors.light, params.noise);
	b.border(1, 0, 1, params.colors.dark, params.noise);
	b.border(2, 0, 1, params.colors.dark, params.noise);
	b.border(0, 0, 1, params.colors.light, params.noise);
	b.corner(0, 0, 2, b._rainbow.brightness(params.colors.light, 2), params.noise);
	b.corner(2, 0, 2, b._rainbow.brightness(params.colors.dark, 0.5), params.noise);

	console.timeEnd('brick');
	b.save('test.png');
}

main();