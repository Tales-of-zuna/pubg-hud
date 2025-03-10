"use clien";
import { useEffect, useState } from "react";
import Plane from "../toggles/plane";
import PlayerImage from "../toggles/playerImage";
import Sponsors from "../toggles/sponsors";
import TeamDamage from "../toggles/teamDamage";
import Teams from "../toggles/teams";

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
        <Teams
          teamsWithPlayers={teamsWithPlayers}
          observedPlayer={observedPlayer}
          getPlacementPoints={getPlacementPoints}
        />
      )}
      {toggles?.includes("lastfourteams") && (
        <div className="h-32 w-32 bg-red-500">last four</div>
      )}
      {toggles?.includes("plane") && (
        <Plane
          mapName={mapName}
          seriesName={seriesName}
          matchName={matchName}
        />
      )}
      {toggles?.includes("playerimage") && (
        <PlayerImage observedPlayer={observedPlayer} />
      )}
      {toggles?.includes("sponsors") && (
        <Sponsors seriesName={seriesName} matchName={matchName} />
      )}
      {toggles?.includes("teamdamage") && (
        <TeamDamage selectedTeam={selectedTeam} />
      )}
    </div>
  );
};

export default Toggle;
