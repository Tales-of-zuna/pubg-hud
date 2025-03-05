const Popup = ({ activePopup }: { activePopup: string }) => {
  return (
    <div
      className="absolute left-0 top-0 z-10 h-screen w-screen"
      style={{
        backgroundImage:
          "url('/assets/images/screens/Screenshot 2025-02-17 181725.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {activePopup.includes("socialplatforms") && (
        <div className="absolute bottom-0 left-0 z-10 flex h-[200px] w-[450px] flex-col items-center justify-end border-2 border-green-950">
          <div className="flex h-1/2 w-full items-center">
            <div className="h-full w-1/2 border-2 border-green-950"></div>
            <div className="h-full w-1/2 border-2 border-green-950"></div>
          </div>
        </div>
      )}
      {activePopup.includes("teams") && (
        <div className="absolute bottom-5 right-0 z-10 flex h-[812px] w-[300px] flex-col items-center justify-start bg-green-950 bg-opacity-30">
          <div className="flex h-[40px] w-full bg-black bg-opacity-30 font-bold">
            <div className="flex h-full w-[45px] items-center justify-center bg-black bg-opacity-30">
              NO
            </div>
            <div className="flex h-full w-[150px] items-center justify-center bg-green-600 bg-opacity-30">
              Teams
            </div>
            <div className="flex h-full w-[55px] items-center justify-center bg-orange-600 bg-opacity-30">
              Alive
            </div>
            <div className="flex h-full w-[50px] items-center justify-center bg-black bg-opacity-30">
              PTS
            </div>
          </div>
          <div className="h-full w-full bg-red-600 bg-opacity-30"></div>
          <div className="flex h-[40px] w-full items-center justify-center gap-2 bg-black bg-opacity-30 text-sm font-bold">
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded-sm bg-green-600"></div>
              ALIVE
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded-sm bg-red-600"></div>
              KNOCKED
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded-sm bg-neutral-600"></div>
              ELIMINATED
            </div>
          </div>
        </div>
      )}
      {activePopup.includes("lastfourteams") && (
        <div className="h-32 w-32 bg-red-500">last four</div>
      )}
      {activePopup.includes("playerimage") && (
        <div className="h-32 w-32 bg-red-500">player image here</div>
      )}
    </div>
  );
};

export default Popup;
