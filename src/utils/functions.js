const getRemainingTimeInSeconds = (startTime) => {
  const utcDateTime = new Date(startTime + "Z");
  const localStartTime = utcDateTime.toLocaleString();
  const currentTime = new Date();

  const timeDifferenceInMillis = utcDateTime.getTime() - currentTime.getTime();
  const timeDifferenceInSeconds = Math.floor(timeDifferenceInMillis / 1000);
  if (timeDifferenceInMillis > 0) {
    return timeDifferenceInSeconds;
  }
  return 0;
};

module.exports = { getRemainingTimeInSeconds };
