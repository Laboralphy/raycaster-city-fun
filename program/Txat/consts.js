module.exports = {
	OPCODE: {
		
		// message client -> serveur
		C_SAY: 'T_SAY',
		C_MSG: 'T_MSG',
		C_JOIN: 'T_JOIN',
		C_LEAVE: 'T_LEAVE',
		C_LIST: 'T_LIST',
		C_WHO: 'T_WHO',
		C_BAN: 'T_BAN',
		C_UNBAN: 'T_UNBAN',
		C_PROMOTE: 'T_PROMOTE',
		C_DEMOTE: 'T_DEMOTE',

		// messages serveur -> client
		CA: 'T_CA', // channel arrival
		CD: 'T_CD', // channel departure
		CL: 'T_CL', // channel list
		CM: 'T_CM', // channel message
		ER: 'T_ER', // error
		IM: 'T_IM', // information message
		LS: 'T_LS', // list
		UM: 'T_UM', // user message
	},
	
	MESSAGE: {
		DISCONNECTED: 'client disconnected:',
		USER_ON_CHANNEL: '%s is %s on channel %s', // user, channel
		USER_NOT_ON_CHANNEL: 'user %s is not on channel %s', // user, channel
		NEW_ADMIN: 'the new channel administrator is %s', // user
		ACCESS_DENIED: 'access to this channel is denied',
		USER_BANNED: '%s has been banned from the channel', // user
		BANNED: 'you have been banned from the channel %s', // channel
		IS_NOW: '%s is now %s', // user, role
	}
};
