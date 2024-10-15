export const createRoundedCanvas = (
  image: HTMLImageElement,
  width: number,
  height: number,
  borderRadius: number,
  tableNumber: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");

  // Variables for spacing
  const padding = 20; // Padding around the image
  const textMargin = 5; // Margin between the image and the table number text
  const textHeight = 25; // Approximate height of the text area

  // Increase the canvas height to accommodate the text and margins
  canvas.width = width;
  canvas.height = height + textMargin + textHeight;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Define the new height for the rounded rectangle
    const rectHeight = height + textMargin + textHeight;

    // Draw the background (green) with rounded corners
    ctx.fillStyle = "#14de91"; // Set your desired background color
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(width - borderRadius, 0);
    ctx.quadraticCurveTo(width, 0, width, borderRadius);
    ctx.lineTo(width, rectHeight - borderRadius);
    ctx.quadraticCurveTo(width, rectHeight, width - borderRadius, rectHeight);
    ctx.lineTo(borderRadius, rectHeight);
    ctx.quadraticCurveTo(0, rectHeight, 0, rectHeight - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.fill();

    // Set clipping region for rounded corners
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(width - borderRadius, 0);
    ctx.quadraticCurveTo(width, 0, width, borderRadius);
    ctx.lineTo(width, rectHeight - borderRadius);
    ctx.quadraticCurveTo(width, rectHeight, width - borderRadius, rectHeight);
    ctx.lineTo(borderRadius, rectHeight);
    ctx.quadraticCurveTo(0, rectHeight, 0, rectHeight - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.clip();

    // Draw the image onto the canvas with padding
    ctx.drawImage(
      image,
      padding,
      padding,
      width - padding * 2,
      height - padding * 2
    );

    ctx.restore();

    // Add the table number to the canvas
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // Position the text below the image with specified margin
    ctx.fillText(`Table ${tableNumber}`, width / 2, height + textMargin);
  }

  return canvas;
};
