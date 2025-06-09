import {SafeAreaView, StyleSheet} from "react-native";
import {ExerciseItemData} from "@/types/ExerciseItem";
import {ExerciseList} from "@/components/exercise/ExerciseList";
import React, {useEffect, useState} from "react";
import {Timer} from "@/components/timer/Timer";
import {TimerState} from "@/enums/TimerState";
import {VibrationService} from "@/services/VibrationService";

const DATA: ExerciseItemData[] = [
  {
    id: '0',
    exercise: {
      type: "running",
      durationInSeconds: 120,
    }
  },
  {
    id: '1',
    exercise: {
      type: "walking",
      durationInSeconds: 45,
    }
  },
  {
    id: '2',
    exercise: {
      type: "walking",
      durationInSeconds: 10,
    }
  },
  {
    id: '3',
    exercise: {
      type: "walking",
      durationInSeconds: 10,
    }
  },
  {
    id: '4',
    exercise: {
      type: "walking",
      durationInSeconds: 10,
    }
  },
  {
    id: '5',
    exercise: {
      type: "walking",
      durationInSeconds: 10,
    }
  },
  {
    id: '6',
    exercise: {
      type: "walking",
      durationInSeconds: 10,
    }
  },
]

export default function Index() {
  const [data, setData] = useState<ExerciseItemData[]>(DATA);
  const [nextExercise, setNextExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItemData>();
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);

  useEffect(() => {
    if (timerState === TimerState.RUNNING) VibrationService.startTraining();
  }, [timerState])

  const onNextExercise = () => {
    setNextExercise(true);
  }

  const onTrainingEnded = () => {
    setTimerState(TimerState.STOPPED);
    VibrationService.finishTraining();
  }

  const onSelectExercise = (selected: ExerciseItemData) => {
    setNextExercise(false);
    setSelectedExercise(selected);

    if (timerState === TimerState.RUNNING) VibrationService.nextExercise();
  }

  const onNewExercise = (newExercise: ExerciseItemData) => {
    setData(prevData => [
      ...prevData,
      newExercise
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Timer
        exercise={selectedExercise}
        onNextExercise={onNextExercise}
        timerState={timerState}
        onStateChanged={setTimerState}
      />
      <ExerciseList
        data={data}
        nextExercise={nextExercise}
        onSelectExercise={onSelectExercise}
        onNewExercise={onNewExercise}
        onTrainingEnded={onTrainingEnded}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 45,
  },
});
