// utils/qrCodeConfig.ts

import QRCodeStyling, { Options } from "qr-code-styling";

interface QRCodeConfigOptions {
  data: string;
  width?: number;
  height?: number;
  colorDark?: string;
  colorLight?: string;
  dotStyle?:
    | "dots"
    | "rounded"
    | "classy"
    | "classy-rounded"
    | "square"
    | "extra-rounded";
}

export const createQRCode = ({
  data,
  width = 300,
  height = 300,
  colorDark = "#000000",
  colorLight = "#14de91",
  dotStyle = "rounded",
}: QRCodeConfigOptions): QRCodeStyling => {
  return new QRCodeStyling({
    width,
    height,
    type: "canvas",
    data,
    image: "/logo.jpeg",
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10,
    },
    margin: 5,
    dotsOptions: {
      color: colorDark,
      type: dotStyle,
    },
    backgroundOptions: {
      color: colorLight,
    },
  });
};
