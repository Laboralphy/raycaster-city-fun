
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
				expect(door1.done()).toBeFalsy();
				expect(door1.nextSecretDoor.nState).toBe(0);
				door1.process();
				expect(door1.nextSecretDoor.nState).toBe(1);
				expect(door2.nState).toBe(1);
				for (let i = 0; i < door2.nOffsetOpen; ++i) {
					door2.process();
				}
				expect(door2.nState).toBe(2);
				expect(door2.done()).toBeFalsy();
				door2.process();
				expect(door2.nState).toBe(2);
				expect(door2.done()).toBeTruthy();
            });
        });

    });
});




