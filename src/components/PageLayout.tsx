/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Cairo } from "next/font/google";
import PageTitle from "./PageTitle";
// import PageTitle from "./PageTitle";



const cairo = Cairo({ weight: "600", subsets: ['arabic'] });

export default function PageLayout({ children, title }: { children: any, title: string; })
{
    const [sideMenu, setSideMenu] = useState(true);
    const { status } = useSession();
    const router = useRouter();
    return (


        <div className="h-full w-full">

            {/* { sideMenu && status === 'authenticated' && (
                <div className="w-1/5   fixed ">
                    <SideMenu />
                </div>
            ) } */}
            {/* <ParentsSideBar /> */ }

            <div className={ `pb-12  min-h-screen ` }>
                <div className="my-6">

                    <PageTitle title={ title } />
                </div>
                <div className="">

                    { children }
                </div>
            </div>
        </div>


    );
}