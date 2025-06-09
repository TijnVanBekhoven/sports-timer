import {View} from "react-native";
import {Clock} from "@/components/timer/Clock";
import {TimerControls} from "@/components/timer/TimerControls";
import {useEffect, useRef, useState} from "react";
import {ExerciseItemData} from "@/types/ExerciseItem";
import {TimerState} from "@/enums/TimerState";

type TimerProps = {
  exercise: ExerciseItemData | undefined;
  onNextExercise: () => void;
  timerState: TimerState;
  onStateChanged: (newState: TimerState) => void;
}

const SECOND_IN_MS = 1000;

/**
 * NOTE: When the timer is paused, it does not save the milliseconds since the last update.
 * This results in the second being started from the beginning (0 ms).
 * */
export function Timer({exercise, onNextExercise, timerState, onStateChanged}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | undefined>(undefined);
  const timer = useRef<number>(undefined);

  // Update timeLeft when exercise is updated
  useEffect(() => {
    if (!exercise) return;

    setTimeLeft(exercise.exercise.durationInSeconds);
  }, [exercise]);

  // Check if timer has reached 0
  useEffect(() => {
    if (timeLeft === 0) {
      onNextExercise();
      setTimeLeft(undefined);
    }
  }, [onNextExercise, timeLeft]);

  // Change timer when timerState is updated
  useEffect(() => {
    switch (timerState) {
      case TimerState.STOPPED:
        stopTimer();
        break;
      case TimerState.RUNNING:
        startTimer();
        break;
      case TimerState.PAUSED:
        pauseTimer();
        break;
    }
  }, [timerState]);

  return (
    <View>
      <Clock timeLeft={timeLeft} />
      <TimerControls
        timerState={timerState}
        onStateChanged={onStateChanged}
        onNextPressed={onNextExercise}
      />
    </View>
  );

  function startTimer() {
    timer.current = setInterval(() => {
      setTimeLeft(prev => {
        return prev ? prev - 1 : 0;
      });
    }, SECOND_IN_MS);
  }

  function pauseTimer() {
    clearInterval(timer.current);
  }

  function stopTimer() {
    if (!exercise) return;

    clearInterval(timer.current);
    setTimeLeft(exercise.exercise.durationInSeconds);
  }
}
