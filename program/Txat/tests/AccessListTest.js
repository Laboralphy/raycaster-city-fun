const AccessList = require('../AccessList.js');

describe('AccessList', function() {
	describe('basic', function() {
		it('should instanciate an empty list', function () {
			let l = new AccessList();
			expect(l).toBeTruthy();
			expect(l.oList).toEqual({});
		});
	});

	describe('managing users', function() {

		it ('should have 2 users', function() {
			let l = new AccessList();
			l.addUser('foo');
			l.addUser('bar', 1000);
			expect(l.oList).toEqual({foo: 0, bar: 1000});
		});

		it ('should have only user bar / foo is deleted', function() {
			let l = new AccessList();
			l.addUser('foo');
			l.addUser('bar', 1000);
			l.removeUser('foo');
			expect(l.oList).toEqual({bar: 1000});
		});

		it ('should try to remove toto but no one found : no error though', function() {
			let l = new AccessList();
			l.addUser('foo');
			l.addUser('bar', 1000);
			l.removeUser('foo');
			l.removeUser('toto');
			expect(l.oList).toEqual({bar:1000});
		});
		it ('should remove both users', function() {
			let l = new AccessList();
			l.addUser('foo');
			l.addUser('bar', 1000);
			l.removeUser('foo');
			l.removeUser('toto');
			l.removeUser('bar');
		});
	});

	describe('isUserListed', function() {
		let l = new AccessList();
		let t = Date.now() + 24 * 3600 * 1000;
		l.addUser('alwaysWelcome');
		l.addUser('tooOld', 1000);
		l.addUser('still3days', t);
		it ('should be always welcome', function() {
			expect(l.isUserListed('alwaysWelcome')).toBeTruthy();
		});
		it ('should be too old', function() {
			expect(l.isUserListed('tooOld')).toBeFalsy();
		});
		it ('should be here for 3 days', function() {
			expect(l.isUserListed('still3days')).toBeTruthy();
		});
	});
});

