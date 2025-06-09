import {Text, TouchableOpacity, View} from "react-native";
import {ExerciseItemData} from "@/types/ExerciseItem";
import {Ionicons} from "@expo/vector-icons";
import {Exercise} from "@/types/Exercise";

export type ExerciseItemProps = {
  item: ExerciseItemData;
  onPress: () => void;
  selected: boolean;
  onDuplicate: (item: Exercise) => void;
};

export function ExerciseItem({item, onPress, selected, onDuplicate}: ExerciseItemProps) {
  const selectedStyle = selected ? styles.selected : null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={[styles.container, selectedStyle]}>
      <Text>{item.exercise.type}</Text>
      <View style={styles.rightContainer}>
        <Text>{formatTime(item.exercise.durationInSeconds)}</Text>
        <TouchableOpacity>
          <Ionicons name={'copy'} size={26} onPress={() => onDuplicate(item.exercise)} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function formatTime(timeInSeconds: number) {
  return timeInSeconds % 60 === 0 ? `${Math.floor(timeInSeconds / 60)} min` : `${timeInSeconds} sec`
}

const styles = {
  container: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    padding: 20,
    backgroundColor: '#fff'
  },
  rightContainer: {
    flexDirection: 'row' as const,
    gap: 16,
  },
  selected: {
    borderWidth: 1,
    borderColor: '#3b90f1'
  }
}
