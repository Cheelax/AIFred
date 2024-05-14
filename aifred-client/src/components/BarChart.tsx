import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const BarChart = ({
  data,
  startingColor,
}: {
  data: any;
  startingColor: any;
}) => {
  // Convertit une couleur RGB en format string pour Nivo
  const rgbToString = (r: number, g: number, b: number) =>
    `rgb(${r}, ${g}, ${b})`;

  // Convertit une valeur de couleur RGB en HSL
  function rgbToHsl(r: any, g: any, b: any) {
    (r /= 255), (g /= 255), (b /= 255);
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      let h: number = 0; // Add default value for 'h'
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  }

  // Convertit une valeur de couleur HSL en RGB
  function hslToRgb(h: any, s: any, l: any) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      let hue2rgb = function hue2rgb(p: any, q: any, t: any) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // Convertit la couleur de départ en HSL, génère des couleurs et les convertit en RGB
  const generateColors = (
    startingColor: { r: number; g: number; b: number },
    count: number
  ) => {
    const [h = 0, s = 0, l = 0]: (number | undefined)[] = rgbToHsl(
      startingColor.r,
      startingColor.g,
      startingColor.b
    );
    console.log(`h: ${h}, s: ${s}, l: ${l}`); // Log h, s, l values

    let colors = [];
    let hueIncrement = 360 / count; // Répartit les couleurs uniformément autour du cercle chromatique
    console.log(`hueIncrement: ${hueIncrement}`); // Log hueIncrement value

    for (let i = 0; i < count; i++) {
      const [r, g, b] = hslToRgb((h + hueIncrement * i) % 1, s, l);
      const color = rgbToString(r, g, b);
      colors.push(color);
      console.log(`color ${i}: ${color}`); // Log each generated color
    }
    return colors;
  };

  // Appliquez les couleurs générées à vos données
  console.log("Transformed data", data.length);
  console.log("DATA", data);

  const transformedData: any[] = Object.entries(data).map(
    ([category, scores]) => {
      // Assurez-vous que 'scores' est bien un tableau de nombres. Utilisez une annotation de type ou une vérification de type si nécessaire.
      if (
        !Array.isArray(scores) ||
        scores.some((score) => typeof score !== "number")
      ) {
        console.error("Invalid scores data", scores);
        throw new Error("Invalid scores data");
      }
      const averageScore =
        scores.reduce((acc, cur) => acc + cur, 0) / scores.length;
      return { category, score: averageScore };
    }
  );
  const colors = generateColors(startingColor, transformedData.length);
  console.log("colors", colors);

  if (!Array.isArray(transformedData)) {
    console.log("OUTTT");
    console.error("Invalid data:", data);
    return null;
  }

  //   const transformedData = Object.entries(data).map(([category, scores]) => ({
  //     category,
  //     score: scores[0], // Si chaque tableau a un seul élément, utilisez scores[0]. Sinon, vous devrez peut-être calculer une moyenne ou une somme.
  //   }));

  console.log(transformedData);

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={transformedData}
        keys={["score"]}
        indexBy="category"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={colors}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Category",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Score",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        animate={true}
      />
    </div>
  );
};

export default BarChart;
