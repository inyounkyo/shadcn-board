"use client"

import { useEffect, useState } from "react";

import { useAtom } from "jotai";
import { sidebarStateAtom } from "@/store";
import { toast } from "sonner"
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input"
import { Dot, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

import styles from "./SideNavigation.module.scss";


function SideNavigation() {
  const router = useRouter();
  const [sidevarState, setSidevarState] = useState(sidebarStateAtom);
  const [todos, setTodos] = useState<any>([]);

  const onCreate = async() => {
    

    // Supabase Database row 생성
    const { error, status } = await supabase.from("todos").insert([
      {
        title: "", 
        start_date: new Date(),
        end_date: new Date(),
        contents: [],
      },
    ]);
    
    if (error) {
      console.log(error);
    }
    if (status === 201) {
      	toast("페이지 생성 완료", {
          description: "새로운 투두리스트 생성 되었습니다.",
        });
        let { data } = await supabase.from("todos").select("*");
        if(data){
          router.push(`/create/${data[data?.length-1].id}`);
          getTodos();
        } 
    }
  }

  // Supabase에 기존에 생성된 페이지가 있는지 없는지 체크(확인)
  const getTodos = async() => {
    let { data: todos, error, status } = await supabase.from("todos").select("*");

    if (status === 200) {
      setTodos(todos);
    }
  }

  useEffect(() => {
    getTodos();
  }, [sidevarState]);

  return (
    <div className={styles.container}>
      {/* 검색창 */}
      <div className={styles.container__searchBox}>
        <Input type="text" placeholder="검색어를 입력해 주세요." className="focus-visible:ring-0"/>
        <Button variant={"outline"} size="icon">
            <Search className="w-4 h-4"/>
        </Button>
      </div>
      <div className={styles.container__buttonBox}>
        <Button variant={"outline"} className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-300" 
          onClick={ onCreate }
        >Add New Page</Button>
      </div>
      <div className={styles.container__todos}>
        <span className={styles.container__todos__label}>Your To Do</span>
        {/* Is Supabase Todos */}
        <div className={styles.container__todos__list}>
            {todos && todos.map((item: any) => {
              return(
                  <div className="flex item-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer" key={item.id}>
                    <Dot className="mr-1 text-green-400"></Dot>
                    <span className="text-sm">{item.title === ""? "제목 없음": item.title}</span>
                  </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default SideNavigation
