//
import ClientPrediction from '../src/game/ClientPrediction';
describe('ClientPrediction', function() {
	describe('pushing one packet', function() {
		let cp = new ClientPrediction();
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		it ('should have on packet', function() {
			expect(cp.packets().length).toBe(1);
		});
		it ('t of packet shoumld be 1', function () {
			expect(cp._packets[0].t).toBe(1);
		});
	});

	describe('pushing N packets with same params', function() {
		let cp = new ClientPrediction();
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		it ('should have one packet', function() {
			expect(cp.packets().length).toBe(1);
		});
		it ('t of packet should be 4', function () {
			expect(cp._packets[0].t).toBe(4);
		});
	});

	describe('pushing 20 packets with same params', function() {
		let cp = new ClientPrediction();
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		it ('should have one packet', function() {
			expect(cp.packets().length).toBe(1);
		});
		it ('t of packet should be 20', function () {
			expect(cp._packets[0].t).toBe(20);
		});
	});

	describe('pushing 22 packets with same params', function() {
		let cp = new ClientPrediction();
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});

		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});

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
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 11, x: 20, y: 30, sx: 41, sy: 50});
		cp.pushMovement({a: 11, x: 20, y: 30, sx: 41, sy: 50});
		cp.pushMovement({a: 12, x: 20, y: 30, sx: 42, sy: 50});
		it ('should have 3 packets', function() {
			expect(cp.packets().length).toBe(3);
		});
		it ('should check that packets hasve correct values', function () {
			expect(cp._packets[0]).toEqual({t:1, a: 10, x: 20, y: 30, sx: 40, sy: 50, id: 1, c: 0, send: true, sent: false});
			expect(cp._packets[1]).toEqual({t:2, a: 11, x: 20, y: 30, sx: 41, sy: 50, id: 2, c: 0, send: true, sent: false});
			// le dernier ne peut pas être envoyé
			expect(cp._packets[2]).toEqual({t:1, a: 12, x: 20, y: 30, sx: 42, sy: 50, id: 3, c: 0, send: false, sent: false});
		});
	});

	describe('sending two packets, starting a movement', function() {
		let cp = new ClientPrediction();
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		it ('should have 2 packets', function() {
			expect(cp.packets().length).toBe(1);
		});
		it ('should check this packet have "send" flag set to true', function () {
			expect(cp._packets[0].send).toBeTruthy();
		});
		it ('should check this packet have t = 2', function () {
			expect(cp._packets[0].t).toBe(2);
		});
	});

});
