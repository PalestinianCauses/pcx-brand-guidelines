import assert from "node:assert/strict";
import test from "node:test";

import MOTION, {
  getEntranceTime,
  MOTION_REDUCED,
  TIME_FLOW,
  TIME_INSTANT,
} from "./motion";

test("the motion keeps its times, its curve, its distance and its wait", () => {
  assert.deepEqual(MOTION, {
    times: { small: 100, medium: 200, large: 400 },
    curve: [0.2, 0, 0, 1],
    distance: 8,
    wait: 40,
  });
});

test("the two limits of time keep their values", () => {
  assert.equal(TIME_INSTANT, 100);
  assert.equal(TIME_FLOW, 1000);
});

test("each time is twice the one before it", () => {
  assert.equal(MOTION.times.medium, MOTION.times.small * 2);
  assert.equal(MOTION.times.large, MOTION.times.medium * 2);
});

test("a small move feels instant", () => {
  assert.ok(MOTION.times.small <= TIME_INSTANT);
});

test("an entrance of seven parts settles within a visitor's flow of thought", () => {
  assert.equal(getEntranceTime(7), 640);
  assert.ok(getEntranceTime(7) <= TIME_FLOW);
});

test("one part enters in the time of a large move, and no part takes no time", () => {
  assert.equal(getEntranceTime(1), MOTION.times.large);
  assert.equal(getEntranceTime(0), 0);
});

test("the curve is one that a style sheet takes", () => {
  const [startAcross, , stopAcross] = MOTION.curve;

  assert.equal(MOTION.curve.length, 4);
  assert.ok(startAcross >= 0 && startAcross <= 1);
  assert.ok(stopAcross >= 0 && stopAcross <= 1);
});

test("a device that is set to reduce motion gets none", () => {
  assert.equal(MOTION_REDUCED, "none");
});
