// User data

export type UserGarden = {
  _id: string;
  name: string;

  // ...

  goals: Goals;
  tiles: GardenTilePositions;
  icons: GardenTileTypes;
}

// N x N grid size

export const GRID_SIZE = 20;

// Flower goal

export type FlowerGoal = {
  id: string; // Unique ID
  title: string; // Short label
  expandedTitle: string; // One-sentence description

  // ...

  currentStage: number; // Growth stage: 0 (Seed), 1 (Bud), 2 (Bloom)
  lastPosition: [number, number]; // [row, col] of the newest flower
  lastWateredDay: number; // Track the last day the flower was watered
  totalDaysWatered: number; // Total number of days this flower has been watered
};

// All (unique) goals in the garden

export type Goals = {
  [id: string]: FlowerGoal;
}

// Tile positions in garden grid

export type GardenTilePositions = {
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

// All (unique) tile types in the garden

export type GardenTileTypes = {
  [id: string]: GardenTileType;
}