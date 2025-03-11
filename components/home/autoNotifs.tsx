"use client";
import { Image } from "@heroui/react";
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
    if (!isInGame) {
      return;
    }
    if (
      !teamInfo ||
      prevTeamInfoRef.current?.liveMemberNum === teamInfo.liveMemberNum
    ) {
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
    if (!totalPlayerList || !totalPlayerList.length || !isInGame) return;

    totalPlayerList.forEach((player: any) => {
      const prevPlayer = prevPlayersRef.current[player.id] || {
        killNumByGrenade: 0,
        killNumInVehicle: 0,
        killNum: 0,
      };

      if (player.killNumByGrenade > prevPlayer.killNumByGrenade) {
        addNotification("grenadeKill", {
          playerName: player.name,
        });
      }

      if (player.killNumInVehicle > prevPlayer.killNumInVehicle) {
        addNotification("vehicleKill", {
          playerName: player.name,
        });
      }

      if (!firstBloodShownRef.current && player.killNum > 0) {
        firstBloodShownRef.current = true;
        addNotification("firstBlood", {
          playerName: player.name,
        });
      }

      prevPlayersRef.current[player.id] = {
        killNumByGrenade: player.killNumByGrenade,
        killNumInVehicle: player.killNumInVehicle,
        killNum: player.killNum,
      };
    });
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
    } else if (timeRemaining > 20 || CircleStatus !== 0) {
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
            className="absolute left-[830px] top-[200px] z-10 flex h-[90px] w-[275px] items-center bg-cyan-600 bg-opacity-30"
          >
            <div className="relative flex h-full w-[120px] items-center justify-center bg-black bg-opacity-30">
              <div className="absolute left-2 top-2">
                #{notification.data.position}
              </div>
              <Image
                src="/assets/images/logo.png"
                alt=""
                className="h-[60px] w-[60px] object-cover"
              />
            </div>
            <div className="flex h-full w-[155px] items-center justify-center bg-white bg-opacity-30">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <p className="text-xl font-bold">
                  <span className="text-5xl text-white">
                    {notification.data.kills}
                  </span>{" "}
                  ELIMS
                </p>
                <p className="text-xl font-bold">Eliminated</p>
              </div>
            </div>
          </div>
        );

      case "grenadeKill":
      case "vehicleKill":
      case "firstBlood":
        return (
          <div
            key={notification.id}
            className="absolute left-0 top-[350px] z-10 flex h-[90px] w-[330px] items-center justify-center bg-cyan-600 bg-opacity-30"
          >
            <div className="relative">
              <video
                src="/assets/videos/mininotif.mp4"
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
              />
            </div>
            <p className="text-3xl font-bold">
              {notification.type === "grenadeKill" &&
                `${notification.data.playerName} fragged ${notification.data.victims}`}
              {notification.type === "vehicleKill" &&
                `${notification.data.playerName} roadkilled ${notification.data.victims}`}
              {notification.type === "firstBlood" &&
                `FIRST BLOOD: ${notification.data.playerName}`}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute left-0 top-0 z-10 h-screen w-screen">
      {notifications.map(renderNotification)}
      {circleTimer !== null && (
        <div className="absolute left-[275px] top-[90px] z-10 flex h-[100px] w-[315px] bg-cyan-600 bg-opacity-30">
          <video
            src="assets/videos/circleTimer.mp4"
            autoPlay
            loop
            muted
            className="h-full w-full object-cover"
          ></video>
          <div className="absolute left-0 top-0 flex h-full w-[115px] items-center justify-center text-4xl font-bold text-slate-800">
            {circleTimer}
          </div>
          <div className="absolute right-0 top-0 flex h-full w-[200px] items-center justify-center text-wrap text-center text-2xl font-bold uppercase">
            Circle <br /> closing in
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoNotifs;
