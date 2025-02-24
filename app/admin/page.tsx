"use client";

import { Button, Card, CardBody, Switch, Tab, Tabs } from "@heroui/react";
import { mdiBellCog, mdiProjectorScreen, mdiToggleSwitch } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";

const popupChannel = new BroadcastChannel("popup");
const screenChannel = new BroadcastChannel("screen");
const toggleChannel = new BroadcastChannel("toggle");

const Admin = () => {
  const [activeScreen, setActiveScreen] = useState("battle");
  const [activeToggles, setActiveToggles] = useState<string[]>([]);

  const handleToggleChange = (toggle: string) => {
    setActiveToggles((prevToggles) => {
      const updatedToggles = prevToggles.includes(toggle)
        ? prevToggles.filter((t) => t !== toggle)
        : [...prevToggles, toggle];

      toggleChannel.postMessage({ data: updatedToggles });
      return updatedToggles;
    });
  };

  return (
    <div className="h-full w-full space-x-4 space-y-4 rounded-xl">
      <Tabs aria-label="Options" isVertical>
        <Tab className="w-full" key="dashboard" title="In Game Dashboard">
          <Card className="w-full p-8">
            <CardBody className="space-y-8">
              <div className="flex w-full items-center justify-center gap-4">
                <div className="h-px w-full bg-neutral-800"></div>
                <div className="flex w-auto items-center gap-2">
                  Screens <Icon path={mdiProjectorScreen} size={1} />
                </div>
                <div className="h-px w-full bg-neutral-800"></div>
              </div>
              <div className="flex items-center gap-8">
                {["battle", "postdata", "teamstats", "matchrankings"].map(
                  (screen) => (
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
                        : screen === "postdata"
                          ? "Teams data"
                          : screen === "teamstats"
                            ? "Match ranking"
                            : "Overall ranking"}
                    </Switch>
                  ),
                )}
              </div>
              <div className="flex w-full items-center justify-center gap-4">
                <div className="h-px w-full bg-neutral-800"></div>
                <div className="flex w-auto items-center gap-2">
                  Toggles <Icon path={mdiToggleSwitch} size={1} />
                </div>
                <div className="h-px w-full bg-neutral-800"></div>
              </div>
              <div className="flex items-center gap-8">
                {["sponsors", "teams", "playerimage", "lastfourteams"].map(
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
                            : "Last four teams"}
                    </Switch>
                  ),
                )}
                <Button
                  color="warning"
                  onPress={() => {
                    setActiveToggles([]);
                    toggleChannel.postMessage({ activeToggles: [] });
                  }}
                >
                  Clear <Icon path={mdiToggleSwitch} size={1} />
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
                {[
                  { key: "socialplatforms", label: "Social Platforms" },
                  { key: "teamdamage", label: "Team Damage" },
                  {
                    key: "circleclosing",
                    label: "Circle closing notif (auto)",
                  },
                  { key: "teamelimination", label: "Team Elimination (auto)" },
                  { key: "finalblow", label: "Final blow (auto)" },
                  {
                    key: "uniqueweapons",
                    label: "Unique Weapon Eliminations (auto)",
                  },
                  { key: "firstblood", label: "First Blood (auto)" },
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    onPress={() => {
                      popupChannel.postMessage(key);
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="postgame" title="Post Game Data">
          <Card>
            <CardBody>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="teams" title="Team Ratings">
          <Card>
            <CardBody>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Admin;
