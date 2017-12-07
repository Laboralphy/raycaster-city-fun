require('../TinyTxat/test');
require('../Application/consts/actions');


describe('test const scope', function() {
	it('should access const', function() {
		expect(TEST_ACTION).toBe(12);
	});
});