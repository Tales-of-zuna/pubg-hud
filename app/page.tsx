"use client";

import { useEffect, useState } from "react";

const screenChannel = new BroadcastChannel("layout");
const popupChannel = new BroadcastChannel("popup");
const toggleChannel = new BroadcastChannel("camera");

const popupTimeout = 3000;
const datafetchInterval = 2000;

const Home = () => {
  const [battleData, setBattleData] = useState(null);
  const [activeScreen, setActiveScreen] = useState("battle");
  const [activePopup, setActivePopup] = useState("none");
  const [activeToggle, setActiveToggle] = useState("none");

  const fetchBattleData = async () => {
    try {
      const res = await fetch("/api/battle");
      const data = await res.json();
      setBattleData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handlePopupMessage = (e: any) => setActivePopup(e.data);
    const handleScreenMessage = (e: any) => setActiveScreen(e.data);
    const handleToggleMessage = (e: any) => setActiveToggle(e.data);

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
    fetchBattleData();
    const interval = setInterval(fetchBattleData, datafetchInterval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (battleData) {
      console.log(battleData);
    }
  }, [battleData]);

  useEffect(() => {
    if (activePopup !== "none") {
      const timeout = setTimeout(() => setActivePopup("none"), popupTimeout);
      return () => clearTimeout(timeout);
    }
  }, [activePopup]);

  const drawScreen = () => {
    if (activeScreen === "battle") {
      return <div className="h-screen w-screen bg-black"></div>;
    }
    return null;
  };

  const drawPopup = () => {
    if (activePopup === "red") {
      return (
        <div className="absolute left-0 top-0 h-screen w-screen bg-red-500"></div>
      );
    } else if (activePopup === "blue") {
      return (
        <div className="absolute left-0 top-0 h-screen w-screen bg-blue-500"></div>
      );
    }
    return null;
  };

  const drawToggle = () => {
    if (activeToggle === "camera") {
      return (
        <div className="absolute left-0 top-0 h-screen w-screen bg-black"></div>
      );
    }
    return null;
  };

  return (
    <div>
      {drawScreen()}
      {drawPopup()}
      {drawToggle()}
    </div>
  );
};

export default Home;
