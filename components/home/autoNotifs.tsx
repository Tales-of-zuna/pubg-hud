"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const AutoNotifs = ({
  circleInfo,
  isInGame,
  totalPlayerList,
  teamInfo,
}: any) => {
  const [circleTimer, setCircleTimer] = useState<number | null>(null);
  const [notification, setNotification] = useState<any>(null);
  const circleTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const firstBloodShownRef = useRef(false);
  const prevPlayersRef = useRef<{ [key: string]: any }>({});
  const prevTeamInfoRef = useRef<any>(null);

  const showNotification = useCallback(
    (type: string, data: any) => {
      if (notification) return;

      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }

      setNotification({ type, data });

      notificationTimeoutRef.current = setTimeout(() => {
        setNotification(null);
        notificationTimeoutRef.current = null;
      }, 5000);
    },
    [notification],
  );

  useEffect(() => {
    if (!totalPlayerList?.length || !isInGame) return;

    totalPlayerList.forEach((player: any) => {
      const prevPlayer = prevPlayersRef.current[player.id] || {
        killNum: 0,
        killNumByGrenade: 0,
        killNumInVehicle: 0,
      };

      if (!firstBloodShownRef.current && player.killNum > 0) {
        firstBloodShownRef.current = true;
        showNotification("firstBlood", { playerName: player.playerName });
      }

      if (player.killNumByGrenade > prevPlayer.killNumByGrenade) {
        showNotification("grenadeKill", { playerName: player.playerName });
      }

      if (player.killNumInVehicle > prevPlayer.killNumInVehicle) {
        showNotification("vehicleKill", { playerName: player.playerName });
      }

      prevPlayersRef.current[player.id] = {
        killNum: player.killNum,
        killNumByGrenade: player.killNumByGrenade,
        killNumInVehicle: player.killNumInVehicle,
      };
    });
  }, [totalPlayerList, showNotification, isInGame]);

  useEffect(() => {
    if (!isInGame || !teamInfo) return;

    if (!prevTeamInfoRef.current) {
      prevTeamInfoRef.current = teamInfo;
      return;
    }

    if (
      prevTeamInfoRef.current.liveMemberNum > 0 &&
      teamInfo.liveMemberNum === 0
    ) {
      showNotification("teamEliminated", {
        teamName: teamInfo.teamName,
        kills: teamInfo.killNum,
      });
    }

    prevTeamInfoRef.current = teamInfo;
  }, [teamInfo, showNotification, isInGame]);

  useEffect(() => {
    if (!circleInfo || !isInGame) {
      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
        circleTimerIntervalRef.current = null;
      }
      return;
    }

    const Counter = Number(circleInfo.Counter);
    const MaxTime = Number(circleInfo.MaxTime);
    const CircleStatus = Number(circleInfo.CircleStatus);
    const timeRemaining = MaxTime - Counter;

    if (timeRemaining <= 20 && Counter < MaxTime && CircleStatus === 0) {
      setCircleTimer(timeRemaining);

      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
      }

      circleTimerIntervalRef.current = setInterval(() => {
        setCircleTimer((prev) => {
          const newValue = prev !== null && prev > 0 ? prev - 1 : null;

          if (newValue === null && circleTimerIntervalRef.current) {
            clearInterval(circleTimerIntervalRef.current);
            circleTimerIntervalRef.current = null;
          }

          return newValue;
        });
      }, 1000);
    } else if (CircleStatus !== 0) {
      setCircleTimer(null);
      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
        circleTimerIntervalRef.current = null;
      }
    }

    return () => {
      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
        circleTimerIntervalRef.current = null;
      }
    };
  }, [circleInfo, isInGame]);

  useEffect(() => {
    return () => {
      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInGame) {
      firstBloodShownRef.current = false;
      prevPlayersRef.current = {};
      prevTeamInfoRef.current = null;
      setCircleTimer(null);
      setNotification(null);

      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
        circleTimerIntervalRef.current = null;
      }

      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
        notificationTimeoutRef.current = null;
      }
    }
  }, [isInGame]);

  return (
    <div className="absolute left-0 top-0 z-10">
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.type}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute left-0 top-[350px] z-10 flex w-96 items-center justify-center"
          >
            <video
              src="assets/videos/mininotif.mp4"
              autoPlay
              loop
              muted
              className="h-full w-full object-cover"
            ></video>
            <div className="absolute left-0 top-2 z-30 flex w-full items-center justify-center font-bold">
              <p className="text-5xl text-neutral-800">
                {notification.type === "firstBlood" && `FIRST BLOOD`}
                {notification.type === "grenadeKill" && `GRENADE KILL`}
                {notification.type === "vehicleKill" && `VEHICLE KILL`}
                {notification.type === "teamEliminated" &&
                  `TEAM ELIMINATED - ${notification.data.teamName} (${notification.data.kills} KILLS)`}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full text-center uppercase">
              <p className="text-white">{notification.data.playerName}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {circleTimer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="absolute left-[275px] top-[120px] z-10 flex h-[100px] w-[315px] bg-cyan-600 bg-opacity-30"
          >
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
            <div className="absolute right-0 top-0 flex h-full w-[200px] items-center justify-center text-wrap text-center text-3xl font-bold uppercase">
              Circle <br /> closing in
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutoNotifs;
