"use client";

import { useEffect, useState } from "react";

const BattleScreen = ({
  totalPlayerList,
  isInGame,
  seriesName,
  matchName,
}: any) => {
  const [screenIndex, setScreenIndex] = useState(0);

  useEffect(() => {
    if (isInGame == true) {
      return;
    }
    const screenDurations = [5000, 5000, 5000, 5000];
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
        <div className="relative h-screen w-screen">
          <video
            src="/assets/videos/teamStat.mp4"
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 z-10 h-full w-full object-cover"
          ></video>
        </div>
      )}
      {screenIndex === 2 && (
        <div className="relative h-screen w-screen">
          <video
            src="/assets/videos/matchRanking.mp4"
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 z-10 h-full w-full object-cover"
          ></video>
        </div>
      )}
      {screenIndex === 3 && (
        <div className="relative h-screen w-screen">
          <video
            src="/assets/videos/overallRanking.mp4"
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 z-10 h-full w-full object-cover"
          ></video>
        </div>
      )}
    </div>
  );
};

export default BattleScreen;
