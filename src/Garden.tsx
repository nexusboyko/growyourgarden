import React from 'react'
import { FlowerGoal, GardenTilePositions, GardenTileType, GardenTileTypes, Goals, GRID_SIZE } from './types'
import GardenTile from './GardenTile'

const Garden = ({tileMapping}: {tileMapping: GardenTilePositions}) => {
  // TODO: Move elsewhere + save goal data locally
  const [goals, setGoals] = React.useState<Goals>({});
  const [tileMappings, setTileMappings] = React.useState<GardenTilePositions>(tileMapping);
  const [tileTypes, setTileTypes] = React.useState<GardenTileTypes>(
    // FIXME: Mock tile types
    {
      "rose": {
        id: "rose",
        icon: '🌹',
        name: "Rose",
        description: "A rose is a type of flowering plant in the rose family, Roseaceae."
      },
      "sunflower": {
        id: "sunflower",
        icon: '🌻',
        name: "Sunflower",
        description: "A sunflower is a type of flowering plant in the sunflower family, Asteraceae."
      }
    }
  );

  const [grid, setGrid] = React.useState<(string | null)[][]>(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
  );

  const tileIdLookup = React.useMemo(() => {
    const lookup: Record<string, string> = {};
    Object.entries(tileMappings).forEach(([id, coordinates]) => {
      coordinates.forEach(([x, y]) => {
        lookup[`${x},${y}`] = id;
      });
    });
    return lookup;
  }, [tileMappings]);

  React.useEffect(() => {
    setGrid((prevGrid) =>
      prevGrid.map((row, rowi) =>
        row.map((_, coli) =>
          tileIdLookup[`${rowi},${coli}`] || null
        )
      )
    );
  }, [tileIdLookup]);

  React.useEffect(() => {
    // ...
  }, [grid, tileMappings, tileTypes])

  const dragElementRef = React.useRef<HTMLDivElement | null>(null);
  const [grabbedTile, setGrabbedTile] = React.useState<{ row: number; col: number } | null>(null);

  // New Goal

  const [newGoalPosition, setNewGoalPosition] = React.useState<number[] | null>(null);
  const [showNewGoalPopup, setShowNewGoalPopup] = React.useState<boolean>(false);

  const NewGoal = ({ position }: { position: number[] | null }) => {
    const [title, setTitle] = React.useState("");
    const [expandedTitle, setExpandedTitle] = React.useState("");
    
    if (!position) {
      return;
    }
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      const newGoalId = crypto.randomUUID();

      const newGoal: FlowerGoal = {
        id: newGoalId,
        title,
        expandedTitle,

        currentStage: 0,
        lastPosition: [position[0], position[1]],
        lastWateredDay: new Date().getTime(),
        totalDaysWatered: 0
      };

      const newTileType: GardenTileType = {
        id: newGoalId,
        icon: "🌺",
      };
      
      setShowNewGoalPopup(false);
      saveNewGoal(newGoal, newTileType, position);
    };
  
    return (
      <>
        <div className='fixed inset-0 bg-black backdrop-blur-sm bg-opacity-30 z-0' />
        <div className='fixed inset-0 flex items-center justify-center'>
          <form onSubmit={handleSubmit} className='bg-base-300 rounded-lg shadow-lg p-4 w-fit h-fit'>
            <div className='flex flex-col items-center justify-center gap-y-2 font-semibold'>
              <label className='flex flex-col items-center'>
                Title <input type="text" value={title} onChange={e => setTitle(e.target.value)} className='mt-1' />
              </label>
              <label className='flex flex-col items-center'>
                Description <textarea value={expandedTitle} onChange={e => setExpandedTitle(e.target.value)} className='mt-1' rows={2} />
              </label>
            </div>
            <br />
            <div className="mt-4 gap-1 flex justify-center">
              <button className='btn btn-sm btn-success' type="submit">Add new goal</button>
              <button className='btn btn-sm btn-error' onClick={() => { setShowNewGoalPopup(false); }}>No thanks!</button>
            </div>
          </form>
        </div>
      </>
    );
  }

  function saveNewGoal(newGoal: FlowerGoal, newGoalType: GardenTileType, position: number[]) {
    setGoals((prevGoals) => {
      const newGoals = { ...prevGoals };
      newGoals[newGoal.id] = newGoal;
      return newGoals;
    });
    
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[position[0]][position[1]] = newGoalType.id;
      return newGrid;
    });

    setTileMappings((prevTileMappings) => {
      const newTileMapping = { ...prevTileMappings };
      
      if (!newTileMapping[newGoal.id]) {
        newTileMapping[newGoal.id] = [[position[0], position[1]]];
      }
      
      return newTileMapping;
    });
    
    setTileTypes((prevTileTypes) => {
      const newTileType = { ...prevTileTypes };
      newTileType[newGoalType.id] = newGoalType;
      return newTileType;
    });

    console.log('save goal', newGoal, 'with tile info ', newGoalType, 'at', position);

    setShowNewGoalPopup(false);
  }

  // Grid + Tile

  function handleTileDrag(e: React.DragEvent<HTMLDivElement>) {
    e.currentTarget.classList.add('!cursor-grabbing');
  }
  
  function handleTileDragStart(e: React.DragEvent<HTMLDivElement>, row: number, col: number) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setDragImage(e.currentTarget, 5, 5);
    e.currentTarget.classList.add("!cursor-grabbing");
    e.dataTransfer.setData("text/plain", `${row},${col}`);
    setGrabbedTile({ row, col });
  }

  function handleTileDragOver(e: React.DragEvent<HTMLDivElement>, row: number, col: number) {
    e.preventDefault();
    if (row !== grabbedTile?.row || col !== grabbedTile?.col) {
      if (grid[row][col] === null) {
        e.currentTarget.classList.add("!bg-blue-500/40");
      } else {
        e.currentTarget.classList.add("!bg-red-500/30");
      }
    }
  }

  function handleTileDragEnter(
    e: React.DragEvent<HTMLDivElement>,
    row: number,
    col: number
  ) {
    if (
      grabbedTile &&
      grabbedTile.row === row &&
      grabbedTile.col === col
    ) {
      e.currentTarget.classList.remove('!bg-green-500/40');
    } else {
      if (grid[row][col] === null) {
        e.currentTarget.classList.add('!bg-blue-500/40');
      } else {
        e.currentTarget.classList.add('!bg-red-500/30');
      }
    }
  }

  function handleTileDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.currentTarget.classList.remove("!bg-red-500/30");
    e.currentTarget.classList.remove("!bg-blue-500/40");
  }

  function handleTileDragEnd(e: React.DragEvent<HTMLDivElement>) {
    e.currentTarget.classList.remove("!cursor-grabbing");
  }

  function handleTileDrop(e: React.DragEvent<HTMLDivElement>, row: number, col: number) {
    e.preventDefault();
    e.currentTarget.classList.remove("!bg-blue-500/40");
    e.currentTarget.classList.remove("!bg-red-500/30");

    if (grabbedTile) {
      if (row !== grabbedTile.row || col !== grabbedTile.col) {
        if (grid[row][col] === null) {
          setGrid((prevGrid) =>
            prevGrid.map((rowVal, rIndex) =>
              rowVal.map((cellValue, cIndex) => {
                if (rIndex === grabbedTile.row && cIndex === grabbedTile.col) {
                  return null;
                } else if (rIndex === row && cIndex === col) {
                  return prevGrid[grabbedTile.row][grabbedTile.col];
                }
                return cellValue;
              })
            )
          );
        }
      }
      setGrabbedTile(null);
    }
  }

  
  function handleTileClick(row: number, col: number) {
    if (grid[row][col]) {
      // TODO: Water - GROW existing goal flower

      // ...

    } else {
      setNewGoalPosition([row, col]);
      setShowNewGoalPopup(true);
    }
  }
  
  return (
    <>
      {showNewGoalPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <NewGoal position={newGoalPosition} />
        </div>
      )}
      
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1px',
          width: '100%',
          aspectRatio: '1/1',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {
          grid.map((row, rowi) => {
            return row.map((tileId, coli) => {
              return (
                <GardenTile
                  key={`${rowi}-${coli}`}
                  id={tileId || "ground"} //  null == "ground"
                  position={[rowi, coli]}
                  goal={goals[tileId || "ground"]}
                  type={tileTypes[tileId || "ground"]}
      
                  dragElementRef={dragElementRef}
                  handleTileDrag={handleTileDrag}
                  handleTileDragStart={handleTileDragStart}
                  handleTileDragOver={handleTileDragOver}
                  handleTileDrop={handleTileDrop}
                  handleTileDragEnd={handleTileDragEnd}
                  handleTileDragEnter={handleTileDragEnter}
                  handleTileDragLeave={handleTileDragLeave}
                  
                  onClick={handleTileClick}
                />
              );
            });
          })
        }
      </div>
    </>
  )
}

export default Garden