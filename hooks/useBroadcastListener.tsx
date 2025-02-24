import { useEffect, useState } from "react";

const screenChannel = new BroadcastChannel("screen");
const popupChannel = new BroadcastChannel("popup");
const toggleChannel = new BroadcastChannel("toggle");

const popupTimeout = 3000;

const useBroadcastListeners = () => {
  const [activeScreen, setActiveScreen] = useState("none");
  const [activePopup, setActivePopup] = useState("none");
  const [activeToggle, setActiveToggle] = useState({});

  useEffect(() => {
    const handlePopupMessage = (e: MessageEvent) => setActivePopup(e.data);
    const handleScreenMessage = (e: MessageEvent) => setActiveScreen(e.data);
    const handleToggleMessage = (e: MessageEvent) => setActiveToggle(e.data);

    popupChannel.addEventListener("message", handlePopupMessage);
    screenChannel.addEventListener("message", handleScreenMessage);
    toggleChannel.addEventListener("message", handleToggleMessage);

    return () => {
      popupChannel.removeEventListener("message", handlePopupMessage);
      screenChannel.removeEventListener("message", handleScreenMessage);
      toggleChannel.removeEventListener("message", handleToggleMessage);
    };
  }, []);

  useEffect(() => {
    if (activePopup !== "none") {
      const timeout = setTimeout(() => setActivePopup("none"), popupTimeout);
      return () => clearTimeout(timeout);
    }
  }, [activePopup]);

  return { activeScreen, activePopup, activeToggle };
};

export default useBroadcastListeners;
