import Match from '../models/Match.js';

export async function createMatch(req, res) {
  const { tournament, teamA, teamB, scheduledAt, venue, groupName } = req.body || {};
  if (!tournament || !teamA || !teamB || !scheduledAt) {
    return res.status(400).json({ message: 'tournament, teamA, teamB, scheduledAt required' });
  }
  const m = await Match.create({ tournament, teamA, teamB, scheduledAt, venue, groupName, status: 'upcoming' });
  res.status(201).json(m);
}

export async function listMatches(req, res) {
  const { tournamentId, status } = req.query;
  const q = {};
  if (tournamentId) q.tournament = tournamentId;
  if (status) q.status = status;
  const matches = await Match.find(q).sort({ scheduledAt: 1 }).populate('teamA teamB', 'name');
  res.json(matches);
}

export async function updateScore(req, res) {
  const { id } = req.params;
  const { scoreA, scoreB, markCompleted } = req.body || {};
  if (typeof scoreA !== 'number' || typeof scoreB !== 'number') {
    return res.status(400).json({ message: 'scoreA and scoreB must be numbers' });
  }
  const m = await Match.findById(id);
  if (!m) return res.status(404).json({ message: 'Match not found' });

  m.scoreA = scoreA;
  m.scoreB = scoreB;
  
  // Only mark as completed if explicitly requested (defaults to true for backward compatibility)
  if (markCompleted !== false) {
    m.status = 'completed';
    if (scoreA > scoreB) m.winner = m.teamA;
    else if (scoreB > scoreA) m.winner = m.teamB;
    else m.winner = null; // draw
  }

  await m.save();
  await m.populate('teamA teamB', 'name');
  res.json(m);
}

export async function upcoming(_req, res) {
  // Show matches that are upcoming (not completed and scheduled more than 2 hours in the future)
  const now = new Date();
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const matches = await Match.find({ 
    status: 'upcoming',
    scheduledAt: { $gte: twoHoursFromNow }
  })
    .sort({ scheduledAt: 1 })
    .limit(10)
    .populate('teamA teamB', 'name');
  res.json(matches);
}

export async function live(_req, res) {
  // Show matches that are currently live (within 2 hours of scheduled time and not completed)
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const matches = await Match.find({ 
    status: 'upcoming',
    scheduledAt: { $gte: twoHoursAgo, $lte: twoHoursFromNow }
  })
    .sort({ scheduledAt: 1 })
    .limit(10)
    .populate('teamA teamB', 'name');
  res.json(matches);
}

export async function completeMatch(req, res) {
  const { id } = req.params;
  const m = await Match.findById(id);
  if (!m) return res.status(404).json({ message: 'Match not found' });

  // Mark match as completed
  m.status = 'completed';
  
  // Set winner based on current scores if they exist
  if (m.scoreA !== undefined && m.scoreB !== undefined) {
    if (m.scoreA > m.scoreB) m.winner = m.teamA;
    else if (m.scoreB > m.scoreA) m.winner = m.teamB;
    else m.winner = null; // draw
  }

  await m.save();
  await m.populate('teamA teamB winner', 'name');
  res.json(m);
}

export async function recent(_req, res) {
  const matches = await Match.find({ status: 'completed' })
    .sort({ updatedAt: -1 })
    .limit(10)
    .populate('teamA teamB winner', 'name');
  res.json(matches);
}
