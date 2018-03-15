//
import Predictor from '../../../program/engine/client/Predictor';
describe('Predictor', function() {
	describe('pushing one packet', function() {
		let cp = new Predictor();
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		it ('should have on packet', function() {
			expect(cp.packets().length).toBe(1);
		});
		it ('t of packet shoumld be 1', function () {
			expect(cp._packets[0].t).toBe(1);
		});
	});

	describe('pushing N packets with same params', function() {
		let cp = new Predictor();
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
		let cp = new Predictor();
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
		let cp = new Predictor();
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
		let cp = new Predictor();
		cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50});
		cp.pushMovement({a: 11, x: 20, y: 30, sx: 41, sy: 50});
		cp.pushMovement({a: 11, x: 20, y: 30, sx: 41, sy: 50});
		cp.pushMovement({a: 12, x: 20, y: 30, sx: 42, sy: 50});
		it ('should have 3 packets', function() {
			expect(cp.packets().length).toBe(3);
		});
		it ('should check that packets hasve correct values', function () {
			expect(cp._packets[0]).toEqual({t:1, a: 10, x: 20, y: 30, sx: 40, sy: 50, id: 1, c: 0, s: true, lt: 0});
			expect(cp._packets[1]).toEqual({t:2, a: 11, x: 20, y: 30, sx: 41, sy: 50, id: 2, c: 0, s: true, lt: 1});
			// le dernier ne peut pas être envoyé
			expect(cp._packets[2]).toEqual({t:1, a: 12, x: 20, y: 30, sx: 42, sy: 50, id: 3, c: 0, s: false, lt: 2});
		});
	});

	describe('sending two packets, starting a movement', function() {
		let cp = new Predictor();
		let push1 = cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50}); // {t: 1, a: 10, x: 20, y: 30, sx: 40, sy: 50}
		let push2 = cp.pushMovement({a: 10, x: 20, y: 30, sx: 40, sy: 50}); // {t: 2, a: 10, x: 20, y: 30, sx: 40, sy: 50}
		it ('should have 1 packet', function() {
			expect(cp.packets().length).toBe(1);
		});
		it ('should check this packet have t = 2', function () {
			expect(cp._packets[0].t).toBe(2);
		});
		it ('should have pushed the first move, not the second', function() {
			expect(push1).toBeTruthy();
			expect(push2).toBeFalsy();
		});
	});

	describe('return value of pushMovement', function() {
		let cp = new Predictor();
		let push_a0 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});
		let push_a1 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});
		let push_a2 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});
		let push_a3 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});
		let push_a4 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});
		let push_a5 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});
		let push_a6 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});
		let push_b0 = cp.pushMovement({a: 1.2, x: 100, y: 100, sx: 1.8, sy: 1.1, c: 0});
		let push_c0 = cp.pushMovement({a: 1.3, x: 100, y: 100, sx: 1.7, sy: 1.2, c: 0});
		let push_c1 = cp.pushMovement({a: 1.3, x: 100, y: 100, sx: 1.7, sy: 1.2, c: 0});
		let push_c2 = cp.pushMovement({a: 1.3, x: 100, y: 100, sx: 1.7, sy: 1.2, c: 0});
		let push_c3 = cp.pushMovement({a: 1.3, x: 100, y: 100, sx: 1.7, sy: 1.2, c: 0});
		let push_c4 = cp.pushMovement({a: 1.3, x: 100, y: 100, sx: 1.7, sy: 1.2, c: 0});
		let push_c5 = cp.pushMovement({a: 1.3, x: 100, y: 100, sx: 1.7, sy: 1.2, c: 0});
		let push_d0 = cp.pushMovement({a: 1.3, x: 100, y: 100, sx: 0, sy: 0, c: 0});
		it('these pushes should be true', function() {
			expect(push_a0).toBeTruthy();
			expect(push_b0).toBeTruthy();
			expect(push_c0).toBeTruthy();
			expect(push_d0).toBeTruthy();
		});
		it('these pushes should be false', function() {
			expect(push_a1).toBeFalsy();
			expect(push_a2).toBeFalsy();
			expect(push_a3).toBeFalsy();
			expect(push_a4).toBeFalsy();
			expect(push_a5).toBeFalsy();
			expect(push_a6).toBeFalsy();
			expect(push_c1).toBeFalsy();
			expect(push_c2).toBeFalsy();
			expect(push_c3).toBeFalsy();
			expect(push_c4).toBeFalsy();
			expect(push_c5).toBeFalsy();
		});
		it('should have only 4 packets... i think', function() {
			let p = cp.packets();
			expect(p.length).toBe(4);
			expect(p[0].t).toBe(7);
			expect(p[0].a).toBe(1);
			expect(p[0].sx).toBe(2);
			expect(p[0].sy).toBe(1);
			expect(p[0].c).toBe(0);

			expect(p[1].t).toBe(1);
			expect(p[1].a).toBe(1.2);
			expect(p[1].sx).toBe(1.8);
			expect(p[1].sy).toBe(1.1);
			expect(p[1].c).toBe(0);

			expect(p[2].t).toBe(6);
			expect(p[2].a).toBe(1.3);
			expect(p[2].sx).toBe(1.7);
			expect(p[2].sy).toBe(1.2);
			expect(p[2].c).toBe(0);

			expect(p[3].t).toBe(1);
			expect(p[3].a).toBe(1.3);
			expect(p[3].sx).toBe(0);
			expect(p[3].sy).toBe(0);
			expect(p[3].c).toBe(0);

		});
	});

	describe('unset packets', function() {
		let cp = new Predictor();
		it ('should do the job', function() {
			let cp = new Predictor();
			let p;

			let push_a0 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});
			p = cp.getUnsentPackets();
			expect(p.length).toBe(1);
			expect(p[0]).toEqual({t: 1, a: 1, x: 100, y: 100, sx: 2, sy: 1, id: 1, c: 0, s: true, lt: 0});

			let push_a1 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});
			p = cp.getUnsentPackets();
			expect(p.length).toBe(0);

			p = cp.packets();
			expect(p.length).toBe(1);
			expect(p[0].t).toBe(2);

			let push_a2 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});

			p = cp.packets();
			expect(p.length).toBe(1);
			expect(p[0].t).toBe(3);

			let push_a3 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});

			p = cp.packets();
			expect(p.length).toBe(1);
			expect(p[0].t).toBe(4);

			let push_a4 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});

			p = cp.packets();
			expect(p.length).toBe(1);
			expect(p[0].t).toBe(5);

			let push_a5 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});

			p = cp.packets();
			expect(p.length).toBe(1);
			expect(p[0].t).toBe(6);

			let push_a6 = cp.pushMovement({a: 1, x: 100, y: 100, sx: 2, sy: 1, c: 0});

			p = cp.packets();
			expect(p.length).toBe(1);
			expect(p[0].t).toBe(7);

			let push_b0 = cp.pushMovement({a: 1.2, x: 100, y: 100, sx: 1.8, sy: 1.1, c: 0});

			p = cp.packets();
			expect(p.length).toBe(2);
			expect(p[0].t).toBe(7);
			expect(p[1].t).toBe(1);

		});
	});



});
