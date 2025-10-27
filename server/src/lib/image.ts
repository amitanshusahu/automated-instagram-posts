import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontPath = path.resolve(__dirname, "../font/IBMPlexMono-SemiBold.ttf");

export async function generateQuoteImage(quote: string): Promise<Uint8Array> {
  const fontData = fs.readFileSync(fontPath);
  const imageData = fs.readFileSync(path.resolve(__dirname, "../image/bg2.png"));
  const base64Image = imageData.toString("base64");

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1080px",
          height: "1080px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundImage: `url(data:image/png;base64,${base64Image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#222",
          fontFamily: "IBM Plex Mono",
          padding: "100px 80px",
          textAlign: "center",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                fontSize: "28px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "#555",
              },
              children: "Daily Dev Quotes",
            },
          },
          {
            type: "div",
            props: {
              style: {
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "48px",
                lineHeight: 1.5,
                padding: "0 40px",
                maxWidth: "800px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              },
              children: `“${quote}”`,
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: "24px",
                color: "#888",
                letterSpacing: "2px",
              },
              children: "@dailydev_quotes",
            },
          },
        ],
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

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1080 },
    background: "white",
  });

  const png = resvg.render();
  // const outputPath = path.resolve(__dirname, "quote.png");
  // fs.writeFileSync(outputPath, png.asPng());
  console.log("✅ Quote image generated:");
  return png.asPng();
}

// quick test
// generateQuoteImage("The only way to do great work is to love what you do").catch(console.error);
