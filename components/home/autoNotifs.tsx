"use client";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const AutoNotifs = ({
  totalPlayerList,
  circleInfo,
  teamInfo,
  isInGame,
}: any) => {
  const [notifications, setNotifications] = useState<any>([]);
  const [circleTimer, setCircleTimer] = useState<any>(null);
  const circleTimerIntervalRef = useRef<any>(null);
  const firstBloodShownRef = useRef(false);

  const prevPlayersRef = useRef<any>({});
  const prevTeamInfoRef = useRef<any>(null);

  const addNotification = useCallback((type: any, data: any) => {
    const id = Date.now();
    const newNotification = { id, type, data, timestamp: Date.now() };

    setNotifications((prev: any) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev: any) =>
        prev.filter((notif: any) => notif.id !== id),
      );
    }, 5000);
  }, []);

  useEffect(() => {
    if (!isInGame || !teamInfo) return;

    if (prevTeamInfoRef.current?.liveMemberNum === teamInfo.liveMemberNum) {
      prevTeamInfoRef.current = teamInfo;
      return;
    }

    if (teamInfo.liveMemberNum === 0) {
      addNotification("teamEliminated", {
        teamName: teamInfo.teamName,
        teamId: teamInfo.teamId,
        kills: teamInfo.killNum,
        position: teamInfo.position || "?",
      });
    }

    prevTeamInfoRef.current = teamInfo;
  }, [teamInfo, addNotification, isInGame]);

  useEffect(() => {
    if (!totalPlayerList?.length || !isInGame) return;

    const newKillEvents: any = {};

    totalPlayerList.forEach((player: any) => {
      const prevPlayer = prevPlayersRef.current[player.id] || {
        killNumByGrenade: 0,
        killNumInVehicle: 0,
        killNum: 0,
      };

      // Track grenade kills
      if (player.killNumByGrenade > prevPlayer.killNumByGrenade) {
        newKillEvents[player.id] ??= {
          name: player.name,
          grenadeKills: [],
          vehicleKills: [],
        };
        newKillEvents[player.id].grenadeKills.push(
          ...Array(player.killNumByGrenade - prevPlayer.killNumByGrenade).fill(
            "victim",
          ),
        );
      }

      // Track vehicle kills
      if (player.killNumInVehicle > prevPlayer.killNumInVehicle) {
        newKillEvents[player.id] ??= {
          name: player.name,
          grenadeKills: [],
          vehicleKills: [],
        };
        newKillEvents[player.id].vehicleKills.push(
          ...Array(player.killNumInVehicle - prevPlayer.killNumInVehicle).fill(
            "victim",
          ),
        );
      }

      // First blood logic
      if (!firstBloodShownRef.current && player.killNum > 0) {
        firstBloodShownRef.current = true;

        let killType = "firstBlood";
        let victims = null;

        if (player.killNumByGrenade > 0) {
          killType = "firstBloodGrenade";
          victims = newKillEvents[player.id]?.grenadeKills.length || 1;
        } else if (player.killNumInVehicle > 0) {
          killType = "firstBloodVehicle";
          victims = newKillEvents[player.id]?.vehicleKills.length || 1;
        }

        addNotification(killType, {
          playerName: player.name,
          victims,
        });
      }

      prevPlayersRef.current[player.id] = {
        killNumByGrenade: player.killNumByGrenade,
        killNumInVehicle: player.killNumInVehicle,
        killNum: player.killNum,
      };
    });

    // Batch grenade & vehicle kill notifications
    Object.values(newKillEvents).forEach(
      ({ name, grenadeKills, vehicleKills }: any) => {
        if (grenadeKills.length) {
          addNotification("grenadeKill", {
            playerName: name,
            victims: grenadeKills.length,
          });
        }
        if (vehicleKills.length) {
          addNotification("vehicleKill", {
            playerName: name,
            victims: vehicleKills.length,
          });
        }
      },
    );
  }, [totalPlayerList, addNotification, isInGame]);

  useEffect(() => {
    if (!circleInfo || !isInGame) return;

    const Counter = Number(circleInfo.Counter);
    const MaxTime = Number(circleInfo.MaxTime);
    const CircleStatus = Number(circleInfo.CircleStatus);
    const timeRemaining = MaxTime - Counter;

    if (timeRemaining <= 20 && Counter < MaxTime && CircleStatus === 0) {
      setCircleTimer(timeRemaining);

      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
      }

      const intervalId = setInterval(() => {
        setCircleTimer((prev: any) => {
          if (prev !== null && prev > 0) {
            return prev - 1;
          } else {
            clearInterval(intervalId);
            return null;
          }
        });
      }, 1000);

      circleTimerIntervalRef.current = intervalId;
    } else {
      setCircleTimer(null);
      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
        circleTimerIntervalRef.current = null;
      }
    }

    return () => {
      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
      }
    };
  }, [circleInfo, isInGame]);

  const renderNotification = (notification: any) => {
    switch (notification.type) {
      case "teamEliminated":
        return (
          <div
            key={notification.id}
            className="absolute left-[830px] top-[200px] z-10 flex h-[90px] w-[275px] bg-cyan-600 bg-opacity-30"
          >
            <p className="text-xl font-bold">Eliminated</p>
          </div>
        );

      case "grenadeKill":
      case "vehicleKill":
      case "firstBlood":
      case "firstBloodGrenade":
      case "firstBloodVehicle":
        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute left-0 top-[350px] z-10"
          >
            <p className="text-3xl font-bold">
              {notification.type.includes("firstBlood") && `FIRST BLOOD: `}
              {notification.data.playerName}
              {notification.type.includes("grenadeKill") &&
                ` fragged ${notification.data.victims}`}
              {notification.type.includes("vehicleKill") &&
                ` roadkilled ${notification.data.victims}`}
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute left-0 top-0 z-10">
      {notifications.map(renderNotification)}
    </div>
  );
};

export default AutoNotifs;
