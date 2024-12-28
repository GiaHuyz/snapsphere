export function buildRangeFilter(min?: number, max?: number): any {
  // Validate inputs
  if (min !== undefined && max !== undefined) {
    if (min > max) {
      throw new Error('Min value must be less than or equal to max value');
    }
    if (min === max) {
      return min; // Exact match if min equals max
    }
    return { $gte: min, $lte: max };
  }

  // Handle cases where only one of min or max is provided
  if (min !== undefined) {
    return { $gte: min };
  }
  if (max !== undefined) {
    return { $lte: max };
  }

  // Return an empty condition if neither min nor max is provided
  return undefined;
}