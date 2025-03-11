import { motion } from "framer-motion";

const Plane = ({ mapName, seriesName, matchName }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start hidden and below its position
      animate={{ opacity: 1, y: 0 }} // Animate to full visibility
      exit={{ opacity: 0, x: 50 }} // Exit animation
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
      className="absolute top-[150px] flex h-32 w-full items-center justify-center"
    >
      <div className="relative h-48 w-96 bg-black">
        <video
          src="/assets/videos/mininotif.mp4"
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
        ></video>
        <div className="absolute top-0 z-10 flex h-36 w-full items-center justify-center text-5xl font-bold uppercase text-neutral-800">
          {mapName}
        </div>
        <div className="absolute bottom-0 z-10 flex h-14 w-full items-center justify-center text-xl font-bold uppercase">
          {seriesName} MATCH {matchName}
        </div>
      </div>
    </motion.div>
  );
};

export default Plane;
