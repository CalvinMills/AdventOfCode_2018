import { readFile } from "fs";

export const findOverlappingClaims = inputFile => {
  readFile(inputFile, "utf8", (err, data) => {
    //init 1000x1000 fabric grid
    let fabricGrid = new Array(1000);
    for (let i = 0; i < 1000; i++) {
      fabricGrid[i] = new Array(1000);
    }

    const claims = data.split("\r\n");
    let overlapCount = 0;

    claims.forEach(claim => {
      let [colStart, rowStart, width, height] = getVariablesFromClaim(claim);
      for (let row = rowStart; row < rowStart + height; row++) {
        for (let col = colStart; col < colStart + width; col++) {
          const currentSqInchCount = fabricGrid[row][col];
          if (currentSqInchCount === undefined) {
            fabricGrid[row][col] = 0;
          } else if (currentSqInchCount === 1) {
            //this will be the first overlap on this inch, count it
            overlapCount++;
          }
          fabricGrid[row][col]++;
        }
      }
    });
    console.log(`Fabric claim overlap count: ${overlapCount}`);
  });
};

export const findUniqueClaim = inputFile => {
  readFile(inputFile, "utf8", (err, data) => {
    //init 1000x1000 fabric grid
    let fabricGrid = new Array(1000);
    for (let i = 0; i < 1000; i++) {
      fabricGrid[i] = new Array(1000);
    }

    const claims = data.split("\r\n");
    let uniqueClaim = "";

    //find all areas and overlaps
    claims.forEach(claim => {
      let [colStart, rowStart, width, height, claimId] = getVariablesFromClaim(
        claim
      );
      for (let row = rowStart; row < rowStart + height; row++) {
        for (let col = colStart; col < colStart + width; col++) {
          const currentSqInchId = fabricGrid[row][col];
          if (currentSqInchId === undefined) {
            fabricGrid[row][col] = claimId;
          } else {
            //we have an overlap
            fabricGrid[row][col] = "X";
          }
        }
      }
    });

    //find the unique claim
    claims.forEach(claim => {
      let [colStart, rowStart, width, height, claimId] = getVariablesFromClaim(
        claim
      );
      let isClaimIntact = true;
      for (let row = rowStart; row < rowStart + height; row++) {
        for (let col = colStart; col < colStart + width; col++) {
          const currentSqInchId = fabricGrid[row][col];
          //go through every square, if one isnt its' id then it has been overlapped
          if (currentSqInchId !== claimId) {
            isClaimIntact = false;
          }
        }
      }
      if (isClaimIntact) {
        uniqueClaim = claimId;
      }
    });
    console.log(`Unique fabric claim ID: ${uniqueClaim}`);
  });
};

const getVariablesFromClaim = claimString => {
  const idEndIndex = claimString.indexOf("@") - 1;
  const colStartIndex = claimString.indexOf("@") + 2;
  const commaIndex = claimString.indexOf(",");
  const rowEndIndex = claimString.indexOf(":");
  const byIndex = claimString.indexOf("x");

  return [
    parseInt(claimString.slice(colStartIndex, commaIndex)),
    parseInt(claimString.slice(commaIndex + 1, rowEndIndex)),
    parseInt(claimString.slice(rowEndIndex + 2, byIndex)),
    parseInt(claimString.slice(byIndex + 1)),
    claimString.slice(1, idEndIndex)
  ];
};
