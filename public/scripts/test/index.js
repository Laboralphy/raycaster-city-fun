//
import ClientPrediction from '../src/game/ClientPrediction';
describe('ClientPrediction', function() {
	describe('pushing one packet', function() {
		let cp = new ClientPrediction();
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		it ('should have on packet', function() {
			expect(cp.packets().length).toBe(1);
		});
		it ('t of packet shoumld be 1', function () {
			expect(cp._packets[0].t).toBe(1);
		});
	});

	describe('pushing N packets with same params', function() {
		let cp = new ClientPrediction();
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		it ('should have one packet', function() {
			expect(cp.packets().length).toBe(1);
		});
		it ('t of packet should be 4', function () {
			expect(cp._packets[0].t).toBe(4);
		});
	});

	describe('pushing 20 packets with same params', function() {
		let cp = new ClientPrediction();
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		it ('should have one packet', function() {
			expect(cp.packets().length).toBe(1);
		});
		it ('t of packet should be 20', function () {
			expect(cp._packets[0].t).toBe(20);
		});
	});

	describe('pushing 22 packets with same params', function() {
		let cp = new ClientPrediction();
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});

		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});

		it ('should have two packets', function() {
			expect(cp.packets().length).toBe(2);
		});
		it ('t of packet should be 20', function () {
			expect(cp._packets[0].t).toBe(20);
			expect(cp._packets[1].t).toBe(2);
		});
	});

	describe('pushing N different packets', function() {
		let cp = new ClientPrediction();
		cp.pushMovement({a: 10, x: 20, y: 30, ma: 40, ms: 50});
		cp.pushMovement({a: 11, x: 20, y: 30, ma: 41, ms: 50});
		cp.pushMovement({a: 11, x: 20, y: 30, ma: 41, ms: 50});
		cp.pushMovement({a: 12, x: 20, y: 30, ma: 42, ms: 50});
		it ('should have 3 packets', function() {
			expect(cp.packets().length).toBe(3);
		});
		it ('should check taht packet 0 has correct values', function () {
			expect(cp._packets[0]).toEqual({t:1, a: 10, x: 20, y: 30, ma: 40, ms: 50, id: 1, c: false});
			expect(cp._packets[1]).toEqual({t:2, a: 11, x: 20, y: 30, ma: 41, ms: 50, id: 2, c: false});
			expect(cp._packets[2]).toEqual({t:1, a: 12, x: 20, y: 30, ma: 42, ms: 50, id: 3, c: false});
		});
	});
});
