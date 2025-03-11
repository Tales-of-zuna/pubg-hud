import { Image } from "@heroui/react";

const WinnerTeam = ({
  mvpPlayer,
  seriesName,
  matchName,
  matchWinners,
}: any) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video
        src="/assets/videos/teamStat.mp4"
        autoPlay
        loop
        muted
        className="absolute left-0 top-0 z-10 h-full w-full scale-[1.02] object-cover"
      ></video>
      <div className="absolute bottom-[358px] left-[22px] z-20 flex h-[60px] w-[530px] items-center text-4xl font-bold text-neutral-800">
        <div className="flex w-64 items-center justify-center">
          <p className="">{seriesName}</p>
        </div>
        <div className="flex w-72 items-center justify-center">
          <p className="">{matchName}</p>
        </div>
      </div>
      <div className="absolute bottom-[450px] left-[22px] z-20 flex h-[250px] w-[530px] flex-col items-center justify-center text-4xl font-bold">
        <p className="text-9xl">Winner</p>
        <p className="text-5xl">Team Stats</p>
      </div>
      <div className="absolute bottom-[75px] right-0 z-20 flex h-[130px] w-[1342px] items-center text-4xl font-bold">
        {matchWinners?.map((player: any) => {
          return (
            <div
              key={player.uId}
              className="flex h-full w-[335.5px] items-center justify-center"
            >
              <p className="text-neutral-800">{player.playerName}</p>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-[205px] right-0 z-20 flex h-[900px] w-[1342px] items-end text-4xl font-bold">
        <div className="flex">
          {matchWinners?.map((player: any) => {
            return (
              <div
                key={player.uId}
                className="h-full w-[335.5px] space-y-8 bg-gradient-to-t from-black to-transparent p-4"
              >
                <div className="">
                  <p className="text-5xl">{player.killNum}</p>
                  <p className="text-medium">ELIMS</p>
                </div>
                <div className="">
                  <p className="text-5xl">{player.damage}</p>
                  <p className="text-medium">DAMAGE</p>
                </div>
                <div className="">
                  <p className="text-5xl">{player.knockouts}</p>
                  <p className="text-medium">KNOCKOUTS</p>
                </div>
                <div className="">
                  <p className="text-5xl">{player.rescueTimes}</p>
                  <p className="text-medium">RESCUE</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-[100px] left-[22px] z-20 flex h-[250px] w-[530px] items-center justify-center text-4xl font-bold">
        <Image
          src="/assets/images/logo.png"
          className="h-32 w-32 object-contain"
          alt=""
        />
        <p className="text-7xl">{mvpPlayer?.teamName}</p>
      </div>
    </div>
  );
};

export default WinnerTeam;
