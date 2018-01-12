const TILES = {
	m_warlock_b : {
		src : '/tiles/sprites/m_warlock_b.png',
		width : 64,
		height : 96,
		frames : 27,
		animations : [ [ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],	// stand
			[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 166, 1 ],		// walk
			[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],			// attack
			[ [ 16, 16, 16, 16, 16, 16, 16, 16 ], 11, 50, 0 ] ] // death
	},

	m_imp1 : {
		src : '/tiles/sprites/m_imp1.png',
		width : 64,
		height : 96,
		frames : 59,
		animations : [ [
			[ 25, 31, 37, 43, 1, 7, 13, 19 ], 1, 0, 0 ], [
			[ 24, 30, 36, 42, 0, 6, 12, 18 ], 3, 150, 2 ], [
			[ 27, 33, 39, 45, 3, 9, 15, 21 ], 3, 150, 1 ], [
			[ 49, 49, 49, 49, 49, 49, 49, 49 ], 11, 50, 0 ] ]
	},

	p_magbolt : {
		src : '/tiles/sprites/p_magbolt.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
			[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},

	p_magbolt_c2 : {
		src : '/tiles/sprites/p_magbolt_c2.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
			[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},

};

module.exports = TILES;