import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {ExerciseItemData} from "@/types/ExerciseItem";
import {Ionicons} from "@expo/vector-icons";
import {Exercise} from "@/types/Exercise";
import Swipeable, {SwipeableMethods} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {SharedValue} from "react-native-reanimated";
import {ReactNode} from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type ExerciseItemProps = {
  item: ExerciseItemData;
  onPress: () => void;
  selected: boolean;
  onDuplicate: (item: Exercise) => void;
  onDelete: (item: ExerciseItemData) => void;
};

export function ExerciseItem({item, onPress, selected, onDuplicate, onDelete}: ExerciseItemProps) {
  const selectedStyle = selected ? styles.selected : null;

  const renderRightActions = (
    progress: SharedValue<number>,
    translation: SharedValue<number>,
    swipeableMethods: SwipeableMethods,
  ): ReactNode => {
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'row',
      },
      opacity: {
        width: 62,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      delete: {
        backgroundColor: '#da0000'
      },
      duplicate: {
        backgroundColor: '#3b90f1',
      },
      icon: {
        color: 'white',
      },
    });

    const duplicateExercise = () => {
      onDuplicate(item.exercise)
      swipeableMethods.close();
    }

    const deleteExercise = () => {
      onDelete(item);
    }

    return (
      <Animated.View style={styles.container}>
        <TouchableOpacity onPress={deleteExercise} style={[styles.opacity, styles.delete]}>
          <MaterialIcons name={'delete'} size={26} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={duplicateExercise} style={[styles.opacity, styles.duplicate]}>
          <Ionicons name={'copy'} size={26} style={styles.icon} />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={[styles.container, selectedStyle]}>
        <Text>{item.exercise.type}</Text>
        <Text>{formatTime(item.exercise.durationInSeconds)}</Text>
      </TouchableOpacity>
    </Swipeable>
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
  },
}
