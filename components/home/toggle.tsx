"use clien";
import { Image } from "@heroui/react";
import { useEffect, useState } from "react";

const Toggle = ({ activeToggles, totalPlayerList }: any) => {
  const toggles = activeToggles?.data || [];
  const [teamsWithPlayers, setTeamsWithPlayers] = useState<any>();

  useEffect(() => {
    const transformData = (list: any) => {
      const teamsWithPlayers = list?.reduce((acc: any, player: any) => {
        const { teamId, teamName, killNum } = player;

        if (!acc[teamId]) {
          acc[teamId] = {
            teamId,
            teamName,
            teamKillNum: killNum,
            players: [],
          };
        }

        acc[teamId].players.push(player);
        acc[teamId].teamKillNum += player.killNum;

        return acc;
      }, {});

      return Object.values(teamsWithPlayers);
    };

    if (totalPlayerList?.length !== 0) {
      const groupedPlayers = transformData(totalPlayerList);
      const sortedPlayers = groupedPlayers.sort((a: any, b: any) => {
        return b.teamKillNum - a.teamKillNum;
      });
      setTeamsWithPlayers(sortedPlayers);
    }
  }, [totalPlayerList]);

  return (
    <div
      className="absolute left-0 top-0 z-10 h-screen w-screen"
      style={{
        backgroundImage:
          "url('/assets/images/screens/Screenshot 2025-02-17 181903.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {toggles.includes("teams") && (
        <div className="absolute bottom-5 right-0 z-10 flex h-[812px] w-[350px] flex-col justify-start bg-green-950 bg-opacity-30">
          <div className="flex h-[45px] w-full bg-black bg-opacity-30 text-sm font-bold">
            <div className="flex h-full w-[45px] items-center justify-center bg-black bg-opacity-30">
              NO
            </div>
            <div className="flex h-full w-[150px] items-center justify-center bg-green-600 bg-opacity-30">
              Teams
            </div>
            <div className="flex h-full w-[55px] items-center justify-center bg-orange-600 bg-opacity-30">
              Alive
            </div>
            <div className="flex h-full w-[50px] items-center justify-center bg-black bg-opacity-30">
              PTS
            </div>
            <div className="flex h-full w-[50px] items-center justify-center bg-black bg-opacity-30">
              ELIMS
            </div>
          </div>
          <div className="h-full w-full bg-red-600 bg-opacity-30">
            {teamsWithPlayers?.map((team: any, index: number) => (
              <div
                key={index}
                className={`flex h-[45.5px] w-full items-center justify-center bg-red-600 bg-opacity-30 text-xs font-bold`}
              >
                <div className="flex h-full w-[45px] items-center justify-center bg-black bg-opacity-30">
                  {index + 1}
                </div>
                <div className="flex h-full w-[150px] items-center justify-center bg-green-600 bg-opacity-30 text-medium">
                  {team.teamName}
                </div>
                <div className="flex h-full w-[55px] items-end justify-center gap-1 bg-orange-600 bg-opacity-30 py-2">
                  {team.players.map((player: any) => {
                    return (
                      <div
                        className="flex h-full items-end bg-neutral-700"
                        key={player.uId}
                      >
                        <div
                          className={`w-2 bg-emerald-700`}
                          style={{
                            height: `${(player.health / player.healthMax) * 100}%`,
                          }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex h-full w-[50px] items-center justify-center bg-black bg-opacity-30">
                  {team.players.reduce(
                    (acc: any, player: any) => acc + player.assist,
                    0,
                  )}
                </div>
                <div className="flex h-full w-[50px] items-center justify-center bg-black bg-opacity-30">
                  {team.teamKillNum}
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
      )}
      {toggles.includes("lastfourteams") && (
        <div className="h-32 w-32 bg-red-500">last four</div>
      )}
      {toggles.includes("playerimage") && (
        <div className="absolute bottom-0 left-[450px] z-10 flex h-[200px] w-[286px] flex-col items-center justify-end bg-green-600 bg-opacity-30">
          <div className="relative h-full w-full">
            <Image
              src="/assets/images/player.webp"
              alt=""
              className="h-[200px] w-[290px] object-contain"
            />
          </div>
        </div>
      )}
      {toggles.includes("sponsors") && (
        <div className="absolute bottom-0 left-0 z-10 flex h-[200px] w-[450px] flex-col items-center justify-end border-2 border-green-950">
          <div className="flex h-1/2 w-full items-center">
            <div className="h-full w-1/2 border-2 border-green-950"></div>
            <div className="h-full w-1/2 border-2 border-green-950"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toggle;
