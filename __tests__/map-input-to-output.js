const mapInputToOutput = require("../src/map-input-to-output");

const argFactory = args => ({
  "MOVE NAME": "Sengeki",
  COMMAND: "1",
  "HIT LEVEL": "high",
  RANGE: "1",
  GAP: "0.25",
  TRACKING: "-",
  CRUSH: "-",
  JAIL: "-",
  "NC / NCc": "-",
  ENVIRONMENTAL: "-",
  DAMAGE: "7 [8]",
  "START UP": "i10",
  "ON BLOCK": "+1",
  "ON HIT": "+8",
  "ON CH": "+8",
  "IN AIR": "FLOAT",
  "ON WHIFF": "-13",
  ACTIVE: "1",
  NOTES: "-",
  ...args
});

test("it should return the expected shape", () => {
  const res = mapInputToOutput(argFactory());

  expect(res).toEqual({
    move_name: "Sengeki",
    notation: "1",
    hit_level: "high",
    range: "1",
    pushback: "0.25",
    tracking: "-",
    crush: "-",
    jail: "-",
    natural: "-",
    environmental: "-",
    damage: "7 [8]",
    speed: "10",
    on_block: "+1",
    on_hit: "+8",
    on_ch: "+8",
    in_air: "FLOAT",
    on_whiff: "-13",
    active_frames: "1",
    notes: "-"
  });
});
