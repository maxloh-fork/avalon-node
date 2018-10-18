const Room   = require('./room');
const Player = require('./player');

jest.mock('./player');

describe('room', () => {
  test('should reset room to it\'s original state', () => {
    const room = new Room();

    room.toggleTeammate('some-id-1');
    room.setExecutionTarget('some-id-2');

    room.resetState();

    expect(room.getState().team).toStrictEqual([]);
    expect(room.getState().executionTargetId).toBeFalsy();
    expect(room.getState().stateIsLocked).toStrictEqual(true);
  });

  test('should not touch `roomId`, `players` and `updatedAt`', () => {
    const room   = new Room('room-id');
    room.players = ['something'];

    const roomId    = room.roomId;
    const updatedAt = room.updatedAt;
    const players   = room.players;

    room.resetState();

    expect(roomId).toStrictEqual(room.roomId);
    expect(updatedAt).toStrictEqual(room.updatedAt);
    expect(players).toStrictEqual(['something']);
  });

  test('should toggle teammate', () => {
    const room = new Room('room-id');

    room.toggleTeammate('some-id-1');
    room.toggleTeammate('some-id-2');
    expect(room.getState().team).toStrictEqual(['some-id-1', 'some-id-2']);

    room.toggleTeammate('some-id-1');
    expect(room.getState().team).toStrictEqual(['some-id-2']);

    room.toggleTeammate('some-id-2');
    expect(room.getState().team).toStrictEqual([]);
  });

  test('should reset team', () => {
    const room = new Room();

    room.toggleTeammate('some-id');

    room.clearTeam();

    expect(room.getState().team).toEqual([]);
  });

  test('should set execution target', () => {
    const room = new Room();

    room.setExecutionTarget('execution-id-1');

    expect(room.getState().executionTargetId).toEqual('execution-id-1');
  });

  test('should get state', () => {
    const room = new Room();

    expect(room.getState().team).toBeDefined();
    expect(room.getState().executionTargetId).toBeDefined();
  });

  test('should remove players from the room', () => {
    const room = new Room();

    room.addPlayer(new Player('some-id', {}));

    room.destroy();

    expect(room.players).toEqual([]);
  });

  test('should add a player to the room', () => {
    const room   = new Room();
    const player = new Player('some-id', {});

    room.addPlayer(player);

    expect(room.players).toEqual([player]);
  });

  test('should replace a player with the similar ID in the room', () => {
    const room    = new Room();
    const player1 = new Player('some-id', {});
    const player2 = new Player('some-id', {});

    room.addPlayer(player1);

    const spy = jest.spyOn(player1, 'leaveRoom');

    room.addPlayer(player2);

    expect(spy).toBeCalled();

    expect(room.players).toEqual([player2]);
  });

  test('should remove players from the room', () => {
    const room = new Room();

    room.addPlayer(new Player('some-id', {}));

    room.destroy();

    expect(room.players).toEqual([]);
  });

  test('should lock the room state', () => {
    const room = new Room();

    room.resetState();

    expect(room.getState().stateIsLocked).toStrictEqual(true);
  });

  test('should unlock the room state', () => {
    const room = new Room();

    room.toggleTeammate('some-id');
    expect(room.getState().stateIsLocked).toStrictEqual(false);
    room.resetState();

    room.clearTeam();
    expect(room.getState().stateIsLocked).toStrictEqual(false);
    room.resetState();

    room.setExecutionTarget('some-id');
    expect(room.getState().stateIsLocked).toStrictEqual(false);
    room.resetState();
  });
});
