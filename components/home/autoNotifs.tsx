"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Define notification types
type NotificationType =
  | "grenadeKill"
  | "vehicleKill"
  | "firstBlood"
  | "teamEliminated";

// Define notification interface
interface Notification {
  id: number;
  type: NotificationType;
  playerName: string;
  teamName?: string;
  victimTeamName?: string;
  timestamp: number;
}

const AutoNotifs = ({
  circleInfo,
  isInGame,
  totalPlayerList,
  teamInfo,
}: any) => {
  const [circleTimer, setCircleTimer] = useState<number | null>(null);
  const [circleTimerInterval, setCircleTimerInterval] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeNotification, setActiveNotification] =
    useState<Notification | null>(null);
  const [previousPlayerData, setPreviousPlayerData] = useState<any[]>([]);
  const [firstBloodShown, setFirstBloodShown] = useState(false);

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

  // Track player and team changes for notifications
  useEffect(() => {
    if (!isInGame || !totalPlayerList) return;

    // First game initialization
    if (previousPlayerData.length === 0 && totalPlayerList.length > 0) {
      setPreviousPlayerData(totalPlayerList);
      return;
    }

    // Check for kill notifications
    const newNotifications: Notification[] = [];

    // Check for first blood if not already shown
    if (!firstBloodShown) {
      const hasKills = totalPlayerList.some(
        (player: any) => player.killNum > 0,
      );
      if (hasKills) {
        // Find the player who got first blood
        const firstBloodPlayer = totalPlayerList.find(
          (player: any) => player.killNum > 0,
        );
        if (firstBloodPlayer) {
          newNotifications.push({
            id: Date.now(),
            type: "firstBlood",
            playerName: firstBloodPlayer.playerName,
            teamName: firstBloodPlayer.teamName,
            timestamp: Date.now(),
          });
          setFirstBloodShown(true);
        }
      }
    }

    // Check for grenade kills
    totalPlayerList.forEach((currentPlayer: any) => {
      const previousPlayer = previousPlayerData.find(
        (p) => p.uId === currentPlayer.uId,
      );

      if (
        previousPlayer &&
        currentPlayer.killNumByGrenade > previousPlayer.killNumByGrenade
      ) {
        newNotifications.push({
          id: Date.now() + 1,
          type: "grenadeKill",
          playerName: currentPlayer.playerName,
          teamName: currentPlayer.teamName,
          timestamp: Date.now(),
        });
      }

      // Check for vehicle kills
      if (
        previousPlayer &&
        currentPlayer.killNumInVehicle > previousPlayer.killNumInVehicle
      ) {
        newNotifications.push({
          id: Date.now() + 2,
          type: "vehicleKill",
          playerName: currentPlayer.playerName,
          teamName: currentPlayer.teamName,
          timestamp: Date.now(),
        });
      }
    });

    // Check for team eliminations
    if (teamInfo) {
      teamInfo.forEach((team: any) => {
        if (team.liveMemberNum === 0) {
          const alreadyNotified = notifications.some(
            (notif) =>
              notif.type === "teamEliminated" &&
              notif.victimTeamName === team.teamName,
          );

          if (!alreadyNotified) {
            newNotifications.push({
              id: Date.now() + 3,
              type: "teamEliminated",
              playerName: "", // No specific player for team elimination
              victimTeamName: team.teamName,
              timestamp: Date.now(),
            });
          }
        }
      });
    }

    // Add new notifications and update state
    if (newNotifications.length > 0) {
      setNotifications((prev) => [...prev, ...newNotifications]);
    }

    // Update previous player data
    setPreviousPlayerData(totalPlayerList);
  }, [totalPlayerList, teamInfo, isInGame, firstBloodShown, notifications]);

  // Handle displaying one notification at a time
  useEffect(() => {
    // If there's no active notification but we have notifications in queue
    if (!activeNotification && notifications.length > 0) {
      // Set the first notification as active
      setActiveNotification(notifications[0]);

      // Remove it from the queue
      setNotifications((prev) => prev.slice(1));

      // Set a timeout to clear this notification after 5 seconds
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [activeNotification, notifications]);

  // Cleanup effects when component unmounts
  useEffect(() => {
    return () => {
      if (circleTimerInterval) {
        clearInterval(circleTimerInterval);
      }
    };
  }, [circleTimerInterval]);

  // Reset state when game ends
  useEffect(() => {
    if (!isInGame) {
      setCircleTimer(null);
      setNotifications([]);
      setActiveNotification(null);
      setFirstBloodShown(false);
      if (circleTimerInterval) {
        clearInterval(circleTimerInterval);
        setCircleTimerInterval(null);
      }
    }
  }, [isInGame, circleTimerInterval]);

  // Get notification text based on type
  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case "grenadeKill":
        return "GRENADE KILL";
      case "vehicleKill":
        return "VEHICLE KILL";
      case "firstBlood":
        return "FIRST BLOOD";
      case "teamEliminated":
        return "TEAM ELIMINATED";
      default:
        return "";
    }
  };

  return (
    <div className="absolute left-0 top-0 z-10">
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

      {/* PUBG notifications - showing only one at a time with simplified content */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            key={activeNotification.id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute left-0 top-[350px] z-10 flex h-32 w-48 items-center justify-center"
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
                {getNotificationText(activeNotification)}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full text-center uppercase">
              {activeNotification.type === "teamEliminated" ? (
                <p className="text-white">
                  {activeNotification.victimTeamName}
                </p>
              ) : (
                <p className="text-white">{activeNotification.playerName}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutoNotifs;
