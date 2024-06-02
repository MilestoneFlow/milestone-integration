import {
  FinishFullScreenPosition,
  FlowFinishFullScreenAnimation,
} from "../types/flow";

export const injectAnimationStyles = (document: Document) => {
  document.getElementById("milestone_animation_styles")?.remove();

  const styleSheet = document.createElement("style");
  styleSheet.id = "milestone_animation_styles";
  styleSheet.innerText = `
    #milestone_animation {
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: ${Number.MAX_SAFE_INTEGER}; /* Make sure it's above other content */
    }
  `;
  document.head.appendChild(styleSheet);

  return styleSheet;
};

interface GifElementOpts {
  position: FinishFullScreenPosition;
}

const createGifElement = (source: string, opts: Partial<GifElementOpts>) => {
  const gif = document.createElement("img");
  gif.src = source;
  gif.style.maxWidth = "100%";
  gif.style.maxHeight = "100%";
  gif.style.position = "absolute";
  gif.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;

  let position = FinishFullScreenPosition.MiddleScreen;
  if (opts.position) {
    position = opts.position;
  }

  if (position === FinishFullScreenPosition.MiddleScreen) {
    gif.style.top = "50%";
    gif.style.left = "50%";
    gif.style.transform = "translate(-50%, -50%)";
  } else if (position === FinishFullScreenPosition.BottomMiddle) {
    gif.style.bottom = "0";
    gif.style.left = "50%";
    gif.style.transform = "translateX(-50%)";
  }

  return gif;
};

export const showAnimation = (
  document: Document,
  animationData: FlowFinishFullScreenAnimation,
) => {
  const styleSheet = injectAnimationStyles(document);

  const gifContainer = document.createElement("div");
  gifContainer.id = "milestone_animation";

  const gif = createGifElement(animationData.url, {
    position: animationData.position,
  });

  gifContainer.appendChild(gif);

  document.body.appendChild(gifContainer);

  setTimeout(async () => {
    gifContainer.remove();
    styleSheet.remove();
  }, animationData.durationS * 1000);
};
