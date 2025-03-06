const Popup = ({ activePopups, totalPlayerList }: any) => {
  const popups = activePopups?.data || [];

  return (
    <div
      className="absolute left-0 top-0 z-10 h-screen w-screen"
      style={{
        backgroundImage:
          "url('/assets/images/screens/Screenshot 2025-02-17 181725.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {popups.includes("socialplatforms") && (
        <div className="absolute bottom-[20px] left-[450px] z-10 flex h-[180px] w-[1080px] flex-col items-center justify-end bg-cyan-600 bg-opacity-30"></div>
      )}
    </div>
  );
};

export default Popup;
