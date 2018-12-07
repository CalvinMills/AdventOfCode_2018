import { readFile } from "fs";

export const getPolymerReactionLength = inputFile => {
  readFile(inputFile, "utf8", (err, data) => {
    let polymer = activatePolymerReaction(data.split(""));
    console.log(`Resultant polymer has length of: ${polymer.length}`);
  });
};

export const getSmallestPossibleReactionLength = inputFile => {
  let minLength;
  readFile(inputFile, "utf8", (err, data) => {
    const charList = data.split("");
    for (let i = 0; i < 26; i++) {
      const filteredPolymer = charList.filter(
        c => c !== charAt(i) && c !== charAt(i).toUpperCase()
      );
      const reactedPolymer = activatePolymerReaction(filteredPolymer);
      if (minLength === undefined || reactedPolymer.length < minLength) {
        minLength = reactedPolymer.length;
      }
    }
    console.log(`Minimum length polymer has length of: ${minLength}`);
  });
};

const activatePolymerReaction = (charList, index = 0) => {
  while (index < charList.length - 1) {
    //if the chars are equal and of differing cases
    if (
      ((isUpper(charList[index]) && isLower(charList[index + 1])) ||
        (isLower(charList[index]) && isUpper(charList[index + 1]))) &&
      charList[index].toUpperCase() === charList[index + 1].toUpperCase()
    ) {
      //the 2 chars react, remove them and go to the previous index/ 0
      charList.splice(index, 2);
      index = index === 0 ? 0 : index - 1;
    } else {
      //the 2 adjacent at this index dont react, move to next index
      index++;
    }
  }
  return charList;
};

const isUpper = str => RegExp(/[A-Z]/).test(str);
const isLower = str => RegExp(/[a-z]/).test(str);
const charAt = i => String.fromCharCode("a".charCodeAt(0) + i);
