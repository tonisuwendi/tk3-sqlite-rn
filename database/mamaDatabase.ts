import { IMama } from '@/types/mama';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mama.db');

export const createTables = async () => {
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS mamas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age TEXT,
      phone TEXT,
      pregnancyAge TEXT,
      expectedBirthdate TEXT,
      address TEXT,
      note TEXT,
      photo TEXT
    );`
  );
};

export const getAllMamas = async () => {
  const allRows: IMama[] = await db.getAllAsync('SELECT * FROM mamas ORDER BY id DESC');
  return allRows;
};

export const getMamaById = async (id: number) => {
  const mama: IMama | null = await db.getFirstAsync('SELECT * FROM mamas WHERE id = ?', [id]);
  return mama;
};

export const insertMama = async ({
  name,
  age,
  phone,
  pregnancyAge,
  expectedBirthdate,
  address,
  note,
  photo,
}: Omit<IMama, 'id'>) => {
  await db.runAsync(
    `INSERT INTO mamas (name, age, phone, pregnancyAge, expectedBirthdate, address, note, photo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, age, phone, pregnancyAge, expectedBirthdate, address, note, photo]
  );
};

export const updateMama = async ({
  id,
  name,
  age,
  phone,
  pregnancyAge,
  expectedBirthdate,
  address,
  note,
  photo,
}: IMama) => {
  await db.runAsync(
    `UPDATE mamas SET name = ?, age = ?, phone = ?, pregnancyAge = ?, expectedBirthdate = ?, address = ?, note = ?, photo = ? WHERE id = ?`,
    [name, age, phone, pregnancyAge, expectedBirthdate, address, note, photo, id]
  );
};

export const deleteMama = async (id: number) => {
  await db.runAsync('DELETE FROM mamas WHERE id = ?', [id]);
};
