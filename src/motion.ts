// The motion of the PCX brand: quick and plain. Things move a short way and
// settle at once. Every time is in milliseconds.

// A reaction within this time feels instant.
export const TIME_INSTANT = 100;

// A wait longer than this breaks a visitor's flow of thought.
export const TIME_FLOW = 1000;

// What a device gets that is set to reduce motion.
export const MOTION_REDUCED = "none";

const MOTION = {
  // How long a move takes. A small move is the pointer over a button, or a
  // press. A medium move is a tab that switches, or a panel that opens. A
  // large move is the entrance of a part.
  times: { small: 100, medium: 200, large: 400 },

  // How a move starts and stops: a fast start and a soft stop. These are the
  // four numbers of a cubic Bezier curve, as a style sheet takes them. The
  // last one, 1, is where the move comes to rest.
  curve: [0.2, 0, 0, 1],

  // How far a part rises as it enters, in pixels.
  distance: 8,

  // The wait between two parts that enter one after the other.
  wait: 40,
} as const;

// The time until the last of several parts has entered and settled.
export const getEntranceTime = function getEntranceTime(parts: number): number {
  if (parts < 1) return 0;

  const time = (parts - 1) * MOTION.wait + MOTION.times.large;
  return time;
};

export default MOTION;
