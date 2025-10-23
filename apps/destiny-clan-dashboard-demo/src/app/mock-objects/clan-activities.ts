const dateMinusDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};


export const clanActivitiesMock = Array(30).fill(null).map((_, i) => {
  return {
    date: dateMinusDays(i + 1),
    seconds: Math.floor(Math.random() * 200000)
  };
});
