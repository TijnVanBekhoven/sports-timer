const ZERO_SECONDS_IN_MS = 0;
const ONE_SECOND_IN_MS = 1000;
const HALF_SECOND_IN_MS = 500;
const FOURTH_SECOND_IN_MS = 250;

export const VibrationPatterns = {
  exercise: {
    start: [
      ZERO_SECONDS_IN_MS,
      2 * ONE_SECOND_IN_MS,
    ],
    next: [
      ZERO_SECONDS_IN_MS,
      HALF_SECOND_IN_MS,
      FOURTH_SECOND_IN_MS,
      HALF_SECOND_IN_MS,
      FOURTH_SECOND_IN_MS,
      HALF_SECOND_IN_MS
    ],
    finish: [
      ZERO_SECONDS_IN_MS,
      2 * ONE_SECOND_IN_MS,
      HALF_SECOND_IN_MS,
      2 * ONE_SECOND_IN_MS
    ]
  }
}
