import { Models } from 'node-appwrite'

import Card from '@/components/Card'
import Sort from '@/components/Sort'
import { getFiles } from '@/lib/actions/file.actions'
import { convertFileSize, getFileTypesParams } from '@/lib/utils'

const Type = async({ params, searchParams }: SearchParamProps) => {
    const type = (await params)?.type as string || ""
    const searchText = ((await searchParams)?.query as string) || ""
    const sort = ((await searchParams)?.sort as string) || ""

    const types = getFileTypesParams(type) as FileType[]

    const files = await getFiles({ types, searchText, sort })

    const totalSize = files.documents.reduce((sum: number, file: FileDoc) => sum + (file.size || 0), 0)

    return (
        <div className='mx-auto flex w-full max-w-7xl flex-col items-center gap-8'>
            <section className='w-full'>
                <h1 className='capitalize text-[34px] leading-[42px] font-bold'>
                    {type}
                </h1>
                <div className='flex mt-2 flex-col justify-between sm:flex-row sm:items-center'>
                    <p className='text-[16px] leading-[24px] font-normal'>
                        Total:&nbsp;
                        <span className='text-[16px] leading-[24px] font-semibold'>
                            {convertFileSize(totalSize)}
                        </span>
                    </p>
                    <div className='mt-5 flex items-center sm:mt-0 sm:gap-3'>
                        <p className='text-[16px] leading-[24px] font-normal hidden text-light-200 sm:block'>
                            Sort By:
                        </p>
                        <Sort />
                    </div>
                </div>
            </section>
            {/*Render the files */}
            {files.total > 0 ? (
                <section className='grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {files.documents.map((file: Models.Document) => (
                        <Card key={file.$id} file={file} />
                    ))}
                </section>
            ): (
                <p className='text-[16px] leading-[24px] font-normal mt-10 text-center text-light-200'>
                    No Files Uploaded
                </p>
            )}
        </div>
    )
}

export default Type