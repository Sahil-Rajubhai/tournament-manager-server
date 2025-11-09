// Simple round-robin (league) generator using "circle method"
export function generateLeagueFixtures(teamIds, options = {}) {
  const { startDate = new Date(), intervalDays = 2, venue = 'TBD' } = options;
  const teams = [...teamIds];
  if (teams.length % 2 !== 0) teams.push(null); // bye

  const rounds = teams.length - 1;
  const half = teams.length / 2;
  const fixtures = [];
  let current = new Date(startDate);

  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < half; i++) {
      const home = teams[i];
      const away = teams[teams.length - 1 - i];
      if (home && away) {
        fixtures.push({
          teamA: home,
          teamB: away,
          scheduledAt: new Date(current),
          venue
        });
      }
    }
    // rotate except first team
    const fixed = teams.shift();
    const moved = teams.pop();
    teams.unshift(fixed);
    teams.splice(1, 0, moved);

    // next round date
    current = new Date(current.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  }
  return fixtures;
}
