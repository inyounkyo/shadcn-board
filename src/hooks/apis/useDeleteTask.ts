"use client";

import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner"


function useDeleteTask() {
    const router = useRouter();
    const deleteTask = async (taskId: number) => {
        try {
            const { status, error } = await supabase.from("tasks").delete().eq("id", taskId);
            if(status == 204){
                toast("선택한 TASK가 삭제되었습니다.", {
                    description: '새로운 TASK가 생기면 언제든 추가해주세요.',
                });
                router.push("/"); // 초기 페이지 이동
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
    return { deleteTask };
}

export { useDeleteTask };