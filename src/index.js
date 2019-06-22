const path = require("path");
const fs = require("fs");
const jetpack = require("fs-jetpack");

const mapInputToOutput = require("./map-input-to-output");
const getWorkbook = require("./get-workbook");

function getMovePreviewUrl(moveName, masterMoveList) {
  const move = masterMoveList.find(move => move["Move Name"] === moveName);

  //////////////////////////////////////////////////////////////////
  // This is where you will add any URL transforms/checking you need

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

function transformFullnameToFilename(dir, name) {
  return `${dir}/${name.toLowerCase().replace(/ /g, "")} moves.xlsx`;
}

function constructCharacter({ fullname, displayName, label, inputDir }) {
  const moves = getWorkbook(
    `${transformFullnameToFilename(inputDir, fullname)}`
  );
  const characterMoveList = getWorkbook(
    path.resolve(__dirname, "moves-list.xlsx")
  ).filter(move => move["Character"] === displayName);

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
