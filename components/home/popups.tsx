const Popup = ({ activePopup }: { activePopup: string }) => {
  if (activePopup === "red") {
    return (
      <div className="absolute left-0 top-0 h-screen w-screen bg-red-500"></div>
    );
  } else if (activePopup === "blue") {
    return (
      <div className="absolute left-0 top-0 h-screen w-screen bg-blue-500"></div>
    );
  }
  return null;
};

export default Popup;
