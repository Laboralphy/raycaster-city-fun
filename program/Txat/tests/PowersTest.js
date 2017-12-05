const Powers = require('../Powers.js');

describe('Powers', function() {
	describe('levels', function() {
		it('should be have 0 level by default', function() {
			let p = new Powers();
			expect(p).toBeDefined();
			expect(p.nLevel).toBe(0);
		});

		it('should be have 2 levels and all rights updated', function() {
			let p = new Powers();
			p.preset(2);
			expect(p.nLevel).toBe(2);
			expect(p.bSend).toBeTruthy();
			expect(p.bReceive).toBeTruthy();
			expect(p.bInvite).toBeTruthy();
			expect(p.bKick).toBeTruthy();
			expect(p.bBan).toBeTruthy();
			expect(p.bUnban).toBeTruthy();
			expect(p.bPromote).toBeTruthy();
			expect(p.bDemote).toBeTruthy();
		});

		it('should be have 1 level and all rights updated', function() {
			let p = new Powers();
			p.preset(1);
			expect(p.nLevel).toBe(1);
			expect(p.bSend).toBeTruthy();
			expect(p.bReceive).toBeTruthy();
			expect(p.bInvite).toBeTruthy();
			expect(p.bKick).toBeTruthy();
			expect(p.bBan).toBeTruthy();
			expect(p.bUnban).toBeTruthy();
			expect(p.bPromote).toBeFalsy();
			expect(p.bDemote).toBeFalsy();
		});

		it('should be have 0 level and all rights updated', function() {
			let p = new Powers();
			p.preset(0);
			expect(p.nLevel).toBe(1);
			expect(p.bSend).toBeTruthy();
			expect(p.bReceive).toBeTruthy();
			expect(p.bInvite).toBeFalsy();
			expect(p.bKick).toBeFalsy();
			expect(p.bBan).toBeFalsy();
			expect(p.bUnban).toBeFalsy();
			expect(p.bPromote).toBeFalsy();
			expect(p.bDemote).toBeFalsy();
		});

	});
});
module.exports.testlevels = function(test) {
	
	p.preset(2);
	
	var p2 = new Powers();
	p2.preset(0);

	var p3 = new Powers();
	p3.preset(0);
	
	test.equal(p2.nLevel, 0, 'user2 level 0');
	test.equal(p3.nLevel, 0, 'user3 level 0 too');
	
	p2.promote(p3);
	test.equal(p3.nLevel, 0, 'user2 cannot promote user3');

	p.promote(p3);
	test.equal(p3.nLevel, 1, 'user1 can promote user3');
	test.done();
	
};
