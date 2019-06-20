#!/usr/bin/env node

const { prompt } = require("enquirer");
const { constructCharacter, writeToJson } = require("./src");

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
        message: "Enter the display name for the character"
      },
      {
        type: "input",
        name: "label",
        message: "Enter the name of the file you would like to create"
      },
      {
        type: "input",
        name: "outputDir",
        message:
          "Enter the path to the directory you would like the file to be written"
      },
      {
        type: "input",
        name: "inputFilePath",
        message: "Enter the input filepath"
      }
    ]);

    const characterJson = constructCharacter(response);

    writeToJson({
      outputDir: response.outputDir,
      filename: response.label,
      character: characterJson
    });
  } catch (e) {
    console.log("Exiting chicken-parser");
    console.error(e);
  }
}

run();
