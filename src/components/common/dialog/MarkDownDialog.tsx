// Shadcn UI
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

import styles from './MarkDownDialog.module.scss'
import { Checkbox } from "@/components/ui/checkbox";
import LabelCalendar from "@/components/calender/LabelCalendar";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

function MarkDownDialog() {
  return (
   <Dialog>
    <DialogTrigger asChild>
        <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">Add Contents</span>
    </DialogTrigger>
    <DialogContent className="max-w-fit">
        <DialogHeader>
            <DialogTitle>
                <div className={styles.dialog__titleBox}>
                    <Checkbox className="w-5 h-5" />
                    <input type="text" placeholder="Write a title for your board." className={styles.dialog__titleBox__title} />
                </div>    
            </DialogTitle>
            <div className={styles.dialog__calendarBox}>
                <LabelCalendar label="From" />
                <LabelCalendar label="To" />
            </div>
            <Separator />
            <div className={styles.dialog__markdown}></div>
        </DialogHeader>
        <DialogFooter>
            <div className={styles.dialog__buttonBox}>
                <DialogClose asChild>
                    <Button variant={'ghost'} className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500">Cancel</Button>
                </DialogClose>
                <Button type={"submit"} className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white">Cancel</Button>
            </div>
        </DialogFooter>
    </DialogContent>
   </Dialog>
  )
}

export default MarkDownDialog;
