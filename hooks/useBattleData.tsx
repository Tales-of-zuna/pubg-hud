import { useEffect, useState } from "react";

const datafetchInterval = 2000;

const useBattleData = () => {
  const [battleData, setBattleData] = useState<any>();

  const fetchBattleData = async () => {
    try {
      const res = await fetch("/api/battle");
      const data = await res.json();
      setBattleData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBattleData();
    const interval = setInterval(fetchBattleData, datafetchInterval);
    return () => clearInterval(interval);
  }, []);

  return battleData;
};

export default useBattleData;
