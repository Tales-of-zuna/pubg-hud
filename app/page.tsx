"use client";

import BattleScreen from "@/components/home/battleScreen";
import Popup from "@/components/home/popups";
import Toggle from "@/components/home/toggle";
import useBroadcastListeners from "@/hooks/useBroadcastListener";
import { useEffect, useState } from "react";

const DATA_FETCH_INTERVAL = 2000;

const Home = () => {
  const { activeScreen, activePopups, activeToggles } = useBroadcastListeners();
  const [totalPlayerList, setTotalPlayerList] = useState<any[]>([]);
  const [observedPlayer, setObservedPlayer] = useState<any>();
  const [error, setError] = useState<string | null>(null);

  const fetchBattleData = async () => {
    try {
      const res = await fetch("/api/battle");

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid API response: Expected an array.");
      }

      setTotalPlayerList(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch battle data.");
    }
  };
  // main fetching logic here
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
      {error ? (
        <div className="p-4 text-center text-red-500">Error: {error}</div>
      ) : (
        <>
          <BattleScreen
            totalPlayerList={totalPlayerList}
            activeScreen={activeScreen}
          />
          <Popup
            totalPlayerList={totalPlayerList}
            activePopups={activePopups}
          />
          <Toggle
            observedPlayer={observedPlayer}
            totalPlayerList={totalPlayerList}
            activeToggles={activeToggles}
          />
        </>
      )}
    </div>
  );
};

export default Home;
