"use client"

import { useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { deleteFile, renameFile, updateFileUsers } from "@/lib/actions/file.actions"
import { 
    Dialog, DialogContent, DialogFooter, 
    DialogHeader, DialogTitle 
} from "./ui/dialog"
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "./ui/dropdown-menu"
import { actionsDropdownItems } from "@/constants"
import { constructDownloadUrl } from "@/lib/utils"
import { Input } from "./ui/input"
import { FileDetails, ShareInput } from "./ActionsModalContent"
import { Button } from "./ui/button"

const ActionDropdown = ({ file }: { file: FileDoc }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [action, setAction] = useState<ActionType | null>(null)
    const [name, setName] = useState(file.name)
    const [isLoading, setIsLoading] = useState(false)
    const [emails, setEmails] = useState<string[]>([])
    
    const path = usePathname()

    const closeAllModals = () => {
        setIsModalOpen(false)
        setIsDropdownOpen(false)
        setAction(null)
        setName(file.name)
        // setEmails([])
    }

    const handleAction = async () => {
        if(!action) return

        setIsLoading(true)
        let success = false

        const actions = {
            rename: () => renameFile({ fileId: file.$id, name, extension: file.extension, path }),
            share: () => updateFileUsers({ fileId: file.$id, emails, path }),
            delete: () => deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path })
        }

        success = await actions[action.value as keyof typeof actions]()

        if(success) {
            closeAllModals()
        }

        setIsLoading(false)
    }
    
    const handleRemoveUser = async (email: string) => {
        const updatedEmails = emails.filter((e) => e !== email)

        const success = await updateFileUsers({
            fileId: file.$id,
            emails: updatedEmails,
            path
        })

        if(success){
            setEmails(updatedEmails)
        }
        closeAllModals()
    }

    const renderDialogContent = () => {
        if(!action) return null

        const { value, label } = action

        return (
            <DialogContent className="focus:ring-0 focus:ring-offset-0 focus-visible:border-none outline-none focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 bg-white">
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center text-light-100">
                        {label}
                    </DialogTitle>
                    {value === 'rename' && (
                        <Input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    {value === 'details' && <FileDetails file={file} />}
                    {value === 'share' && (
                        <ShareInput
                            file={file}
                            onInputChange={setEmails}
                            onRemove={handleRemoveUser}
                        />
                    )}
                    {value === 'delete' && (
                        <p className="text-center text-light-100">
                            Are you sure you want to delete &nbsp;
                            <span className="font-medium text-brand-100">{file.name}</span>
                        </p>
                    )}
                </DialogHeader>
                {['rename', 'delete', 'share'].includes(value) && (
                    <DialogFooter className="flex flex-col gap-3 md:flex-row">
                        <Button onClick={closeAllModals} className="h-[52px] flex-1 rounded-full bg-lime-500 text-white hover:bg-lime-400">
                            Cancel
                        </Button>
                        <Button onClick={handleAction} className="bg-[#fa7275] text-white hover:bg-[#ea6365] transition-all rounded-full text-[14px] leading-[20px] font-medium mx-0 h-[52px] w-full flex-1">
                            <p className="capitalize">
                                {value}
                            </p>
                            {isLoading && (
                                <Image 
                                    src='/assets/icons/loader.svg'
                                    alt="loader"
                                    width={24}
                                    height={24}
                                    className="animate-spin"
                                />
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        )
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger className="outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0">
                    <Image 
                        src='/assets/icons/dots.svg'
                        alt="dots"
                        width={34}
                        height={34}
                        className="cursor-pointer"
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                    <DropdownMenuLabel className="max-w-[200px] truncate">
                        {file.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actionsDropdownItems.map((actionItem) => (
                        <DropdownMenuItem
                            key={actionItem.value}
                            className="cursor-pointer"
                            onClick={() => {
                                setAction(actionItem)
                                if(['rename', 'share', 'delete', 'details'].includes(actionItem.value)) {
                                    setIsModalOpen(true)
                                }
                            }}
                        >
                            {actionItem.value === 'download' ? (
                                <Link 
                                    href={constructDownloadUrl(file.bucketFileId)}
                                    download={file.name}
                                    className="flex items-center gap-2"
                                >
                                    <Image 
                                        src={actionItem.icon}
                                        alt={actionItem.label}
                                        width={30}
                                        height={30}
                                    />
                                    {actionItem.label}
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Image 
                                        src={actionItem.icon}
                                        alt={actionItem.label}
                                        width={30}
                                        height={30}
                                    />
                                    {actionItem.label}
                                </div>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {renderDialogContent()}
        </Dialog>
    )
}

export default ActionDropdown