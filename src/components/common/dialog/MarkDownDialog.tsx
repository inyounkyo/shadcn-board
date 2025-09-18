"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LabelDataPicker } from "@/components/ui";
// Components
import MDEditor from "@uiw/react-md-editor";
// Shadcn UI
import { toast } from "sonner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui"
import { Checkbox, Button, Separator } from "@/components/ui"
import { unique } from "next/dist/build/utils";
// Types
import { Task, Board } from "@/types";
// Hooks
import { useCreateBoard, useGetTaskById } from "@/hooks/apis";
import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";
import { Value } from 'vfile';

interface Props {
  children: React.ReactNode;
  board: Board;
}

function MarkDownDialog({board, children}: Props) {
  const { id } = useParams();
  const updateBoard = useCreateBoard();
  const task = useAtomValue(taskAtom);
  const { getTaskById } = useGetTaskById(Number(id));


  // 해당 컴포넌트에서 사용되는 상태 값
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
	const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [content, setContent] = useState<string | undefined>("**Hello, World!!");
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // 상태 값 초기값
  const initState = () => {
    setIsCompleted(board.isCompleted || false);
    setTitle(board.title || "");
    setStartDate(board.startDate ? new Date(board.startDate) : undefined);
    setEndDate(board.endDate ? new Date(board.endDate) : undefined);
    setContent(board.content || "**Hello, World!!");
  }

  useEffect(() => {
    if(isDialogOpen){
      initState();
    }
  }, [isDialogOpen]);

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    initState();
  }

	// 등록버튼 insert
	const handleSummit = async(boardId: string) => {
		if(!title || !content) {
			toast("기입되지 않은 데이터(값)이 있습니다.", {
          description: "제목, 콘텐츠 값을 모두 작성해주세요.",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
				return;
		}

    // 해당 Board에 대한 데이터만 수정이 되도록 한다.
    try {
      // boards 배열에서 선택한 board를 찾고, 수정된 값으로 업데이트
      const newBoards = task?.boards.map((board: Board) => {
        if(board.id === boardId){
          return { ...board, isCompleted, title, startDate, endDate, content };
        }
        return board;
      });
      await updateBoard(Number(id), "boards", newBoards);
      handleCloseDialog();
      getTaskById();
    } catch (error) {
      // 네트워크 오류나 예기치 않은 에러를 잡기 위한 catch
      toast("네트워크 오류.", {
        description: "서버와 연결할 수 없습니다.",
      });

      throw error;
    }
  }

  return (
   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>
              <div className="flex items-center justify-start gap-2">
                <Checkbox className="w-5 min-w-5 h-5" checked={isCompleted} 
                  onCheckedChange={(checked) => {
                    if(typeof checked == "boolean") setIsCompleted(checked);
                  }}
                />
                <input type="text" 
                    placeholder="게시물에 제목을 입력하세요." 
                    className="w-full text-xl outline-none bg-transparent"
                    value={title}
                    onChange={ (event) => setTitle(event.target.value) }
                    />
              </div>
            </DialogTitle>
            <DialogDescription>마크다운 에디터를 사용하여 TODO-BAORD를 예쁘게 꾸며보세요.</DialogDescription>
        </DialogHeader>
        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          <LabelDataPicker label="From" value={startDate} onChange={setStartDate} />
          <LabelDataPicker label="To" value={endDate} onChange={setEndDate} />
        </div>
        <Separator />
        {/* 마크다운 에이터 UI 영역 */}
        <MDEditor height={320 + "px"} value={content} onChange={setContent}/>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>취소</Button>
          </DialogClose>
          <Button type={"submit"} 
            className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
            onClick={() => handleSummit(board.id)}
            >등록</Button>
            
        </DialogFooter>
    </DialogContent>
   </Dialog>
  )
}

export {MarkDownDialog};
