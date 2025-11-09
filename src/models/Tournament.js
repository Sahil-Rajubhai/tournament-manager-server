import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    format: { type: String, enum: ['league', 'knockout', 'group_knockout'], required: true },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    groups: [
      {
        name: String,
        teamIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
      }
    ],
    startDate: Date
  },
  { timestamps: true }
);

export default mongoose.model('Tournament', tournamentSchema);
