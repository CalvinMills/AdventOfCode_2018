import { readFile } from "fs";

export const getMaxFiniteArea = inputFile => {
  //create vars for the bounding box
  let minX, maxX, minY, maxY;
  readFile(inputFile, "utf8", (err, data) => {
    const coOrdinates = data.split("\r\n");
    let parsedCoOrds = [];
    //parse co ords and find bounding box
    coOrdinates.forEach(coOrd => {
      const coOrdStringArray = coOrd.split(",");
      const parsedCoOrd = coOrdStringArray.map(Number);
      if (minX === undefined || parsedCoOrd[0] < minX) {
        minX = parsedCoOrd[0];
      }
      if (maxX === undefined || parsedCoOrd[0] > maxX) {
        maxX = parsedCoOrd[0];
      }
      if (minY === undefined || parsedCoOrd[1] < minY) {
        minY = parsedCoOrd[1];
      }
      if (maxY === undefined || parsedCoOrd[1] > maxY) {
        maxY = parsedCoOrd[1];
      }
      parsedCoOrds.push(parsedCoOrd);
    });

    let areaMap = new Map();
    let infiniteCoOrdIndeces = new Set();
    let safeRegionCount = 0;

    for (let x = 0; x <= maxX; x++) {
      for (let y = 0; y <= maxY; y++) {
        //for each co ord in our bounding box, find the closest point in our co ord list
        let minDistance, coOrdIndex;
        let isTied = false;
        let distancesToAllPoints = [];
        parsedCoOrds.forEach((coOrd, index) => {
          const distance = manhattanDistance(coOrd, [x, y]);
          distancesToAllPoints.push(distance);

          if (distance === minDistance) {
            isTied = true;
          } else if (minDistance === undefined || distance < minDistance) {
            minDistance = distance;
            coOrdIndex = index;
            isTied = false;
          }
        });

        //if we have a unique closest point increase its area by 1
        if (!isTied) {
          const currentArea = areaMap.get(coOrdIndex);
          if (currentArea === undefined) {
            areaMap.set(coOrdIndex, 1);
          } else {
            areaMap.set(coOrdIndex, currentArea + 1);
          }
          //add to a set all the co ords with infintite area
          if (x === 0 || y === 0 || x === maxX || y === maxY) {
            if (!infiniteCoOrdIndeces.has(coOrdIndex)) {
              infiniteCoOrdIndeces.add(coOrdIndex);
            }
          }
        }

        const regionSize = distancesToAllPoints.reduce((a, b) => a + b);
        if (regionSize < 10000) {
          safeRegionCount++;
        }
      }
    }

    infiniteCoOrdIndeces.forEach(index => {
      areaMap.delete(index);
    });

    const maxArea = Math.max(...Array.from(areaMap.values()));
    console.log(`Max area of co ordinates is: ${maxArea}`);
    console.log(`Size of safe region is: ${safeRegionCount}`);
  });
};

const manhattanDistance = (coOrd1, coOrd2) => {
  return Math.abs(coOrd2[0] - coOrd1[0]) + Math.abs(coOrd2[1] - coOrd1[1]);
};
