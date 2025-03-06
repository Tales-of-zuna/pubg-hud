"use client";

import AutoNotifs from "@/components/home/autoNotifs";
import BattleScreen from "@/components/home/battleScreen";
import Popup from "@/components/home/popups";
import Toggle from "@/components/home/toggle";
import useBroadcastListeners from "@/hooks/useBroadcastListener";
import { useEffect, useState } from "react";

const DATA_FETCH_INTERVAL = 2000;

const Home = () => {
  const { activeScreen, activePopups, activeToggles, matchName, seriesName } =
    useBroadcastListeners();
  const [totalPlayerList, setTotalPlayerList] = useState<any[]>([]);
  const [observedPlayer, setObservedPlayer] = useState<any>();

  const fetchBattleData = async () => {
    try {
      const res = await fetch("/api/battle");
      const data = await res.json();
      setTotalPlayerList(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchBattleData();
    const interval = setInterval(fetchBattleData, DATA_FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const findObservingPlayer = async () => {
      const res = await fetch("/api/observed");
      const data = await res.json();
      setObservedPlayer(data);
    };

    findObservingPlayer();
  }, [totalPlayerList]);

  return (
    <div className="h-full w-full bg-neutral-900">
      <BattleScreen
        totalPlayerList={totalPlayerList}
        activeScreen={activeScreen}
        matchName={matchName}
        seriesName={seriesName}
      />
      <Popup totalPlayerList={totalPlayerList} activePopups={activePopups} />
      <AutoNotifs totalPlayerList={totalPlayerList} />
      <Toggle
        observedPlayer={observedPlayer}
        totalPlayerList={totalPlayerList}
        activeToggles={activeToggles}
        matchName={matchName}
        seriesName={seriesName}
      />
    </div>
  );
};

export default Home;
