const Channel = require('../Channel.js');


describe('Channel', function() {
	describe('basic', function() {
		let c = new Channel();
		it('should be instanciated', function() {
			expect(c).toBeTruthy();
		});
		it('should have no users yet', function() {
			expect(c.aUsers).toEqual([]);
		});
		it('should have an empty whitelist', function() {
			expect(c.oWhiteList.oList).toEqual({});
		});
		it('should have an empty blacklist', function() {
			expect(c.oBlackList.oList).toEqual({});
		});
		it('should have 0 user', function() {
			expect(c.getUserCount()).toBe(0);
		});
	});

	describe('public channel', function() {
		let c = new Channel();
		let nDelay = 3 * 24 * 3600 * 1000;
		let nNow = Date.now();
		it('should be public - no white list yet', function() {
			expect(c.isPublic()).toBeTruthy();
		});
		it('should allow foo to access this public channel', function () {
			expect(c.isUserAccessGranted('foo')).toBeTruthy();
		});
		it('should allow bar to access this public channel', function () {
			expect(c.isUserAccessGranted('bar')).toBeTruthy();
		});
	});

	describe('white list', function() {
		let c = new Channel();
		let nDelay = 3 * 24 * 3600 * 1000;
		let nNow = Date.now();
		c.addUserToWhiteList('foo', nNow + nDelay);
		it('should have one user in white list', function() {
			expect(c.oWhiteList.oList).toEqual({foo: nNow + nDelay});
		});
		it('should not be public anymore', function() {
			expect(c.isPublic()).toBeFalsy();
		});
		it('should accept foo, but not accept bar', function() {
			expect(c.isUserAccessGranted('foo')).toBeTruthy();
			expect(c.isUserAccessGranted('bar')).toBeFalsy();
		});
	});

	describe('adding user', function() {
		const User = function() {};
		User.prototype.id = 0;
		User.prototype.sName = '';
		User.prototype.getName = function() {
			return this.sName;
		};
		User.prototype.grantPowers = function() {};
		User.prototype.stripPowers = function() {};


		function createUser(id, name) {
			var u = new User();
			u.id = id;
			u.sName = name;
			return u;
		}

		it('should instanciate user', function() {
			let u = createUser(10, 'foo');
			expect(u).toBeTruthy();
			expect(u.sName).toBe('foo');
			expect(u.id).toBe(10);
		});

		it('should wtf 1', function() {
			let c = new Channel();
			let u = createUser(10, 'foo');
			c.addUser(u);
			expect(c.getUserCount()).toBe(1);

			let u1 = createUser(11, 'bar');
			c.addUser(u1);
			expect(c.getUserCount()).toBe(2);
			expect(c.aUsers[0]).toBe(10);
			expect(c.aUsers[1]).toBe(11);

			c.removeUser(u);
			expect(c.aUsers[0]).toBe(11);
			expect(c.getUserCount()).toBe(1);

			c.removeUser(u1);
			expect(c.getUserCount()).toBe(0);

			c.addUser(u);
			expect(function() {
				c.addUser(u);
			}).toThrowError();
		});
	});
});

