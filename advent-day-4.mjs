import { readFile } from "fs";

export const findGuardChecksum = inputFile => {
  readFile(inputFile, "utf8", (err, data) => {
    const logEntries = data.split("\r\n");
    let logMap = new Map();
    logEntries.forEach(le => {
      let [logDate, logAction] = getVariablesFromLogEntry(le);
      logMap.set(logDate, logAction);
    });
    //sort the log entries by date
    logMap = new Map(
      [...logMap.entries()].sort((a, b) => {
        return a[0] - b[0];
      })
    );

    let [currentGuardId, minFellAsleep, minWokeUp] = [0, 0, 0];
    let guardSleepSchedule = new Map();

    //Get guard sleeping schedule
    logMap.forEach((action, date) => {
      if (action === "falls asleep") {
        minFellAsleep = date.getMinutes();
      } else if (action === "wakes up") {
        minWokeUp = date.getMinutes();
        //update the sleep schedule
        let currentSchedule = guardSleepSchedule.get(currentGuardId);
        for (let i = minFellAsleep; i < minWokeUp; i++) {
          currentSchedule[i]++;
        }
      } else {
        currentGuardId = getGuardIdFromAction(action);
        if (guardSleepSchedule.get(currentGuardId) === undefined) {
          guardSleepSchedule.set(currentGuardId, new Array(60).fill(0));
        }
      }
    });

    //Get sleepiest boi
    let [sleepyGuardId, minSleptMost, totalMinsSlept] = [0, 0, 0];
    //Get sleepiest on particular min
    let [routineSleepyGuardId, minSleptMostRoutine, minsSleptOnMin] = [0, 0, 0];

    guardSleepSchedule.forEach((guardSchedule, guardId) => {
      const minsSlept = guardSchedule.reduce((a, b) => a + b);
      const mostSleptMins = Math.max(...guardSchedule);
      //if hes the sleepiest boi then set the vals
      if (minsSlept > totalMinsSlept) {
        sleepyGuardId = guardId;
        minSleptMost = guardSchedule.indexOf(mostSleptMins);
        totalMinsSlept = minsSlept;
      }

      if (mostSleptMins > minsSleptOnMin) {
        routineSleepyGuardId = guardId;
        minsSleptOnMin = mostSleptMins;
        minSleptMostRoutine = guardSchedule.indexOf(mostSleptMins);
      }
    });
    console.log(`Sleepiest boi: ${sleepyGuardId * minSleptMost}`);
    console.log(`Routine boi: ${routineSleepyGuardId * minSleptMostRoutine}`);
  });
};

const getVariablesFromLogEntry = logEntry => {
  const endOfDate = logEntry.indexOf("]");
  return [
    new Date(logEntry.slice(1, endOfDate)),
    logEntry.slice(endOfDate + 2)
  ];
};

const getGuardIdFromAction = action => {
  const idBeginIndex = action.indexOf("#");
  const endOfId = action.nthIndexOf(" ", 2);

  return parseInt(action.slice(idBeginIndex + 1, endOfId));
};
