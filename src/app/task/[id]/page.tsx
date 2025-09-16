"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { ChevronLeft } from "lucide-react";
import {nanoid} from "nanoid";
import Image from "next/image";
import { useAtom } from "jotai";
import { sidebarStateAtom } from "@/store";

// Shadcn UI
import { toast } from "sonner"
import { Button, Progress, LabelDataPicker } from "@/components/ui"
import { usePathname, useRouter } from "next/navigation";
import BasicBoard from '../../../components/common/board/BasicBoard';
// CSS
import styles from './page.module.scss'



interface Todo {
  id: number;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  contents: BoardContent[];
}

interface BoardContent {
  boardId: string | number;
  isCompleted: boolean;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  content: string;
}

function TaskPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [sidevarState, setSidevarState] = useState(sidebarStateAtom);
  const [title, setTitle] = useState<string>("");
  const [boards, setBoards] = useState<Todo>();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  // Supabase
  const insertRowData = async(contents: BoardContent[]) => {
    const { data, error, status } = await supabase
      .from("todos")
      .update({
          contents: contents,
      })
      .eq("id", pathname.split("/")[2]);

      if (error) {
        console.log(error);
        toast("에러가 발생", {
            description: "콘솔창 확인 바람.",
        });
      }
      if (status === 204) {
          toast("추가 완료", {
            description: "새로운 TO-DO-LIST 추가(수정) 되었습니다.",
          });
          getData();
      }
  }

  // ADD NEW BOARD 버튼 클릭하였을 때
  const createBoard = () => {
    let newContents: BoardContent[] = [];
    const boardContent = {
      boardId: nanoid(),
      isCompleted: false,
      title: "",
      startDate: "",
      endDate: "",
      content: "",
    };

    if(boards && boards.contents.length > 0) {
      newContents = [...boards.contents];
      newContents.push(boardContent);
      insertRowData(newContents);
    }else if(boards && boards.contents.length === 0){
      newContents.push(boardContent);
      insertRowData(newContents);
    }
  }

  //=================
  // Supabase에 기존에 생성된 보드가 있는지 없는지 확인
  const getData = async() => {
    let { data: todos, error, status } = await supabase.from("todos").select("*");
    if (todos !== null) {
      todos.forEach((item: Todo) => {
        if (item.id === Number(pathname.split("/")[2])){
          setBoards(item);
          setTitle(item.title); // board를 가져온 후 title 값을 갱신
        }
      });
    }
  }

  // 저장
  const handleSave = async () => {
    const {data, error, status} = await supabase.from("todos").update({
      title:title,
    })
    .eq("id", pathname.split("/")[2]);

    if(error){
       toast("에러가 발생", {
            description: "콘솔창 확인 바람.",
        });
    }
    if(status == 240){
       toast("수정 완료", {
            description: "작성한 게시물이 수파에 올바르게 저장되었습니다.",
        });
        getData();
        // 상태 변수 함수 (onSave가 호출될 때 상태 변경)
        setSidevarState("update");
    }
  }

  useEffect( () => {
    getData();
  }, []);

  return (
    <div className={styles.header}>
        <div className={styles['header__btn-box']}>
          <Button variant={"outline"} size={"icon"} onClick={() => router.push("/")}>
            <ChevronLeft />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant={"secondary"} onClick={handleSave}>저장</Button>
            <Button className="text-rose-600 bg-red-50 hover:bg-stone-50">삭제</Button>
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
              1/10 Completed
            </small>
            <Progress className="w-60 h-[10px]" value={33} />
          </div>
        </div>
        {/* 캘린더 + ADD New Board 버튼 섹션 */}
        <div className={styles.header__bottom}>
            <div className="flex items-center gap-5">
              <LabelDataPicker label={"From"} />
              <LabelDataPicker label={"To"} />
            </div>
            <Button className="text-white bg-[#E79057] hover:bg-[#E79057] hover:ring-[#E79057] hover:ring-offset-1 active:bg-[#E79057] hover:shadow-lg">
              Add New Board
            </Button>
        </div>
    </div>
  )
}

export default TaskPage;
