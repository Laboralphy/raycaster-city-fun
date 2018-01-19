
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
		const Vector2D = o876.geometry.Vector2D;


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
					new Vector2D(57, 53),
					new Vector2D(0, -2),
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
                    new Vector2D(57, 53),
                    new Vector2D(0, -2),
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
                    new Vector2D(57, 53),
                    new Vector2D(-8, 0),
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
					new Vector2D(57.5, 53),
					new Vector2D(-7, 0),
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
					new Vector2D(57.5, 53),
					new Vector2D(-8, 0),
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

			/*
						it ('should not collide while going east', function() {
							let v = Mobile.computeWallCollisions(
								new Vector2D(55, 53),
								new Vector2D(8, 0),
								4,
								10,
								false,
								collisionWest
							);
							expect(v.delta.x).toBe(8);
							expect(v.delta.y).toBe(0);
							expect(v.wcf.x).toBe(0);
							expect(v.wcf.y).toBe(0);
						});

						it ('should collide with east wall while going east', function() {
							let vPos = new Vector2D(55, 53);
							let vSpeed = new Vector2D(8, 0);
							let nSize = 2;
							let nPlaneSpacing = 10;
							let wcf = {x: 0, y: 0}; // wall collision flags
							let delta = new Vector2D(vSpeed);
							let dx = vSpeed.x;
							let dy = vSpeed.y;
							let x = vPos.x;
							let y = vPos.y;
							let iIgnoredEye = (Math.abs(dx) > Math.abs(dy) ? 1 : 0) | ((dx > dy) || (dx === dy && dx < 0) ? 2 : 0);
							let xClip, yClip, ix, iy, xci, yci;
							let bCorrection = false;

							expect(iIgnoredEye).toBe(3);


							let i = 0;
							xci = (i & 1) * Math.sign(2 - i);
							yci = ((3 - i) & 1) * Math.sign(i - 1);
							ix = nSize * xci + x;
							iy = nSize * yci + y;

							expect(xci).toBe(0);
							expect(yci).toBe(-1);
							expect(x).toBe(55);
							expect(y).toBe(53);
							expect(ix).toBe(55);
							expect(iy).toBe(51);
							expect(dx).toBe(8);
							expect(dy).toBe(0);

							xClip = collisionEast(ix + dx, iy);
							yClip = collisionEast(ix, iy + dy);

							expect(ix + dx).toBe(63);

							expect(xClip).toBeFalsy();
							expect(yClip).toBeFalsy();

							let v = Mobile.computeWallCollisions(
								new Vector2D(55, 53),
								new Vector2D(8, 0),
								2,
								10,
								false,
								collisionEast
							);
							expect(v.delta.x).toBe(2);
							expect(v.delta.y).toBe(0);
							expect(v.wcf.x).toBe(1);
							expect(v.wcf.y).toBe(0);
						});


						it ('should not collide while going south', function() {
							let v = Mobile.resolveWallCollision(
								new Vector2D(55, 55),
								new Vector2D(0, 5),
								2,
								10,
								0b0000
							);
							expect(v.x).toBe(0);
							expect(v.y).toBe(5);
						});

						it ('should collide with west wall while going south', function() {
							let v = Mobile.resolveWallCollision(
								new Vector2D(55, 55),
								new Vector2D(0, 5),
								2,
								10,
								0b0100
							);
							expect(v.x).toBe(0);
							expect(v.y).toBe(2);
						});*/
        });
	});
});




