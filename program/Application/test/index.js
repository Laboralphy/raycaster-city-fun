
describe('model', function() {
    describe('Door', function() {
        const Door = require('../model/Door');
        describe('initial state check', function() {
            let oDoor = new Door();
            it ('should be closed and solid', function() {
                expect(oDoor.isSolid()).toBeTruthy();
                expect(oDoor.nState).toBe(0);
            });
        });

        describe('processing door after intial check', function() {
            it ('should be closed and solid', function() {
                let oDoor = new Door();
                oDoor.process();
                oDoor.process();
                oDoor.process();
                oDoor.process();
                oDoor.process();
                oDoor.process();
                expect(oDoor.isSolid()).toBeTruthy();
                expect(oDoor.bLocked).toBeFalsy();
            });
        });

        describe('locking door', function() {
            it ('should be impossible to open', function() {
                let oDoor = new Door();
                oDoor.bLocked = true;
                let result = oDoor.open();
                expect(result).toBeFalsy();
                expect(oDoor.nState).toBe(0);
            });
            it ('should openable', function() {
                let oDoor = new Door();
                oDoor.bLocked = false;
                let result = oDoor.open();
                expect(result).toBeTruthy();
                expect(oDoor.nState).toBe(1);
            });
        });

        describe('checking offsets', function() {
            it ('should be openable when offset reaches max', function() {
                let oDoor = new Door();
                oDoor.bAutoclose = false;
                oDoor.open();
                expect(oDoor.isSolid()).toBeTruthy();
                for (let i = 0; i < 60; ++i) {
                    oDoor.process();
                }
                expect(oDoor.isSolid()).toBeTruthy();
                expect(oDoor.nOffset).toBeLessThan(oDoor.nOffsetOpen);
                expect(oDoor.nOffset).toBe(60);
                oDoor.process();
                oDoor.process();
                oDoor.process();
                expect(oDoor.nOffset).toBeLessThan(oDoor.nOffsetOpen);
                expect(oDoor.isSolid()).toBeTruthy();
                expect(oDoor.nState).toBe(1);
                oDoor.process(); // 64 !
                expect(oDoor.isSolid()).toBeFalsy();
                expect(oDoor.nState).toBe(2);
            });
        });

        describe('checking autoclose system', function() {
            it('should autoclose', function() {
                let oDoor = new Door();
                oDoor.autoclose(10);
                expect(oDoor.bAutoclose).toBeTruthy();
                expect(oDoor.nState).toBe(0);
                oDoor.open();
                for (let i = 0; i < 63; ++i) {
                    oDoor.process();
                }
                expect(oDoor.isSolid()).toBeTruthy();
                expect(oDoor.nState).toBe(1);
                oDoor.process();

                expect(oDoor.isSolid()).toBeFalsy();
                expect(oDoor.nState).toBe(2);
                for (let i = 0; i <= 10; ++i) {
                    oDoor.process();
                }
                expect(oDoor.nAutocloseTime).toBe(0);
                expect(oDoor.isSolid()).toBeTruthy();
                expect(oDoor.nState).toBe(3);

                for (let i = 0; i < 63; ++i) {
                    oDoor.process();
                }
                expect(oDoor.nState).toBe(0);

            });
        });


        describe('adjacent doors', function() {
            it ('should be adjacent', function() {
				let door1 = new Door();
				let door2 = new Door();
				door1.x = 10;
				door1.y = 15;
				door2.x = 10 + 1;
				door2.y = 15;
				expect(door1.isAdjacent(door2)).toBeTruthy();
				expect(door2.isAdjacent(door1)).toBeTruthy();
            });

			it ('should be adjacent', function() {
				let door1 = new Door();
				let door2 = new Door();
				door1.x = 10;
				door1.y = 15;
				door2.x = 10;
				door2.y = 15 + 1;
				expect(door1.isAdjacent(door2)).toBeTruthy();
				expect(door2.isAdjacent(door1)).toBeTruthy();
			});

			it ('should be adjacent', function() {
				let door1 = new Door();
				let door2 = new Door();
				door1.x = 10;
				door1.y = 15;
				door2.x = 10 - 1;
				door2.y = 15;
				expect(door1.isAdjacent(door2)).toBeTruthy();
				expect(door2.isAdjacent(door1)).toBeTruthy();
			});

			it ('should be adjacent', function() {
				let door1 = new Door();
				let door2 = new Door();
				door1.x = 10;
				door1.y = 15;
				door2.x = 10;
				door2.y = 15 - 1;
				expect(door1.isAdjacent(door2)).toBeTruthy();
				expect(door2.isAdjacent(door1)).toBeTruthy();
			});

			it ('should not be adjacent', function() {
				let door1 = new Door();
				let door2 = new Door();
				door1.x = 10;
				door1.y = 15;
				door2.x = 10 + 2;
				door2.y = 15;
				expect(door1.isAdjacent(door2)).toBeFalsy();
				expect(door2.isAdjacent(door1)).toBeFalsy();
			});

			it ('should not be adjacent', function() {
				let door1 = new Door();
				let door2 = new Door();
				door1.x = 10;
				door1.y = 15;
				door2.x = 10;
				door2.y = 15;
				expect(door1.isAdjacent(door2)).toBeFalsy();
				expect(door2.isAdjacent(door1)).toBeFalsy();
			});

			it ('should not be adjacent', function() {
				let door1 = new Door();
				let door2 = new Door();
				door1.x = 10;
				door1.y = 15;
				door2.x = 10;
				door2.y = 15 + 2;
				expect(door1.isAdjacent(door2)).toBeFalsy();
				expect(door2.isAdjacent(door1)).toBeFalsy();
			});

			it ('should not be adjacent', function() {
				let door1 = new Door();
				let door2 = new Door();
				door1.x = 10;
				door1.y = 15;
				door2.x = 10 + 1;
				door2.y = 15 - 1;
				expect(door1.isAdjacent(door2)).toBeFalsy();
				expect(door2.isAdjacent(door1)).toBeFalsy();
			});

			it ('should not be adjacent', function() {
				let door1 = new Door();
				let door2 = new Door();
				door1.x = 10;
				door1.y = 15;
				door2.x = 10 - 1;
				door2.y = 15 + 1;
				expect(door1.isAdjacent(door2)).toBeFalsy();
				expect(door2.isAdjacent(door1)).toBeFalsy();
			});

			it ('should not be adjacent', function() {
				let door1 = new Door();
				let door2 = new Door();
				door1.x = 10;
				door1.y = 15;
				door2.x = 10;
				door2.y = 15 + 2;
				expect(door1.isAdjacent(door2)).toBeFalsy();
				expect(door2.isAdjacent(door1)).toBeFalsy();
			});
        });

        describe('double secret door', function() {
            it('should open 2 secret doors', function() {
				let door1 = new Door();
				let door2 = new Door();
				door1.setDoorType('s');
				door2.setDoorType('s');
				door1.nextSecretDoor = door2;
				expect(door1.nState).toBe(0);
				expect(door2.nState).toBe(0);
				door1.open();
				expect(door1.nState).toBe(1);
				expect(door2.nState).toBe(0);
				for (let i = 0; i < door1.nOffsetOpen; ++i) {
					door1.process();
				}
				expect(door1.nState).toBe(2);
				expect(door1.nextSecretDoor.nState).toBe(0);
				door1.process();
				expect(door1.nextSecretDoor.nState).toBe(1);
				expect(door2.nState).toBe(1);
				let bLastProcess;
				for (let i = 0; i < door2.nOffsetOpen; ++i) {
					bLastProcess = door2.process();
				}
				expect(door2.nState).toBe(2);
				expect(bLastProcess).toBeFalsy();
				bLastProcess = door2.process();
				expect(door2.nState).toBe(2);
				expect(bLastProcess).toBeTruthy();
            });
        });
    });

	describe('Mobile', function() {
		const Mobile = require('../model/Mobile');
		const o876 = require('../../o876');
		const Vector = o876.geometry.Vector;


		describe('wall collisions', function() {
			function collisionNorth(x, y) {
				return y < 50;
			}
			function collisionSouth(x, y) {
				return y >= 60;
			}
			function collisionWest(x, y) {
				return x < 50;
			}
			function collisionEast(x, y) {
				return x >= 60;
			}

            it ('should not collide while going north', function() {
                let r = Mobile.computeWallCollisions(
					new Vector(57, 53),
					new Vector(0, -2),
                    2,
                    10,
					false,
					collisionSouth
                );
				expect(r.pos.x).toBe(57);
				expect(r.pos.y).toBe(51);
				expect(r.speed.x).toBe(0);
				expect(r.speed.y).toBe(-2);
				expect(r.wcf.x).toBe(0);
				expect(r.wcf.y).toBe(0);
            });

			it ('should collide with north wall while going north', function() {
                let r = Mobile.computeWallCollisions(
                    new Vector(57, 53),
                    new Vector(0, -2),
                    2,
                    10,
                    false,
					collisionNorth
                );
                expect(r.pos.x).toBe(57);
                expect(r.pos.y).toBe(52);
				expect(r.speed.x).toBe(0);
				expect(r.speed.y).toBe(-1);
				expect(r.wcf.x).toBe(0);
				expect(r.wcf.y).toBe(-1);
			});

			it ('should not collide while going west', function() {
                let v = Mobile.computeWallCollisions(
                    new Vector(57, 53),
                    new Vector(-8, 0),
                    4,
                    10,
                    false,
					collisionEast
                );
                expect(v.pos.x).toBe(49);
                expect(v.pos.y).toBe(53);
				expect(v.speed.x).toBe(-8);
				expect(v.speed.y).toBe(0);
				expect(v.wcf.x).toBe(0);
				expect(v.wcf.y).toBe(0);
            });

			it ('should collide with west wall while going west', function() {
				let v = Mobile.computeWallCollisions(
					new Vector(57.5, 53),
					new Vector(-7, 0),
					4,
					10,
					false,
					collisionWest
				);

				expect(v.pos.x).toBe(54);
				expect(v.pos.y).toBe(53);
				expect(v.speed.x).toBe(-3.5);
				expect(v.speed.y).toBe(0);
				expect(v.wcf.x).toBe(-1);
				expect(v.wcf.y).toBe(0);
			});

			it ('should collide with west wall while going west', function() {
				let v = Mobile.computeWallCollisions(
					new Vector(57.5, 53),
					new Vector(-8, 0),
					4,
					10,
					false,
					collisionWest
				);

				expect(v.pos.x).toBe(54);
				expect(v.pos.y).toBe(53);
				expect(v.speed.x).toBe(-3.5);
				expect(v.speed.y).toBe(0);
				expect(v.wcf.x).toBe(-1);
				expect(v.wcf.y).toBe(0);
			});
        });

		describe('mobile collision', function() {
			const o876 = require('../../o876');

			// innstancier collider
			const collider = new o876.collider.Collider();
			collider
				.cellWidth(100)
				.cellHeight(100)
				.width(10)
				.height(10);
			// créer des mobiles
			let m = [
				new Mobile(),
				new Mobile(),
				new Mobile(),
				new Mobile()
			];

			m.forEach(mob => mob.collider(collider));

			it('should not collide', function() {
				m[0].size(10).location.position(new Vector(200, 155));
				m[1].size(10).location.position(new Vector(250, 155));
				m[2].size(10).location.position(new Vector(200, 255));
				m[3].size(10).location.position(new Vector(250, 255));
				m.forEach(mob => collider.track(mob._dummy));

				expect(m[0].forces().toString()).toBe('0:0');
				expect(m[1].forces().toString()).toBe('0:0');
				expect(m[2].forces().toString()).toBe('0:0');
				expect(m[3].forces().toString()).toBe('0:0');
			});

			it('should collide and have force (2 mobs)', function() {
				m[0].size(10).location.position(new Vector(200, 155));
				m[1].size(10).location.position(new Vector(203, 155));
				m[2].size(10).location.position(new Vector(200, 255));
				m[3].size(10).location.position(new Vector(250, 255));
				let d = m.map(mob => mob.dummy());


				expect(d[0].position().x).toBe(200);
				expect(d[0].position().y).toBe(155);
				expect(d[1].position().x).toBe(203);
				expect(d[1].position().y).toBe(155);


				expect(m[0]._dummy.distanceTo(m[1]._dummy)).toBe(3);
				expect(m[0]._dummy.hits(m[1]._dummy)).toBeTruthy();

				m.forEach(mob => collider.track(mob._dummy));
				m.forEach((mob, i) => mob.computeMobileCollisions(i));

				expect(m[0].forces().toString()).toBe('-8.5:0');
				expect(m[1].forces().toString()).toBe('8.5:0');
				expect(m[2].forces().toString()).toBe('0:0');
				expect(m[3].forces().toString()).toBe('0:0');
			});


			it('should collide and have force (3 mobs)', function() {
				m[0].size(10).location.position(new Vector(103, 107));
				m[1].size(10).location.position(new Vector(116, 104));
				m[2].size(10).location.position(new Vector(110, 113));
				m[3].size(10).location.position(new Vector(250, 255));
				let d = m.map(mob => mob.dummy());
				expect(d[0].distanceTo(d[1])).toBeCloseTo(13.341664064, 4);
				expect(d[0].distanceTo(d[2])).toBeCloseTo(9.219544457, 4);
				expect(d[1].distanceTo(d[2])).toBeCloseTo(10.816653826, 4);
				m.forEach(mob => collider.track(mob._dummy));
				m.forEach((mob, i) => mob.computeMobileCollisions());
				let f = m.map(mob => mob.forces());
				expect(f[0].x).toBeCloseTo(-15.836477980599165, 4);
				expect(f[0].y).toBeCloseTo(-2.7593186675721006, 4);
				expect(f[1].x).toBeCloseTo(14.290913919198491, 4);
				expect(f[1].y).toBeCloseTo(-4.56909801036602, 4);
				expect(f[2].x).toBeCloseTo(1.5455640614006745, 4);
				expect(f[2].y).toBeCloseTo(7.328416677938121, 4);

			});

		});
	});

	describe('Thinker', function() {


  // #####  #    #     #    #    #  #    #  ######  #####
  //   #    #    #     #    ##   #  #   #   #       #    #
  //   #    ######     #    # #  #  ####    #####   #    #
  //   #    #    #     #    #  # #  #  #    #       #####
  //   #    #    #     #    #   ##  #   #   #       #   #
  //   #    #    #     #    #    #  #    #  ######  #    #


		const Thinker = require('../model/thinkers/Thinker');

		describe('state succession', function() {
			it('shoud log correctly', function() {
				const TestThinker = class extends Thinker {
                    constructor() {
                        super();
                        this.log = [];
                        this.counter = 0;
                        this.state('state1');
                    }
                    $idle() {
                    }
                    $state1_enter() {
                        this.log.push('entering state1');
                    }
                    $state1() {
                        this.log.push('inside state1 ' + this.counter);
                        this.counter++;
                        if (this.counter > 5) {
                            this.state('state2');
                        }
                    }
                    $state1_exit() {
                        this.log.push('exiting state1');
                    }
                    $state2_enter() {
                        this.log.push('entering state2');
                    }
                    $state2() {
                        this.log.push('inside state2 ' + this.counter);
                        this.counter++;
                        if (this.counter > 9) {
                            this.state('idle');
                        }
                    }
                    $state2_exit() {
                        this.log.push('exiting state2');
                    }
                };
                let t = new TestThinker();
                for (let i = 0; i < 20; ++i) {
                    t.think();
                }
                expect(t.log).toEqual([
                    'entering state1',
                    'inside state1 0',
                    'inside state1 1',
                    'inside state1 2',
                    'inside state1 3',
                    'inside state1 4',
                    'inside state1 5',
                    'exiting state1',
                    'entering state2',
                    'inside state2 6',
                    'inside state2 7',
                    'inside state2 8',
                    'inside state2 9',
                    'exiting state2'
                ]);
			});
		});

        describe('timed state succession', function() {
        	it('should check timed state', function() {
                const TestThinker = class extends Thinker {
                    constructor() {
                        super();
                        this.log = [];
                        this.counter = 0;
                        this.state('state1');
                    }
                    $idle() {
                    }
                    $state1_enter() {
                    	this.duration(5).next('state2');
                        this.log.push('entering state1');
                    }
                    $state1() {
                        this.log.push('inside state1 ' + this.counter);
                        this.counter++;
                    }
                    $state1_exit() {
                        this.log.push('exiting state1');
                    }

                    $state2_enter() {
                        this.duration(3);
                        this.log.push('entering state2');
                    }
                    $state2() {
                        this.log.push('inside state2 ' + this.counter);
                        this.counter++;
                    }
                    $state2_exit() {
                        this.log.push('exiting state2');
                    }
                };
                let t = new TestThinker();
                for (let i = 0; i < 20; ++i) {
                    t.think();
                }
                expect(t.log).toEqual([
                    'entering state1',
                    'inside state1 0',
                    'inside state1 1',
                    'inside state1 2',
                    'inside state1 3',
                    'inside state1 4',
                    'exiting state1',
                    'entering state2',
                    'inside state2 5',
                    'inside state2 6',
                    'inside state2 7',
                    'exiting state2'
                ]);
			});
        });
	});


	describe('Area', function() {
		const Area = require('../model/Area');

		describe('physicMapping', function() {
			it ('should have solid zone around the map', function() {
                let area = new Area();
                area.data({
                    map: [
                        [0x1000, 0x1000, 0x1000, 0x1000],
                        [0x1000, 0x0000, 0x0000, 0x1000],
                        [0x1000, 0x0000, 0x0000, 0x1000],
                        [0x1000, 0x1000, 0x1000, 0x1000],
                    ]
                });
                expect(area.isSolid(0, 0)).toBeTruthy();
                expect(area.isSolid(1, 0)).toBeTruthy();
                expect(area.isSolid(2, 0)).toBeTruthy();
                expect(area.isSolid(3, 0)).toBeTruthy();

                expect(area.isSolid(0, 1)).toBeTruthy();
                expect(area.isSolid(1, 1)).toBeFalsy();
                expect(area.isSolid(2, 1)).toBeFalsy();
                expect(area.isSolid(3, 1)).toBeTruthy();

                expect(area.isSolid(0, 2)).toBeTruthy();
                expect(area.isSolid(1, 2)).toBeFalsy();
                expect(area.isSolid(2, 2)).toBeFalsy();
                expect(area.isSolid(3, 2)).toBeTruthy();

                expect(area.isSolid(0, 3)).toBeTruthy();
                expect(area.isSolid(1, 3)).toBeTruthy();
                expect(area.isSolid(2, 3)).toBeTruthy();
                expect(area.isSolid(3, 3)).toBeTruthy();
			});

            it ('should detect door and instanciate doorlist', function() {
                let area = new Area();
                area.data({
                    map: [
                        [0x1000, 0x1000, 0x1000, 0x1000],
                        [0x1000, 0x0000, 0x0000, 0x1000],
                        [0x1000, 0x0000, 0x0000, 0x1000],
                        [0x1000, 0x2000, 0x1000, 0x1000],
                    ]
                });
                expect(area.isSolid(0, 0)).toBeTruthy();
                expect(area.isSolid(1, 0)).toBeTruthy();
                expect(area.isSolid(2, 0)).toBeTruthy();
                expect(area.isSolid(3, 0)).toBeTruthy();

                expect(area.isSolid(0, 1)).toBeTruthy();
                expect(area.isSolid(1, 1)).toBeFalsy();
                expect(area.isSolid(2, 1)).toBeFalsy();
                expect(area.isSolid(3, 1)).toBeTruthy();

                expect(area.isSolid(0, 2)).toBeTruthy();
                expect(area.isSolid(1, 2)).toBeFalsy();
                expect(area.isSolid(2, 2)).toBeFalsy();
                expect(area.isSolid(3, 2)).toBeTruthy();

                expect(area.isSolid(0, 3)).toBeTruthy();
                expect(area.isSolid(1, 3)).toBeTruthy(); // door
                expect(area.isSolid(2, 3)).toBeTruthy();
                expect(area.isSolid(3, 3)).toBeTruthy();

                expect(area._doorList.length).toBe(1);

                let door = area._doorList[0];
                expect(door.nState).toBe(0);
                area.openDoor(1, 3);
                expect(door.nState).toBe(1);
                area.processDoors();
                expect(door.nOffsetOpen).toBe(20);
                expect(door.nOffset).toBe(1);
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                expect(door.nOffset).toBe(8);
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                area.processDoors();
                expect(door.nOffset).toBe(19);
                expect(door.nState).toBe(1);
                area.processDoors();
                expect(door.nOffset).toBe(20);
                expect(door.nState).toBe(2);
            });
		});
	});


	describe('Level', function() {
		const Level = require('../model/Level');

		it('should build a valid level', function() {
			let level = new Level();

			let json = level.size(4)
				.textures({
					walls: 'wall.png',
					flats: 'flat.png'
				})
				.alias('#', {w: [1, 1], p: 'solid'})
				.alias(' ', {f: [2, 3]})
				.map('lower', [
					'####',
					'#  #',
					'#  #',
					'####'
				])
				.render();
			expect(json.uppermap).toBe(null);
			expect(json.map).toEqual([
				[0x1001, 0x1001, 0x1001, 0x1001],
				[0x1001, 0x0002, 0x0002, 0x1001],
				[0x1001, 0x0002, 0x0002, 0x1001],
				[0x1001, 0x1001, 0x1001, 0x1001],
			]);
			expect(json.walls).toEqual({
				src: 'wall.png',
				codes: [null, [1, 1], null]
			});
			expect(json.flats).toEqual({
				src: 'flat.png',
				codes: [null, null, [2, 3]]
			});
		});

		it('should build a valid level 2nd version with big ids', function() {
			let level = new Level();

			let json = level.size(4)
				.textures({
					walls: 'wall.png',
					flats: 'flat.png'
				})
				.alias(0x21, {w: [1, 1], p: 'solid'})
				.alias(0x10, {f: [2, 3]})
				.alias(0x33, {w: [1, 1], f: [2, 3], p: 'door-double'})
				.map('lower', [
					[0x21, 0x21, 0x21, 0x21],
					[0x21, 0x10, 0x10, 0x21],
					[0x21, 0x10, 0x10, 0x21],
					[0x21, 0x21, 0x33, 0x21]
				])
				.render();
			expect(json.uppermap).toBe(null);
			expect(json.map).toEqual([
				[0x1001, 0x1001, 0x1001, 0x1001],
				[0x1001, 0x0002, 0x0002, 0x1001],
				[0x1001, 0x0002, 0x0002, 0x1001],
				[0x1001, 0x1001, 0x8003, 0x1001],
			]);
			expect(json.walls).toEqual({
				src: 'wall.png',
				codes: [null, [1, 1], null, [1, 1]]
			});
			expect(json.flats).toEqual({
				src: 'flat.png',
				codes: [null, null, [2, 3], [2, 3]]
			});
		});
	});
});
