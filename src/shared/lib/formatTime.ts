export const formatRemainingTime = (endAt: string | Date, now = Date.now()) => {
  const endTime = new Date(endAt).getTime();

  const remainingMilliseconds = Math.max(endTime - now, 0);

  const totalSeconds = Math.floor(remainingMilliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
};

export const formatRelativeTime = (bidAt: string) => {
  const targetTime = new Date(bidAt).getTime();
  const now = Date.now();
  const diffMs = now - targetTime;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (Number.isNaN(targetTime)) {
    return "방금";
  }

  if (diffMinutes <= 0) {
    return "방금";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}시간전`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일전`;
};
