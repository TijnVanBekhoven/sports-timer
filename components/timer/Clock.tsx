import {View, Text, StyleSheet} from "react-native";

type ClockProps = {
  timeLeft: number | undefined;
}

export function Clock({timeLeft}: ClockProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
    </View>
  )

  function formatTime(value: number | undefined): string {
    if (!value) return `00:00`;

    const seconds = value % 60;
    const minutes = (value - seconds) / 60;
    const formatTimePart = (part: number): string => {
      if (part < 0) return '00';
      if (part < 10) return `0${part}`;
      return `${part}`
    };

    return `${formatTimePart(minutes)}:${formatTimePart(seconds)}`;
  }
}

const styles = StyleSheet.create({
  container: {
    marginBlock: 80,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 100
  },
})
