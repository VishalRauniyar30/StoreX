"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Separator } from "@radix-ui/react-separator"

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet"
import { navItems } from "@/constants"
import { cn } from "@/lib/utils"
import FileUploader from "./FileUploader"
import { Button } from "./ui/button"
import { signOutUser } from "@/lib/actions/users.actions"

interface Props {
    $id: string;
    accountId: string;
    fullName: string;
    avatar: string;
    email: string;
}

const MobileNavigation = ({
    $id: ownerId,
    accountId,
    fullName,
    avatar, 
    email
}: Props) => {
    const [open, setOpen] = useState(false)

    const pathname = usePathname()
    return (
        <header className="flex h-[60px] justify-between px-5 sm:hidden">
            <Image
                src={'/assets/icons/logo-full-brand.svg'}
                alt="logo"
                width={120}
                height={52}
                className="h-auto"
            />
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger>
                    <Image
                        src={'/assets/icons/menu.svg'}
                        alt="search"
                        width={30}
                        height={30}
                    />
                </SheetTrigger>
                <SheetContent className="pt-0 bg-white h-screen px-3">
                    <SheetTitle>
                        <div className="my-3 flex items-center gap-2 rounded-full p-1 text-light-100 sm:justify-center sm:bg-[#fa7275]/10 lg:justify-start lg:p-3">
                            <Image 
                                src={avatar}
                                alt="avatar"
                                width={44}
                                height={44}
                                className="aspect-square w-10 rounded-full object-cover"
                            />
                            <div className="sm:hidden lg:block">
                                <p className="text-[14px] leading-[20px] font-semibold capitalize">
                                    {fullName}
                                </p>
                                <p className="text-[12px] leading-[16px] font-normal">
                                    {email}
                                </p>
                            </div>
                        </div>
                        <Separator className="mb-4 bg-[#a3b2c7]/20" />
                    </SheetTitle>
                    <nav className="text-[16px] leading-[24px] font-semibold flex-1 gap-1 text-brand">
                        <ul className="flex flex-1 flex-col gap-4">
                            {navItems.map(({ url, name, icon }) => (
                                <Link href={url} key={name} className="lg:w-full">
                                    <li className={cn("flex text-light-100 gap-4 w-full justify-start items-center h5 px-6 h-[52px] rounded-full", pathname === url && "bg-brand text-white shadow-drop-2")}>
                                        <Image 
                                            src={icon}
                                            alt={name}
                                            width={24}
                                            height={24}
                                            className={cn('w-6 filter invert opacity-25', pathname === url && "invert-0 opacity-100")}
                                        />
                                        <p>{name}</p>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </nav>
                    <Separator className="my-5 bg-[#a3b2c7]/20" />
                    <div className="flex flex-col justify-between gap-5 pb-5">
                        <FileUploader
                            ownerId={ownerId}
                            accountId={accountId}
                        />
                    </div>
                    <Button 
                        type="submit" 
                        className="h5 flex h-[52px] w-full items-center gap-4 rounded-full bg-[#fa7275]/10 px-6 text-[#fa7275] shadow-none transition-all duration-300 hover:bg-[#fa7275]/30"
                        onClick={async() => await signOutUser()}
                    >
                        <Image 
                            src="/assets/icons/logout.svg"
                            alt="logo"
                            width={24}
                            height={24}
                        />
                        <p>Logout</p>
                    </Button>
                </SheetContent>
            </Sheet>
        </header>
    )
}

export default MobileNavigation