import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontPath = path.resolve(__dirname, "../font/IBMPlexMono-SemiBold.ttf");

export async function generateQuoteImage(quote: string): Promise<Uint8Array> {
  const fontData = fs.readFileSync(fontPath);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1080px",
          height: "1080px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          background: "#fef9f4",
          color: "#222",
          fontFamily: "IBM Plex Mono",
          fontSize: "48px",
          padding: "80px",
          whiteSpace: "pre-wrap",
        },
        children: `"${quote}"`,
      },
    } as any,
    {
      width: 1080,
      height: 1080,
      fonts: [
        {
          name: "IBM Plex Mono",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1080 } });
  const png = resvg.render();
  fs.writeFileSync("quote.png", png.asPng());

  console.log("✅ Image generated successfully!");

  return png.asPng();
}
