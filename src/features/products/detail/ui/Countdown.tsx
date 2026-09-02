import { useEffect, useState } from "react";

import { formatRemainingTime } from "@/shared/lib/formatTime";

// 시간초가 0이되면 경매 종료로 상태변경하고, 한 번 더 api 호출 필요함.
// 추후에는 웹소켓에서 경매 종료 이벤트를 받아서 상태변경하도록 구현 필요

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <>{formatRemainingTime(targetDate, now)}</>;
};

export default Countdown;
