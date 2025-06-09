import {ExerciseItemData} from "@/types/ExerciseItem";

export interface IExerciseService {
  getAllExercises: () => Promise<ExerciseItemData[]>;
  addExercise: (exercise: ExerciseItemData) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
}