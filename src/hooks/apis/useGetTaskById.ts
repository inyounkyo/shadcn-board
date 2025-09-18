"use client";

import { useAtom } from "jotai";
import { taskAtom } from "@/store/atoms";
import { toast } from "sonner"
import { supabase } from "@/utils/supabase/client";
import { useEffect } from "react";

function useGetTaskById(taskId: number){
    const [task, setTask] = useAtom(taskAtom);
    const getTaskById = async () => {
        try {
            const { data, status, error } = await supabase.from("tasks").select("*").eq("id", taskId);

            if(data && status == 200) setTask(data[0]);

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

    useEffect(() => {
       if(taskId) getTaskById();
    }, [taskId]);

    return { task, getTaskById };
}

export { useGetTaskById };