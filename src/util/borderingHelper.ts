import chroma from "chroma-js";

export const outlineMatchingCondition = (condition: boolean): any => {
  if (!condition) {
    return {};
  }

  return {
    outline: 2,
    outlineColor: "#6366F1",
    outlineStyle: "solid",
    backgroundColor: "rgba(183, 184, 233, 0.4)",
  };
};

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
