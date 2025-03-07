"use client";

import { useEffect, useState } from "react";

const BattleScreen = ({
  totalPlayerList,
  isInGame,
  seriesName,
  matchName,
}: any) => {
  const [screenIndex, setScreenIndex] = useState(0);
  const [teamsData, setTeamsData] = useState<any>([]);
  useEffect(() => {
    if (isInGame == true && teamsData.length > 0) {
      return;
    }
    const fetchTeamsData = async () => {
      try {
        const res = await fetch("/api/gameData");
        const data = await res.json();
        setTeamsData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTeamsData();
  }, [isInGame]);

  useEffect(() => {
    if (isInGame == true) {
      return;
    }

    const screenDurations = [35000, 35000, 40000, 40000];
    let index = 0;

    const cycleScreens = () => {
      setScreenIndex(index);
      index++;

      if (index < screenDurations.length) {
        setTimeout(cycleScreens, screenDurations[index]);
      }
    };

    cycleScreens();

    return () => {
      index = screenDurations.length;
    };
  }, [isInGame]);

  if (isInGame == true) {
    return <div className="h-screen w-screen bg-transparent">v1.2</div>;
  }

  return (
    <div>
      {screenIndex === 0 && (
        <div className="relative h-screen w-screen">
          <video
            src="/assets/videos/background.mp4"
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 z-10 h-full w-full object-cover"
          ></video>
        </div>
      )}
      {screenIndex === 1 && (
        <div className="relative h-screen w-screen overflow-hidden">
          <video
            src="/assets/videos/teamStat.mp4"
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 z-10 h-full w-full scale-[1.02] object-cover"
          ></video>
        </div>
      )}
      {screenIndex === 2 && (
        <div className="relative h-screen w-screen overflow-hidden">
          <video
            src="/assets/videos/matchRanking.mp4"
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 z-10 h-full w-full scale-[1.02] object-cover"
          ></video>
        </div>
      )}
      {screenIndex === 3 && (
        <div className="relative h-screen w-screen overflow-hidden">
          <video
            src="/assets/videos/overallRanking.mp4"
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 z-10 h-full w-full scale-[1.02] object-cover"
          ></video>
        </div>
      )}
    </div>
  );
};

export default BattleScreen;
