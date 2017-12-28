

// user manager

const UserManager = require('../UserManager');

describe('User Manager', function() {
    describe('initial', function() {
        it('should not have any user', function() {
            let um = new UserManager();
            expect(um.lastId).toBe(0);
            expect(um.users).toEqual([]);
        })
    });

    describe('adding user', function() {
        it('should work', function() {
            let um = new UserManager();
            um.newUser('ralphy', 'xxx');
            expect(um.lastId).toBe(1);
            expect(um.users.length).toBe(1);
            expect(um.users[0].name).toBe('ralphy');
            expect(um.users[0].id).toBe(1);
        });
    });

    describe('removing user', function() {
        it('should work', function() {
            let um = new UserManager();
            um.newUser('ramuh', 'xxx');
            um.newUser('ifrit', 'xxx');
            um.newUser('shiva', 'xxx');
            um.newUser('carbunkle', 'xxx');
            expect(um.users.length).toBe(4);
            expect(um.users[0].name).toBe('ramuh');
            expect(um.users[1].name).toBe('ifrit');
            expect(um.users[2].name).toBe('shiva');
            expect(um.users[3].name).toBe('carbunkle');
            expect(um.users[0].id).toBe(1);
            expect(um.users[1].id).toBe(2);
            expect(um.users[2].id).toBe(3);
            expect(um.users[3].id).toBe(4);
            um.removeUser(2);
            expect(um.users[0].name).toBe('ramuh');
            expect(um.users[1].name).toBe('shiva');
            expect(um.users[2].name).toBe('carbunkle');
            expect(um.users[0].id).toBe(1);
            expect(um.users[1].id).toBe(3);
            expect(um.users[2].id).toBe(4);
        });
    });
});