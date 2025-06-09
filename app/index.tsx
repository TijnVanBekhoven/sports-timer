import {SafeAreaView, StyleSheet} from "react-native";
import {ExerciseItemData} from "@/types/ExerciseItem";
import {ExerciseList} from "@/components/exercise/ExerciseList";
import React, {useEffect, useRef, useState} from "react";
import {Timer} from "@/components/timer/Timer";
import {TimerState} from "@/enums/TimerState";
import {VibrationService} from "@/services/VibrationService";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {IExerciseService} from "@/services/IExerciseService";
import {SqlExerciseService} from "@/services/SqlExerciseService";

export default function Index() {
  const [data, setData] = useState<ExerciseItemData[]>([]);
  const [nextExercise, setNextExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItemData | undefined>();
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);
  const exerciseService = useRef<IExerciseService>(new SqlExerciseService());

  useEffect(() => {
    exerciseService.current.getAllExercises().then((res) => {
      setData(res);
    });
  }, [exerciseService]);

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

  const onSelectExercise = (selected: ExerciseItemData | undefined) => {
    setNextExercise(false);
    setSelectedExercise(selected);

    if (timerState === TimerState.RUNNING) VibrationService.nextExercise();
  }

  const onNewExercise = (newExercise: ExerciseItemData) => {
    exerciseService.current.addExercise(newExercise).then(() => {
      setData(prevData => [
        ...prevData,
        newExercise
      ]);
    });
  };

  const onRemoveExercise = (oldExercise: ExerciseItemData) => {
    exerciseService.current.deleteExercise(oldExercise.id).then(() => {
      setData(prevData => prevData.filter(item => item.id !== oldExercise.id));
    });
  }

  return (
    <GestureHandlerRootView>
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
          onRemoveExercise={onRemoveExercise}
          onTrainingEnded={onTrainingEnded}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
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
