describe('o876', function() {
    const o876 = require('../index.js');










    //  ####   ######   ####   #    #  ######   #####  #####    #   #
    // #    #  #       #    #  ##  ##  #          #    #    #    # #
    // #       #####   #    #  # ## #  #####      #    #    #     #
    // #  ###  #       #    #  #    #  #          #    #####      #
    // #    #  #       #    #  #    #  #          #    #   #      #
    //  ####   ######   ####   #    #  ######     #    #    #     #

    describe('geometry', function() {
        const Vector2D = o876.geometry.Vector2D;




        //                                                 #####  ######
        // #    #  ######   ####    #####   ####   #####  #     # #     #
        // #    #  #       #    #     #    #    #  #    #       # #     #
        // #    #  #####   #          #    #    #  #    #  #####  #     #
        // #    #  #       #          #    #    #  #####  #       #     #
        //  #  #   #       #    #     #    #    #  #   #  #       #     #
        //   ##    ######   ####      #     ####   #    # ####### ######

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



        describe('Collider', function() {
        //  ####    ####   #       #          #    #####   ######  #####
        // #    #  #    #  #       #          #    #    #  #       #    #
        // #       #    #  #       #          #    #    #  #####   #    #
        // #       #    #  #       #          #    #    #  #       #####
        // #    #  #    #  #       #          #    #    #  #       #   #
        //  ####    ####   ######  ######     #    #####   ######  #    #
            const Collider = o876.collider.Collider;
            const Mobile = o876.collider.Mobile;
            const Rect = o876.collider.shapes.Rect;
            const Vector = o876.geometry.Vector2D;

            it('should create good rects', function() {
                let r1 = new Rect(new Vector(15, 15), new Vector(-15, -15));
                let r2 = new Rect(new Vector(15, -15), new Vector(-15, 15));
                let r3 = new Rect(new Vector(-15, 15), new Vector(15, -15));
                let r4 = new Rect(new Vector(-15, -15), new Vector(15, 15));
                expect(r1._p1.x).toBe(-15);
                expect(r2._p1.x).toBe(-15);
                expect(r3._p1.x).toBe(-15);
                expect(r4._p1.x).toBe(-15);
                expect(r1._p1.y).toBe(-15);
                expect(r2._p1.y).toBe(-15);
                expect(r3._p1.y).toBe(-15);
                expect(r4._p1.y).toBe(-15);
                expect(r1._p2.x).toBe(15);
                expect(r2._p2.x).toBe(15);
                expect(r3._p2.x).toBe(15);
                expect(r4._p2.x).toBe(15);
                expect(r1._p2.y).toBe(15);
                expect(r2._p2.y).toBe(15);
                expect(r3._p2.y).toBe(15);
                expect(r4._p2.y).toBe(15);
            });

            it('should instanciate', function() {
                let collider = new Collider();
                expect(collider).toBeDefined();
            });

            it('should count the exact number of mobiles', function() {
                let collider = new Collider();
                collider.cellWidth(64).cellHeight(64);
                collider.width(10).height(10);
                let m = [
                    new Mobile(),
                    new Mobile()
                ];
                m[0].shape(new Rect(new Vector(-15, -15), new Vector(15, 15)));
                m[1].shape(new Rect(new Vector(-10, -10), new Vector(10, 10)));
                m[0].position().set(64 * 3 + 20, 64 * 5 + 12);
                m[1].position().set(64 * 7 + 20, 64 * 2 + 12);
                collider.track(m[0]);
                collider.track(m[1]);
                expect(collider.sector(m[0].position()).count()).toBe(1);
                expect(collider.sector(3, 5).count()).toBe(1);
                expect(collider.sector(0, 0).count()).toBe(0);
                expect(collider.sector(7, 2).count()).toBe(1);
                m[1].position().set(64 * 3 + 40, 64 * 5 + 32);
                collider.track(m[0]);
                collider.track(m[1]);
                expect(collider.sector(3, 5).count()).toBe(2);
                expect(collider.sector(7, 2).count()).toBe(0);
            });

            it('should indicate the collision', function() {
                let collider = new Collider();
                collider.cellWidth(64).cellHeight(64);
                collider.width(10).height(10);
                let m = [
                    new Mobile(),
                    new Mobile()
                ];
                m[0].shape(new Rect(new Vector(-15, -15), new Vector(15, 15)));
                m[1].shape(new Rect(new Vector(-10, -10), new Vector(10, 10)));
                m[0].position().set(64 * 3 + 20, 64 * 5 + 12);
                m[1].position().set(64 * 3 + 20, 64 * 2 + 12);
                collider.track(m[0]);
                collider.track(m[1]);
                let aColl;

                aColl = collider.collides(m[0]);
                expect(aColl.length).toBe(0); // y = 140

                m[1].position().translate(new Vector(0, 167)); // y = 307
                collider.track(m[0]);
                collider.track(m[1]);
                aColl = collider.collides(m[0]);
                expect(m[1].position().y).toBe(307);
                expect(aColl.length).toBe(0);

                m[1].position().translate(new Vector(0, 20)); // y = 307
                collider.track(m[0]);
                collider.track(m[1]);
                aColl = collider.collides(m[0]);
                expect(m[1].position().y).toBe(327);
                expect(m[0].position().y).toBe(332);
                expect(m[1].position().x).toBe(212);
                expect(m[0].position().x).toBe(212);
                expect(aColl.length).toBe(1);
            });
        });
    });







    describe('algorithms', function() {
    //   ##    #        ####    ####   #####      #     #####  #    #  #    #   ####
    //  #  #   #       #    #  #    #  #    #     #       #    #    #  ##  ##  #
    // #    #  #       #       #    #  #    #     #       #    ######  # ## #   ####
    // ######  #       #  ###  #    #  #####      #       #    #    #  #    #       #
    // #    #  #       #    #  #    #  #   #      #       #    #    #  #    #  #    #
    // #    #  ######   ####    ####   #    #     #       #    #    #  #    #   ####






        describe('Astar', function() {
            //   ##     ####    #####    ##    #####
            //  #  #   #          #     #  #   #    #
            // #    #   ####      #    #    #  #    #
            // ######       #     #    ######  #####
            // #    #  #    #     #    #    #  #   #
            // #    #   ####      #    #    #  #    #
            describe('simple path find', function() {
                const oAstar = new o876.algorithms.Astar();
                oAstar.grid([
                    ('*******').split(''),
                    ('*   * *').split(''),
                    ('*     *').split(''),
                    ('* **  *').split(''),
                    ('*  ** *').split(''),
                    ('*  *  *').split(''),
                    ('*******').split('')
                ]).walkable(' ').diagonals(false);
                it('should have initialized grid 7x7 grid', function() {
                    expect(oAstar._grid.length).toEqual(7);
                    expect(oAstar._grid[0].length).toEqual(7);
                });
                it('should have property width and height set to 7', function() {
                    expect(oAstar._width).toEqual(7);
                    expect(oAstar._height).toEqual(7);
                });
                it('should find the way', function() {
                    const aExpected =
                        [ { x: 5, y: 5 },
                            { x: 5, y: 4 },
                            { x: 5, y: 3 },
                            { x: 4, y: 3 },
                            { x: 4, y: 2 },
                            { x: 3, y: 2 },
                            { x: 2, y: 2 },
                            { x: 1, y: 2 },
                            { x: 1, y: 3 },
                            { x: 1, y: 4 },
                            { x: 1, y: 5 },
                            { x: 2, y: 5 } ];
                    let p = oAstar.find(4, 5, 2, 5);
                    expect(p).toEqual(aExpected);
                });
            });

            describe('impossible path', function() {
                const oAstar = new o876.algorithms.Astar();
                oAstar.grid([
                    ('*******').split(''),
                    ('*   * *').split(''),
                    ('*  *  *').split(''),
                    ('* **  *').split(''),
                    ('*  ** *').split(''),
                    ('*  *  *').split(''),
                    ('*******').split('')
                ]).walkable(' ').diagonals(false);
                it('should not find path', function() {
                    expect(() => oAstar.find(4, 5, 2, 5)).toThrow(new Error('Astar: no path to destination'));
                });
            });

            describe('path is possible via diagonals', function() {
                const oAstar = new o876.algorithms.Astar();
                oAstar.grid([
                    ('*******').split(''),
                    ('*   * *').split(''),
                    ('*  *  *').split(''),
                    ('* **  *').split(''),
                    ('*  ** *').split(''),
                    ('*  *  *').split(''),
                    ('*******').split('')
                ]).walkable(' ').diagonals(true);
                it('should not find path', function() {
                    expect(Array.isArray(oAstar.find(4, 5, 2, 5))).toBeTruthy();
                });
            });
        });


// #####   #####   ######   ####   ######  #    #  #    #    ##    #    #
// #    #  #    #  #       #       #       ##   #  #    #   #  #   ##  ##
// #####   #    #  #####    ####   #####   # #  #  ######  #    #  # ## #
// #    #  #####   #            #  #       #  # #  #    #  ######  #    #
// #    #  #   #   #       #    #  #       #   ##  #    #  #    #  #    #
// #####   #    #  ######   ####   ######  #    #  #    #  #    #  #    #

        describe('Bresenham', function() {
            const Bresenham = o876.algorithms.Bresenham;
            it('should build a line', function() {
                let aList = [];
                let bOk = Bresenham.line(10, 10, 15, 12, function (x, y) {
                    aList.push(x + ';' + y);
                });
                expect(aList.join('-')).toEqual('10;10-11;10-12;11-13;11-14;12-15;12');
                expect(bOk).toBeTruthy();
            });
        });



// ######    ##     ####      #    #    #   ####
// #        #  #   #          #    ##   #  #    #
// #####   #    #   ####      #    # #  #  #
// #       ######       #     #    #  # #  #  ###
// #       #    #  #    #     #    #   ##  #    #
// ######  #    #   ####      #    #    #   ####

        describe('Easing', function() {
            describe('setting move', function() {
                it('should initialize correctly', function() {
                    const e = new o876.algorithms.Easing();
                    e.from(4).to(17).during(10);
                    expect(e.x).toEqual(4);
                    expect(e.xStart).toEqual(4);
                    expect(e.xEnd).toEqual(17);
                    expect(e.nTime).toEqual(10);
                    expect(e.iTime).toEqual(0);
                });
            });
            describe('setting move', function() {
                it('should correctly use a simple linear function', function() {
                    const e = new o876.algorithms.Easing();
                    e.from(4).to(17).during(10).use(function(v) {
                        return v * 2;
                    });
                    expect(e.x).toEqual(4);
                    expect(e.xStart).toEqual(4);
                    expect(e.xEnd).toEqual(17);
                    expect(e.nTime).toEqual(10);
                    expect(e.iTime).toEqual(0);
                    e.next();
                    expect(e.val() * 10 | 0).toEqual(66);
                    e.next();
                    expect(e.val() * 10 | 0).toEqual(92);
                    e.next();
                    expect(e.val() * 10 | 0).toEqual(117);
                    e.next();
                    expect(e.val() * 10 | 0).toEqual(144);
                    e.next();
                    expect(e.val() * 10 | 0).toEqual(170);
                });
            });
        });
    });







//         #####  #######  #####
//  ####  #     # #    #  #     #
// #    # #     #     #   #
// #    #  #####     #    ######
// #    # #     #   #     #     #
// #    # #     #   #     #     #
//  ####   #####    #      #####

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



//  ####   #####   ######  #       #       #####    ####    ####   #    #
// #       #    #  #       #       #       #    #  #    #  #    #  #   #
//  ####   #    #  #####   #       #       #####   #    #  #    #  ####
//      #  #####   #       #       #       #    #  #    #  #    #  #  #
// #    #  #       #       #       #       #    #  #    #  #    #  #   #
//  ####   #       ######  ######  ######  #####    ####    ####   #    #

    describe('SpellBook', function() {
        describe('#array', function() {
            it('should return the same array', function() {
                let a = ['a', 'b', 'c'];
                let b = o876.SpellBook.array(a);
                expect(a).toEqual(b);
                expect(a === b).toBeTruthy();
            });
            it('should convert a simple object', function() {
                let aSource = {3:'t', 2:'o', 1: 'i', 0:'y'};
                expect(o876.SpellBook.array(aSource))
                    .toEqual(['y', 'i', 'o', 't']);
            });
            it('should convert a simple object with quoted keys', function() {
                let aSource = {'3':'t', '2':'o', '1':'i', '0':'y'};
                expect(o876.SpellBook.array(aSource))
                    .toEqual(['y', 'i', 'o', 't']);
            });
            it('should convert an array like object', function() {
                let aSource = {0:111, 1:222, 2:333, 3:444, 'length': 4};
                expect(o876.SpellBook.array(aSource)).toEqual([111, 222, 333, 444]);
            });
            it('should fail to convert an array like object (bad length)', function() {
                let aSource = {0:111, 1:222, 2:333, 3:444, 'length': 5};
                expect(o876.SpellBook.array(aSource)).toBeFalsy();
            });
            it('should fail to convert an array like object (missing key)', function() {
                let aSource = {0:111, 1:222, 2:333, 4:444};
                expect(o876.SpellBook.array(aSource)).toBeFalsy();
            });
            it('should convert argument', function() {
                let a;
                (function() {
                    a = o876.SpellBook.array(arguments);
                })(4, 5, 6);
                expect(a).toEqual([4, 5, 6]);
            });
        });

        describe('#typeMap', function() {
            it('should map this type', function() {
                expect(o876.SpellBook.typeMap([1, 0, {}, [], null, true, false, Infinity, undefined, function() {}])).toEqual('nnoaubbnuf');
            });
        });

        describe('#parseSearch', function() {
            it ('should parse a simple query', function() {
                expect(o876.SpellBook.parseSearch('?x=1&y=5')).toEqual({
                    x: '1',
                    y: '5'
                });
                expect(o876.SpellBook.parseSearch('?text=abc+def')).toEqual({
                    text: 'abc def'
                });
            });
        })
    });

    describe('Emitter', function() {
        describe('#on', function() {
            it('should trigger an event', function () {
                const E = new o876.Emitter();
                let sTemoin = 0;
                E.on('test', function (v) {
                    sTemoin = v;
                });
                expect('test' in E._oEventHandlers).toBeTruthy();
                expect('on' in E._oEventHandlers.test).toBeTruthy();
                expect('one' in E._oEventHandlers.test).toBeTruthy();
                expect(Array.isArray(E._oEventHandlers.test.on)).toBeTruthy();
                expect(Array.isArray(E._oEventHandlers.test.one)).toBeTruthy();
                expect(E._oEventHandlers.test.on.length).toEqual(1);
                expect(E._oEventHandlers.test.one.length).toEqual(0);
                E.trigger('test', 10);
                expect(sTemoin).toEqual(10);
            });
        });
        describe('#one', function() {
            it('should trigger an event only once', function() {
                const E = new o876.Emitter();
                let sTemoin = 0;
                E.one('test', function(v) {
                    sTemoin += v*2;
                });
                E.trigger('test', 44);
                expect(sTemoin).toEqual(88);
                E.trigger('test', 44);
                expect(sTemoin).toEqual(88);
                E.trigger('test', 44);
                expect(sTemoin).toEqual(88);
            });
        });
        describe('#off', function() {
            it('should not trigger anything', function() {
                const E = new o876.Emitter();
                let sTemoin = 0;
                let pHandler = function(v) {
                    sTemoin += v*2;
                };
                let pHandler2 = function(v) {
                    sTemoin += v*3;
                };
                E.on('test', pHandler);
                E.on('test', pHandler2);
                E.trigger('test', 4);
                expect(sTemoin).toEqual(20);
                E.off('test', pHandler);
                E.trigger('test', 3);
                expect(sTemoin).toEqual(29);
                E.off('test', pHandler2);
                E.trigger('test', 5);
                expect(sTemoin).toEqual(29);
            });
        });


    });
});
