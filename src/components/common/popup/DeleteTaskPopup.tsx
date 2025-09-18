"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui";
import { useDeleteTask } from "@/hooks/apis";
import { useParams } from "next/navigation";

type Props = {
  children: React.ReactNode;
}

function DeleteTaskPopup({ children }: Props) {
  const { id } = useParams();
  const { deleteTask } = useDeleteTask();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>해당 TASK를 정말로 삭제하시겠습니다?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업이 실행되면 되 돌릴수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction 
            onClick={ () => deleteTask(Number(id)) }
            className="bg-red-500 hover:bg-red-500">
              삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
  )
}

export { DeleteTaskPopup };
