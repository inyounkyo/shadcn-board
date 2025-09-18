import { Task } from "@/types";
import { atom } from "jotai";

// 전체 Task 목록 조회
export const tasksAtom = atom<Task[]>([]);

// 단일(개별) TASK 조회
export const taskAtom = atom<Task | null>(null);
