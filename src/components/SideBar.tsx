import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Cairo } from 'next/font/google';
import Image from 'next/image';
import { ModeToggle } from '../darkModeToggle';
import { Button } from '@/components/ui/button';
import { NavigationMenuDemo } from '../NavigationMenu';
import { useRouter } from 'next/navigation';
import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { MdOutlineAssignment } from 'react-icons/md';
import { HiOutlineChartPie } from 'react-icons/hi2';
import { CiMail } from 'react-icons/ci';
import { FaCalendarAlt } from "react-icons/fa";
import { CgArrowsExchange } from "react-icons/cg";
import { PiSignOutFill } from "react-icons/pi";
import useStore from '@/utils/store';




const cairo = Cairo({ weight: "600", subsets: ['arabic'] });

export default function SideBar()
{

    // const [collapsedState, setCollapsedState] = React.useState(false);
    const collapsedState = useStore((state) => state.collapsedState);
    const setCollapsedState = useStore((state) => state.setCollapsedState);
    const { data } = useSession();
    const router = useRouter();
    const handleSignOut = async () =>
    {
        await signOut().then((res) => console.log(res)).catch((e) => console.log(e));
    };
    return (

        <Sidebar width='auto' style={ { height: "100vh" } }

            backgroundColor='auto' className="text-slate-950   text-xl min-w-[250px] py-8 
        from-red-200 to-red-50 bg-gradient-to-bl  flex flex-col justify-between relative " collapsed={ collapsedState }>
            < Menu className='drop-shadow-md' >
                <MenuItem rootStyles={ { "a.ps-menu-button:hover": { backgroundColor: "transparent" } } } className={ `hover:bg-transparent ` }>
                    <div onClick={ () => setCollapsedState() } className={ `absolute top-2 left-0 bg-opacity-80 h-fit ${collapsedState ? 'w-full' : "w-[60px]"}  flex flex-row justify-center py-2 bg-white` }>

                        <CgArrowsExchange size={ 30 } color='black' className=" cursor-pointer" />
                    </div>
                </MenuItem>
                <MenuItem onClick={ () => router.push('/') } rootStyles={ { "a.ps-menu-button:hover": { backgroundColor: "transparent" } } } className='my-4 py-4 border-b-2 border-red-400 '>
                    <div className=' py-4 flex flex-row  text-black text-3xl gap-4'>

                        <Image src={ '/signin.jpg' } alt="logo" width={ 50 } height={ 50 } className={ 'rounded' } />
                        <p>الصراف</p>
                    </div>
                </MenuItem>
                <MenuItem onClick={ () => router.push('/funds') } icon={
                    <MdOutlineAssignment size={ 30 } />

                } rootStyles={ { "a.ps-menu-button:hover": { backgroundColor: "salmon", } } } className=' hover:bg-opacity-75'>
                    <div className='flex gap-4'>
                        <p>الخزينة</p>
                    </div>

                </MenuItem>
                <MenuItem onClick={ () => router.push('/transactions') } icon={
                    <HiOutlineChartPie size={ 30 } />
                } rootStyles={ { "a.ps-menu-button:hover": { backgroundColor: "salmon", } } }>
                    <div className='flex gap-4'>

                        <p>معاملة</p>
                    </div>
                </MenuItem>
                <MenuItem onClick={ () => router.push('/favorite-customer') } icon={ <CiMail size={ 30 } />
                } rootStyles={ { "a.ps-menu-button:hover": { backgroundColor: "salmon", } } }>
                    <div className='flex gap-4'>

                        <p>العملاء الدائمين</p>
                    </div>
                </MenuItem>

            </Menu>
            <Button onClick={ handleSignOut } className={ `box-border ${collapsedState && 'bg-transparent hover:bg-red-400'} absolute bottom-0 left-0 right-0 m-auto  w-2/5 min-w-fit text-sm text-center ${cairo.className}` }>
                {
                    collapsedState ? (
                        <PiSignOutFill size={ 30 } color='white' />
                    ) : (
                        "تسجيل الخروج"
                    )
                }
            </Button>
        </Sidebar >
        // </div>
        // </div>
    );
};

