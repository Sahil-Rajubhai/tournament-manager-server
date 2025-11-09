import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true } // optional: position/role
  },
  { _id: false }
);

export default playerSchema; // subdocument schema
