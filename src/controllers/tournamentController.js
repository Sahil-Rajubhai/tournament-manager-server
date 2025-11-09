import Tournament from "../models/Tournament.js";
import Team from "../models/Team.js";
import Match from "../models/Match.js";
import { generateLeagueFixtures } from "../utils/fixtureGenerator.js";

export async function createTournament(req, res) {
  const { name, format, teamIds = [], startDate, endDate } = req.body || {};

  try {
    // Validate required fields
    if (!name)
      return res.status(400).json({ message: "Tournament name is required" });
    if (!format)
      return res.status(400).json({ message: "Tournament format is required" });
    if (!startDate)
      return res.status(400).json({ message: "Start date is required" });
    if (!endDate)
      return res.status(400).json({ message: "End date is required" });

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    // Ensure teams exist and there are at least 2
    if (teamIds.length < 2) {
      return res.status(400).json({ message: "At least 2 teams are required" });
    }

    const count = await Team.countDocuments({ _id: { $in: teamIds } });
    if (count !== teamIds.length) {
      return res.status(400).json({ message: "One or more teams are invalid" });
    }

    const tournament = await Tournament.create({
      name,
      format,
      teams: teamIds,
      startDate,
      endDate,
    });
    res.status(201).json(tournament);
  } catch (error) {
    console.error("Error creating tournament:", error);
    res.status(500).json({ message: "Failed to create tournament" });
  }
}

export async function addTeamToTournament(req, res) {
  const { id } = req.params;
  const { teamId } = req.body || {};
  if (!teamId) return res.status(400).json({ message: "teamId required" });

  const t = await Tournament.findById(id);
  if (!t) return res.status(404).json({ message: "Tournament not found" });

  const exists = await Team.findById(teamId);
  if (!exists) return res.status(400).json({ message: "Invalid teamId" });

  if (!t.teams.map(String).includes(String(teamId))) {
    t.teams.push(teamId);
    await t.save();
  }
  res.json(t);
}

export async function getAllTournaments(req, res) {
  try {
    const tournaments = await Tournament.find()
      .populate("teams", "name") // Include team names
      .sort({ startDate: -1 }); // Most recent first
    res.json(tournaments);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ message: "Failed to fetch tournaments" });
  }
}

export async function generateFixtures(req, res) {
  // Only league generator implemented now (covers most needs). Manual creation available via /matches.
  const { id } = req.params;
  const { intervalDays = 2, venue = "TBD", startDate } = req.body || {};
  const t = await Tournament.findById(id);
  if (!t) return res.status(404).json({ message: "Tournament not found" });

  if (t.format !== "league") {
    return res
      .status(400)
      .json({ message: "Auto-fixtures currently only for league format" });
  }
  if (!t.teams || t.teams.length < 2)
    return res.status(400).json({ message: "Need at least 2 teams" });

  const fixtures = generateLeagueFixtures(t.teams, {
    intervalDays,
    venue,
    startDate: startDate ? new Date(startDate) : undefined,
  });
  const created = await Match.insertMany(
    fixtures.map((f) => ({ ...f, tournament: t._id }))
  );
  res.json({ count: created.length, fixtures: created });
}
