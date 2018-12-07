import { createReadStream, readFile } from "fs";
import readline from "readline";
import stream from "stream";

export const getFrequency = inputFile => {
  let frequency = 0;
  let instream = createReadStream(inputFile),
    outstream = new stream(),
    rl = readline.createInterface(instream, outstream);

  rl.on("line", line => {
    frequency += parseInt(line);
  });

  rl.on("close", () => {
    console.log(`Accumulative frequency: ${frequency}`);
  });
};

export const getFirstDuplicate = inputFile => {
  readFile(inputFile, "utf8", (err, data) => {
    const numberList = data.split("\r\n");
    const parsedNumberList = numberList.map(f => parseInt(f));
    let frequencyMap = new Map();
    let frequency = 0;
    let duplicate = 0;
    while (duplicate === 0) {
      parsedNumberList.forEach(number => {
        frequency += number;
        const frequencyCount = frequencyMap.get(frequency);
        if (frequencyCount && duplicate === 0) {
          duplicate = frequency;
        } else {
          frequencyMap.set(frequency, 1);
        }
      });
    }
    console.log(`First duplicate located: ${duplicate}`);
  });
};
