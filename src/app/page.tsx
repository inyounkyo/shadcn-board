"use client"

import { useRouter } from 'next/navigation'
import { supabase } from "@/utils/supabase";
// Shadcn UI
import { Button } from '@/components/ui'
import { toast } from "sonner"

function InitPage() {
  const router = useRouter();

  // 페이지 생성 및 Supabase 연동
  const handleCreateTask = async() => {
    console.log("함수 호출");

    // Supabase Database row 생성
    const { error, status } = await supabase.from("todos").insert([
      {
        title: "", 
        start_date: new Date(),
        end_date: new Date(),
        contents: [],
      },
    ]).select();
    
    if (error) {
      console.log(error);
    }

     // 방금 생성한 TODOLIST의 ID 값으로 URL 파라미터 생성/변경 => Next.js 동적 라우팅(Dynamic Routing)
    let { data } = await supabase.from("todos").select();

    if (status === 201) {
      	toast("페이지 생성 완료", {
          description: "새로운 투두리스트 생성 되었습니다.",
        });

      if (data){
        router.push( `/create/${data[data?.length -1].id}` );
      } else return;
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5 mb-6">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">How to Start:</h3>
        <div className='flex flex-col items-center gap-3'>
          <small className='text-sm font-normal leading-none'>1. Crate a page</small>
          <small className='text-sm font-normal leading-none'>2. Add boards to page</small>
        </div>
        {/* 페이지 추가 버튼 */}
        <Button className="text-[#279057] bg-transparent border-[#279057] hover:bg-[#FFF9F5] w-[180px]"
          onClick={ handleCreateTask }
        >
          Add New Page
        </Button>
      </div>
     
    </div>
  )
}

export default InitPage;