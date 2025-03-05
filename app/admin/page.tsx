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
  const [activePopups, setActivePopups] = useState<string[]>([]);

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
                {[
                  { key: "socialplatforms", label: "Social Platforms" },
                  { key: "teamdamage", label: "Team Damage" },
                  { key: "circleclosing", label: "Circle Closing (auto)" },
                  { key: "teamelimination", label: "Team Elimination (auto)" },
                  { key: "finalblow", label: "Final Blow (auto)" },
                  { key: "uniqueweapons", label: "Unique Weapons (auto)" },
                  { key: "firstblood", label: "First Blood (auto)" },
                ].map(({ key, label }) => (
                  <Switch
                    key={key}
                    color="warning"
                    isSelected={activePopups.includes(key)}
                    onValueChange={() => handlePopupChange(key)}
                  >
                    {label}
                  </Switch>
                ))}
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
            </CardBody>
          </Card>
        </Tab>
        <Tab className="w-full" key="settings" title="Settings">
          <Card className="w-full p-8">
            <CardBody className="space-y-8">
              <div className="flex w-full items-center justify-center gap-4">
                <div className="h-px w-full bg-neutral-800"></div>
                <div className="flex w-auto items-center gap-2">Settings</div>
                <div className="h-px w-full bg-neutral-800"></div>
              </div>
              <div className="flex items-center gap-8">
                <Switch color="warning">Enable/Disable</Switch>
                <Switch color="warning">Enable/Disable</Switch>
              </div>
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
