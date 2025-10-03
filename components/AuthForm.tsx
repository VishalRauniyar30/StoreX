'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import OTPModal from './OTPModal'
import Image from 'next/image'
import { createAccount, signInUser } from '@/lib/actions/users.actions'

type FormType = "sign-in" | "sign-up"

const authFormSchema = (formType: FormType) => {
    return z.object({
        email: z.email(),
        fullName: formType === 'sign-up' ?
        z.string().min(2).max(50) : z.string().optional()
    })
}

const AuthForm = ({ type }: { type: FormType }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [accountId, setAccountId] = useState(null)


    const formSchema = authFormSchema(type)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
        }
    })

    const onsubmit = async(values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        setErrorMessage("")

        try {
            const user = type === 'sign-up' ?
            await createAccount({
                fullName: values.fullName || "",
                email: values.email
            }) :
            await signInUser({ email: values.email })

            setAccountId(user.accountId)
        } catch (error) {
            setErrorMessage("Failed to create Account. Please try again")
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <>
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onsubmit)} 
                    className='flex max-h-[800px] w-full max-w-[580px] flex-col justify-center space-y-6 transition-all lg:h-full lg:space-y-8'
                >
                    <h1 className='text-[34px] leading-[42px] font-bold text-center text-light-100 md:text-left'>
                        {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                    </h1>
                    {type === 'sign-up' && (
                        <FormField
                            control={form.control}
                            name='fullName'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex h-[78px] flex-col justify-center rounded-xl border border-light-300 px-4 shadow-drop-1'>
                                        <FormLabel className='text-light-100 pt-2 text-[14px] leading-[20px] font-normal w-full'>
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder='Enter Your Full Name'
                                                className='border-none shadow-none p-0 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-light-200 text-[14px] leading-[20px] font-normal'
                                                { ...field }
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className='text-red text-[14px] leading-[20px] font-normal ml-4' />
                                </FormItem>
                            )}
                        />
                    )}
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex h-[78px] flex-col justify-center rounded-xl border border-light-300 px-4 shadow-drop-1'>
                                    <FormLabel className='text-light-100 pt-2 text-[14px] leading-[20px] font-normal w-full'>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder='Enter Your Email'
                                            className='border-none shadow-none p-0 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-light-200 text-[14px] leading-[20px] font-normal'
                                            { ...field }
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className='text-red text-[14px] leading-[20px] font-normal ml-4' />
                            </FormItem>
                        )}
                    />
                    <Button
                        type='submit'
                        className='bg-[#FA7275] hover:bg-[#EA6365] transition-all rounded-full text-[14px] leading-[20px] font-medium h-[66px] text-[#F2F5F9]'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                {type === 'sign-in' ? 'Signing In' : "Signing Up"}
                                <Image 
                                    src='/assets/icons/loader.svg'
                                    alt='loader'
                                    width={24}
                                    height={24}
                                    className='ml-2 animate-spin'
                                />
                            </>
                        ) : (
                            type === 'sign-in' ? 'Sign In' : "Sign Up"
                        )}
                    </Button>
                    {errorMessage && (
                        <p className='text-[14px] leading-[20px] font-normal mx-auto w-fit rounded-xl bg-error/5 px-8 py-4 text-center text-error'>
                            *{errorMessage}
                        </p>
                    )}
                    
                    <div className='text-[14px] leading-[20px] font-normal flex justify-center'>
                        <p className='text-light-100'>
                            {type === 'sign-in' ?
                            "Don't have an account?" : "Already have an account?"}
                        </p>
                        <Link 
                            href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
                            className='ml-1 font-medium text-brand transition-all duration-500 hover:scale-110'
                        >
                            &nbsp;{type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                        </Link>
                    </div>
                </form>
            </Form>
            {accountId && (
                <OTPModal accountId={accountId} email={form.getValues("email")} />
            )}
        </>
    )
}

export default AuthForm