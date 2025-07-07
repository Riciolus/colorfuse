"use client";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [tableSize, setTableSize] = useState({ vertical: 5, horizontal: 7 });

  const [colors, setColors] = useState<string[][]>(
    Array.from({ length: tableSize.vertical }, () =>
      Array.from({ length: tableSize.horizontal }, () => "#525252"),
    ),
  );

  const [dragStart, setDragStart] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ row: number; col: number } | null>(
    null,
  );

  // 🧠 Watch dragStart and dragEnd together
  useEffect(() => {
    if (!dragStart || !dragEnd) return;
    generateGradientFromDrag(dragStart, dragEnd);
    setDragStart(null);
    setDragEnd(null);
  }, [dragStart, dragEnd]);

  // 🎨 Gradient Generation Logic
  function generateGradientFromDrag(
    dragStart: { row: number; col: number },
    dragEnd: { row: number; col: number },
  ) {
    const { row: startRow, col: startCol } = dragStart;
    const { row: endRow, col: endCol } = dragEnd;

    // Only allow horizontal drag
    if (startRow !== endRow) return;

    const row = startRow;
    const startColor = colors[row][startCol];
    const endColor = colors[row][endCol];

    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    const newRow = [...colors[row]];

    for (let col = minCol + 1; col < maxCol; col++) {
      const t = (col - minCol) / (maxCol - minCol);
      newRow[col] = interpolateHexColor(startColor, endColor, t);
    }

    newRow[startCol] = startColor;
    newRow[endCol] = endColor;

    const newColors = [...colors];
    newColors[row] = newRow;
    setColors(newColors);
  }

  // 🔁 Interpolation Logic
  function interpolateHexColor(a: string, b: string, t: number) {
    const c1 = hexToRgb(a);
    const c2 = hexToRgb(b);

    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b_ = Math.round(c1.b + (c2.b - c1.b) * t);

    return rgbToHex({ r, g, b: b_ });
  }

  function hexToRgb(hex: string) {
    hex = hex.replace("#", "");
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }

  function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div>
        <div className="flex">
          <div className="flex flex-col gap-2">
            {Array.from({ length: tableSize.vertical }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex gap-2">
                {Array.from({ length: tableSize.horizontal }).map(
                  (_, colIndex) => (
                    <div
                      key={colIndex}
                      className="h-16 w-16 overflow-hidden rounded-lg border-2 border-neutral-700 bg-neutral-500 transition hover:scale-105"
                    >
                      <span className="block h-4 ps-1 text-xs text-neutral-300">
                        {colors[rowIndex][colIndex]}
                      </span>
                      <input
                        type="color"
                        value={colors[rowIndex][colIndex]}
                        onChange={(e) => {
                          const newColors = colors.map((row) => [...row]);
                          newColors[rowIndex][colIndex] = e.target.value;
                          setColors(newColors);
                        }}
                        onMouseDown={() =>
                          setDragStart({ row: rowIndex, col: colIndex })
                        }
                        onMouseUp={() =>
                          setDragEnd({ row: rowIndex, col: colIndex })
                        }
                        className="h-[120%] w-[120%] -translate-x-1 -translate-y-1 cursor-pointer appearance-none border-none bg-transparent p-0"
                      />
                    </div>
                  ),
                )}
              </div>
            ))}
          </div>

          {/* Vertical Resize Buttons */}
          <div className="border-line ml-3 flex h-20 w-8 flex-col items-center justify-center gap-2 rounded-full border-2 bg-amber-200/70 p-3">
            <button
              className="cursor-pointer"
              onClick={() =>
                setTableSize((prev) => ({
                  ...prev,
                  vertical: Math.min(10, prev.vertical + 1),
                }))
              }
            >
              +
            </button>
            <button>{tableSize.vertical}</button>
            <button
              className="cursor-pointer"
              onClick={() =>
                setTableSize((prev) => ({
                  ...prev,
                  vertical: Math.max(1, prev.vertical - 1),
                }))
              }
            >
              -
            </button>
          </div>
        </div>

        {/* Horizontal Resize Buttons */}
        <div className="mt-3 flex h-8 w-20 flex-row items-center justify-center gap-2 rounded-full border-2 bg-amber-200/70 p-3">
          <button
            className="cursor-pointer"
            onClick={() =>
              setTableSize((prev) => ({
                ...prev,
                horizontal: Math.min(12, prev.horizontal + 1),
              }))
            }
          >
            +
          </button>
          <button>{tableSize.horizontal}</button>
          <button
            className="cursor-pointer"
            onClick={() =>
              setTableSize((prev) => ({
                ...prev,
                horizontal: Math.max(1, prev.horizontal - 1),
              }))
            }
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
}
