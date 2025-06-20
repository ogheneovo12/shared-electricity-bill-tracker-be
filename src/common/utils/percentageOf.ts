export const percentageOf = (total: number) => {
  return (part: number, precision?: number): number => {
    if (total === 0) return 0;
    const percentage = (part / total) * 100;
    return precision !== undefined
      ? Number(percentage.toFixed(precision))
      : percentage;
  };
};
