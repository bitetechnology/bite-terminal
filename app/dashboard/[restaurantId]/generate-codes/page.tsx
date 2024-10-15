"use client";
import { useCallback, useState } from "react";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import QrCodeGenerator from "@/components/QrGenerator/QrGenerator";
import { createQRCode } from "@/utils/qrCodeConfig";
import { createRoundedCanvas } from "@/utils/canvasUtils";

// const restaurantId = "your-restaurant-id"; // Replace with actual restaurant ID

const Home = ({ params }: { params: { restaurantId: string } }) => {
  const { restaurantId } = params;
  const [tableCount, setTableCount] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleDownloadAll = async () => {
    setIsGenerating(true);
    const zip = new JSZip();

    for (let i = 1; i <= tableCount; i++) {
      const data = `https://bite.technology/menu/${restaurantId}/${i}`;
      const qrCode = createQRCode({ data });

      // Get the QR code as a Blob
      const blob = await qrCode.getRawData("png");

      // Convert Blob to Data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        if (blob) reader.readAsDataURL(blob);
      });

      // Create an image element
      const image = new Image();
      image.src = dataUrl;

      // Wait for the image to load
      await new Promise<void>((resolve) => {
        image.onload = () => {
          // Create a canvas with rounded corners
          const canvas = createRoundedCanvas(
            image,
            qrCode._options.width,
            qrCode._options.height,
            20, // Adjust border radius as needed
            i
          );

          // Convert canvas to Blob
          canvas.toBlob((roundedBlob) => {
            if (roundedBlob) {
              zip.file(`table-${i}.png`, roundedBlob);
              resolve();
            }
          });
        };
      });
    }

    // Generate the ZIP file and prompt download
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "qr-codes.zip");
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">QR Code Generator for Tables</h1>

      {/* Example QR Code */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Example QR Code:</h2>
        <QrCodeGenerator
          data={`https://bite.technology/menu/${restaurantId}/1`}
          width={200}
          height={200}
          colorDark="#000000"
          colorLight="#ffffff"
          dotStyle="rounded"
        />
      </div>

      {/* Table Number Selector */}
      <div className="mb-6">
        <label htmlFor="tableCount" className="block text-lg font-medium mb-2">
          Number of Tables (1-32):
        </label>
        <input
          type="number"
          id="tableCount"
          name="tableCount"
          min={1}
          max={32}
          value={tableCount}
          onChange={(e) => setTableCount(Number(e.target.value))}
          className="border border-gray-300 p-2 rounded w-32 text-center"
        />
      </div>

      {/* Generate and Download Button */}
      <button
        onClick={handleDownloadAll}
        disabled={isGenerating}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${
          isGenerating ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isGenerating ? "Generating..." : "Download QR Codes"}
      </button>
    </div>
  );
};

export default Home;
