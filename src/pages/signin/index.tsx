/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { type SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { Cairo } from "next/font/google";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageLayout from "@/components/PageLayout";
import toast, { Toaster, useToaster } from "react-hot-toast";
import PageTitle from "@/components/PageTitle";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import React from "react";

type Inputs = {
    username: string,
    password: string,
};

const cairo = Cairo({ weight: '700', subsets: ['arabic'] });
const cairoLight = Cairo({ weight: '500', subsets: ['arabic'] });
const formSchema = z.object({
    // username: z.string().min(2).max(50),
    username: z.string(),
    password: z.string(),
});
export default function SignIn()
{

    const [spinner, setSpinner] = React.useState(false);
    // const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const session = useSession();
    const router = useRouter();

    if (session.status === 'authenticated')
    {
        void router.push('/');
    }


    const onSubmit: SubmitHandler<Inputs> = async (data) =>
    {
        setSpinner(true);
        try
        {
            await signIn('credentials', { redirect: false, username: data.username, password: data.password, callbackUrl: '/' }).then((res) =>
            {
                if (res?.ok === false)
                {
                    toast.error('اسم الدخول أو كلمة السر خطأ، الرجاء المحاولة مرة أخرى');
                    console.log('res', res);
                    setSpinner(false);
                } else
                {
                    toast.success('تم تسجيل الدخول بنجاح');

                }
            }).catch((e) =>
            {
                toast.error('لقد حدث خطأ ما، الرجاء المحاولة لاحقاً');
                console.log('e', e);
                setSpinner(false);
            });

        } catch (error)
        {
            toast.error('لقد حدث خطأ ما، الرجاء المحاولة لاحقاً');
            setSpinner(false);
            console.log('error', error);
        }
        if (session.status === 'authenticated')
        {
            void router.push('/');
        }
    };


    return (
        <>
            <Head>
                <title>بوابة الدخول</title>
            </Head>
            <div className="min-h-screen fixed top-0 right-0 bottom-0 left-0 z-50 flex flex-col from-red-50 to-red-200 bg-gradient-to-tr ">
                {/* <PageTitle title="بوابة الدخول" /> */ }
                <div className="flex flex-col 
                   w-full  items-center justify-center h-5/6 ">
                    <Card className="w-1/2 flex  items-center relative overflow-hidden">



                        <Toaster />

                        <div className="flex flex-col w-1/2 items-center">

                            <CardContent className="w-full">

                                <Form  { ...form }>
                                    <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-6 w-full m-auto   py-20 px-8  ">
                                        <FormField
                                            control={ form.control }
                                            name="username"
                                            render={ ({ field }) => (
                                                <FormItem className="" >
                                                    <FormLabel className='text-xl'>اسم الدخول</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="اسم الدخول" { ...field } />
                                                    </FormControl>
                                                    {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                                                    <FormMessage />
                                                </FormItem>
                                            ) }
                                        />
                                        <FormField
                                            control={ form.control }
                                            name="password"
                                            render={ ({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xl">كلمة السر</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="كلمة السر" { ...field } />
                                                    </FormControl>
                                                    {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                                                    <FormMessage />
                                                </FormItem>
                                            ) }
                                        />
                                        <div className="flex gap-8">

                                            <Button type="submit">الدخول</Button>
                                            { spinner &&
                                                <Loader2 className="h-8 w-8 animate-spin " />
                                            }
                                        </div>
                                    </form>
                                </Form>

                            </CardContent>
                        </div>
                        <div className="relative   bg-zinc-200 bottom-0  top-0 -left-20 skew-x-6 h-full  w-4/6 p-12">


                            <Image
                                priority
                                // className="w-1/3"
                                // objectFit={ "fill" }
                                quality={ 95 }
                                style={ { objectFit: "fill" } }
                                // className=" "
                                src="/signin.jpg"
                                alt="exechange picture"

                                fill={ true }
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );


}