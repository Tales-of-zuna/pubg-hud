import { Divider, Image } from "@heroui/react";

const MVPDisplay = ({ seriesName, matchName, mvpPlayer }: any) => {
  return (
    <div className="relative h-screen w-screen">
      <video
        src="/assets/videos/background.mp4"
        autoPlay
        loop
        muted
        className="absolute left-0 top-0 z-10 h-full w-full object-cover"
      ></video>
      <div className="absolute left-0 top-0 z-20 flex h-full w-[800px] flex-col justify-center py-32 pl-32 text-3xl font-bold">
        <p>
          {seriesName} {matchName}
        </p>
        <Divider className="w-96" />
        <p className="text-9xl">MVP</p>
        <div className="flex items-center gap-4">
          <Image
            src="/assets/images/logo.png"
            className="h-32 w-32 object-contain"
            alt=""
          />
          <div>
            <p className="text-orange-500">{mvpPlayer?.teamName}</p>
            <p className="text-5xl">{mvpPlayer?.playerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPDisplay;
