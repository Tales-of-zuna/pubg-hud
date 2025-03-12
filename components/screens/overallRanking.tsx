import { Image } from "@heroui/react";
import { mdiFoodDrumstick } from "@mdi/js";
import Icon from "@mdi/react";
import { motion } from "framer-motion";
const OverallRanking = ({ teamsData, seriesName, matchName }: any) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video
        src="/assets/videos/overallRanking.mp4"
        autoPlay
        loop
        muted
        className="absolute left-0 top-0 z-10 h-full w-full scale-[1.02] object-cover"
      ></video>
      <div className="absolute bottom-[70px] right-[170px] z-20 h-[720px] w-[660px]">
        <div className="flex h-[80px] w-full items-center justify-between py-2">
          <div className="flex h-full w-full items-center text-xl font-bold uppercase">
            <div className="flex h-full w-[66px] items-center justify-center">
              RANK
            </div>
            <div className="flex h-full w-[198px] items-center justify-center">
              TEAM
            </div>
            <div className="flex h-full w-[132px] items-center justify-center">
              PLACE PTS
            </div>
            <div className="flex h-full w-[66px] items-center justify-center">
              ELIMS
            </div>
            <div className="flex h-full w-[132px] items-center justify-center text-orange-300">
              TOTAL PTS
            </div>
            <div className="flex h-full w-[66px] items-center justify-center text-orange-300">
              <Icon path={mdiFoodDrumstick} size={1} />
            </div>
          </div>
        </div>
        {teamsData?.slice(0, 8)?.map((team: any, index: any) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex h-[80px] w-full items-center justify-between py-2"
          >
            <div
              className={`flex h-full w-full items-center justify-center ${index == 0 ? "bg-yellow-600 bg-opacity-30" : index == 1 ? "bg-white bg-opacity-30" : index == 2 ? "bg-orange-900 bg-opacity-30" : "bg-white bg-opacity-10"} text-xl font-light backdrop-blur-xl`}
            >
              <div className="flex h-full w-[66px] items-center justify-center font-black">
                #{index + 1}
              </div>
              <div className="flex h-full w-[198px] items-center justify-center">
                {team.teamName}
              </div>
              <div className="flex h-full w-[132px] items-center justify-center">
                {team.totalPoints - team.killCount}
              </div>
              <div className="flex h-full w-[66px] items-center justify-center">
                {team.killCount}
              </div>
              <div className="flex h-full w-[132px] items-center justify-center font-black">
                {team.totalPoints}
              </div>
              <div className="flex h-full w-[66px] items-center justify-center font-black">
                {team.winCount}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-[100px] left-[170px] z-20 flex h-[100px] w-[800px] items-center text-7xl font-bold">
        #1 {teamsData[0]?.teamName}
      </div>
      <div className="absolute bottom-[200px] left-[170px] z-20 flex h-[500px] w-[800px] items-center text-5xl font-bold">
        <div className="relative h-full w-full">
          <Image
            src="/assets/images/logo.png"
            alt=""
            className="h-[500px] w-[800px] object-contain"
          />
        </div>
      </div>

      <div
        className={`absolute right-[170px] top-[210px] z-20 flex h-[75px] w-[660px] transform items-center justify-around text-4xl font-bold transition-all duration-1000 ease-in-out`}
      >
        <p className="text-neutral-800">{matchName}</p>
        <p className="">{seriesName}</p>
      </div>
    </div>
  );
};

export default OverallRanking;
