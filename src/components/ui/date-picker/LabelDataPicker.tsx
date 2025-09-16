"use client"
import {useState} from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"

import {
    Button, 
    Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui"

interface Props {
    label: string;
    readonly?: boolean;
}

function LabelDataPicker({label, readonly}: Props) {
    const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className='max-w-64 flex items-center gap-3'>
        <span className='text-sm font-medium leading-none text-[#6d6d6d]'>{label}</span>
        {/* Shadcn UI - Calrendar */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-[200px] justify-start text-left font-normal"
          >
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>날짜를 선택하세요</span>}
          </Button>
        </PopoverTrigger>
        {!readonly && (
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}

export { LabelDataPicker }
