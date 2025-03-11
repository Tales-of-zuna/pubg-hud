import { Image } from "@heroui/react";

const Teams = ({ teamsWithPlayers, observedPlayer }: any) => {
  return (
    <div className="absolute bottom-5 right-0 z-10 flex h-[812px] w-[425px] flex-col justify-start">
      <video
        src="assets/videos/teamList.mp4"
        className="absolute left-0 top-0 h-full w-full object-contain object-top"
        autoPlay
        loop
        muted
      ></video>
      <div className="z-10 flex h-[40px] w-full overflow-hidden bg-[#030e22] text-medium font-bold">
        <div className="flex h-full w-[40px] items-center justify-center text-white">
          #
        </div>
        <div className="relative flex h-full w-[140px] items-center justify-center">
          TEAMS
        </div>
        <div className="flex h-full w-[155px] items-end justify-center gap-1 py-2">
          ALIVE
        </div>

        <div className="flex h-full w-[70px] items-center justify-center text-white">
          ELIMS
        </div>
      </div>
      <div className="z-10 h-full w-full">
        {teamsWithPlayers?.map((team: any, index: number) => (
          <div
            key={index}
            className={`flex h-[43.5px] w-full ${
              team?.players?.some((player: any) => player.uId == observedPlayer)
                ? "bg-gradient-to-r from-[#FEE75C] to-[#18BDFb] text-neutral-800"
                : ""
            } text-xl font-bold ${
              team?.players?.every((player: any) => player.health <= 0)
                ? "bg-black bg-opacity-90 text-white grayscale backdrop-blur-sm"
                : team?.players?.some(
                      (player: any) => player.isOutsideBlueCircle === true,
                    )
                  ? "animaterotate z-30 animate-pulse bg-blue-700 bg-opacity-100 backdrop-blur-lg"
                  : "text-neutral-800"
            }`}
          >
            <div className="flex h-full w-[40px] items-center justify-center text-white">
              {index + 1}
            </div>
            <div className="relative flex h-full w-[140px] items-center justify-center text-medium">
              <Image
                src="assets/images/player.webp"
                alt=""
                className="aspect-square h-[30px]"
              />
              VCTC
              {/* {team?.teamName} */}
            </div>
            <div className="flex h-full w-[155px] items-end justify-center gap-1 py-2">
              {team?.players?.map((player: any) => {
                return (
                  <div
                    className={`flex h-full items-end bg-neutral-700`}
                    key={player?.uId}
                  >
                    <div
                      className={`w-[6px] ${player.liveState == 4 ? "bg-[#fb8500]" : "bg-green-600"}`}
                      style={{
                        height: `${(player?.health / player?.healthMax) * 100}%`,
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>

            <div className="flex h-full w-[70px] items-center justify-center text-white">
              {team?.teamKillNum}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-9 flex h-[40px] w-full items-center justify-center gap-2 bg-[#030e22] px-2 text-lg font-bold">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-green-600"></div>
          ALIVE
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-[#fb8500]"></div>
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
