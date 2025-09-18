"use client"

// Hooks
import { useCreateTask } from '@/hooks/apis';
// Shadcn UI
import { Button } from '@/components/ui'

function InitPage() {
  // TASK 생성
  const handleCreateTask = useCreateTask();

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