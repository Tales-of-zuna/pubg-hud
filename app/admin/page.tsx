"use client";

import {
  Button,
  Card,
  CardBody,
  Input,
  Switch,
  Tab,
  Tabs,
} from "@heroui/react";
import {
  mdiBellCog,
  mdiCog,
  mdiProjectorScreen,
  mdiToggleSwitch,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { toast } from "sonner";

const popupChannel = new BroadcastChannel("popup");
const screenChannel = new BroadcastChannel("screen");
const toggleChannel = new BroadcastChannel("toggle");
const matchChannel = new BroadcastChannel("match");
const seriesChannel = new BroadcastChannel("series");

const Admin = () => {
  const [activeScreen, setActiveScreen] = useState("battle");
  const [activeToggles, setActiveToggles] = useState<string[]>([]);
  const [activePopups, setActivePopups] = useState<string[]>([]);
  const [totalPlayerList, setTotalPlayerList] = useState([]);
  const [disableButtons, setDisableButtons] = useState(false);

  // popupChannel.onmessage = (e) => setActivePopups(e.data);
  // screenChannel.onmessage = (e) => setActiveScreen(e.data);
  // toggleChannel.onmessage = (e) => setActiveToggles(e.data);

  const handleToggleChange = (toggle: string) => {
    setActiveToggles((prevToggles) => {
      const updatedToggles = prevToggles.includes(toggle)
        ? prevToggles.filter((t) => t !== toggle)
        : [...prevToggles, toggle];

      toggleChannel.postMessage({ data: updatedToggles });
      return updatedToggles;
    });
  };

  const handlePopupChange = (popup: string) => {
    setActivePopups((prevPopups) => {
      const updatedPopups = prevPopups.includes(popup)
        ? prevPopups.filter((p) => p !== popup)
        : [...prevPopups, popup];

      popupChannel.postMessage({ data: updatedPopups });
      return updatedPopups;
    });
  };

  const saveTeamData = async () => {
    try {
      const teamStats: any = {};
      totalPlayerList.forEach((player) => {
        const { teamId, teamName, killNum, rank } = player;
        if (!teamStats[teamId]) {
          teamStats[teamId] = {
            teamName,
            teamId: teamId,
            totalPoints: 0,
            winCount: 0,
            killCount: 0,
          };
        }

        teamStats[teamId].killCount += killNum;

        if (rank == 1) {
          teamStats[teamId].winCount += 1;
          teamStats[teamId].totalPoints += 10;
        } else if (rank == 2) {
          teamStats[teamId].totalPoints += 6;
        } else if (rank == 3) {
          teamStats[teamId].totalPoints += 5;
        } else if (rank == 4) {
          teamStats[teamId].totalPoints += 4;
        } else if (rank == 5) {
          teamStats[teamId].totalPoints += 3;
        } else if (rank == 6) {
          teamStats[teamId].totalPoints += 2;
        } else if (rank == 8 || rank == 7) {
          teamStats[teamId].totalPoints += 1;
        } else {
          teamStats[teamId].totalPoints += 0;
        }

        teamStats[teamId].totalPoints += killNum;
      });

      const teamsToUpdate = Object.values(teamStats);

      const updatePromises = teamsToUpdate.map((team) => {
        return fetch("/api/gameData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(team),
        });
      });

      await Promise.all(updatePromises);
      setDisableButtons(true);
      toast.success("Team data saved successfully!");
    } catch (error) {
      console.error("Error saving team data:", error);
      alert("Failed to save team data. See console for details.");
    }
  };

  return (
    <div className="h-full w-full space-x-4 space-y-4 rounded-xl">
      <Tabs aria-label="Options" isVertical>
        <Tab className="w-full" key="dashboard" title="In Game Dashboard">
          <Card className="w-full p-8">
            <CardBody className="space-y-8">
              <div className="flex w-1/2 gap-4">
                <Input
                  onChange={(e) => seriesChannel.postMessage(e.target.value)}
                  label="Series Name"
                />
                <Input
                  onChange={(e) => matchChannel.postMessage(e.target.value)}
                  label="Current Match (13/18)"
                />
              </div>
              <div className="flex w-full items-center justify-center gap-4">
                <div className="h-px w-full bg-neutral-800"></div>
                <div className="flex w-auto items-center gap-2">
                  Screens <Icon path={mdiProjectorScreen} size={1} />
                </div>
                <div className="h-px w-full bg-neutral-800"></div>
              </div>
              <div className="flex items-center gap-8">
                {[
                  "battle",
                  "teamstats",
                  "matchrankings",
                  "overallrankings",
                ].map((screen) => (
                  <Switch
                    key={screen}
                    color="warning"
                    isSelected={activeScreen === screen}
                    onValueChange={() => {
                      setActiveScreen(screen);
                      screenChannel.postMessage(screen);
                    }}
                  >
                    {screen === "battle"
                      ? "Battle"
                      : screen === "overallrankings"
                        ? "Overall ranking"
                        : screen === "teamstats"
                          ? "Team stats"
                          : "Match ranking"}
                  </Switch>
                ))}
              </div>

              <div className="flex w-full items-center justify-center gap-4">
                <div className="h-px w-full bg-neutral-800"></div>
                <div className="flex w-auto items-center gap-2">
                  Toggles <Icon path={mdiToggleSwitch} size={1} />
                </div>
                <div className="h-px w-full bg-neutral-800"></div>
              </div>
              <div className="flex items-center gap-8">
                {["sponsors", "teams", "playerimage", "teamdamage"].map(
                  (toggle) => (
                    <Switch
                      key={toggle}
                      color="warning"
                      isSelected={activeToggles.includes(toggle)}
                      onValueChange={() => handleToggleChange(toggle)}
                    >
                      {toggle === "sponsors"
                        ? "Sponsors"
                        : toggle === "teams"
                          ? "Teams"
                          : toggle === "playerimage"
                            ? "Player image"
                            : "Team damage"}
                    </Switch>
                  ),
                )}
                <Button
                  color="warning"
                  onPress={() => {
                    setActiveToggles([]);
                    toggleChannel.postMessage({ data: [] });
                  }}
                >
                  Clear Toggles <Icon path={mdiToggleSwitch} size={1} />
                </Button>
              </div>

              <div className="flex w-full items-center justify-center gap-4">
                <div className="h-px w-full bg-neutral-800"></div>
                <div className="flex w-auto items-center gap-2">
                  Popups <Icon path={mdiBellCog} size={1} />
                </div>
                <div className="h-px w-full bg-neutral-800"></div>
              </div>
              <div className="flex items-center gap-8">
                {[{ key: "socialplatforms", label: "Social Platforms" }].map(
                  ({ key, label }) => (
                    <Button
                      key={key}
                      color="warning"
                      variant="bordered"
                      onPress={() => handlePopupChange(key)}
                    >
                      {label}
                    </Button>
                  ),
                )}
                <Button
                  color="warning"
                  onPress={() => {
                    setActivePopups([]);
                    popupChannel.postMessage({ data: [] });
                  }}
                >
                  Clear Popups <Icon path={mdiBellCog} size={1} />
                </Button>
              </div>
              <div className="flex w-full items-center justify-center gap-4">
                <div className="h-px w-full bg-neutral-800"></div>
                <div className="flex w-auto items-center gap-2">
                  SaveGame <Icon path={mdiCog} size={1} />
                </div>
                <div className="h-px w-full bg-neutral-800"></div>
              </div>
              <p></p>
              <div className="flex items-center gap-8">
                <Button
                  isDisabled={disableButtons}
                  onPress={async () => {
                    const res = await fetch("/api/battle");
                    const data = await res.json();
                    console.log(data);
                    setTotalPlayerList(data);
                  }}
                >
                  Get Players Data
                </Button>
                <Button
                  isDisabled={totalPlayerList.length === 0 || disableButtons}
                  onPress={saveTeamData}
                >
                  Save Game Data
                </Button>
                <Icon path={mdiCog} size={1} className="animate-bounce" />
              </div>
              <div>
                {totalPlayerList.map((player: any) => {
                  return (
                    <div key={player.uId}>
                      {player.playerName} - {player.teamId} - {player.killNum}
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab className="w-full" key="dataS" title="SaveMatchData">
          <Card className="w-full p-8">
            <CardBody className="space-y-8">
              <div className="flex gap-4"></div>
            </CardBody>
          </Card>
        </Tab>
        <Tab className="w-full" key="about" title="About">
          <Card className="w-full p-8">
            <CardBody className="space-y-8">
              <div className="flex w-full items-center justify-center gap-4">
                <div className="h-px w-full bg-neutral-800"></div>
                <div className="flex w-auto items-center gap-2">About</div>
                <div className="h-px w-full bg-neutral-800"></div>
              </div>
              <div className="flex items-center gap-8">
                <Switch color="warning">Enable/Disable</Switch>
                <Switch color="warning">Enable/Disable</Switch>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab className="w-full" key="help" title="Help">
          <Card className="w-full p-8">
            <CardBody className="space-y-8">
              <div className="flex w-full items-center justify-center gap-4">
                <div className="h-px w-full bg-neutral-800"></div>
                <div className="flex w-auto items-center gap-2">Help</div>
                <div className="h-px w-full bg-neutral-800"></div>
              </div>
              <div className="flex items-center gap-8">
                <Switch color="warning">Enable/Disable</Switch>
                <Switch color="warning">Enable/Disable</Switch>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Admin;
