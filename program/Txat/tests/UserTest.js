const User = require('../User.js');

describe('User', function() {
	it('should had 3 channels', function() {
		let u = new User();
		u.grantPowers(10);
		u.grantPowers(13);
		u.grantPowers(16);
		let a = u.getChannelList();
		expect(a).toEqual([10, 13, 16]);
	});

});

