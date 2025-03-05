"use client";

import BattleScreen from "@/components/home/battleScreen";
import Popup from "@/components/home/popups";
import Toggle from "@/components/home/toggle";
import useBattleData from "@/hooks/useBattleData";
import useBroadcastListeners from "@/hooks/useBroadcastListener";
import { useEffect } from "react";

const Home = () => {
  const battleData = useBattleData();
  const { activeScreen, activePopups, activeToggles } = useBroadcastListeners();

  useEffect(() => {
    // i will set popups here or some additional logics based on in game data
    if (battleData) {
      console.log(battleData);
    }
  }, [battleData]);

  return (
    <div className="h-full w-full bg-neutral-900">
      <BattleScreen activeScreen={activeScreen} />
      <Popup activePopups={activePopups} />
      <Toggle activeToggles={activeToggles} />
    </div>
  );
};

export default Home;
