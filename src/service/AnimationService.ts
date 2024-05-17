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

export const showAnimation = (document: Document) => {
  const styleSheet = injectAnimationStyles(document);
  // Create the container div
  const gifContainer = document.createElement("div");
  gifContainer.id = "milestone_animation";

  // Create the image element
  const gif = document.createElement("img");
  gif.src =
    "https://milestone-uploaded-flows-media.s3.amazonaws.com/assets/confetti-glitter.gif";
  gif.style.maxWidth = "100%";
  gif.style.maxHeight = "100%";
  gif.style.position = "fixed";
  gif.style.bottom = "0";
  gif.style.left = "0";
  gif.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;

  // Append the image to the container
  gifContainer.appendChild(gif);

  // Append the container to the body
  document.body.appendChild(gifContainer);

  // Set a timeout to remove the GIF after 3 seconds
  setTimeout(function () {
    gifContainer.remove();
    styleSheet.remove();
  }, 5000); // 3000 milliseconds = 3 seconds
};
