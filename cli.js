#!/usr/bin/env node

const { prompt } = require("enquirer");
const { constructCharacter, writeToJson } = require("./src");

function withDefaults({ fullname, displayName, outputDir, inputDir }) {
  return {
    fullname,
    displayName: displayName === "" ? fullname : displayName,
    outputDir: outputDir === "" ? "./output" : outputDir,
    inputDir: inputDir === "" ? "./input" : inputDir
  };
}

const DISPLAY_NAME_PROMPT = `Enter the display name for the character.
[Defaults to the full character name] Press Enter to Skip`;

const OUTPUT_DIR_PROMPT = `Enter the path to the directory you would like the file to be written.
[ Defaults to ./output ] Press Enter to Skip`;

const INPUT_DIR_PROMPT = `Enter the path to the input folder
[ Defaults to ./input] Press Enter to Skip`;

async function run() {
  try {
    const response = await prompt([
      {
        type: "input",
        name: "fullname",
        message: "Enter the full character name"
      },
      {
        type: "input",
        name: "displayName",
        message: DISPLAY_NAME_PROMPT
      },
      {
        type: "input",
        name: "outputDir",
        message: OUTPUT_DIR_PROMPT
      },
      {
        type: "input",
        name: "inputDir",
        message: INPUT_DIR_PROMPT
      }
    ]);

    const defaultResponse = withDefaults(response);

    const characterJson = constructCharacter(defaultResponse);

    writeToJson({
      outputDir: defaultResponse.outputDir,
      filename: defaultResponse.fullname.toLowerCase().replace(/ /g, ""),
      character: characterJson
    });
  } catch (e) {
    console.log("Exiting chicken-parser");
    console.error(e);
  }
}

run();
