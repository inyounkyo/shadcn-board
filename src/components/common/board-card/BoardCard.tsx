"use client";

// Shadcd UI
import { ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox, Button, Card, LabelDataPicker, Separator } from "@/components/ui";
// Component
import MDEditor from "@uiw/react-md-editor";
import { MarkDownDialog } from "@/components/common"
// Type
import { Board, Task } from "@/types";
import { useCreateBoard, useDeleteBoard, useGetTaskById } from "@/hooks/apis";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";
import { useState } from "react";

interface Props {
  board: Board;
}


function BoardCard({board}: Props) {
  const { id } = useParams();
  // TASK의 개별 TODO-BOARD 삭제(TODO-BOARD 1건 삭제)
  const handleDeleteBoard = useDeleteBoard(Number(id), board.id);

  const task = useAtomValue(taskAtom);
  const updateBoard = useCreateBoard();
  const { getTaskById } = useGetTaskById(Number(id));
  const [isShowContent, setIsShowContent] = useState<boolean>(false);

   return (
    // <div className={styles.container}>
    //   <div className={styles.container__header}>
    //     <div className={styles.container__header__titleBox }>
    //         <Checkbox className="w-5 h-5"/>
    //         {data.title !== "" ? 
    //           <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{data.title}</h3> : <span className={styles.title}>Please enter a title for me board.</span>}
    //     </div>
    //     <Button variant={"ghost"} >
    //         <ChevronUp className="w-5 h-5 text-gray-400"/>
    //     </Button>
    //   </div>
    //   <div className={styles.container__body}>
    //     <div className={styles.container__body__calendarBox}>
    //       <div className="flex items-center gap-3">
    //         <span className="text-[#6d6d6d]">From</span>
    //         <Input value={data.startDate.toString().split("T")[0]} disabled />
    //       </div>
    //       <div className="flex items-center gap-3">
    //         <span className="text-[#6d6d6d]">To</span>
    //         <Input value={data.endDate.toString().split("T")[0]} disabled />
    //       </div>
    //     </div>
    //     <div className={styles.container__body__buttonBox}>
    //         <Button variant={"ghost"} className="font-normal text-gray-400 hover:bg-green-50 hover:text-green-500">
    //             Duplicate
    //         </Button>
    //         <Button variant={"ghost"} 
    //           className="font-normal text-gray-400 hover:bg-red-50 hover:text-red-500"
    //           onClick={ () => handleDelete(data.boardId) }
    //           >
    //             Delete
    //         </Button>
    //     </div>
    //   </div>
    //   {
    //     data.content && (
    //       <Card className="w-full p-4 mb-3">
    //         <MDEditor value={data.content} height={100 + "%"}/>
    //       </Card>
    //     )
    //   }
    //   <div className={styles.container__footer}>
    //      <MarkDownDialog data={data} updateBoards={getData} />
    //   </div>
    // </div>
    <Card className="w-full  flex flex-col item-center p-5">
        {/* 게시물 카드 제목 영역 */}
      <div className="w-full flex items-center justify-between md-4">
          <div className="w-full flex items-center justify-start gap-2">
            <Checkbox className="h-5 w-5" checked={board.isCompleted} />
            <input type="text" placeholder="등록된 제목이 없습니다." 
              value={board.title}
              className="w-full text-xl outline-none bg-transparent" disabled={true} />
          </div>
          <Button variant={"ghost"} size={"icon"} onClick={()=>setIsShowContent(!isShowContent)}>
            {isShowContent ? <ChevronUp className="text-[#6d6d6d]" /> : <ChevronDown className="text-[#6d6d6d]" /> }
          </Button>
      </div>
      {/* 캘린더 및 버튼 박스 영역 */}
      <div className="w-full flex items-center justify-between">
        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          <LabelDataPicker label="From" value={board.startDate} readonly={true} />
          <LabelDataPicker label="To" value={board.endDate} readonly={true} />
        </div>
        {/* 버튼 박스 */}
        <div className="flex items-center">
          <Button variant={"ghost"} className="font-normal text-[#6d6d6d]">
            Duplicate</Button>
          <Button variant={"ghost"} 
            onClick={handleDeleteBoard}
            className="font-normal text-rose-600 hover:text-rose-600 hover:bg-red-50">
            Delete</Button>
        </div>
      </div>
      {isShowContent && <MDEditor height={320 + "px"} 
        style={{width:100 + "%", marginTop:16 + "px"}}
        value={board.content? board.content : "Empty!!"}/>
      }
      
      <Separator className="my-3" />
      <MarkDownDialog board={board}>
        <Button variant={"ghost"} className="font-normal text-[#6d6d6d]">
          {board.title ? "Update Contents" : "Add Contents"}
        </Button>
      </MarkDownDialog>
      
    </Card>
  )
}

export { BoardCard };
