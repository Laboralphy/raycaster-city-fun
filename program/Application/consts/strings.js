const Config = require('../Config');

const STRINGS = {
	en: {
		service: {
			hello: 'CITY WARS - SERVER',
			listening: 'listening on port : ',
			event: {
				connected: 'user connected (user "%s")',
				disconnected: 'user disconnected (user "%s")',
				not_auth: 'not authenticated',
				assign_name: 'user has logged in (user "%s" nickname "%s")',
				level_loaded: 'level loaded successfully (user "%s" level "%s")',
				user_said: '[%s] %s (%s): %s'
			},
			plugin_loaded: 'plugin "%s" has been loaded',



			game_events: {
				building_level: 'building level (id "%s")',
				level_built: 'level built (id "%s")',
				player_created: 'player\'s mobile instance created (id "%s")',
				player_auth: 'player is now connected to game (id "%s")',
				player_data_loaded: 'player\'s data loaded (id "%s")',
				player_downloading_area: 'player is downloading area (client "%s" area "%s")'
			},

			error: {
				invalid_channel: 'user send message to a wrong channel (user "%s" channel "%s")',
				login_failed: 'user access denied (user "%s" nickname "%s")',
				level_not_found: 'error when loading level (user "%s" level "%s")',
				bad_client: 'client not found - possibly just disconnected (id "%s")'
			}

		},
	}
};

module.exports = STRINGS[Config.general.lang];