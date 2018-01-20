describe('o876', function() {
    const o876 = require('../index.js');
    describe('geometry', function() {
        const Vector2D = o876.geometry.Vector2D;
        describe('Vector', function() {
            describe('initialisation 0', function () {
                it('creates a zero vector', function () {
                    let v = new Vector2D();
                    expect(v.x).toEqual(0);
                    expect(v.y).toEqual(0);
                });
            });

            describe('initialisation not 0', function () {
                it('creates an initialized vector with arbitrary values', function () {
                    let v = new Vector2D(7, 89);
                    expect(v.x).toEqual(7);
                    expect(v.y).toEqual(89);
                });
            });

            describe('cloning', function () {
                it('properly clones a vector', function () {
                    let v = new Vector2D(-7, 66);
                    let w = new Vector2D(v);
                    expect(v.x).toEqual(w.x);
                    expect(v.y).toEqual(w.y);
                    expect(v === w).toBeFalsy();
                });
            });

            describe('zero vector', function() {
                it('should build a 0, 0 vector', function() {
                    let v = Vector2D.zero();
                    expect(v.x).toEqual(0);
                    expect(v.y).toEqual(0);
                });
            });

            describe('adding two vectors', function() {
                it('should add 2 vectors', function() {
                    let v1 = new Vector2D(10, 15);
                    let v2 = new Vector2D(2, -2);
                    let v3 = v1.add(v2);
                    // immutability
                    expect(v1.x).toEqual(10);
                    expect(v1.y).toEqual(15);
                    expect(v2.x).toEqual(2);
                    expect(v2.y).toEqual(-2);
                    expect(v3.x).toEqual(12);
                    expect(v3.y).toEqual(13);
                });
            });

            describe('scaling a vector', function() {
                it('should scale a vector', function() {
                    let v1 = new Vector2D(30, 4);
                    let v2 = v1.mul(6);
                    expect(v1.x).toEqual(30);
                    expect(v1.y).toEqual(4);
                    expect(v2.x).toEqual(30 * 6);
                    expect(v2.y).toEqual(4 * 6);
                });
            });

            describe('get vector distance', function() {
                it('should compute vector distance', function() {
                    let v = new Vector2D(5, 5);
                    expect(v.distance()).toBeCloseTo(5 * Math.sqrt(2), 4);
                });
                it('should compute vector distance 2', function() {
                    let v = new Vector2D(-3, 2);
                    expect(v.distance()).toBeCloseTo(Math.sqrt(9 + 4), 4);
                });
            });

            describe('normalize vector', function() {
                it('should build a normalized vector', function() {
                    let v = new Vector2D(64, 4123);
                    expect(v.normalize().distance()).toBeCloseTo(1, 5);
                });
            });
        });
    });


    describe('algorithms', function() {
        const Bresenham = o876.algorithms.Bresenham;
        describe('Bresenham', function() {
            it('should build a line', function() {
                let aList = [];
                let bOk = Bresenham.line(10, 10, 15, 12, function (x, y) {
                    aList.push(x + ';' + y);
                });
                expect(aList.join('-')).toEqual('10;10-11;10-12;11-13;11-14;12-15;12');
                expect(bOk).toBeTruthy();
            });
        });
    });

    describe('Rainbow', function() {
        it ('should parse colors without error', function() {
            const r = o876.Rainbow;
            expect(r.parse('741')).toEqual({r: 0x77, g: 0x44, b: 0x11});
            expect(r.parse('774411')).toEqual({r: 0x77, g: 0x44, b: 0x11});
            expect(r.parse('#741')).toEqual({r: 0x77, g: 0x44, b: 0x11});
            expect(r.parse('#774411')).toEqual({r: 0x77, g: 0x44, b: 0x11});
            expect(r.parse('rgb(119,68, 17)')).toEqual({r: 0x77, g: 0x44, b: 0x11});
            expect(r.parse('rgba(119,68, 17, 0.777)')).toEqual({r: 0x77, g: 0x44, b: 0x11, a:0.777});
        });

        it('should convert rgba', function() {
            const r = o876.Rainbow;
            expect(r.rgba('#FFF')).toEqual('rgb(255, 255, 255)');
        });

        it('should make an array of 4 items', function() {
            const r = o876.Rainbow;
            let a = r.spectrum('#F41', '#8A5', 4);
            expect(a.length).toEqual(4);
        });

        it('should build a big gradient array', function() {
            const r = o876.Rainbow;
            let a;

            a = r.gradient({
                0: 'red',
                2: 'navy',
                4: 'yellow'
            });
            expect(a).toEqual([
                "rgb(255, 0, 0)",
                "rgb(127, 0, 64)",
                "rgb(0, 0, 128)",
                "rgb(127, 127, 64)",
                "rgb(255, 255, 0)"
            ]);
            expect(a.length).toEqual(5);

            a = r.gradient({
                0: 'red',
                1: 'navy',
                2: 'yellow'
            });
            expect(a).toEqual([
                "rgb(255, 0, 0)",
                "rgb(0, 0, 128)",
                "rgb(255, 255, 0)"
            ]);
            expect(a.length).toEqual(3);

            a = r.gradient({
                0: 'red',
                15: 'navy',
                30: 'yellow'
            });
            expect(a).toEqual([
                "rgb(255, 0, 0)",
                "rgb(223, 0, 16)",
                "rgb(207, 0, 24)",
                "rgb(191, 0, 32)",
                "rgb(175, 0, 40)",
                "rgb(159, 0, 48)",
                "rgb(143, 0, 56)",
                "rgb(127, 0, 64)",
                "rgb(111, 0, 72)",
                "rgb(95, 0, 80)",
                "rgb(79, 0, 88)",
                "rgb(63, 0, 96)",
                "rgb(47, 0, 104)",
                "rgb(31, 0, 112)",
                "rgb(15, 0, 120)",
                "rgb(0, 0, 128)",
                "rgb(31, 31, 112)",
                "rgb(47, 47, 104)",
                "rgb(63, 63, 96)",
                "rgb(79, 79, 88)",
                "rgb(95, 95, 80)",
                "rgb(111, 111, 72)",
                "rgb(127, 127, 64)",
                "rgb(143, 143, 56)",
                "rgb(159, 159, 48)",
                "rgb(175, 175, 40)",
                "rgb(191, 191, 32)",
                "rgb(207, 207, 24)",
                "rgb(223, 223, 16)",
                "rgb(239, 239, 8)",
                "rgb(255, 255, 0)"
            ]);
            expect(a.length).toEqual(31);
        });

    });
});
