"use client";

import { supabase } from  "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

function useCreateTask() {
    const router = useRouter();
    const createTask = async () => {
        try {
            const { data, status, error } = await supabase
            .from("tasks")
            .insert([
                {
                    title: null, 
                    start_date: null,
                    end_date: null,
                    boards: [],
                },
            ])
            .select();
            console.log(data);
            if(data && status === 201){
                //  올바르게 tasks 테이블에 row 데이터 한 줄이 생성
                toast("새로운 TASK가 생성 되었습니다.", {
                 description: "나만의 TODO-BOARD 생성해보세요!",
                });
                router.push(`/task/${data[0].id}`);
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
    return createTask;
}

export { useCreateTask }