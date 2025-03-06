"use clien";
import { Image } from "@heroui/react";
import { useEffect, useState } from "react";

const Toggle = ({
  activeToggles,
  totalPlayerList,
  observedPlayer,
  matchName,
  seriesName,
}: any) => {
  const toggles = activeToggles?.data || [];
  const [teamsWithPlayers, setTeamsWithPlayers] = useState<any>();
  const [selectedTeam, setSelectedTeam] = useState<any>();

  useEffect(() => {
    const transformData = (list: any) => {
      const teamsWithPlayers = list?.reduce((acc: any, player: any) => {
        const { teamId, teamName } = player;

        if (!acc[teamId]) {
          acc[teamId] = {
            teamId,
            teamName,
            teamKillNum: 0,
            teamDamage: 0,
            players: [],
          };
        }

        acc[teamId].players.push(player);
        acc[teamId].teamKillNum += player.killNum;
        acc[teamId].teamDamage += player.damage;

        return acc;
      }, {});

      return Object.values(teamsWithPlayers);
    };

    if (totalPlayerList?.length !== 0) {
      const groupedPlayers = transformData(totalPlayerList);
      const sortedPlayers = groupedPlayers?.sort((a: any, b: any) => {
        return b.teamKillNum - a.teamKillNum;
      });
      setTeamsWithPlayers(sortedPlayers);
    }
  }, [totalPlayerList]);

  useEffect(() => {
    teamsWithPlayers?.forEach((team: any) => {
      if (team.players.some((player: any) => player.uId == observedPlayer)) {
        setSelectedTeam(team);
      }
    });
  }, [observedPlayer]);

  return (
    <div className="absolute left-0 top-0 z-10 h-screen w-screen">
      {toggles?.includes("teams") && (
        <div className="absolute bottom-5 right-0 z-10 flex h-[812px] w-[350px] flex-col justify-start">
          <div className="flex h-[45px] w-full text-sm font-bold">
            <div className="flex h-full w-[45px] items-center justify-center">
              NO
            </div>
            <div className="flex h-full w-[150px] items-center justify-center">
              Teams
            </div>
            <div className="flex h-full w-[55px] items-center justify-center">
              Alive
            </div>
            <div className="flex h-full w-[50px] items-center justify-center">
              PTS
            </div>
            <div className="flex h-full w-[50px] items-center justify-center">
              ELIMS
            </div>
          </div>
          <div className="h-full w-full">
            {teamsWithPlayers?.map((team: any, index: number) => (
              <div
                key={index}
                className={`flex h-[45.5px] w-full items-center justify-center ${
                  team?.players?.some(
                    (player: any) => player.uId == observedPlayer,
                  )
                    ? "bg-orange-600"
                    : "bg-black"
                } text-xl font-bold`}
              >
                <div className="flex h-full w-[45px] items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex h-full w-[150px] items-center justify-center text-medium">
                  {team?.teamName}
                </div>
                <div className="flex h-full w-[55px] items-end justify-center gap-1 py-2">
                  {team?.players?.map((player: any) => {
                    return (
                      <div
                        className="flex h-full items-end bg-neutral-700"
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
                <div className="flex h-full w-[50px] items-center justify-center">
                  {team?.teamId}
                </div>
                <div className="flex h-full w-[50px] items-center justify-center">
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
      )}
      {toggles?.includes("lastfourteams") && (
        <div className="h-32 w-32 bg-red-500">last four</div>
      )}
      {toggles?.includes("playerimage") && (
        <div className="absolute bottom-0 left-[450px] z-10 flex h-[200px] w-[286px] flex-col items-center justify-end">
          <div className="relative h-full w-full">
            <Image
              src="/assets/images/player.webp"
              alt=""
              className="h-[200px] w-[290px] object-contain"
            />
          </div>
        </div>
      )}
      {toggles?.includes("sponsors") && (
        <div className="absolute bottom-0 left-0 z-10 flex h-[200px] w-[450px] flex-col items-start justify-end gap-4">
          <div className="px-4">
            <Image src="/assets/images/logo.png" alt="" className="w-32" />
          </div>
          <div className="flex h-1/2 w-full items-center">
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-2">
              <video
                src="/assets/videos/sponsors.mp4"
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
              />
            </div>
          </div>
        </div>
      )}
      {toggles?.includes("teamdamage") && (
        <div className="absolute bottom-[280px] left-0 z-10 h-[350px] w-[257px] bg-green-600 bg-opacity-30">
          <div className="relative h-full w-full">
            <video
              src="/assets/videos/background.mp4"
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
            ></video>
          </div>
          <div className="absolute top-0 h-full w-full">
            <div className="flex h-[40px] w-full items-center justify-center text-xl font-semibold uppercase">
              Damage Proportion
            </div>
            <div className="flex h-[90px] w-full items-center justify-center gap-2">
              <Image
                src="/assets/images/player.webp"
                alt=""
                className="h-[60px] w-[60px] object-cover"
              />
              <p className="text-xl font-bold">{selectedTeam?.teamName}</p>
            </div>
            <div className="h-[220px] w-full">
              {selectedTeam?.players?.map((player: any) => (
                <div
                  key={player?.uId}
                  className="h-[55px] w-full border-b px-3 py-1"
                >
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center gap-2">
                      <p>{selectedTeam?.teamName}</p>
                      <p>{player.playerName}</p>
                    </div>
                    <p>{player.damage}</p>
                  </div>
                  <div className="flex h-[20px] w-full gap-2 bg-neutral-600 pr-2">
                    <div
                      className="h-full bg-orange-500"
                      style={{
                        width:
                          ((player?.damage != 0 ? player?.damage : 1) /
                            selectedTeam?.teamDamage) *
                            100 +
                          "%",
                      }}
                    ></div>
                    <p className="text-sm">
                      {((player?.damage != 0 ? player?.damage : 1) /
                        selectedTeam?.teamDamage) *
                        100 +
                        "%"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toggle;
