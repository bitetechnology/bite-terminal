export const createRoundedCanvas = (
  image: HTMLImageElement,
  width: number,
  height: number,
  borderRadius: number,
  tableNumber: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");

  // Define padding around the image
  const padding = 20; // Adjust as needed
  const additionalSpace = 30; // Space for the table number text

  canvas.width = width + padding * 2;
  canvas.height = height + padding * 2 + additionalSpace;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Move the drawing context to account for padding
    ctx.translate(padding, padding);

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

    // Reset transform for text drawing
    ctx.resetTransform();

    // **Add the table number to the canvas with more space**
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `Table ${tableNumber}`,
      canvas.width / 2,
      height + padding * 2 + additionalSpace / 2
    );
  }

  return canvas;
};
