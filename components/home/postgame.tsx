"use client";

import { Divider, Image } from "@heroui/react";
import { mdiFoodDrumstick } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";

const popupChannel = new BroadcastChannel("popup");
const toggleChannel = new BroadcastChannel("toggle");

const BattleScreen = ({
  totalPlayerList,
  isInGame,
  seriesName,
  matchName,
}: any) => {
  const [screenIndex, setScreenIndex] = useState(0);
  const [teamsData, setTeamsData] = useState<any>([]);
  const [mvpPlayer, setMvpPlayer] = useState<any>(null);
  const [matchWinners, setMatchWinners] = useState<any>([]);
  const [matchTeams, setMatchTeams] = useState<any>([]);

  const saveTeamData = async () => {
    const teamStats: any = {};
    totalPlayerList.forEach((player: any) => {
      const { teamId, teamName, killNum, rank } = player;

      if (!teamStats[teamId]) {
        teamStats[teamId] = {
          teamName,
          teamId,
          totalPoints: 0,
          winCount: 0,
          killCount: 0,
          bestRank: Infinity,
        };
      }

      teamStats[teamId].killCount += killNum;

      teamStats[teamId].bestRank = Math.min(teamStats[teamId].bestRank, rank);
    });
    Object.values(teamStats).forEach((team: any) => {
      const { bestRank } = team;

      if (bestRank === 1) {
        team.winCount += 1;
        team.totalPoints += 10;
      } else if (bestRank === 2) {
        team.totalPoints += 6;
      } else if (bestRank === 3) {
        team.totalPoints += 5;
      } else if (bestRank === 4) {
        team.totalPoints += 4;
      } else if (bestRank === 5) {
        team.totalPoints += 3;
      } else if (bestRank === 6) {
        team.totalPoints += 2;
      } else if (bestRank === 7 || bestRank === 8) {
        team.totalPoints += 1;
      }

      team.totalPoints += team.killCount;
    });

    const teamsToUpdate = Object.values(teamStats);
    teamsToUpdate.sort((a: any, b: any) => b.totalPoints - a.totalPoints);
    setMatchTeams(teamsToUpdate);
  };

  useEffect(() => {
    if (isInGame == true && teamsData.length > 0) {
      return;
    }

    saveTeamData();

    const rankedPlayers = totalPlayerList?.filter(
      (player: any) => player.rank == 1,
    );

    setMatchWinners(rankedPlayers);
    if (rankedPlayers.length > 0) {
      const mvp = rankedPlayers.reduce((topPlayer: any, current: any) =>
        current.damage > topPlayer.damage ? current : topPlayer,
      );

      setMvpPlayer(mvp);
    }
    popupChannel.postMessage({ data: [] });
    toggleChannel.postMessage({ data: [] });
  }, [isInGame]);

  useEffect(() => {
    if (isInGame == true) {
      return;
    }
    if (screenIndex == 2) {
      const fetchTeamsData = async () => {
        try {
          const res = await fetch("/api/gameData");
          const data = await res.json();
          data.sort((a: any, b: any) => b.totalPoints - a.totalPoints);
          setTeamsData(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchTeamsData();
    }
  }, [screenIndex, isInGame]);

  useEffect(() => {
    if (isInGame == true) {
      return;
    }

    const screenDurations = [35000, 20000, 35000, 35000];
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
          <div className="absolute left-0 top-0 z-20 flex h-full w-[800px] flex-col justify-center py-32 pl-32 text-3xl font-bold">
            <p>
              {seriesName} {matchName}
            </p>
            <Divider className="w-96" />
            <p className="text-9xl">MVP</p>
            <div className="flex items-center gap-4">
              <Image
                src="/assets/images/logo.png"
                className="h-32 w-32 object-contain"
                alt=""
              />
              <div>
                <p className="text-lime-300">{mvpPlayer?.teamName}</p>
                <p className="text-5xl">{mvpPlayer?.playerName}</p>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 z-20 flex h-full w-[800px] flex-col items-center justify-center py-32 pl-32 text-3xl font-bold">
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center justify-center">
                <p className="text-9xl">{mvpPlayer?.killNum || 0}</p>
                <p>ELIMS</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-9xl">{mvpPlayer?.rescueTimes || 0}</p>
                <p>RESCUE TIMES</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center justify-center">
                <p className="text-9xl">{mvpPlayer?.assist || 0}</p>
                <p>ASSISTS</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-9xl">{mvpPlayer?.damage || 0}</p>
                <p>DAMAGE</p>
              </div>
            </div>
          </div>
          <div className="absolute right-8 top-8 z-20 flex items-center text-4xl font-bold">
            BE THE #1
          </div>
          <div className="absolute bottom-0 left-0 z-20 flex h-[1000px] w-screen items-center text-5xl font-bold">
            <div className="relative flex h-full w-full items-end justify-center">
              <Image
                src="/assets/images/logo.png"
                alt=""
                className="h-[1000px] w-[500px] object-contain"
              />
            </div>
          </div>
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
          <div className="absolute bottom-[358px] left-[22px] z-20 flex h-[60px] w-[530px] items-center text-4xl font-bold text-blue-950">
            <div className="flex w-64 items-center justify-center">
              <p className="">{seriesName}</p>
            </div>
            <div className="flex w-72 items-center justify-center">
              <p className="">{matchName}</p>
            </div>
          </div>
          <div className="absolute bottom-[450px] left-[22px] z-20 flex h-[250px] w-[530px] flex-col items-center justify-center text-4xl font-bold">
            <p className="text-9xl">Winner</p>
            <p className="text-5xl">Team Stats</p>
          </div>
          <div className="absolute bottom-[75px] right-0 z-20 flex h-[130px] w-[1342px] items-center text-4xl font-bold">
            {matchWinners?.map((player: any) => {
              return (
                <div
                  key={player.uId}
                  className="flex h-full w-[335.5px] items-center justify-center"
                >
                  <p className="text-blue-950">{player.playerName}</p>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-[205px] right-0 z-20 flex h-[900px] w-[1342px] items-end text-4xl font-bold">
            <div className="flex">
              {matchWinners?.map((player: any) => {
                return (
                  <div
                    key={player.uId}
                    className="h-full w-[335.5px] space-y-8 bg-gradient-to-t from-black to-transparent p-4"
                  >
                    <div className="">
                      <p className="text-5xl">{player.killNum}</p>
                      <p className="text-medium">ELIMS</p>
                    </div>
                    <div className="">
                      <p className="text-5xl">{player.damage}</p>
                      <p className="text-medium">DAMAGE</p>
                    </div>
                    <div className="">
                      <p className="text-5xl">{player.knockouts}</p>
                      <p className="text-medium">KNOCKOUTS</p>
                    </div>
                    <div className="">
                      <p className="text-5xl">{player.rescueTimes}</p>
                      <p className="text-medium">RESCUE</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute bottom-[100px] left-[22px] z-20 flex h-[250px] w-[530px] items-center justify-center text-4xl font-bold">
            <Image
              src="/assets/images/logo.png"
              className="h-32 w-32 object-contain"
              alt=""
            />
            <p className="text-7xl">{mvpPlayer?.teamName}</p>
          </div>
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
          <div className="absolute bottom-2 left-0 z-20 grid h-[510px] w-full grid-cols-2 px-4 text-4xl font-bold">
            <div className="flex flex-col">
              {matchTeams?.slice(0, 4).map((team: any, index: number) => {
                const placementPoints = team.totalPoints - team.killCount;
                return (
                  <div
                    key={team.teamId}
                    className="flex h-[127.5px] items-center"
                  >
                    <div className="flex h-full w-[260px] items-center justify-center">
                      #{index + 1}
                    </div>
                    <div className="flex h-full w-[135px] items-center justify-center">
                      {team.teamName}
                    </div>
                    <div className="flex h-full w-[200px] items-center justify-center">
                      {placementPoints}
                    </div>
                    <div className="flex h-full w-[125px] items-center justify-center">
                      {team.killCount}
                    </div>
                    <div className="flex h-full w-[185px] items-center justify-center">
                      {team.totalPoints}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col">
              {matchTeams?.slice(4, 8).map((team: any, index: number) => {
                const placementPoints = team.totalPoints - team.killCount;
                return (
                  <div
                    key={team.teamId}
                    className="flex h-[127.5px] items-center"
                  >
                    <div className="flex h-full w-[290px] items-center justify-center">
                      #{index + 5}
                    </div>
                    <div className="flex h-full w-[135px] items-center justify-center">
                      {team.teamName}
                    </div>
                    <div className="flex h-full w-[200px] items-center justify-center">
                      {placementPoints}
                    </div>
                    <div className="flex h-full w-[125px] items-center justify-center">
                      {team.killCount}
                    </div>
                    <div className="flex h-full w-[185px] items-center justify-center">
                      {team.totalPoints}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute left-4 top-16 z-20 flex w-full items-center text-6xl font-bold">
            Match Rankings
          </div>
          <div className="absolute left-4 top-[135px] z-20 flex h-[70px] w-[694px] items-center justify-around text-3xl font-bold">
            <p>{matchName}</p>
            <p>{seriesName}</p>
          </div>
          <div className="absolute left-4 top-[220px] z-20 flex h-[276px] w-[1888px] text-3xl font-bold">
            <div className="w-[100px] p-4 text-4xl">
              <p>#1</p>
            </div>
            <div className="flex w-[700px] items-center justify-center">
              <Image
                src="/assets/images/logo.png"
                alt=""
                className="z-20 h-32 w-32 object-contain"
              />
            </div>
            <div className="flex w-[272px] flex-col items-center justify-center uppercase text-neutral-800">
              <p className="text-lg uppercase">team</p>
              <p className="text-6xl font-bold uppercase">
                {matchTeams[0].teamName}
              </p>
            </div>
            <div className="flex w-[272px] flex-col items-center justify-center text-neutral-800">
              <p className="uppercase">place pts</p>
              <p className="text-9xl font-bold uppercase">
                {matchTeams[0].totalPoints - matchTeams[0].killCount}
              </p>
            </div>
            <div className="flex w-[272px] flex-col items-center justify-center text-neutral-800">
              <p className="uppercase">elims</p>
              <p className="text-9xl font-bold uppercase">
                {matchTeams[0].killCount}
              </p>
            </div>
            <div className="flex w-[272px] flex-col items-center justify-center text-neutral-800">
              <p className="uppercase">total pts</p>
              <p className="text-9xl font-bold uppercase">
                {matchTeams[0].totalPoints}
              </p>
            </div>
          </div>
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
          <div className="absolute bottom-[70px] right-[170px] z-20 h-[720px] w-[660px]">
            <div className="flex h-[80px] w-full items-center justify-between py-2">
              <div className="flex h-full w-full items-center text-xl font-bold uppercase">
                <div className="flex h-full w-[66px] items-center justify-center">
                  RANK
                </div>
                <div className="flex h-full w-[198px] items-center justify-center">
                  TEAM
                </div>
                <div className="flex h-full w-[132px] items-center justify-center">
                  PLACE PTS
                </div>
                <div className="flex h-full w-[66px] items-center justify-center">
                  ELIMS
                </div>
                <div className="flex h-full w-[132px] items-center justify-center text-orange-300">
                  TOTAL PTS
                </div>
                <div className="flex h-full w-[66px] items-center justify-center text-orange-300">
                  <Icon path={mdiFoodDrumstick} size={1} />
                </div>
              </div>
            </div>
            {teamsData?.slice(0, 8)?.map((team: any, index: any) => (
              <div
                key={index}
                className="flex h-[80px] w-full items-center justify-between py-2"
              >
                <div
                  className={`flex h-full w-full items-center justify-center ${index == 0 ? "bg-yellow-600 bg-opacity-30" : index == 1 ? "bg-white bg-opacity-30" : index == 2 ? "bg-orange-900 bg-opacity-30" : "bg-white bg-opacity-10"} text-xl font-light backdrop-blur-xl`}
                >
                  <div className="flex h-full w-[66px] items-center justify-center font-black">
                    #{index + 1}
                  </div>
                  <div className="flex h-full w-[198px] items-center justify-center">
                    {team.teamName}
                  </div>
                  <div className="flex h-full w-[132px] items-center justify-center">
                    {team.totalPoints - team.killCount}
                  </div>
                  <div className="flex h-full w-[66px] items-center justify-center">
                    {team.killCount}
                  </div>
                  <div className="flex h-full w-[132px] items-center justify-center font-black">
                    {team.totalPoints}
                  </div>
                  <div className="flex h-full w-[66px] items-center justify-center font-black">
                    {team.winCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-[100px] left-[170px] z-20 flex h-[100px] w-[800px] items-center text-7xl font-bold">
            #1 {teamsData[0]?.teamName}
          </div>
          <div className="absolute bottom-[200px] left-[170px] z-20 flex h-[500px] w-[800px] items-center text-5xl font-bold">
            <div className="relative h-full w-full">
              <Image
                src="/assets/images/logo.png"
                alt=""
                className="h-[500px] w-[800px] object-contain"
              />
            </div>
          </div>

          <div
            className={`absolute right-[170px] top-[210px] z-20 flex h-[75px] w-[660px] transform items-center justify-around text-3xl font-bold transition-all duration-1000 ease-in-out`}
          >
            <p className="text-blue-950">{matchName}</p>
            <p className="">{seriesName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleScreen;
