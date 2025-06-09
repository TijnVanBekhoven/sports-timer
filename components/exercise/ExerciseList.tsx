import {ExerciseItemData} from "@/types/ExerciseItem";
import {useEffect, useRef, useState} from "react";
import {ExerciseItem} from "@/components/exercise/ExerciseItem";
import {FlatList, StyleSheet, View} from "react-native";
import {ExerciseForm} from "@/components/exercise/ExerciseForm";
import {Exercise} from "@/types/Exercise";
import * as Crypto from 'expo-crypto';

type ExerciseListProps = {
  data: ExerciseItemData[];
  nextExercise: boolean;
  onSelectExercise: (selected: ExerciseItemData | undefined) => void;
  onNewExercise: (exercise: ExerciseItemData) => void;
  onRemoveExercise: (exercise: ExerciseItemData) => void;
  onTrainingEnded: () => void;
};

export function ExerciseList({data, nextExercise, onSelectExercise, onNewExercise, onRemoveExercise, onTrainingEnded}: ExerciseListProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const flatListRef = useRef<FlatList>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    if (data.length > 0) {
      onExerciseItemSelect(data[0]);
    } else {
      onSelectExercise(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (nextExercise) {
      if (scrollIndex >= data.length - 1) {
        onTrainingEnded();
        return;
      }

      const nextIndex = Math.min(scrollIndex + 1, data.length - 1);

      setScrollIndex(nextIndex);
      setSelectedId(data[nextIndex].id);

      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({index: nextIndex, animated: true, viewOffset: 2});
      }
      onSelectExercise(data[nextIndex]);
    }
  }, [data, nextExercise, onSelectExercise, scrollIndex]);

  const createExercise = (newExercise: Exercise) =>
    onNewExercise({
      exercise: newExercise,
      id: Crypto.randomUUID(),
    })

  const onExerciseItemSelect = (item: ExerciseItemData) => {
    setSelectedId(item.id);
    setScrollIndex(
      data.findIndex((value) => value.id === item.id)
    );
    onSelectExercise(item);
  }

  const renderExerciseItem = ({item}: { item: ExerciseItemData }) => {
    const selected = item.id === selectedId;

    return (
      <ExerciseItem
        item={item}
        onPress={() => onExerciseItemSelect(item)}
        selected={selected}
        onDuplicate={createExercise}
        onDelete={onRemoveExercise}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        ref={flatListRef}
        style={styles.list}
      />
      <ExerciseForm
        onSubmit={createExercise}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    backgroundColor: '#FFF',
  }
});
