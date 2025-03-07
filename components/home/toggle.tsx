"use clien";
import { Image } from "@heroui/react";
import { useEffect, useState } from "react";

const Toggle = ({
  activeToggles,
  totalPlayerList,
  observedPlayer,
  matchName,
  seriesName,
  mapName,
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
      if (team.players.some((player: any) => player?.uId == observedPlayer)) {
        setSelectedTeam(team);
      }
    });
  }, [observedPlayer, teamsWithPlayers]);
  const getPlacementPoints = (placement: any) => {
    if (placement === 1) return 10;
    if (placement === 2) return 6;
    if (placement === 3) return 5;
    if (placement === 4) return 4;
    if (placement === 5) return 3;
    if (placement === 6) return 2;
    if (placement >= 7 && placement <= 8) return 1;
    return 0;
  };

  return (
    <div className="absolute left-0 top-0 z-10 h-screen w-screen">
      {toggles?.includes("teams") && (
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
                  team?.players?.some(
                    (player: any) => player.uId == observedPlayer,
                  )
                    ? "bg-gradient-to-r from-[#FEE75C] to-[#18BDFb] text-neutral-800"
                    : ""
                } text-xl font-bold ${
                  team?.players?.every((player: any) => player.health <= 0)
                    ? "bg-black bg-opacity-90 text-white grayscale backdrop-blur-sm"
                    : "text-neutral-800"
                }`}
              >
                <div className="flex h-full w-[40px] items-center justify-center">
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
                <div className="flex h-full w-[55px] items-center justify-center">
                  {team?.teamKillNum + getPlacementPoints(index + 1)}
                </div>
                <div className="flex h-full w-[90px] items-center justify-center">
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
      {toggles?.includes("plane") && (
        <div className="absolute top-[150px] flex h-32 w-full items-center justify-center">
          <div className="relative h-48 w-96 bg-black">
            <video
              src="/assets/videos/mininotif.mp4"
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
            ></video>
            <div className="absolute top-0 z-10 flex h-36 w-full items-center justify-center text-5xl font-bold uppercase text-neutral-800">
              {mapName}
            </div>
            <div className="absolute bottom-0 z-10 flex h-14 w-full items-center justify-center text-xl font-bold uppercase">
              {seriesName} MATCH {matchName}
            </div>
          </div>
        </div>
      )}
      {toggles?.includes("playerimage") && (
        <div className="absolute bottom-0 left-[450px] z-10 flex h-[200px] w-[286px] flex-col items-center justify-end">
          <div className="relative h-full w-full">
            <Image
              src="/assets/images/logo.png"
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
          <div className="flex h-1/2 w-full flex-col items-start justify-end">
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-2">
              <video
                src="/assets/videos/sponsors.mp4"
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
              />
            </div>

            <div className="absolute bottom-[30px] z-10 flex h-[70px] w-[225px] items-center justify-center text-3xl font-bold text-neutral-800">
              {seriesName}
            </div>
            <div className="absolute z-10 flex h-[30px] w-[225px] items-center justify-center font-bold text-neutral-800">
              {matchName}
            </div>
          </div>
        </div>
      )}
      {toggles?.includes("teamdamage") && (
        <div className="absolute bottom-[280px] left-0 z-10 h-[350px] w-[250px] bg-green-600 bg-opacity-30">
          <div className="relative h-full w-full">
            <video
              src="/assets/videos/damageStat.mp4"
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
            ></video>
          </div>
          <div className="absolute top-0 h-full w-full">
            <div className="flex h-[30px] w-full items-center justify-center text-xl font-semibold uppercase">
              <p className="">Damage Dealt</p>
            </div>
            <div className="flex h-[100px] w-full items-center justify-center gap-2">
              <Image
                src="/assets/images/logo.png"
                alt=""
                className="h-[80px] w-[80px] object-cover"
              />
              <p className="text-xl font-bold text-neutral-800">
                {selectedTeam?.teamName}
              </p>
            </div>
            <div className="h-[220px] w-full">
              {selectedTeam?.players?.map((player: any) => {
                const damagePercentage = selectedTeam?.teamDamage
                  ? ((player?.damage !== 0 ? player?.damage : 1) /
                      selectedTeam?.teamDamage) *
                    100
                  : 0;
                return (
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
                          width: `${damagePercentage}%`,
                        }}
                      ></div>
                      <p className="text-sm">{`${damagePercentage.toFixed(2)}%`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toggle;
