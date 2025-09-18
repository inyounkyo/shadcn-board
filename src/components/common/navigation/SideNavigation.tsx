"use client"

// Hooks
import { useGetTasks, useCreateTask } from "@/hooks/apis";
// UI 컴포넌트
import { Input, Button } from "@/components/ui";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// TYPE'S
import { Task } from "@/types";
import { useSearch } from "@/hooks/apis/useSearch";

function SideNavigation() {
  const router = useRouter();
  const { id } = useParams();
  const { tasks, getTasks } = useGetTasks();
  const { search } = useSearch();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // getTasks는 컴포넌트 최초 렌더링 시 한 번만 호출 useEffect로 호출
  useEffect(()=>{
    getTasks();
  }, [id]);

  // TASK 생성
  const handleCreatTask = useCreateTask();

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
  }

  const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key == "Enter") {
      // useSearch 훅이 동작한다.
      search(searchTerm);
    }
  }


  return (
    // <div className={styles.container}>
    //   {/* 검색창 */}
    //   <div className={styles.container__searchBox}>
    //     <Input type="text" placeholder="검색어를 입력해 주세요." className="focus-visible:ring-0"/>
    //     <Button variant={"outline"} size="icon">
    //         <Search className="w-4 h-4"/>
    //     </Button>
    //   </div>
    //   <div className={styles.container__buttonBox}>
    //     <Button variant={"outline"} className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-300" 
    //       onClick={ onCreate }
    //     >Add New Page</Button>
    //   </div>
    //   <div className={styles.container__todos}>
    //     <span className={styles.container__todos__label}>Your To Do</span>
    //     {/* Is Supabase Todos */}
    //     <div className={styles.container__todos__list}>
    //         {todos && todos.map((item: any) => {
    //           return(
    //               <div className="flex item-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer" key={item.id}>
    //                 <Dot className="mr-1 text-green-400"></Dot>
    //                 <span className="text-sm">{item.title === ""? "제목 없음": item.title}</span>
    //               </div>
    //           )
    //         })}
    //     </div>
    //   </div>
    // </div>
    <aside className="page__aside">
      <div className="flex flex-col h-full gap-3">
        {/* 검색창 UI */}
        <Input type="text" placeholder="검색어를 입력해 주세요." 
          onChange={handleSearchTermChange}  onKeyDown={handleSearch}
          className="focus-visible:ring-0"/>
        {/* Add New Page  버튼UI */}
        <Button 
          className="text-[#E79057] bg-white border-[#E79057] hover:bg-[#fff9f5]" 
          onClick={handleCreatTask} >
            Add New Page
        </Button>
        {/* Task 목록 UI */}
        <div className="flex flex-col mt-4 gap-2">
          <small className="text-sm font-medium leading-none text-[#a6a6a6]">
            <span className="text-neutral-700">KKND님</span>의 TASKs
          </small>
          <ul className="flex flex-col">
            {tasks.length == 0 ?
              (<li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
                <div className="h-[6px] w-[6px] rounded-full bg-neutral-400"></div>
                등록된 Task가 없습니다. 
              </li>)
            : 
            (
              tasks.map((task: Task) => {
                return(
                  <li key={task.id} 
                    onClick={() => router.push(`/task/${task.id}`)}
                    className={`"bg-[#f5f5f5] min-h-9 flex items-center gap-2 " ${task.id == Number(id) && " py-2 px-[10px] rounded-sm text-sm cursor-pointer"}`}>
                    <div className={`${task.id == Number(id) ? "bg-[#00f38d]" : "bg-neutral-400"} h-[6px] w-[6px] rounded-full `}></div>
                     <span className={`${task.id !== Number(id) && 'text-neutral-400'}`}>
                        {task.title ? task.title : '등록된 제목이 없습니다.' }                      
                     </span>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      </div>
    </aside>

  )
}

export { SideNavigation }
