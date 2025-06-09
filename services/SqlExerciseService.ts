import {IExerciseService} from "@/services/IExerciseService";
import {ExerciseItemData} from "@/types/ExerciseItem";
import * as SQLite from "expo-sqlite";

export class SqlExerciseService implements IExerciseService {
  db: SQLite.SQLiteDatabase | null = null;

  constructor() {
    this.init().then();
  }

  private async init() {
    this.db = await this.connect()

    try {
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS exercise (id TEXT PRIMARY KEY NOT NULL, type TEXT NOT NULL, durationInSeconds INTEGER NOT NULL);
      `);
    } catch (err) {
      console.error(err);
    }
  }

  public async getAllExercises(): Promise<ExerciseItemData[]> {
    if (!this.db) return [];

    try {
      const res = await this.db.getAllAsync(`SELECT * FROM exercise;`) as ExerciseRes[];
      return res.map((e) => ({
        id: e.id,
        exercise: {
          type: e.type,
          durationInSeconds: e.durationInSeconds,
        }
      }));
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async addExercise({id, exercise,}: ExerciseItemData): Promise<void> {
    if (!this.db) return;

    try {
      await this.db.runAsync(`INSERT INTO exercise (id, type, durationInSeconds) VALUES (?, ?, ?);`, id, exercise.type, exercise.durationInSeconds);
    } catch (err) {
      console.error(err);
    }
  }

  private async connect(): Promise<SQLite.SQLiteDatabase> {
    return SQLite.openDatabaseAsync('');
  }

  public async deleteExercise(id: string): Promise<void> {
    if (!this.db) return;

    try {
      await this.db.runAsync(`DELETE FROM exercise WHERE id = ?`, id);
    } catch (err) {
      console.error(err);
    }
  }
}

type ExerciseRes = {
  id: string;
  type: string;
  durationInSeconds: number;
}
