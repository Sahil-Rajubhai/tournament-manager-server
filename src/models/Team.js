import mongoose from 'mongoose';
import playerSchema from './Player.js';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    players: [playerSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Team', teamSchema);
