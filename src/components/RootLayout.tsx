/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
// import SideMenu from "./sideMenu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Cairo } from "next/font/google";
import useStore from "@/utils/store";
import SideBar from "./SideBar";


const cairo = Cairo({ weight: "600", subsets: ['arabic'] });

export default function Layout({ children }: { children: any; })
{
    const [sideMenu, setSideMenu] = useState(true);
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'unauthenticated')
    {
        void router.push('/signin');
    }

    const collapsedState = useStore((state) => state.collapsedState);
    const setCollapsedState = useStore((state) => state.setCollapsedState);


    return (
        <>
            <main className={ `${cairo.className}     relative max-w-screen  ` }>
                <div className={ `${collapsedState ? 'w-0' : 'w-1/5'} fixed z-10 right-0 ` }>
                    {
                        status === 'authenticated' && router.pathname !== '/signin' && (
                            <SideBar />
                        )
                    }

                    {/* {
                        session?.user.scope === 'PARENT' ? (
                            <ParentsSideBar />
                        ) : session?.user.scope === 'ADMIN' && (
                            <SideMenu />
                        )
                    } */}
                </div>
                {/* <div className="w-4/5 absolute left-0 "> */ }
                <div className={ `container flex min-h-screen   ${collapsedState ? 'w-[96%]' : 'w-4/5'} absolute left-0 flex-col  ` }>

                    { children }
                </div>
                {/* </div> */ }
            </main>
        </>
    );
}