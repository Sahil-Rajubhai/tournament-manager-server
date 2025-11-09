import Match from '../models/Match.js';
import Tournament from '../models/Tournament.js';
import { computeStandings } from '../utils/standings.js';
import Team from '../models/Team.js';

export async function standings(req, res) {
  const { tournamentId } = req.params;
  const t = await Tournament.findById(tournamentId);
  if (!t) return res.status(404).json({ message: 'Tournament not found' });

  const matches = await Match.find({ tournament: tournamentId });
  const table = computeStandings(matches);

  // map team names
  const teamMap = new Map((await Team.find({ _id: { $in: t.teams } })).map(x => [String(x._id), x.name]));
  const enriched = table.map(r => ({ ...r, teamName: teamMap.get(r.teamId) || r.teamId }));

  res.json({ tournament: { id: t._id, name: t.name, format: t.format }, standings: enriched });
}
