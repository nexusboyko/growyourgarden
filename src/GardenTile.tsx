import React from 'react';
import { FlowerGoal, GardenTileType } from './types';

const GardenTile = ({
  id,
  position,
  goal,
  type,

  dragElementRef,
  handleTileDrag,
  handleTileDragStart,
  handleTileDragOver,
  handleTileDrop,
  handleTileDragEnd,
  handleTileDragEnter,
  handleTileDragLeave,

  onClick,
}: {
  id?: string;
  position: [number, number];
  goal: FlowerGoal | null;
  type: GardenTileType | null;
  
  dragElementRef: React.RefObject<HTMLDivElement>;
  handleTileDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  handleTileDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    row: number,
    col: number
  ) => void;
  handleTileDragOver: (
    e: React.DragEvent<HTMLDivElement>,
    row: number,
    col: number
  ) => void;
  handleTileDrop: (
    e: React.DragEvent<HTMLDivElement>,
    row: number,
    col: number
  ) => void;
  handleTileDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  handleTileDragEnter: (
    e: React.DragEvent<HTMLDivElement>,
    row: number,
    col: number
  ) => void;
  handleTileDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;

  onClick?: (row: number, col: number) => void
}) => {
  const x = position[0];
  const y = position[1];

  return (
    <div
      key={id}
      id={id}
      
      className={`select-none text-black font-bold aspect-square rounded-sm
        ${type?.icon ? 'hover:cursor-grab bg-green-500' : 'hover:cursor-pointer bg-slate-600/50'} 
        flex items-center justify-center tile h-full w-full`}

      style={{
        aspectRatio: '1 / 1',
      }}

      ref={dragElementRef}
      draggable={type?.icon ? true : false}
      onDrag={(e) => handleTileDrag(e)}
      onDragStart={(e) => handleTileDragStart(e, x, y)}
      onDragOver={(e) => handleTileDragOver(e, x, y)}
      onDrop={(e) => handleTileDrop(e, x, y)}
      onDragEnd={(e) => handleTileDragEnd(e)}
      onDragEnter={(e) => handleTileDragEnter(e, x, y)}
      onDragLeave={(e) => handleTileDragLeave(e)}
      onClick={() => onClick?.(x, y)}
    >
      {/* No type?.icon = ground (empty) tile */}
      {type?.icon === null ? '' : (
          goal?.currentStage == 0 ? '🌰' : goal?.currentStage === 1 ? '🌱' : type?.icon
      )}
    </div>
  );
};

export default GardenTile;

