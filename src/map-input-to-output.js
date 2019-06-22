////////////////////////////////////////////////////////////////////////////
// KEY_MAP
// input key => output
//
// If your input/output requirements change this is where you will make your
// changes. The key is the input name, and the value is the output name.
const KEY_MAP = {
  ENVIRONMENTAL: "environmental",
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

////////////////////////////////////////////////////////////////////////////////
// CONVERSIONS
//
// A map used for looking up value transforms that need to take place for valid
// output.
//
// A transformation can be simple, like converting a Number to a String,
// or complicated, like appllying a list of transformations.
//
// i.e. If you wanted to perform a number of transformations on a value you
// could use reduce on an array of functions passing in the pervious value.
//
// "move_name": (value) => [
//    (str) => str.toLowerCase(),
//    (str) => str.replace(/ /g, "_")
//  ].reduce((acc, nextFn) => nextFn(acc), value);
//
//  given the input: "Rounhouse to Triple Spin Kick" =>
//  "roundhouse_to_triple_spin_kick"
//
const CONVERSIONS = {
  environmental: String,
  // Currently the default in the json is null, but the input
  // defaults to '-' when no name is present
  move_name: str => (str === "-" ? null : str),
  notation: String,
  on_block: String,
  hit_level: String,
  range: String,
  tracking: String,
  crush: String,
  jail: String,
  natural: String,
  damage: String,
  // Some of the input speed's didnt start with an "i", and were
  // interpreted as numbers. This will convert them to strings,
  // and then check if they include "i"
  speed: str => {
    const speed = String(str);
    return speed.includes("i") ? speed.slice(1) : speed;
  },
  pushback: String,
  on_block: String,
  on_hit: String,
  on_ch: String,
  in_air: String,
  on_whiff: String,
  active_frames: String,
  notes: String
};

//////////////////////////////////////////////////////////////////////////////
//
// mapInputToOutput: MoveInput => MoveOutput
function mapInputToOutput(input) {
  return Object.entries(input).reduce((output, [key, value]) => {
    const k = KEY_MAP[key];
    const shouldTransform = !!CONVERSIONS[k];

    if (k !== undefined) {
      output[k] = shouldTransform ? CONVERSIONS[k](value) : value;
    }

    return output;
  }, {});
}

module.exports = mapInputToOutput;
