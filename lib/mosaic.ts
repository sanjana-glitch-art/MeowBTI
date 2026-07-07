export const MOSAIC_COLORS = ["#809bce", "#95b8d1", "#b8e0d2", "#d6eadf", "#eac4d5"];

export interface MosaicCell {
  color: string | null;
}

// Simple seeded PRNG (mulberry32) so a given seed always produces
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates a grid of mosaic cells with density controlled by a per-row function.
 * densityAt(rowIndex, totalRows) should return a fill probability between 0 and 1.
 */
export function generateMosaicGrid(
  rows: number,
  columns: number,
  densityAt: (row: number, totalRows: number) => number,
  seed?: number
): MosaicCell[] {
  const rand = seed !== undefined ? mulberry32(seed) : Math.random;
  const cells: MosaicCell[] = [];

  for (let row = 0; row < rows; row++) {
    const probability = densityAt(row, rows);
    for (let col = 0; col < columns; col++) {
      if (rand() < probability) {
        cells.push({ color: MOSAIC_COLORS[Math.floor(rand() * MOSAIC_COLORS.length)] });
      } else {
        cells.push({ color: null });
      }
    }
  }

  return cells;
}

export function heroDensity(row: number, totalRows: number): number {
  const t = row / (totalRows - 1);
  return Math.max(0, 1 - t * t * 0.95);
}

export function intakeDensity(row: number, totalRows: number): number {
  const t = row / (totalRows - 1);
  const maxDensity = 0.55; 
  return Math.max(0, maxDensity * t * t);
}