import {Vibration} from "react-native";
import {VibrationPatterns} from "@/constants/VibrationPatterns";

export const VibrationService = {
  startTraining: () => startTraining(),
  nextExercise: () => nextExercise(),
  finishTraining: () => finishTraining(),
};

function startTraining() {
  Vibration.vibrate(VibrationPatterns.exercise.start);
}

function nextExercise() {
  Vibration.vibrate(VibrationPatterns.exercise.next);
}

function finishTraining() {
  Vibration.vibrate(VibrationPatterns.exercise.finish);
}
