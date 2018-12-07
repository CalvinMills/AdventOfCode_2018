import { getFrequency, getFirstDuplicate } from "./advent-day-1.mjs";
import { getInventoryChecksum, findPrototypeBoxes } from "./advent-day-2.mjs";
import { findOverlappingClaims, findUniqueClaim } from "./advent-day-3.mjs";
import { findGuardChecksum } from "./advent-day-4.mjs";
import {
  getPolymerReactionLength,
  getSmallestPossibleReactionLength
} from "./advent-day-5.mjs";
import { getMaxFiniteArea } from "./advent-day-6.mjs";
import { getSleighAssemblyOrder } from "./advent-day-7.mjs";
import "./utilities.mjs";

//day 1
getFrequency("./input-files/advent.txt");
getFirstDuplicate("./input-files/advent.txt");

//day 2
getInventoryChecksum("./input-files/advent_day2.txt");
findPrototypeBoxes("./input-files/advent_day2.txt");

//day 3
findOverlappingClaims("./input-files/advent_day3.txt");
findUniqueClaim("./input-files/advent_day3.txt");

//day 4
findGuardChecksum("./input-files/advent_day4.txt");

//day 5
getPolymerReactionLength("./input-files/advent_day5.txt");
getSmallestPossibleReactionLength("./input-files/advent_day5.txt");

//day 6
getMaxFiniteArea("./input-files/advent_day6.txt");

//day 7
getSleighAssemblyOrder("./input-files/advent_day7.txt");
