module.exports = {
	UNIDENTIFIED: 0, 		// client connecté mais pas identifié
	EXPECTING_LEVEL: 1,		// client en attente des données d'un niveau
	BUILDING_LEVEL: 2,		// niveau en cours de construction après avoir reçu les données
	ENTERING_LEVEL: 3,		// client ayant terminé la construction du niveau, en attente des données des mobiles
	PLAYING: 4				// client ayant la totalité des information, peut donner le controle au joueur
};