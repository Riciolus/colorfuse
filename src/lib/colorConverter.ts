export function interpolateHexColor(a: string, b: string, t: number) {
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
