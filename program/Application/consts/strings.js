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
			error: {
				invalid_channel: 'user send message to a wrong channel (user "%s" channel "%s")',
				login_failed: 'user access denied (user "%s" nickname "%s")',
				level_not_found: 'error when loading level (user "%s" level "%s")'
			}

		},
	}
};

module.exports = STRINGS;