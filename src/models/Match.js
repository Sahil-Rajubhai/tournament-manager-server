import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    scheduledAt: { type: Date, required: true },
    venue: { type: String, trim: true },
    status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' },
    scoreA: { type: Number, default: 0 },
    scoreB: { type: Number, default: 0 },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    groupName: { type: String } // optional for group stage
  },
  { timestamps: true }
);

export default mongoose.model('Match', matchSchema);
