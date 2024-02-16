import React from 'react'
import { MdArrowForwardIos } from 'react-icons/md'

export default function Breadcrums({ parent, childarr }: any) {
    return (
        <div className="flex items-center gap-2 h-14 px-7 py-3 bg-white rounded-lg mb-2">
            <h4 className="text-[#F12D4D] font-semibold flex items-center text-xl">{parent}
            </h4>

            {childarr.map((child: any) => {
                return (
                    <h4 key={child} className="font-normal text-xl flex items-center">{<MdArrowForwardIos className='mr-2' />} {child}</h4>
                )
            })}
        </div>
    )
}
