
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
            });
        });
    });
});




