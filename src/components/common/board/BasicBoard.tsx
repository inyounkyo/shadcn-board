"use client";

import { supabase } from "@/utils/supabase"
import { usePathname } from "next/navigation"

// Shadcd UI
import { Checkbox } from "@/components/ui/checkbox/checkbox"
import { Button } from "@/components/ui/button/button"
import { ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input/input"
import { toast } from "sonner"
import MDEditor from "@uiw/react-md-editor";
import { Card } from "@/components/ui/card/card";
// CSS
import styles from './BasicBoard.module.scss'
// Component
import MarkDownDialog from "../dialog/MarkDownDialog"


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
  endDate: string ;
  content: string;
}

interface Props {
  data: BoardContent;
  handleBoards: (data: Todo) => void;
}

function BasicBoard( {data, handleBoards}: Props ) {
  const pathname = usePathname();

  const handleDelete = async (id:string | number) => {
    // 해당  Board에 대한 데이터만 수정 혹은 삭제
    let {data: todos} = await supabase.from("todos").select("*");

    if(todos !== null) {
      todos.forEach(async (item:Todo) => {
        if(item.id === Number(pathname.split("/")[2])){
          console.log(item);
          
          let newContens = item.contents.filter((element: BoardContent) => element.boardId !== id);
          // Supabase 데이터베이스 다시 저장
          const { data, error, status } = await supabase
          .from("todos")
          .update({
            contents: newContens,
          })
          .eq("id", pathname.split("/")[2]);

          if (error) {
              console.log(error);
              toast("에러가 발생했습니다.", {
                description: "콘솔창에 출력된 에러를 확인하세요.",
              });
            }
            if (status === 204) {
              toast("삭제 완료!", {
                description: "Supabase에 올바르게 삭제됨.",
              });
              getData();
            }
        } else {
          return;
        }
      });
    }
  }

  // Supabase에 기존에 생성된 보드가 있는지 없는지 확인
  const getData = async() => {
    let { data: todos, error } = await supabase.from("todos").select("*");

    if (error) {
      toast("데이터 로드 실패", {
         description: "데이터를 불러오는 중 오류 발생!",
      });
      return;
    }

    if (todos === null || todos.length == 0) {
       toast("조회 가능한 데이터가 없습니다.", {
         description: "no data!",
      });
      return;
    }
    todos.forEach((item: Todo) => {
        if (item.id === Number(pathname.split("/")[2])){
          handleBoards(item);
        }
      });
  }

  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <div className={styles.container__header__titleBox }>
            <Checkbox className="w-5 h-5"/>
            {data.title !== "" ? 
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{data.title}</h3> : <span className={styles.title}>Please enter a title for me board.</span>}
        </div>
        <Button variant={"ghost"} >
            <ChevronUp className="w-5 h-5 text-gray-400"/>
        </Button>
      </div>
      <div className={styles.container__body}>
        <div className={styles.container__body__calendarBox}>
          <div className="flex items-center gap-3">
            <span className="text-[#6d6d6d]">From</span>
            <Input value={data.startDate.toString().split("T")[0]} disabled />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#6d6d6d]">To</span>
            <Input value={data.endDate.toString().split("T")[0]} disabled />
          </div>
        </div>
        <div className={styles.container__body__buttonBox}>
            <Button variant={"ghost"} className="font-normal text-gray-400 hover:bg-green-50 hover:text-green-500">
                Duplicate
            </Button>
            <Button variant={"ghost"} 
              className="font-normal text-gray-400 hover:bg-red-50 hover:text-red-500"
              onClick={ () => handleDelete(data.boardId) }
              >
                Delete
            </Button>
        </div>
      </div>
      {
        data.content && (
          <Card className="w-full p-4 mb-3">
            <MDEditor value={data.content} height={100 + "%"}/>
          </Card>
        )
      }
      <div className={styles.container__footer}>
         <MarkDownDialog data={data} updateBoards={getData} />
      </div>
    </div>
  )
}

export default BasicBoard
