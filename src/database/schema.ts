import sql from "../lib/sql";

export interface Student {
  id: number;
  name: string;
  classId: number;
  batchId: number;
  phone: string;
}

export const students = sql`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        classId INTEGER NOT NULL,
        batchId INTEGER NOT NULL,
        phone TEXT NOT NULL,
        
        FOREIGN KEY (classId) REFERENCES classes(id),
        FOREIGN KEY (batchId) REFERENCES batches(id)
    );
`;

export interface IClass {
  id: number;
  name: string;
}

export const classes = sql`
    CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );
`;

export interface IBatch {
  id: number;
  name: string;
}

export const batches = sql`
    CREATE TABLE IF NOT EXISTS batches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );
`;

export const payments = sql`
    CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY,
        studentId INTEGER NOT NULL,
        month TEXT NOT NULL,
        amount REAL NOT NULL,
        paymentDate TEXT NOT NULL,

        FOREIGN KEY (studentId) REFERENCES students(id)
    );
`;
