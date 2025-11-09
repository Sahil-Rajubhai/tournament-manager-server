import Team from '../models/Team.js';

export async function listTeams(_req, res) {
  const teams = await Team.find().sort({ createdAt: -1 });
  res.json(teams);
}

export async function createTeam(req, res) {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ message: 'Team name required' });
  const t = await Team.create({ name, players: [] });
  res.status(201).json(t);
}

export async function updateTeam(req, res) {
  const { id } = req.params;
  const { name } = req.body || {};
  const updated = await Team.findByIdAndUpdate(id, { name }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Team not found' });
  res.json(updated);
}

export async function deleteTeam(req, res) {
  const { id } = req.params;
  const deleted = await Team.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Team not found' });
  res.json({ ok: true });
}

export async function addPlayer(req, res) {
  const { id } = req.params;
  const { name, role } = req.body || {};
  if (!name) return res.status(400).json({ message: 'Player name required' });
  const team = await Team.findById(id);
  if (!team) return res.status(404).json({ message: 'Team not found' });
  team.players.push({ name, role });
  await team.save();
  res.json(team);
}

export async function getTeam(req, res) {
  const { id } = req.params;
  const team = await Team.findById(id);
  if (!team) return res.status(404).json({ message: 'Team not found' });
  res.json(team);
}
