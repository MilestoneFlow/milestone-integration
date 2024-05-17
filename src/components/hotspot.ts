import chroma from "chroma-js";
import { FlowOpts } from "../types/flowTypes.ts";

export const MilestoneHotspotId = "milestone_blinking_element";
export const MilestoneHotspotStyleId = "milestone_blinking_element_style";

export const createHotspot = (flowOpts: FlowOpts) => {
  const hotspot = document.createElement("div");
  hotspot.id = MilestoneHotspotId;
  hotspot.className = "milestone_blinking";
  hotspot.style.position = "absolute";
  hotspot.style.top = "50px";
  hotspot.style.pointerEvents = "none";
  hotspot.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;
  hotspot.style.opacity = "0";
  // blinking.style.cursor = 'pointer'

  const hotspotStyle = document.createElement("style");
  hotspotStyle.id = MilestoneHotspotStyleId;
  hotspotStyle.innerText = getHotspotCss(flowOpts.themeColor ?? "#f5f5f5");

  return { hotspot, hotspotStyle };
};

export const existsHotspotStyleInHead = () => {
  return !!document.getElementById(MilestoneHotspotStyleId);
};

const getHotspotCss = (color: string) => {
  const hotspotColoring = chroma(color);
  const hotspotDefaultRgb = hotspotColoring.rgb();

  return `
  .milestone_blinking {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background-color: transparent;
    position: absolute;
    top: 50%; /* Poziționează elementul */
    left: 50%; /* Poziționează elementul */
    transform: translate(-50%, -50%);
    animation: blink-animation 3s infinite;
    box-shadow: 0 0 0 3px rgba(${hotspotDefaultRgb.join()}, 0.8);
}

  @keyframes blink-animation {
    0% { box-shadow: 0 0 0 5px rgba(${hotspotDefaultRgb.join()}, 0.8); }
    50% { box-shadow: 0 0 0 7px rgba(${hotspotDefaultRgb.join()}, 0.3); }
    100% { box-shadow: 0 0 0 3px rgba(${hotspotDefaultRgb.join()}, 0.8); }
}
  `;
};
