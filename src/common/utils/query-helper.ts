interface DateRangeConfig {
  key: string;
  values: [Date | undefined, Date | undefined];
}

export function handleDateRange(
  configs: DateRangeConfig[],
): Record<string, any> {
  return configs.reduce(
    (acc, { key, values }) => {
      const [start, end] = values;
      const conditions: Record<string, Date> = {};

      if (start) conditions.$gte = start;
      if (end) conditions.$lte = end;

      if (Object.keys(conditions).length > 0) {
        acc[key] = conditions;
      }

      return acc;
    },
    {} as Record<string, any>,
  );
}
