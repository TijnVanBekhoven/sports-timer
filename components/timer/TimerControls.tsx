import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {TimerState} from "@/enums/TimerState";

type TimerControlProps = {
  timerState: TimerState;
  onStateChanged: (state: TimerState) => void;
  onNextPressed: () => void;
}

export function TimerControls({timerState, onStateChanged, onNextPressed}: TimerControlProps) {
  const startButton = (
    <TouchableOpacity
      onPress={() => onStateChanged(TimerState.RUNNING)}
      activeOpacity={0.5}
      style={styles.button
    }>
      <Text style={styles.buttonText}>START</Text>
    </TouchableOpacity>
  )
  const pauseButton = (
    <TouchableOpacity
      onPress={() => onStateChanged(TimerState.PAUSED)}
      activeOpacity={0.5}
      style={styles.button}
    >
      <Text style={styles.buttonText}>PAUSE</Text>
    </TouchableOpacity>
  )
  const resumeButton = (
    <TouchableOpacity
      onPress={() => onStateChanged(TimerState.RUNNING)}
      activeOpacity={0.5}
      style={styles.button}
    >
      <Text style={styles.buttonText}>RESUME</Text>
    </TouchableOpacity>
  )
  const stopButton = (
    <TouchableOpacity
      onPress={() => onStateChanged(TimerState.STOPPED)}
      activeOpacity={0.5}
      style={[styles.button, styles.stopButton]}
    >
      <Text style={styles.buttonText}>STOP</Text>
    </TouchableOpacity>
  )
  const nextButton = (
    <TouchableOpacity
      onPress={onNextPressed}
      activeOpacity={0.5}
      style={[styles.button, styles.nextButton]}
    >
      <Text style={styles.buttonText}>NEXT</Text>
    </TouchableOpacity>
  )

  switch (timerState) {
    case TimerState.STOPPED:
      return (
        <View style={styles.container}>
          {startButton}
        </View>
      );
    case TimerState.RUNNING:
      return (
        <View style={styles.container}>
          {stopButton}
          {pauseButton}
          {nextButton}
        </View>
      );
    case TimerState.PAUSED:
      return (
        <View style={styles.container}>
          {stopButton}
          {resumeButton}
          {nextButton}
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 10,
    backgroundColor: '#3b90f1',
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#da0000',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#9a9a9a'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});
