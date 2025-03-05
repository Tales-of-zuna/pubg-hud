const BattleScreen = ({ activeScreen, totalPlayerList }: any) => {
  if (activeScreen === "battle") {
    return <div className="h-screen w-screen bg-black">inbattle screen</div>;
  } else if (activeScreen === "postdata") {
    return (
      <div className="h-screen w-screen bg-black">
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-1/2 w-1/2 items-center justify-center rounded-xl bg-neutral-800 text-9xl text-white">
            Battle ended
          </div>
        </div>
      </div>
    );
  } else if (activeScreen === "teamstats") {
    return (
      <div className="h-screen w-screen bg-black">
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-1/2 w-1/2 items-center justify-center rounded-xl bg-neutral-800 text-9xl text-white">
            team stats
          </div>
        </div>
      </div>
    );
  } else if (activeScreen === "matchrankings") {
    return (
      <div className="h-screen w-screen bg-black">
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-1/2 w-1/2 items-center justify-center rounded-xl bg-neutral-800 text-9xl text-white">
            Match rankings
          </div>
        </div>
      </div>
    );
  } else if (activeScreen === "overallrankings") {
    return (
      <div className="h-screen w-screen bg-black">
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-1/2 w-1/2 items-center justify-center rounded-xl bg-neutral-800 text-9xl text-white">
            overallrankings
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default BattleScreen;
