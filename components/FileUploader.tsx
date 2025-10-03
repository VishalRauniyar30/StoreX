'use client'

import { useCallback, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useDropzone } from "react-dropzone"

import { MAX_FILE_SIZE } from "@/constants"
import { uploadFile } from "@/lib/actions/file.actions"
import { Button } from "./ui/button"
import { cn, convertFileToUrl, getFileType } from "@/lib/utils"
import Thumbnail from "./Thumbnail"

interface Props{
    ownerId: string;
    accountId: string;
    className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
    const path = usePathname()
    const { toast } = useToast()
    const [files, setFiles] = useState<File[]>([])

    const onDrop = useCallback(async(acceptedFiles: File[]) => {
        setFiles(acceptedFiles)
        const uploadPromises = acceptedFiles.map(async(file) => {
            if(file.size > MAX_FILE_SIZE) {
                setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))

                return toast({
                    description: (
                        <p className="text-[14px] leading-[20px] font-normal text-white">
                            <span className="font-semibold">{file.name}</span> is too large.
                            Max file size is 50MB
                        </p>
                    ),
                    className: 'bg-[#FF7474] !rounded-[10px]'
                })
            }
            return uploadFile({ file, ownerId, accountId, path })
            .then((uploadedFile) => {
                if(uploadedFile){
                    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))
                }
            })
        })
        await Promise.all(uploadPromises)
    }, [ownerId, accountId, path])

    const { getInputProps, getRootProps } = useDropzone({ onDrop })

    const handleRemoveFile = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent>,
        fileName: string
    ) => {
        e.stopPropagation()
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
    }

    return (
        <div { ...getRootProps() } className="cursor-pointer">
            <input { ...getInputProps() } />
            <Button type="button" className={cn('bg-[#FA7275] hover:bg-[#EA6365] transition-all rounded-full text-[14px] leading-[20px] font-medium h-[52px] gap-2 px-10 shadow-drop-1', className)}>
                <Image
                    src='/assets/icons/upload.svg'
                    alt="upload"
                    width={24}
                    height={24}
                />&nbsp;
                <p className="text-white">Upload</p>
            </Button>
            {files.length > 0 && (
                <ul className="fixed bottom-10 right-10 z-50 flex size-full h-fit max-w-[480px] flex-col gap-3 rounded-[20px] bg-white p-7 shadow-drop-3">
                    <h4 className="text-[18px] leading-[20px] font-medium text-light-100">
                        Uploading
                    </h4>
                    {files.map((file, index) => {
                        const { type, extension } = getFileType(file.name)

                        return (
                            <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl p-3 shadow-drop-3">
                                <div className="flex items-center gap-3">
                                    <Thumbnail
                                        type={type}
                                        extension={extension}
                                        url={convertFileToUrl(file)}
                                    />
                                    <div className="text-[14px] leading-[20px] font-semibold mb-2 line-clamp-1 max-w-[300px]">
                                        {file.name}
                                        <Image
                                            src='/assets/icons/file-loader.gif'
                                            width={80}
                                            height={26}
                                            alt="loader"
                                        />
                                    </div>
                                </div>
                                <Image 
                                    src='/assets/icons/remove.svg'
                                    width={24}
                                    height={24}
                                    alt="remove"
                                    onClick={(e) => handleRemoveFile(e, file.name)}
                                />
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default FileUploader