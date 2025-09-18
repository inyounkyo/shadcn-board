"use client";

import { taskAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { toast } from "sonner"
import { useGetTaskById } from '@/hooks/apis';
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Board } from "@/types";

function useDeleteBoard(taskId: number, boardId: string) {
    const { getTaskById } = useGetTaskById(taskId);
    const [task] = useAtom(taskAtom);

    const deleteBoard = async () => {
        try {
            const { status, error } = await supabase.
            from("tasks")
            .update({
                boards: task?.boards.filter((board: Board) => board.id != boardId)
            })
            .eq("id", taskId)

            if(status == 204){
                toast("선택한 TODO-BOARD가 삭제되었습니다.", {
                    description: '새로운 할 일이 생기면 TODO-BOARD 생성해주세요.',
                });
                // TASK를 갱신
                getTaskById();
            }

            if(error){
                console.log(error.message);
                toast("에러가 발생했습니다.", {
                    description: `Supabase 오류: ${error.message} || "알 수 없는 오류"`,
                });
            }

        } catch (error) {
            console.log(error);
            toast("네트워크 오류.", {
                description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
            });   
        }
        
    }
    return deleteBoard;
}


export { useDeleteBoard };