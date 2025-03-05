import { useEffect, useState } from "react";

const screenChannel = new BroadcastChannel("screen");
const popupChannel = new BroadcastChannel("popup");
const toggleChannel = new BroadcastChannel("toggle");

// const popupTimeout = 5000;

const useBroadcastListeners = () => {
  const [activeScreen, setActiveScreen] = useState("none");
  const [activePopups, setActivePopups] = useState({});
  const [activeToggles, setActiveToggles] = useState({});

  useEffect(() => {
    const handlePopupMessage = (e: MessageEvent) => setActivePopups(e.data);
    const handleScreenMessage = (e: MessageEvent) => setActiveScreen(e.data);
    const handleToggleMessage = (e: MessageEvent) => setActiveToggles(e.data);

    popupChannel.addEventListener("message", handlePopupMessage);
    screenChannel.addEventListener("message", handleScreenMessage);
    toggleChannel.addEventListener("message", handleToggleMessage);

    return () => {
      popupChannel.removeEventListener("message", handlePopupMessage);
      screenChannel.removeEventListener("message", handleScreenMessage);
      toggleChannel.removeEventListener("message", handleToggleMessage);
    };
  }, []);

  // useEffect(() => {
  //   if (activePopups.data !== null) {
  //     const timeout = setTimeout(() => setActivePopups({}), popupTimeout);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [activePopups]);

  return { activeScreen, activePopups, activeToggles };
};

export default useBroadcastListeners;
