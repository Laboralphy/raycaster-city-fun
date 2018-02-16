const Config = require('../Config');

const STRINGS = {
	en: {
		service: {
			hello: 'CITY WARS - SERVER',
			listening: 'listening on port : ',
			event: {
				connected: 'client connected (client "%s")',
				disconnected: 'client disconnected (client "%s")',
				not_auth: 'not authenticated',
				assign_name: 'client has logged in (client "%s" nickname "%s")',
				level_loaded: 'level loaded successfully (client "%s" level "%s")',
				user_said: '[%s] %s (%s): %s'
			},
			plugin_loaded: 'plugin "%s" has been loaded',



			game_events: {
				building_level: 'building area (id "%s")',
				level_built: 'area built (id "%s")',
				player_created: 'client\'s mobile instance created (id "%s")',
				player_auth: 'client\'s identity transmitted to game system (id "%s")',
				player_data_loaded: 'client\'s data loaded (id "%s")',
				player_downloading_area: 'transmitting area to client (id "%s" area "%s")'
			},

			error: {
				invalid_channel: 'client send message to a wrong channel (client "%s" channel "%s")',
				login_failed: 'client access denied (client "%s" nickname "%s")',
				level_not_found: 'error when loading level (client "%s" level "%s")',
				bad_client: 'client not found - possibly just disconnected (id "%s")'
			}

		},
	}
};

module.exports = STRINGS[Config.general.lang];