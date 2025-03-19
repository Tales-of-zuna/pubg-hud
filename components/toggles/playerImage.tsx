import { Image } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
const PlayerImage = ({ observedPlayer }: any) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Start hidden and below its position
        animate={{ opacity: 1, y: 0 }} // Animate to full visibility
        exit={{ opacity: 0, y: 50 }} // Exit animation
        transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
        className="absolute bottom-0 left-[450px] z-10 flex h-[200px] w-[286px] flex-col items-center justify-end"
      >
        <div className="relative h-full w-full">
          <Image
            src={`/assets/images/${observedPlayer.uId}.png`}
            alt=""
            className="h-[200px] w-[290px] object-contain"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default PlayerImage;
