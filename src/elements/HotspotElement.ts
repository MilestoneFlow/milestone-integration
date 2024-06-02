import chroma from "chroma-js";
import { MilestoneFlowElementWrapperId } from "./render/constants";

interface HotspotElementOpts {
  id: string;
  sizePx: number;
  color: string;
  animationDurationS: number;
  actionsHandlers: {
    onClick?: () => void;
    onHover?: () => void;
  };
}

function getHotspotDomId(id: string) {
  return `milestone-hotspot-${id}`;
}

export function getHotspotDomElement(id: string) {
  return document.getElementById(getHotspotDomId(id));
}

export function createHotspot(
  document: Document,
  appContainer: HTMLElement,
  {
    id,
    sizePx,
    color,
    animationDurationS,
    actionsHandlers,
  }: HotspotElementOpts,
): HTMLIFrameElement {
  const scaleFactor = 2;

  const iframe = createIframeElement(document, sizePx * scaleFactor + 5);
  appContainer.append(iframe);

  iframe.id = getHotspotDomId(id);
  iframe.src = "about:blank";
  iframe.onload = () => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      return null;
    }

    const style = createHotspotStyle(scaleFactor, {
      sizePx,
      color,
      animationDurationS,
    });
    iframeDoc.head.append(style);

    const hotspot = createHotspotBody(iframeDoc);
    iframeDoc.body.append(hotspot);
    iframeDoc.body.style.overflow = "hidden";

    if (actionsHandlers.onClick) {
      iframeDoc.body.onclick = actionsHandlers.onClick;
    }
    if (actionsHandlers.onHover) {
      iframeDoc.body.onmouseover = actionsHandlers.onHover;
    }
  };

  return iframe;
}

const createIframeElement = (
  document: Document,
  sizePx: number,
): HTMLIFrameElement => {
  const iframe = document.createElement("iframe");
  iframe.style.width = `${sizePx}px`;
  iframe.style.height = `${sizePx}px`;
  iframe.style.position = "absolute";
  iframe.style.opacity = "0";
  iframe.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;
  iframe.style.border = "none";

  return iframe;
};

const createContainer = (document: Document): HTMLDivElement => {
  const container = document.createElement("div");
  container.id = MilestoneFlowElementWrapperId;

  return container;
};

const createHotspotStyle = (
  scaleFactor: number,
  {
    sizePx,
    color,
    animationDurationS,
  }: { sizePx: number; color: string; animationDurationS: number },
) => {
  const pulseColor = chroma(color).alpha(0.5).css();

  // Append stylesheet for the hotspot to the iframe's head
  const style = document.createElement("style");
  style.textContent = `
        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(${scaleFactor});
                opacity: 0;
            }
        }

        .hotspot {
            position: relative;
            width: ${sizePx}px;
            height: ${sizePx}px;
            cursor: pointer;
        }

        .inner-circle {
            width: 100%;
            height: 100%;
            background-color: ${color};
            border-radius: 50%;
        }

        .outer-circle {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${pulseColor};
            border-radius: 50%;
            animation: pulse ${animationDurationS}s infinite;
        }
    `;

  return style;
};

const createHotspotBody = (iframeDoc: Document) => {
  const hotspot = iframeDoc.createElement("div");
  hotspot.className = "hotspot";
  hotspot.innerHTML = `
        <div class="inner-circle"></div>
        <div class="outer-circle"></div>
    `;

  return hotspot;
};
