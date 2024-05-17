import React, { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const CustomIframe = ({
  children,
  width,
  height,
  settings = {},
  customStyle = {},
  className = "",
}: any) => {
  const [contentRef, setContentRef] = useState<any>(null);

  const cache = createCache({
    key: "css",
    container: contentRef?.contentWindow?.document?.head,
    prepend: true,
  });

  const mountNode = contentRef?.contentWindow?.document?.body;
  if (mountNode) {
    mountNode.style.overflow = "hidden";
  }

  useEffect(() => {
    if (contentRef?.contentWindow?.document) {
      const head = contentRef.contentWindow.document.head;
      const metaViewport = document.createElement("meta");
      metaViewport.name = "viewport";
      metaViewport.content = "initial-scale=1, width=device-width";
      head.appendChild(metaViewport);

      // if (settings?.quillCss === true) {
      //   const quillStyle = applyQuillEditorStyle(document)
      //   head.appendChild(quillStyle)
      // }

      const metaColorScheme = document.createElement("meta");
      metaColorScheme.name = "color-scheme";
      metaColorScheme.content = "light dark";
      head.appendChild(metaColorScheme);

      if (mountNode) {
        mountNode.style.overflow = "hidden";
      }
    }
  }, [contentRef, mountNode, settings]);

  return (
    <CacheProvider value={cache}>
      <iframe
        // id="milestoneStepFrame"
        ref={setContentRef}
        className={className}
        style={{
          width: width,
          height: height,
          border: 0,
          overflow: "none",
          ...customStyle,
        }}
      >
        {mountNode && createPortal(children, mountNode)}
      </iframe>
    </CacheProvider>
  );
};

export default CustomIframe;
