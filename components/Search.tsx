"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from 'use-debounce'

import { getFiles } from "@/lib/actions/file.actions"
import { Input } from "./ui/input"
import Thumbnail from "./Thumbnail"
import FormattedDateTime from "./FormattedDateTime"

const Search = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<FileDoc[]>([])
    const [open, setOpen] = useState(false)

    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('query') || ""

    const router = useRouter()
    const path = usePathname()

    const [debouncedQuery] = useDebounce(query, 300)


    useEffect(() => {
        const fetchFiles = async() => {
            if(debouncedQuery.length === 0) {
                setResults([])
                setOpen(false)
                return router.push(path.replace(searchParams.toString(), ""))
            }
            const files = await getFiles({ types: [], searchText: debouncedQuery })
            setResults(files.documents)
            setOpen(true)
        }
        fetchFiles()
    }, [debouncedQuery])

    useEffect(() => {
        if(!searchQuery){
            setQuery("")
        }
    }, [searchQuery])

    const handleClickItem = (file: FileDoc) => {
        setOpen(false)
        setResults([])

        router.push(
            `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`
        )
    }

    return (
        <div className="relative w-full md:max-w-[480px]">
            <div className="flex h-[52px] flex-1 items-center gap-3 rounded-full px-4 shadow-drop-3">
                <Image
                    src="/assets/icons/search.svg"
                    alt="Search"
                    width={24}
                    height={24}
                />
                <Input
                    value={query}
                    placeholder="Search..."
                    className="text-[14px] leading-[20px] font-normal outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-[16px] placeholder:leading-[24px] placeholder:font-normal w-full border-none p-0 shadow-none placeholder:text-[#a3b2c7]"
                    onChange={(e) => setQuery(e.target.value)}
                />
                {open && (
                    <ul className="absolute left-0 top-16 z-50 flex w-full flex-col gap-3 rounded-[20px] bg-white p-4"> 
                        {results.length > 0 ? (
                            results.map((file) => (
                                <li
                                    className="flex items-center justify-between"
                                    key={file.$id}
                                    onClick={() => handleClickItem(file)}
                                >
                                    <div className="flex cursor-pointer items-center gap-4">
                                        <Thumbnail
                                            type={file.type}
                                            extension={file.extension}
                                            url={file.url}
                                            className="size-9 min-w-9"
                                        />
                                        <p className="text-[14px] leading-[20px] font-semibold line-clamp-1 text-light-100">
                                           {file.name} 
                                        </p>
                                    </div>
                                    <FormattedDateTime 
                                        date={file.$createdAt}
                                        className="text-[12px] leading-[16px] font-normal line-clamp-1 text-light-200"
                                    />
                                </li>
                            ))
                        ) : (
                            <p className="text-[14px] leading-[20px] font-normal text-center text-light-100">No files found</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Search