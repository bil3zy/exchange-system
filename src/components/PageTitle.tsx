import React from 'react';

export default function PageTitle({ title }: { title: string; })
{
    return (
        <div className=" flex flex-col items-center justify-center  ">
            <div
                className={ ` text-4xl w-full  py-2  border-b-2 border-red-300` }
            >
                <h3>{ title }</h3>
            </div>
        </div>
    );
}
