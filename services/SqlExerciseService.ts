import {IExerciseService} from "@/services/IExerciseService";
import {ExerciseItemData} from "@/types/ExerciseItem";
import * as SQLite from "expo-sqlite";

export class SqlExerciseService implements IExerciseService {
  hasBeenInitialized: boolean = false;

  private async init(connection: SQLite.SQLiteDatabase) {
    await connection.execAsync(`CREATE TABLE IF NOT EXISTS exercise (id TEXT PRIMARY KEY NOT NULL, type TEXT NOT NULL, durationInSeconds INTEGER NOT NULL);`)
      .catch(err => console.error(err))
    this.hasBeenInitialized = true;
  }

  public async getAllExercises(): Promise<ExerciseItemData[]> {
    const db = await this.connect();
    return (
      await db.getAllAsync<ExerciseRes>(`SELECT * FROM exercise;`)
        .catch(err => {
          console.error(err);
          return [];
        })
        .finally(async () => {
          await this.disconnect(db);
        })
    ).map(res => ({
      id: res.id,
      exercise: {
        type: res.type,
        durationInSeconds: res.durationInSeconds
      }
    }));
  }

  public async addExercise({id, exercise}: ExerciseItemData): Promise<void> {
    const db = await this.connect();
    await db.runAsync(`INSERT INTO exercise (id, type, durationInSeconds) VALUES (?, ?, ?);`, id, exercise.type, exercise.durationInSeconds)
      .catch(err => console.error(err))
      .finally(async () => await this.disconnect(db));
  }

  public async deleteExercise(id: string): Promise<void> {
    const db = await this.connect();
    await db.runAsync(`DELETE FROM exercise WHERE id = ?`, id)
      .catch(err => console.error(err))
      .finally(async () => await this.disconnect(db));
  }

  private async connect(): Promise<SQLite.SQLiteDatabase> {
    const connection = await SQLite.openDatabaseAsync('');
    if (!this.hasBeenInitialized) await this.init(connection);
    return connection;
  }

  private disconnect(connection: SQLite.SQLiteDatabase): Promise<void> {
    return connection.closeAsync();
  }
}

type ExerciseRes = {
  id: string;
  type: string;
  durationInSeconds: number;
}
