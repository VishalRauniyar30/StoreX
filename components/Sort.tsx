"use client"

import { usePathname, useRouter } from "next/navigation"

import { 
    Select, SelectContent, SelectItem, 
    SelectTrigger, SelectValue 
} from "./ui/select"
import { sortTypes } from "@/constants"

const Sort = () => {
    const path = usePathname()
    const router = useRouter()

    const handleSort = (value: string) => {
        router.push(`${path}?sort=${value}`)
    }

    return (
        <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
            <SelectTrigger className="shad-no-focus h-11 w-full cursor-pointer rounded-[8px] border-transparent bg-white !shadow-sm sm:w-[210px]">
                <SelectValue placeholder={sortTypes[0].value} />
            </SelectTrigger>
            <SelectContent className="shadow-drop-3">
                {sortTypes.map((sort) => (
                    <SelectItem
                        key={sort.label}
                        value={sort.value}
                        className="cursor-pointer"
                    >
                        {sort.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default Sort