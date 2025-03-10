import { Image } from "@heroui/react";

const TeamDamage = ({ selectedTeam }: any) => {
  return (
    <div className="absolute bottom-[280px] left-0 z-10 h-[350px] w-[250px] bg-green-600 bg-opacity-30">
      <div className="relative h-full w-full">
        <video
          src="/assets/videos/damageStat.mp4"
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
        ></video>
      </div>
      <div className="absolute top-0 h-full w-full">
        <div className="flex h-[30px] w-full items-center justify-center text-xl font-semibold uppercase">
          <p className="">Damage Dealt</p>
        </div>
        <div className="flex h-[100px] w-full items-center justify-center gap-2">
          <Image
            src="/assets/images/logo.png"
            alt=""
            className="h-[80px] w-[80px] object-cover"
          />
          <p className="text-xl font-bold text-neutral-800">
            {selectedTeam?.teamName}
          </p>
        </div>
        <div className="h-[220px] w-full">
          {selectedTeam?.players?.map((player: any) => {
            const damagePercentage = selectedTeam?.teamDamage
              ? ((player?.damage !== 0 ? player?.damage : 1) /
                  selectedTeam?.teamDamage) *
                100
              : 0;
            return (
              <div
                key={player?.uId}
                className="h-[55px] w-full border-b px-3 py-1"
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-2">
                    <p>{selectedTeam?.teamName}</p>
                    <p>{player.playerName}</p>
                  </div>
                  <p>{player.damage}</p>
                </div>
                <div className="flex h-[20px] w-full gap-2 bg-neutral-600 pr-2">
                  <div
                    className="h-full bg-orange-500"
                    style={{
                      width: `${damagePercentage}%`,
                    }}
                  ></div>
                  <p className="text-sm">{`${damagePercentage.toFixed(2)}%`}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamDamage;
