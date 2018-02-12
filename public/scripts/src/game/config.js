export default {
	game: {
		namespace: 'CITY',
		interval: 40,
		doomLoop: 'raf',
		fullScreen: false,
		controlThinker: 'CITY.Player',
		mute: false
	},
	raycaster: {
		canvas: 'screen',
		canvasAutoResize: true,
		drawMap: false,
		smoothTextures: false,
		vr: false
	}
};