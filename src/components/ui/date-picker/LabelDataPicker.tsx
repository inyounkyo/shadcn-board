"use client"
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
    value: Date | undefined;
    onChange? : (date: Date | undefined) => void;
}

function LabelDataPicker({label, readonly, value, onChange}: Props) {
  return (
    <div className='max-w-64 flex items-center gap-3'>
        <span className='text-sm font-medium leading-none text-[#6d6d6d]'>{label}</span>
        {/* Shadcn UI - Calrendar */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!value}
            className="data-[empty=true]:text-muted-foreground w-[200px] justify-start text-left font-normal"
          >
            <CalendarIcon />
            {value ? format(value, "PPP") : <span>날짜를 선택하세요</span>}
          </Button>
        </PopoverTrigger>
        {!readonly && (
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={value} onSelect={onChange} />
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}

export { LabelDataPicker }
