import { readFile } from "fs";

export const getInventoryChecksum = inputFile => {
  readFile(inputFile, "utf8", (err, data) => {
    let twiceCount = 0,
      thriceCount = 0;

    const inventoryList = data.split("\r\n");
    inventoryList.forEach(inventoryItem => {
      let foundTwice = false,
        foundThrice = false;

      const uniqueChars = inventoryItem.split("").filter((item, i, ar) => {
        return ar.indexOf(item) === i;
      });

      uniqueChars.forEach(char => {
        const charCount = inventoryItem.split(char).length - 1;
        if (charCount === 2) {
          foundTwice = true;
        }
        if (charCount === 3) {
          foundThrice = true;
        }
      });
      if (foundTwice) {
        twiceCount++;
      }
      if (foundThrice) {
        thriceCount++;
      }
    });
    console.log(`Inventory checksum: ${twiceCount * thriceCount}`);
  });
};

export const findPrototypeBoxes = inputFile => {
  readFile(inputFile, "utf8", (err, data) => {
    let resultString = "";
    const inventoryList = data.split("\r\n");

    inventoryList.forEach(inventoryItem => {
      const restOfInventory = inventoryList.filter(i => i !== inventoryItem);
      const itemCharList = inventoryItem.split("");

      //compare string against every other element in list
      restOfInventory.forEach(itemToCompare => {
        const itemToCompareCharList = itemToCompare.split("");
        let compareListCopy = itemToCompare.split("");

        //compare each character of item to compare
        itemToCompareCharList.forEach((char, index) => {
          if (char !== itemCharList[index]) {
            //remove the unmatched character
            compareListCopy.splice(index, 1);
          }
        });
        //if we only popped one char off the list then we have what we are looking for
        if (
          compareListCopy.length === itemToCompareCharList.length - 1 &&
          resultString === ""
        ) {
          resultString = compareListCopy.join("");
        }
      });
    });
    console.log(`Prototype box id: ${resultString}`);
  });
};
