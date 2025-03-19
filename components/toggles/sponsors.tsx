import { AnimatePresence, motion } from "framer-motion";

const Sponsors = ({ seriesName, matchName }: any) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Start hidden and below its position
        animate={{ opacity: 1, y: 0 }} // Animate to full visibility
        exit={{ opacity: 0, y: 50 }} // Exit animation
        transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
        className="absolute bottom-0 left-0 z-10 flex h-[200px] w-[450px] flex-col items-start justify-end gap-4"
      >
        <div className="px-4">
          {/* <Image src="/assets/images/logo.png" alt="" className="w-32" /> */}
        </div>
        <div className="flex h-1/2 w-full flex-col items-start justify-end">
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-2">
            <video
              src="/assets/videos/sponsors.mp4"
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
            />
          </div>

          <div className="absolute bottom-[30px] z-10 flex h-[70px] w-[225px] items-center justify-center text-4xl font-bold text-neutral-800">
            {seriesName}
          </div>
          <div className="absolute z-10 flex h-[30px] w-[225px] items-center justify-center text-xl font-bold text-neutral-800">
            {matchName}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Sponsors;
