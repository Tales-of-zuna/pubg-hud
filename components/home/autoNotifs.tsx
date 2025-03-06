"use client";
import { Image } from "@heroui/react";
import { useEffect, useState } from "react";

const AutoNotifs = ({ totalPlayerList, circleInfo, teamInfo }: any) => {
  const [notifications, setNotifications] = useState<any>([]);
  const [circleTimer, setCircleTimer] = useState<any>(null);
  const [circleTimerInterval, setCircleTimerInterval] = useState<any>(null);

  const [firstBloodShown, setFirstBloodShown] = useState(false);

  const addNotification = (type: any, data: any) => {
    const id = Date.now();
    const newNotification = { id, type, data, timestamp: Date.now() };
    setNotifications((prev: any) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev: any) =>
        prev.filter((notif: any) => notif.id !== id),
      );
    }, 5000);
  };

  useEffect(() => {
    if (!teamInfo || !teamInfo.liveMemberNum) return;

    if (teamInfo.liveMemberNum === 0) {
      addNotification("teamEliminated", {
        teamName: teamInfo.teamName,
        teamId: teamInfo.teamId,
        kills: teamInfo.killNum,
      });
    }
  }, [teamInfo?.liveMemberNum]);

  useEffect(() => {
    if (!totalPlayerList || !totalPlayerList.length) return;

    totalPlayerList.forEach((player: any) => {
      if (player.killNumByGrenade > (player.prevKillNumByGrenade || 0)) {
        addNotification("grenadeKill", {
          playerName: player.name,
          victims: player.victims?.slice(-1) || ["an opponent"],
        });
      }

      if (player.killNumInVehicle > (player.prevKillNumInVehicle || 0)) {
        addNotification("vehicleKill", {
          playerName: player.name,
          victims: player.victims?.slice(-1) || ["an opponent"],
        });
      }

      if (!firstBloodShown && player.killNum > 0) {
        setFirstBloodShown(true);
        addNotification("firstBlood", {
          playerName: player.name,
        });
      }

      player.prevKillNumByGrenade = player.killNumByGrenade;
      player.prevKillNumInVehicle = player.killNumInVehicle;
    });
  }, [totalPlayerList]);

  useEffect(() => {
    if (!circleInfo) return;

    const Counter = Number(circleInfo.Counter);
    const MaxTime = Number(circleInfo.MaxTime);
    const CircleStatus = Number(circleInfo.CircleStatus);

    if (MaxTime - Counter <= 20 && Counter < MaxTime && CircleStatus == 0) {
      setCircleTimer(MaxTime - Counter);
      if (circleTimerInterval) {
        clearInterval(circleTimerInterval);
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

      setCircleTimerInterval(intervalId);
    } else {
      setCircleTimer(null);
      if (circleTimerInterval) {
        clearInterval(circleTimerInterval);
        setCircleTimerInterval(null);
      }
    }
  }, [circleInfo?.Counter]);

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
                src="/assets/images/player.webp"
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
