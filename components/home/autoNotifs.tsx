"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const AutoNotifs = ({
  circleInfo,
  isInGame,
  totalPlayerList,
  teamInfo,
}: any) => {
  const [circleTimer, setCircleTimer] = useState<number | null>(null);
  const [notification, setNotification] = useState<any>(null);
  const [firstBloodShown, setFirstBloodShown] = useState(false);
  const [prevPlayers, setPrevPlayers] = useState<{ [key: string]: any }>({});
  const [prevTeamInfo, setPrevTeamInfo] = useState<any>(null);
  const [circleTimerInterval, setCircleTimerInterval] = useState<any>(null);
  const [notificationTimeout, setNotificationTimeout] = useState<any>(null);

  const showNotification = useCallback(
    (type: string, data: any) => {
      console.log("New notification:", type, data);

      // Clear any existing notification timeout
      if (notificationTimeout) {
        console.log("Clearing existing timeout");
        clearTimeout(notificationTimeout);
      }

      // Set the new notification
      setNotification({ type, data });

      // Set a timeout to clear the notification
      const timeoutId = setTimeout(() => {
        console.log("Clearing notification after timeout");
        setNotification(null);
        setNotificationTimeout(null);
      }, 5000);

      setNotificationTimeout(timeoutId);
    },
    [notificationTimeout],
  );

  // Handle player-based notifications
  useEffect(() => {
    if (!totalPlayerList?.length || !isInGame) return;

    // Create a copy of the current player state to update
    const newPrevPlayers = { ...prevPlayers };
    let showedFirstBlood = firstBloodShown;

    totalPlayerList.forEach((player: any) => {
      const prevPlayer = prevPlayers[player.id] || {
        killNum: 0,
        killNumByGrenade: 0,
        killNumInVehicle: 0,
      };

      // Check for first blood
      if (!showedFirstBlood && player.killNum > 0) {
        showedFirstBlood = true;
        setFirstBloodShown(true);
        showNotification("firstBlood", { playerName: player.playerName });
      }

      // Check for grenade kills
      if (player.killNumByGrenade > prevPlayer.killNumByGrenade) {
        console.log(
          `Grenade kill detected for ${player.playerName}: ${prevPlayer.killNumByGrenade} → ${player.killNumByGrenade}`,
        );
        showNotification("grenadeKill", { playerName: player.playerName });
      }

      // Check for vehicle kills
      if (player.killNumInVehicle > prevPlayer.killNumInVehicle) {
        console.log(
          `Vehicle kill detected for ${player.playerName}: ${prevPlayer.killNumInVehicle} → ${player.killNumInVehicle}`,
        );
        showNotification("vehicleKill", { playerName: player.playerName });
      }

      // Update the previous player state
      newPrevPlayers[player.id] = {
        killNum: player.killNum,
        killNumByGrenade: player.killNumByGrenade,
        killNumInVehicle: player.killNumInVehicle,
      };
    });

    // Update the previous players state
    setPrevPlayers(newPrevPlayers);
  }, [
    totalPlayerList,
    isInGame,
    prevPlayers,
    firstBloodShown,
    showNotification,
  ]);

  // Handle team elimination notification
  useEffect(() => {
    if (!isInGame || !teamInfo) return;

    if (!prevTeamInfo) {
      setPrevTeamInfo(teamInfo);
      return;
    }

    // Check if team was eliminated
    if (prevTeamInfo.liveMemberNum > 0 && teamInfo.liveMemberNum == 0) {
      showNotification("teamEliminated", {
        teamName: teamInfo.teamName,
        kills: teamInfo.killNum,
      });
    }

    // Update previous team info
    setPrevTeamInfo(teamInfo);
  }, [teamInfo, isInGame, prevTeamInfo, showNotification]);

  // Handle circle timer
  useEffect(() => {
    if (!circleInfo || !isInGame) {
      if (circleTimerInterval) {
        clearInterval(circleTimerInterval);
        setCircleTimerInterval(null);
      }
      setCircleTimer(null);
      return;
    }

    const Counter = Number(circleInfo.Counter);
    const MaxTime = Number(circleInfo.MaxTime);
    const CircleStatus = Number(circleInfo.CircleStatus);
    const timeRemaining = MaxTime - Counter;

    if (timeRemaining <= 20 && Counter < MaxTime && CircleStatus === 0) {
      setCircleTimer(timeRemaining);

      if (circleTimerInterval) {
        clearInterval(circleTimerInterval);
      }

      const intervalId = setInterval(() => {
        setCircleTimer((prev) => {
          const newValue = prev !== null && prev > 0 ? prev - 1 : null;

          if (newValue === null && circleTimerInterval) {
            clearInterval(circleTimerInterval);
            setCircleTimerInterval(null);
          }

          return newValue;
        });
      }, 1000);

      setCircleTimerInterval(intervalId);
    } else if (CircleStatus !== 0) {
      setCircleTimer(null);
      if (circleTimerInterval) {
        clearInterval(circleTimerInterval);
        setCircleTimerInterval(null);
      }
    }
  }, [circleInfo, isInGame, circleTimerInterval]);

  // Cleanup effects when component unmounts
  useEffect(() => {
    return () => {
      if (circleTimerInterval) {
        clearInterval(circleTimerInterval);
      }
      if (notificationTimeout) {
        clearTimeout(notificationTimeout);
      }
    };
  }, [circleTimerInterval, notificationTimeout]);

  // Reset state when game ends
  useEffect(() => {
    if (!isInGame) {
      console.log("Resetting state as game ended");
      setFirstBloodShown(false);
      setPrevPlayers({});
      setPrevTeamInfo(null);
      setCircleTimer(null);
      setNotification(null);

      if (circleTimerInterval) {
        clearInterval(circleTimerInterval);
        setCircleTimerInterval(null);
      }

      if (notificationTimeout) {
        clearTimeout(notificationTimeout);
        setNotificationTimeout(null);
      }
    }
  }, [isInGame, circleTimerInterval, notificationTimeout]);

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
