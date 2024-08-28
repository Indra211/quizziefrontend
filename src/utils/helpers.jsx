export const handleImpressionCount = (impression) => {
  return impression
    ? impression < 1000
      ? `${impression}`
      : `${(impression / 1000).toFixed(1)}K`
    : 0;
};
