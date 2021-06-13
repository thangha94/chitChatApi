import { Room } from '../models/room.model';
import { io } from '../server';

export const getRoomByUsers = async (users) => {
  // if the room didn't exist then create new room
  let room = await Room.find({ users: { $all: users }, name: '' });
  if (!room) {
    let newRoom = new Room({ name: '', users });
    newRoom.save((err, room) => {
      if (err) {
        return false;
      }
      return newRoom;
    });
  }
};
