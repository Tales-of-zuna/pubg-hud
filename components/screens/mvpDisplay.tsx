import { Divider, Image } from "@heroui/react";

const MVPDisplay = ({ seriesName, matchName, mvpPlayer }: any) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video
        src="/assets/videos/background.mp4"
        autoPlay
        loop
        muted
        className="absolute left-0 top-0 z-10 h-full w-full object-cover"
      ></video>
      <div
        className={`transform transition-all duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} absolute left-0 top-0 z-20 flex h-full w-[800px] flex-col justify-center py-32 pl-32 text-3xl font-bold`}
      >
        <p className="text-5xl">
          {seriesName} {matchName}
        </p>
        <Divider className="w-96" />
        <p className="text-9xl">MVP</p>
        <div className="flex items-center gap-4">
          <Image
            src={`/assets/images/teams/${mvpPlayer?.teamName}.png`}
            className="h-32 w-32 object-contain"
            alt=""
          />
          <div>
            <p className="text-lime-300">{mvpPlayer?.teamName}</p>
            <p className="text-5xl">{mvpPlayer?.playerName}</p>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 z-20 flex h-full w-[800px] flex-col items-center justify-center py-32 pl-32 text-3xl font-bold">
        <div className="flex items-center justify-center gap-8">
          <div
            className={`transform transition-all delay-100 duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} flex flex-col items-center justify-center`}
          >
            <p className="text-9xl">{mvpPlayer?.killNum || 0}</p>
            <p>ELIMS</p>
          </div>
          <div
            className={`transform transition-all delay-300 duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} flex flex-col items-center justify-center`}
          >
            <p className="text-9xl">{mvpPlayer?.rescueTimes || 0}</p>
            <p>RESCUE TIMES</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-8">
          <div
            className={`transform transition-all delay-700 duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} flex flex-col items-center justify-center`}
          >
            <p className="text-9xl">{mvpPlayer?.assist || 0}</p>
            <p>ASSISTS</p>
          </div>
          <div
            className={`transform transition-all delay-1000 duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} flex flex-col items-center justify-center`}
          >
            <p className="text-9xl">{mvpPlayer?.damage || 0}</p>
            <p>DAMAGE</p>
          </div>
        </div>
      </div>
      <div className="absolute right-8 top-8 z-20 flex items-center text-4xl font-bold">
        BE THE #1
      </div>
      <div className="absolute bottom-0 left-0 z-20 flex h-[1000px] w-screen items-center text-5xl font-bold">
        <div
          className={`transform transition-all delay-75 duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} relative flex h-full w-full items-end justify-center`}
        >
          <Image
            src="/assets/images/logo.png"
            alt=""
            className="h-[1000px] w-[500px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default MVPDisplay;
