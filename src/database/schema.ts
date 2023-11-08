import sql from "../lib/sql";

export interface IStudent {
  id: number;
  name: string;
  classId?: number;
  batchId?: number;
  phone: string;
}

export interface IStudentWithClassAndBatch
  extends Omit<IStudent, "classId" | "batchId"> {
  class: string;
  batch: string;
  paymentStatus: "paid" | "unpaid";
}

export const students = sql`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        classId INTEGER,
        batchId INTEGER,
        phone TEXT NOT NULL,
        
        FOREIGN KEY (classId) REFERENCES classes(id) ON UPDATE CASCADE ON DELETE SET NULL,
        FOREIGN KEY (batchId) REFERENCES batches(id) ON UPDATE CASCADE ON DELETE SET NULL
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

export interface IPaymentHistory {
  id: number;
  month: number;
  amount: number;
  paymentDate: string;
  paymentStatus: "paid" | "unpaid";
}

export const payments = sql`
    CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY,
        studentId INTEGER NOT NULL,
        month INTEGER NOT NULL,
        amount REAL NOT NULL,
        paymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    );
`;
