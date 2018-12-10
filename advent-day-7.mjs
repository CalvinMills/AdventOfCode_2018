import { readFile } from "fs";
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export const getSleighAssemblyOrder = inputFile => {
  readFile(inputFile, "utf8", (err, data) => {
    const instructions = data.split("\r\n");
    let preRequisiteMap = new Map();

    //Build a map of all steps and their pre requisites
    instructions.forEach(instruction => {
      let [step, preReq] = extractPreRequesitesFromText(instruction);
      let stepPreReqs = preRequisiteMap.get(step);
      if (stepPreReqs === undefined) {
        preRequisiteMap.set(step, [preReq]);
      } else {
        stepPreReqs.push(preReq);
        preRequisiteMap.set(step, stepPreReqs);
      }

      //if a step is mentioned add it to the map with empty pre reqs
      //in case it doesnt have any
      let preReqsPreReqs = preRequisiteMap.get(preReq);
      if (preReqsPreReqs === undefined) {
        preRequisiteMap.set(preReq, []);
      }
    });

    //Sort the pre requisite map alphabetically
    preRequisiteMap = new Map([...preRequisiteMap.entries()].sort());
    const buildOrder = getBuildOrder(preRequisiteMap).join("");
    const buildOrderWithNBuilders = getBuildOrder(preRequisiteMap, 5).join("");
    console.log(`Build order is: ${buildOrder}`);
    console.log(`Build order with 5 builders is: ${buildOrderWithNBuilders}`);
  });
};

const extractPreRequesitesFromText = instructionLine => {
  return [instructionLine.substring(36, 37), instructionLine.substring(5, 6)];
};

const getBuildOrder = (preReqMap, numberOfBuilders = 1) => {
  let buildOrder = [];
  let stepsInProgress = [];
  let preRequisiteMap = new Map(preReqMap);
  let preReqMapCopy = new Map(preRequisiteMap);
  let clock = 0;
  //initialise the builder map with the number of builders
  let builderMap = new Map();
  for (let i = 1; i <= numberOfBuilders; i++) {
    //no builders are busy in the beginning [timeStarted, step]
    builderMap.set(i, [0, ""]);
  }
  //Find the build order
  while (preRequisiteMap.size > 0 || stepsInProgress.length > 0) {
    //PROCESS BUILDER QUEUE
    const builderMapCopy = new Map(builderMap);
    builderMapCopy.forEach((value, index) => {
      const [timeStartedStep, step] = value;
      //The time required has now elapsed, add step to build queue
      //make builder available again
      const timeForStep = getTimeForStep(step);

      if (step !== "" && clock === timeStartedStep + timeForStep) {
        buildOrder.push(step);

        //delete the key from all other steps
        preReqMapCopy.forEach((value, k) => {
          if (value.includes(step)) {
            const indexOfStep = value.indexOf(step);
            value.splice(indexOfStep, 1);
            preRequisiteMap.set(k, value);
          }
        });
        //make builder avail
        builderMap.set(index, [0, ""]);
        //remove step from steps in progress
        stepsInProgress.splice(stepsInProgress.indexOf(step), 1);
      }
    });

    Array.from(preRequisiteMap.keys()).every(key => {
      const preReqs = preRequisiteMap.get(key);
      //no pre reqs, add to build order
      if (preReqs.length === 0) {
        //find first available builder
        let builder = -1;
        builderMap.forEach((value, index) => {
          //first builder who is not busy
          if (value[1] === "" && builder === -1) {
            builder = index;
          }
        });
        //there arent any builders available break out of for loop
        if (builder === -1) {
          return false;
        }
        //There is a builder available, add the step to his map with time started
        else {
          builderMap.set(builder, [clock, key]);
          //delete the step from the map
          preRequisiteMap.delete(key);
          stepsInProgress.push(key);
          //dont increase clock
          return true;
        }
      } else {
        return true;
      }
    });
    clock++;
  }
  return buildOrder;
};

const getTimeForStep = stepChar => {
  const posInAlphabet = ALPHABET.indexOf(stepChar.toLowerCase()) + 1;
  return 60 + posInAlphabet;
};
