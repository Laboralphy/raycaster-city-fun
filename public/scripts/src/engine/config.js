export default {
	game: {
		interval: 40,					// intervale entre chaque image, en millisecondes (par defaut : 40)
		fullScreen: false,				// plein écran (par defaut : false)
		fpsControl: true,				// utilisation des controles FPS (par defaut : true)
		devices: {
			keyboard: 'O876_Raycaster.ES6KeyboardDevice'	// gestionnaire de clavier
		},
		mute: false,					// active ou désactive la sortie audio

		ping: {							// configuration du ping
			width: 48,					// taille du widget
			height: 32,
			threshold: 50,				// ping ideal
			colors: {
				min: 'green',			// couleur quand ping proche de 0
				threshold: 'yellow',	// couleur quand ping proche de threshold
				max: 'red'				// couleur quand ping proche du double de threshold
			}
		}
	},
	raycaster: {
		canvas: 'screen',				// id du canvas utilisé pour l'affichage du jeu
		canvasAutoResize: true,			// auto re dimensionnnemnt du canvas
		drawMap: false,					// affichage d'une minimap de débuggage
		smoothTextures: false,			// active ou désactive l'interpolation de textures
		vr: false						// active ou désactive l'affichage VR
	}
};