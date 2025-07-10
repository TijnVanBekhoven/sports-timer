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
import {activateKeepAwakeAsync, deactivateKeepAwake} from "expo-keep-awake";
import {TextToSpeechService} from "@/services/TextToSpeechService";

export default function Index() {
  const [data, setData] = useState<ExerciseItemData[]>([]);
  const [nextExercise, setNextExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItemData | undefined>();
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);
  const [keepAwake, setKeepAwake] = useState<boolean>(false);
  const exerciseService = useRef<IExerciseService>(new SqlExerciseService());

  useEffect(() => {
    exerciseService.current.getAllExercises().then((res) => {
      setData(res);
    });
  }, [exerciseService]);

  useEffect(() => {
    if (timerState === TimerState.RUNNING) VibrationService.startTraining();

    if (timerState === TimerState.RUNNING) setKeepAwake(true);
    else setKeepAwake(false);
  }, [timerState])

  useEffect(() => {
    if (timerState !== TimerState.RUNNING) return;
    if (!selectedExercise) return;

    TextToSpeechService.speak(
      `${selectedExercise!.exercise.type}. ${formatTime(selectedExercise!.exercise.durationInSeconds)}`
    );
  }, [selectedExercise, timerState]);

  useEffect(() => {
    if (!keepAwake) deactivateKeepAwake().then();
    else activateKeepAwakeAsync().then();
  }, [keepAwake]);

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

    if (timerState === TimerState.RUNNING) {
      VibrationService.nextExercise();
    }
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

function formatTime(timeInSeconds: number) {
  return timeInSeconds % 60 === 0 ? `${Math.floor(timeInSeconds / 60)} minuten` : `${timeInSeconds} seconden`
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
