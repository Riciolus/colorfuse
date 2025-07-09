"use client";
import { interpolateHexColor } from "@/lib/colorConverter";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

type TableSize = {
  vertical: number;
  horizontal: number;
};

export default function Home() {
  const [tableSize, setTableSize] = useState<TableSize>({
    vertical: 5,
    horizontal: 7,
  });

  const updateTableSize = (
    direction: "vertical" | "horizontal",
    action: "increment" | "decrement",
  ) => {
    setTableSize((prev) => {
      const dir = direction === "vertical" ? prev.vertical : prev.horizontal;
      const max = direction === "vertical" ? 5 : 7;
      const next =
        action === "increment" ? Math.min(max, dir + 1) : Math.max(1, dir - 1);
      return {
        ...prev,
        [direction]: next,
      };
    });
  };

  return (
    <div className="flex flex-col items-start justify-start p-6">
      <div className="flex">
        <ColorGeneratorTable tableSize={tableSize} />

        <ResizeControl
          direction="vertical"
          value={tableSize.vertical}
          onUpdate={updateTableSize}
        />
      </div>

      <ResizeControl
        direction="horizontal"
        value={tableSize.horizontal}
        onUpdate={updateTableSize}
      />

      <Spacer />

      <TutorialPreview />
    </div>
  );
}

const ColorGeneratorTable = ({ tableSize }: { tableSize: TableSize }) => {
  const [colors, setColors] = useState<string[][]>(
    Array.from({ length: tableSize.vertical }, (_, rowIndex) =>
      Array.from({ length: tableSize.horizontal }, (_, colIndex) => {
        if (rowIndex === 0 && [0].includes(colIndex)) {
          return "#b673e2";
        }
        if (rowIndex === 0 && [1].includes(colIndex)) {
          return "#81a1a7";
        }
        if (rowIndex === 0 && [2].includes(colIndex)) {
          return "#4bd06c";
        }
        if (rowIndex === 0 && [3].includes(colIndex)) {
          return "#16fe31";
        }
        return "#525252"; // default
      }),
    ),
  );

  const [dragStart, setDragStart] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ row: number; col: number } | null>(
    null,
  );

  const copyColorValue = (color: string) => {
    navigator.clipboard
      .writeText(color)
      .then(() => console.log("Copied:", color))
      .catch((err) => console.error("Failed to copy:", err));
  };

  useEffect(() => {
    if (dragStart && dragEnd) {
      generateGradientFromDrag(dragStart, dragEnd);
      setDragStart(null);
      setDragEnd(null);
    }
  }, [dragStart, dragEnd]);

  function generateGradientFromDrag(
    dragStart: { row: number; col: number },
    dragEnd: { row: number; col: number },
  ) {
    const { row: r1, col: c1 } = dragStart;
    const { row: r2, col: c2 } = dragEnd;

    const startColor = colors[r1]?.[c1] ?? "#525252";
    const endColor = colors[r2]?.[c2] ?? "#525252";

    const newColors = colors.map((row) => [...row]);

    const isHorizontal = r1 === r2;
    const isVertical = c1 === c2;
    const isDiagonal = Math.abs(r2 - r1) === Math.abs(c2 - c1);

    if (isHorizontal) {
      const row = r1;
      const minCol = Math.min(c1, c2);
      const maxCol = Math.max(c1, c2);

      for (let col = minCol; col <= maxCol; col++) {
        const t = (col - minCol) / (maxCol - minCol);
        newColors[row] ??= [];
        newColors[row][col] = interpolateHexColor(startColor, endColor, t);
      }
    }

    if (isVertical) {
      const col = c1;
      const minRow = Math.min(r1, r2);
      const maxRow = Math.max(r1, r2);

      for (let row = minRow; row <= maxRow; row++) {
        const t = (row - minRow) / (maxRow - minRow);
        (newColors[row] ??= [])[col] = interpolateHexColor(
          startColor,
          endColor,
          t,
        );
      }
    }

    if (isDiagonal) {
      const steps = Math.abs(r2 - r1);
      const rowDir = r2 > r1 ? 1 : -1;
      const colDir = c2 > c1 ? 1 : -1;

      for (let i = 0; i <= steps; i++) {
        const row = r1 + i * rowDir;
        const col = c1 + i * colDir;
        const t = i / steps;
        (newColors[row] ??= [])[col] = interpolateHexColor(
          startColor,
          endColor,
          t,
        );
      }
    }

    setColors(newColors);
  }

  return (
    <div className="flex min-h-[50vh] flex-col gap-2">
      {Array.from({ length: tableSize.vertical }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {Array.from({ length: tableSize.horizontal }).map((_, colIndex) => {
            const colorCode = colors[rowIndex]?.[colIndex] ?? "#525252";

            return (
              <div
                key={colIndex}
                className="h-16 w-16 overflow-hidden rounded-lg border-2 border-neutral-700 bg-neutral-500 transition hover:scale-110"
              >
                <span
                  onClick={() => copyColorValue(colorCode)}
                  className="block h-4 cursor-zoom-in ps-1 text-xs text-neutral-300"
                >
                  {colorCode}
                </span>
                <input
                  type="color"
                  value={colorCode}
                  onContextMenu={(e) => e.preventDefault()}
                  onChange={(e) => {
                    const newColors = colors.map((row) => [...row]);
                    (newColors[rowIndex] ??= [])[colIndex] = e.target.value;

                    setColors(newColors);
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 2) {
                      // right-click only
                      setDragStart({ row: rowIndex, col: colIndex });
                    }
                  }}
                  onMouseUp={(e) => {
                    if (e.button === 2) {
                      setDragEnd({ row: rowIndex, col: colIndex });
                    }
                  }}
                  className={cn(
                    dragStart ? "cursor-grab" : "cursor-pointer",
                    "h-[120%] w-[120%] -translate-x-1 -translate-y-1 appearance-none border-none bg-transparent p-0",
                  )}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const ResizeControl = ({
  direction,
  value,
  onUpdate,
}: {
  direction: "vertical" | "horizontal";
  value: number;
  onUpdate: (
    direction: "vertical" | "horizontal",
    action: "increment" | "decrement",
  ) => void;
}) => {
  const isVertical = direction === "vertical";
  return (
    <div
      className={cn(
        "border-line-dark cursor-pointer rounded-full border-2 bg-amber-200/70 p-3",
        isVertical
          ? "ml-3 flex h-20 w-8 flex-col items-center justify-center gap-2"
          : "mt-3 flex h-8 w-20 flex-row items-center justify-center gap-2",
      )}
    >
      <button
        onClick={() => onUpdate(direction, "increment")}
        className="cursor-pointer"
      >
        +
      </button>
      <button>{value}</button>
      <button
        onClick={() => onUpdate(direction, "decrement")}
        className="cursor-pointer"
      >
        -
      </button>
    </div>
  );
};

const TutorialPreview = () => {
  return (
    <div className="mt-6 flex w-full flex-col items-center justify-center rounded-lg text-sm">
      <h3 className="mb-2 p-2 text-base font-semibold">How to use:</h3>
      <ul className="space-y-3">
        <li>
          <p>1. Hover over a color box and click to change its color</p>{" "}
          <Image
            width={100}
            height={50}
            src="/gifs/tutorial-1-v1.gif"
            alt="Gradient directions"
            className="w-full max-w-sm rounded-lg border"
          />
        </li>

        <li>
          <p>
            2. Click and drag from one color box to another to create a gradient
            with right click
          </p>
          <Image
            width={100}
            height={50}
            src="/gifs/tutorial-2-v1.gif"
            alt="Gradient directions"
            className="w-full max-w-sm rounded-lg border"
          />
        </li>
        <li>3. Works for horizontal, vertical, and diagonal gradients</li>
        <li>4. Use the + and - buttons to adjust grid size</li>
        <li>5. Click the color code to copy it</li>
      </ul>
    </div>
  );
};

const Spacer = () => {
  return (
    <div className="spacer w-full py-10">
      <div className="border-line-dark/40 w-full border-t" />
    </div>
  );
};
