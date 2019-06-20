const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const jetpack = require("fs-jetpack");

/*
 * If your input/output requirements change this is where you will make your
 * changes. The key is the input name, and the value is the output name.
 * */
const INPUT_TO_OUTPUT_MAP = {
  "MOVE NAME": "move_name",
  COMMAND: "notation",
  "HIT LEVEL": "hit_level",
  RANGE: "range",
  GAP: "pushback",
  TRACKING: "tracking",
  CRUSH: "crush",
  JAIL: "jail",
  "NC / NCc": "natural",
  DAMAGE: "damage",
  "START UP": "speed",
  "ON BLOCK": "on_block",
  "ON HIT": "on_hit",
  "ON CH": "on_ch",
  "IN AIR": "in_air",
  "ON WHIFF": "on_whiff",
  ACTIVE: "active_frames",
  NOTES: "notes"
};

/*
 * Transformations can be simple, like converting a Number to a String
 * or complicated, like applying a list of transformations.
 *
 * i.e. if you wanted to perform a number of transformations a value you could
 * use reduce on an array of functions passing in the previous value
 *
 * "MOVE NAME": (value) => [ (str) => str.toLowerCase(), (str) => str.replace(/ /g, "_") ].reduce((acc, nextFn) => nextFn(acc), value)
 *
 * given the input: "Roundhouse to Triple Spin Kick" =>
 * "roundhouse_to_triple_spin_kick"
 */
const INPUT_TO_OUTPUT_TRANSFORMS = {
  "ON BLOCK": String,

  /*
   * Some of the input START UP's didnt start with an "i", and were
   * interpreted as numbers. This will convert them to strings,
   * and then check if they include "i"
   */

  "START UP": str => {
    let speed = String(str);

    return speed.includes("i") ? speed.slice(1) : speed;
  },
  GAP: String,
  RANGE: String,

  /*
   * Currently the default in the json is null, but the input
   * defaults to '-' when no name is present
   *
   */
  "MOVE NAME": str => (str === "-" ? null : str)
};

function mapInputToOutput(input) {
  return Object.entries(input)
    .map(([key, value]) => [
      /* Perform any key naming transformations */
      INPUT_TO_OUTPUT_MAP[key],
      /* Perform any value transformations */
      INPUT_TO_OUTPUT_TRANSFORMS[key] !== undefined
        ? INPUT_TO_OUTPUT_TRANSFORMS[key](value)
        : value
    ])
    .reduce((obj, [key, value]) => {
      // If there is an input key that doesn't map
      // to an output key, simply do not include it in the
      // final output
      if (key === undefined) {
        return obj;
      }

      obj[key] = value;
      return obj;
    }, {});
}

function getWorkbook(filePath, sheetNumber = 0) {
  /*
   * Because the name of the first sheet isn't consistent we will
   * have to first get the sheet name through the XLSX API.
   * */

  const isFile = jetpack.exists(filePath) === "file";

  if (!isFile) {
    console.error("There isn't a file at the path you provided. Try again.");
    process.exit(1);
  }

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[sheetNumber]];

  return XLSX.utils.sheet_to_json(sheet);
}

function getMasterMovelist(
  filePath = path.resolve(__dirname, "moves-list.xlsx")
) {
  /*
   * I provided a hardcoded default to the filepath of the moves-list
   * that is located within the chicken-parser src folder.
   * If you need to update this, simply override at the call site,
   * or change the default.
   * */
  return getWorkbook(filePath);
}

function getMovePreviewUrl(moveName, masterMoveList) {
  const move = masterMoveList.find(move => move["Move Name"] === moveName);

  /*
   * The default should be null, if there isn't a gif
   * */
  return move !== undefined ? move["GIF URL"] : null;
}

function createMove(input, label, id, previewUrl) {
  return {
    properties: [],
    preview_url: previewUrl,
    ...mapInputToOutput(input),
    id: `${label}_${id}`
  };
}

function constructCharacter({ fullname, displayName, label, inputFilePath }) {
  const moves = getWorkbook(inputFilePath);
  const characterMoveList = getMasterMovelist().filter(
    move => move["Character"] === displayName
  );

  return {
    fullname,
    displayName,
    label,
    moveList: moves.map((move, i) =>
      createMove(
        move,
        label,
        i + 1,
        getMovePreviewUrl(move["MOVE NAME"], characterMoveList)
      )
    )
  };
}

function writeToJson({ outputDir = "./", filename, character }) {
  const filePath = `${outputDir}/${filename}.json`;

  const doesDirExist = jetpack.exists(outputDir) === "dir";

  if (!doesDirExist) {
    console.log(`Directory ${outputDir} does not exist,`);
    console.log(`creating ${outputDir} now.`);

    jetpack.dir(outputDir);
  }

  fs.writeFile(filePath, JSON.stringify(character, null, 2), err => {
    if (err) {
      throw Error(err);
    }

    console.log(`Successfully written to: ${filePath}`);
  });
}

module.exports = {
  constructCharacter,
  writeToJson
};
