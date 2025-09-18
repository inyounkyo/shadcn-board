"use client";

import { Board } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner"

function useCreateBoard() {
    const createBoard = async (taskId:number, column:string, newValue: Board[] | undefined) => {
        try {
            const { data, status, error } = await supabase
            .from("tasks")
            .update({
                [column]: newValue,
            }).eq("id", taskId)
            .select();

            if(data && status === 200){
                //  올바르게 tasks 테이블에 row 데이터 한 줄이 생성
                toast("새로운 TODO-BOARD 생성 되었습니다.", {
                 description: "생성한 TODO-BOARD 채워보세요!",
                });
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
    return createBoard;
}

export { useCreateBoard };