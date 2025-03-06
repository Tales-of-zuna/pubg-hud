"use client";
const AutoNotifs = ({ totalPlayerList }: any) => {
  const popups = totalPlayerList || [];
  return (
    <div className="absolute left-0 top-0 z-10 h-screen w-screen">
      {popups.includes("socialplatforms") && (
        <div className="absolute bottom-[20px] left-[450px] z-10 flex h-[180px] w-[1080px] flex-col items-center justify-end bg-cyan-600 bg-opacity-30"></div>
      )}
      {popups.includes("lastfourteams") && (
        <div className="h-32 w-32 bg-red-500">last four</div>
      )}
      {popups.includes("playerimage") && (
        <div className="h-32 w-32 bg-red-500">player image here</div>
      )}
    </div>
  );
};

export default AutoNotifs;
