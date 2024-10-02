// components/QrCodeGenerator.tsx

import { createQRCode } from "@/utils/qrCodeConfig";
import { useEffect, useState } from "react";

interface QrCodeGeneratorProps {
  data: string;
  width?: number;
  height?: number;
  colorDark?: string;
  colorLight?: string;
  borderRadius?: string;
  dotStyle?:
    | "dots"
    | "rounded"
    | "classy"
    | "classy-rounded"
    | "square"
    | "extra-rounded";
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({
  data,
  width,
  height,
  colorDark,
  colorLight,
  borderRadius = "rounded-lg",
  dotStyle,
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const qrCode = createQRCode({
      data,
      width,
      height,
      colorDark,
      dotStyle,
    });

    qrCode.getRawData("png").then((blob) => {
      const url = URL.createObjectURL(blob as Blob);
      setImageUrl(url);
    });

    // Cleanup
    return () => {
      if (imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [data, width, height, colorDark, colorLight, dotStyle, imageUrl]);

  return (
    <div className={`${borderRadius} overflow-hidden inline-block border-l`}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="QR Code"
          className={`w-full h-full rounded-3xl`}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QrCodeGenerator;
