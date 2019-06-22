const XLSX = require("xlsx");
const jetpack = require("fs-jetpack");

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

module.exports = getWorkbook;
