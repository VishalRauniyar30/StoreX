import { cn, formatDateTime } from '@/lib/utils'
import React from 'react'

const FormattedDateTime = ({
    date,
    className
} : {
    date: string,
    className?: string
}) => {
    return (
        <p className={cn('text-[16px] leading-[24px] font-normal text-light-200', className)}>
            {formatDateTime(date)}
        </p>
    )
}

export default FormattedDateTime