export const createRoundedCanvas = (
  image: HTMLImageElement,
  width: number,
  height: number,
  borderRadius: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Draw rounded rectangle path
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(width - borderRadius, 0);
    ctx.quadraticCurveTo(width, 0, width, borderRadius);
    ctx.lineTo(width, height - borderRadius);
    ctx.quadraticCurveTo(width, height, width - borderRadius, height);
    ctx.lineTo(borderRadius, height);
    ctx.quadraticCurveTo(0, height, 0, height - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.clip();

    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0, width, height);
  }

  return canvas;
};
