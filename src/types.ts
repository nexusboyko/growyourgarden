// N x N grid size

export const GRID_SIZE = 20;

// Flower goal

export type FlowerGoal = {
  id: string; // Unique ID
  title: string; // Short label
  expandedTitle: string; // One-sentence description

  // ...

  currentStage: number; // Growth stage: 0 (Seed), 1 (Bud), 2 (Bloom)
  daysWatered: number; // Watering progress for current stage
  daysToGrow: number; // Days required to progress to the next stage

  lastWatered: string; // Timestamp of last watering
};

// Tile positions in garden grid

export type GardenTileMapping = {
  [id: string]: [number, number][]; // ID to list of coordinates
};

// Tile "types" (i.e. icons)

export type GardenTileType = {
  id: string; // Unique identifier for the tile
  // null == no icon/ground tile
  icon: string | null;  // Icon path or emoji for rendering
  
  // ...
  
  name?: string; // Readable name of the tile (for tooltips, etc.)
  description?: string; // Optional: Additional details about the tile
};