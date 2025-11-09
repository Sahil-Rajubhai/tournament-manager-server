// Calculates standings for league/group based on completed matches.
// Points rule: Win=2, Draw=1 (if scores equal), Loss=0
export function computeStandings(matches) {
  const table = new Map();
  const ensure = (teamId) => {
    if (!table.has(teamId)) {
      table.set(teamId, { teamId, played: 0, wins: 0, losses: 0, draws: 0, points: 0, gf: 0, ga: 0, gd: 0 });
    }
    return table.get(teamId);
  };

  for (const m of matches.filter(x => x.status === 'completed')) {
    const A = ensure(String(m.teamA));
    const B = ensure(String(m.teamB));
    A.played++; B.played++;
    A.gf += m.scoreA; A.ga += m.scoreB; A.gd = A.gf - A.ga;
    B.gf += m.scoreB; B.ga += m.scoreA; B.gd = B.gf - B.ga;

    if (m.scoreA > m.scoreB) {
      A.wins++; A.points += 2;
      B.losses++;
    } else if (m.scoreB > m.scoreA) {
      B.wins++; B.points += 2;
      A.losses++;
    } else {
      A.draws++; B.draws++;
      A.points += 1; B.points += 1;
    }
  }

  return Array.from(table.values()).sort((a, b) =>
    b.points - a.points || b.gd - a.gd || b.gf - a.gf
  );
}
