export default function (onUrlChangeListeners: UrlChangeListener[] = []): void {
  let currentUrl = location.href;

  const handleUrlChange = () => {
    const newUrl = location.href;
    if (newUrl !== currentUrl) {
      currentUrl = newUrl;
      execListeners(newUrl, onUrlChangeListeners);
    }
  };

  // Listen to the 'popstate' event (for back/forward navigation)
  window.addEventListener("popstate", handleUrlChange);

  // Listen to the 'hashchange' event (for changes to the fragment identifier)
  window.addEventListener("hashchange", handleUrlChange);

  // Monkey-patch history.pushState
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    handleUrlChange();
  };

  // Monkey-patch history.replaceState
  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    handleUrlChange();
  };

  // Mutation Observer for fallback (observing changes in the <title> tag)
  const observer = new MutationObserver(() => {
    handleUrlChange();
  });

  observer.observe(document, { subtree: true, childList: true });

  // Initial execution
  execListeners(currentUrl, onUrlChangeListeners);
}

const execListeners = (url: string, listeners: UrlChangeListener[]) => {
  for (const listener of listeners) {
    listener(url);
  }
};

type UrlChangeListener = (url: string) => void;
