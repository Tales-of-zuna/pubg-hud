const Toggle = ({ activeToggle }: any) => {
  if (activeToggle?.data?.includes("sponsors")) {
    return (
      <div className="absolute left-0 top-0 h-screen w-screen bg-green-950"></div>
    );
  }
  return null;
};

export default Toggle;
