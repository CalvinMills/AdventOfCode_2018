import { readFile } from "fs";

export const getSleighAssemblyOrder = inputFile => {
  readFile(inputFile, "utf8", (err, data) => {
    const instructions = data.split("\r\n");
    let preRequisiteMap = new Map();
    let buildOrder = [];
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
    let preReqMapCopy = new Map(preRequisiteMap);
    //Find the build order
    while (preRequisiteMap.size > 0) {
      Array.from(preRequisiteMap.keys()).every(key => {
        const preReqs = preRequisiteMap.get(key);
        //no pre reqs, add to build order
        if (preReqs.length === 0) {
          buildOrder.push(key);
          //delete the step from the map
          preRequisiteMap.delete(key);
          //delete the key from all other steps
          preReqMapCopy.forEach((value, k) => {
            if (value.includes(key)) {
              const indexOfStep = value.indexOf(key);
              value.splice(indexOfStep, 1);
              preRequisiteMap.set(k, value);
            }
          });
          //start the loop over from first alphabetical key
          return false;
        } else {
          return true;
        }
      });
    }

    console.log(`Build order is: ${buildOrder.join("")}`);
  });
};

const extractPreRequesitesFromText = instructionLine => {
  return [instructionLine.substring(36, 37), instructionLine.substring(5, 6)];
};
