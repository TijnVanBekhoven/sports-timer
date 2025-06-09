import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useState} from "react";
import {Exercise} from "@/types/Exercise";

export function ExerciseForm({onSubmit}: {onSubmit: (exercise: Exercise) => void }) {
  const [exercise, setExercise] = useState<string>();
  const [minutes, setMinutes] = useState<number>();
  const [seconds, setSeconds] = useState<number>();

  const minutesSet = (value: string) => setTime(value, 0, 99, setMinutes);
  const secondsSet = (value: string) => setTime(value, 0, 59, setSeconds);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={'Exercise'}
        inputMode={'text'}
        onChangeText={setExercise}
        style={[styles.textInput, styles.exerciseInput]}
      />
      <View
        style={styles.durationView}
      >
        <TextInput
          placeholder={'00'}
          inputMode={'numeric'}
          value={minutes?.toString()}
          maxLength={2}
          onChangeText={minutesSet}
          style={[styles.textInput, styles.timeInput]}
        />
        <Text>:</Text>
        <TextInput
          placeholder={'00'}
          inputMode={'numeric'}
          value={seconds?.toString()}
          maxLength={2}
          onChangeText={secondsSet}
          style={[styles.textInput, styles.timeInput]}
        />
      </View>
      <TouchableOpacity onPress={submit}>
        <AntDesign name={'pluscircle'} color={'black'} size={30}/>
      </TouchableOpacity>
    </View>
  );

  function setTime(value: string, min: number, max: number, func: (x: number | undefined) => void) {
    // Validate and sanitize time input
    const parsedValue = Number.parseInt(value);
    if (Number.isNaN(parsedValue)) func(undefined);
    else if (parsedValue > max) func(max);
    else if (parsedValue < min) func(min);

    // Save time
    else func(parsedValue);
  }

  function submit() {
    // Validate exercise inputs
    if (!exercise || (!minutes && !seconds)) return;
    if (exercise.length === 0) return;
    const duration = (minutes || 0) * 60 + (seconds || 0);
    if (duration < 1) return;

    // Call high-order onSubmit() function to sent exercise
    const newExercise: Exercise = {durationInSeconds: duration, type: exercise}
    onSubmit(newExercise);
  }
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row' as const,
    gap: 5,
    padding: 20,
    backgroundColor: '#fff',
  },
  textInput: {
    paddingBottom: 5,
    paddingTop: 5,
    borderBottomWidth: 1,
  },
  exerciseInput: {
    flex: 1
  },
  timeInput: {
    minWidth: 23,
  },
  durationView: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center',
  },
});
