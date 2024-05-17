import chroma from "chroma-js";

export const buttonThemeColoring = (themeColorHex: string | undefined): any => {
  if (!themeColorHex) {
    return {};
  }

  const themeColoring = chroma(themeColorHex);

  return {
    backgroundColor: themeColoring.hex(),
    color: themeColoring.luminance() > 0.4 ? "#32363E" : "#f5f5f5",
    "&:hover": {
      backgroundColor: themeColoring.darken().hex(),
      color: themeColoring.darken().luminance() > 0.4 ? "#32363E" : "#f5f5f5",
    },
  };
};
