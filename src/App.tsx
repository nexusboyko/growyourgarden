import React from 'react';

function App() {
  const dragElementRef = React.useRef<HTMLDivElement | null>(null);
  const [grid, setGrid] = React.useState<string[][]>(
    Array.from({ length: 5 }, () => Array(5).fill(''))
  );

  const [grabbedTile, setGrabbedTile] = React.useState<{
    row: number;
    col: number;
  } | null>(null);

  function handleTileDragStart(
    e: React.DragEvent<HTMLDivElement>,
    row: number,
    col: number
  ) {
    // drag image
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(e.currentTarget, 5, 5);
    // cursor change
    e.currentTarget.classList.add('!cursor-grabbing');

    //  transfer data via drag/drop
    e.dataTransfer.setData('text/plain', `${row},${col}`);

    setGrabbedTile({ row, col });
  }

  function handleTileDrag(e: React.DragEvent<HTMLDivElement>) {
    e.currentTarget.classList.add('!cursor-grabbing');
  }

  function handleTileDragOver(
    e: React.DragEvent<HTMLDivElement>,
    row: number,
    col: number
  ) {
    e.preventDefault();
    if (row !== grabbedTile?.row && col !== grabbedTile?.col) {
      if (grid[row][col] === '') {
        e.currentTarget.classList.add('!bg-blue-500/40');
      } else {
        e.currentTarget.classList.add('!bg-red-500/30');
      }
    }
  }

  function handleTileDragEnter(
    e: React.DragEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number
  ) {
    if (
      grabbedTile &&
      grabbedTile.row === rowIndex &&
      grabbedTile.col === colIndex
    ) {
      e.currentTarget.classList.remove('!bg-green-500/40');
    } else {
      if (grid[rowIndex][colIndex] === '') {
        e.currentTarget.classList.add('!bg-blue-500/40');
      } else {
        e.currentTarget.classList.add('!bg-red-500/30');
      }
    }
  }

  function handleTileDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.currentTarget.classList.remove('!bg-red-500/30');
    e.currentTarget.classList.remove('!bg-blue-500/40');
  }

  function handleTileDragEnd(e: React.DragEvent<HTMLDivElement>) {
    e.currentTarget.classList.remove('!cursor-grabbing');
  }

  function handleTileDrop(
    e: React.DragEvent<HTMLDivElement>,
    row: number,
    col: number
  ) {
    e.preventDefault();
    e.currentTarget.classList.remove('!bg-blue-500/40');
    e.currentTarget.classList.remove('!bg-red-500/30');

    if (grabbedTile) {
      // same position, no change
      if (row === grabbedTile.row && col === grabbedTile.col) {
        //
      }
      // different position + empty!
      else if (grid[row][col] === '') {
        // move grabbed tile to new position
        setGrid(
          grid.map((rowVal, rIndex) =>
            rowVal.map((cellValue, cIndex) => {
              if (rIndex === grabbedTile.row && cIndex === grabbedTile.col) {
                return '';
              } else if (rIndex === row && cIndex === col) {
                return grid[grabbedTile.row][grabbedTile.col];
              }
              return cellValue;
            })
          )
        );
      }

      setGrabbedTile(null);
    }
  }

  React.useEffect(() => {
    setGrid(
      grid.map((rowVal, rIndex) =>
        rowVal.map((cell, cIndex) =>
          (rIndex === 0 && cIndex === 0) || (rIndex === 0 && cIndex === 1)
            ? cIndex === 0
              ? '🌷'
              : '🌻'
            : cell
        )
      )
    );
  }, []);

  React.useEffect(() => {
    //
  }, [grid]);

  return (
    <main className="relative h-screen w-screen font-inter">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="m-2 font-bold">Grow Your Garden 🌱</h1>
        <section className="w-[65%] grid grid-cols-2 text-sm mb-4">
          <p className="col-span-2 mb-2 text-center">
            Plant a seed to start a goal. A flower represents smaller, daily
            goals; a tree represents larger, long-term goals.
          </p>
          <p className="p-2 border-r">
            <code>Flowers</code> need to be watered <strong>every day</strong>. With each new
            flower, the next one will grow in <em>twice</em> the time—but make
            sure to water it every day until then! <br />
            Don't worry! You won't lose your flowers if you miss a day, but
            you'll have to wait all over again to get a new one!
          </p>
          <p className="p-2">
            <code>Trees</code> are a little different. They grow slowly, with each branch
            representing a smaller part of the goal—and each leaf its
            completion. If the branches never grow, the tree will wither to a
            stump. If the parts are never completed, the tree will remain bare.{' '}
            <br />
            Don't forget, you choose how big your goal is. The more branches a
            tree has, the longer it will take to grow; the fewer, the quicker!
          </p>
        </section>
        
        <div className="w-56 h-fit flex flex-wrap">
          {grid.map((row, rowIndex) =>
            row.map((_, colIndex) => {
              const filled = grid[rowIndex][colIndex];
              return (
                //  tile
                <div
                  key={colIndex}
                  className={`select-none text-black font-bold w-10 aspect-square rounded-lg
                     ${filled ? 'hover:cursor-grab bg-green-500' : 'bg-slate-600/50'} 
                     flex items-center justify-center`}
                  ref={dragElementRef}
                  draggable={filled ? true : false}
                  onDrag={(e) => handleTileDrag(e)}
                  onDragStart={(e) =>
                    handleTileDragStart(e, rowIndex, colIndex)
                  }
                  onDragOver={(e) => handleTileDragOver(e, rowIndex, colIndex)}
                  onDrop={(e) => handleTileDrop(e, rowIndex, colIndex)}
                  onDragEnd={(e) => handleTileDragEnd(e)}
                  onDragEnter={(e) =>
                    handleTileDragEnter(e, rowIndex, colIndex)
                  }
                  onDragLeave={(e) => handleTileDragLeave(e)}
                >
                  {filled ? filled : ''}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
