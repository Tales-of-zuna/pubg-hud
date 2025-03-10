import { Image } from "@heroui/react";

const PlayerImage = ({ observedPlayer }: any) => {
  return (
    <div className="absolute bottom-0 left-[450px] z-10 flex h-[200px] w-[286px] flex-col items-center justify-end">
      <div className="relative h-full w-full">
        <Image
          src="/assets/images/logo.png"
          alt=""
          className="h-[200px] w-[290px] object-contain"
        />
      </div>
    </div>
  );
};

export default PlayerImage;
