"use client";
import { Button } from "@heroui/react";

const popupChannel = new BroadcastChannel("popup");
const Admin = () => {
  return (
    <div className="h-full w-full space-x-4 space-y-4 rounded-xl bg-neutral-800 p-12 shadow-xl">
      <Button onPress={() => popupChannel.postMessage("red")}>Red</Button>
      <Button onPress={() => popupChannel.postMessage("blue")}>Blue</Button>
    </div>
  );
};

export default Admin;
