const Teams = ({
  teamsWithPlayers,
  observedPlayer,
  getPlacementPoints,
}: any) => {
  return (
    <div className="absolute bottom-5 right-0 z-10 flex h-[812px] w-[425px] flex-col justify-start">
      <video
        src="assets/videos/teamList.mp4"
        className="absolute left-0 top-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
      ></video>
      <div className="z-10 flex h-[40px] w-full text-sm font-bold"></div>
      <div className="z-10 h-full w-full">
        {teamsWithPlayers?.map((team: any, index: number) => (
          <div
            key={index}
            className={`flex h-[43.5px] w-full ${
              team?.players?.some((player: any) => player.uId == observedPlayer)
                ? "bg-gradient-to-r from-[#FEE75C] to-[#18BDFb] text-neutral-800"
                : team?.players?.some(
                      (player: any) => player.isOutsideBlueCircle == true,
                    )
                  ? "animate-pulse bg-blue-700 bg-opacity-30 backdrop-blur-lg"
                  : ""
            } text-xl font-bold ${
              team?.players?.every((player: any) => player.health <= 0)
                ? "bg-black bg-opacity-90 text-white grayscale backdrop-blur-sm"
                : "text-neutral-800"
            }`}
          >
            <div className="flex h-full w-[40px] items-center justify-center text-white">
              {index + 1}
            </div>
            <div className="relative flex h-full w-[140px] items-center justify-center text-medium">
              {/* <Image
                    src="assets/images/player.webp"
                    alt=""
                    className="aspect-square h-[30px]"
                  /> */}
              {team?.teamName}
            </div>
            <div className="flex h-full w-[100px] items-end justify-center gap-1 py-2">
              {team?.players?.map((player: any) => {
                return (
                  <div
                    className={`flex h-full items-end ${player.liveState == 4 ? "bg-red-600" : "bg-neutral-700"} `}
                    key={player?.uId}
                  >
                    <div
                      className={`w-[6px] bg-green-600`}
                      style={{
                        height: `${(player?.health / player?.healthMax) * 100}%`,
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div className="flex h-full w-[55px] items-center justify-center text-white">
              {team?.teamKillNum + getPlacementPoints(index + 1)}
            </div>
            <div className="flex h-full w-[90px] items-center justify-center text-white">
              {team?.teamKillNum}
            </div>
          </div>
        ))}
      </div>
      <div className="flex h-[40px] w-[280px] items-center justify-center gap-2 bg-red-600 bg-opacity-30 px-2 text-xs font-bold">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-green-600"></div>
          ALIVE
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-red-600"></div>
          KNOCKED
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-neutral-600"></div>
          ELIMINATED
        </div>
      </div>
    </div>
  );
};

export default Teams;
