"use client"

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { nanoid } from 'nanoid';
import { toast } from "sonner";
// Shadcn UI
import { Button, Progress, LabelDataPicker } from "@/components/ui"
import { useParams, useRouter } from "next/navigation";
import { BoardCard, DeleteTaskPopup } from '@/components/common';
// CSS
import styles from './page.module.scss'
// Types
import { Task, Board } from "@/types";
import {useGetTaskById, useCreateBoard, useDeleteTask, useGetTasks } from "@/hooks/apis";
import { supabase } from "@/utils/supabase/client";

function TaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const { task } = useGetTaskById(Number(id));
  const createBoard = useCreateBoard();
  const { getTasks } = useGetTasks();

  const [title, setTitle] = useState<string>("");
  const [boards, setBoards] = useState<Board[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if(task){
      setTitle(task.title || "");
      setStartDate(task.start_date ? new Date(task.start_date) : undefined);
      setEndDate(task.end_date ? new Date(task.end_date) : undefined);
      setBoards(task.boards);
    }
  }, [task]);

  // Task 내의 Board 생성
  const handleAddBoard = () => {
    const newBoard: Board = {
      id: nanoid(),
      isCompleted: false,
      title: "",
      startDate: undefined,
      endDate: undefined,
      content: "",
    };
    const newBoards = [...boards, newBoard];
    setBoards(newBoards);
    // 실제 Supabase와 통신하는 로직 Hook
    createBoard(Number(id), "boards", newBoards);
  }

  // 저장
  const handleSave = async () => {
    if (!title || !startDate || !endDate) {
       toast("기입되지 않은 데이터(값)이 있습니다.", {
             description: "제목, 시작일, 종료일은 필수 값.",
       });
       return;
    }

    try {
      const { data, status, error } = await supabase.from("tasks").update({
        title: title,
        start_date: startDate,
        end_date: endDate 
      })
      .eq("id", id)
      .select()

      if(data && status === 200){
        //  올바르게 tasks 테이블에 row 데이터 한 줄이 생성
        toast("TASK가 저장 되었습니다.", {
          description: "수정한 TASK의 마감일 꼭 지켜주세요!",
        });
        // 서버에서 데이터 갱신 후 상태값 업데이트
        // SideNavigation 컴포 리스트 정보를 실시간 업데이트 하기 위해 getTasks 함수 호출
        getTasks();
      }

    } catch (error) {
      console.log(error);
      toast("네트워크 오류.", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
      });
    }
  }

  useEffect(() => {
    if(task?.boards){
      const completedCount = task.boards.filter((board: Board) => board.isCompleted).length;
      setCount(completedCount);
    }
  }, [task?.boards])

  return (
    <>
      <div className={styles.header}>
          <div className={styles['header__btn-box']}>
            <Button variant={"outline"} size={"icon"} onClick={() => router.push("/")}>
              <ChevronLeft />
            </Button>
            <div className="flex items-center gap-2">
              <Button variant={"secondary"} onClick={handleSave}>저장</Button>
              <DeleteTaskPopup>
                <Button className="text-rose-600 bg-red-50 hover:bg-stone-50">삭제</Button>
              </DeleteTaskPopup>
            </div>
          </div>
          <div className={styles.header__top}>
            {/* 제목 입력 Input 섹션 */}
            <input type="text" value={title} 
              onChange={(event) => setTitle(event.target.value)} 
              placeholder="Enter Title Here"
              className={styles.header__top__input}
              />
            {/* 진행상황 척도 그래프 섹션 */}
            <div className="flex items-center justify-start gap-4">
              <small className="text-sm font-medium leading-none text-[#6d6d6d]">
                {count} / {task?.boards.length} Completed
              </small>
              <Progress className="w-60 h-[10px]" 
                value={task && task.boards.length > 0 ? (count/task.boards.length)*100 : 0}
               />
            </div>
          </div>
          {/* 캘린더 + ADD New Board 버튼 섹션 */}
          <div className={styles.header__bottom}>
              <div className="flex items-center gap-5">
                <LabelDataPicker label={"From"} value={startDate} onChange={setStartDate}/>
                <LabelDataPicker label={"To"} value={endDate} onChange={setEndDate}/>
              </div>
              <Button 
                className="text-white bg-[#E79057] hover:bg-[#E79057] hover:ring-[#E79057] hover:ring-offset-1 active:bg-[#E79057] hover:shadow-lg"
                onClick={handleAddBoard}
                >
                Add New Board
              </Button>
          </div>
      </div>
      <div className={styles.body}>
        {
          boards.length !== 0 ? 
          (<div className={styles.body__isData}>
            {/* Add New Board 버튼 클릭으로 인한 Board 데이터가 있을 경우 */}
              {boards.map((board:Board) => {
                  return <BoardCard key={board.id} board={board} />
              })}
          </div>) 
          :
           (<div className={styles.body__noData}>
            {/* Add New Board 버튼 클릭으로 인한 Board 데이터가 없을 경우 */}
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                There is no baord yet.
              </h3>
              <small className="text-sm font-medium leading-none text-[#6d6d6d] mt-3 mb-7">
                  Click the button and start flashing!
              </small>
              <button onClick={handleAddBoard}>
                <Image src={"/assets/images/round-button.svg"} width={74} height={74} alt="rounded-button" />
              </button>
           </div>)
        } 
      </div>
    </>
  )
}

export default TaskPage;
