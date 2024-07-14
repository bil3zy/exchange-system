'use client';
import React from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import
{
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { api } from '@/utils/api';
import PageLayout from '@/components/PageLayout';

const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
});

export default function Index()
{
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
        },
    });

    const createFavoriteCustomer = api.favoriteCustomer.create.useMutation();
    const { data: sessionData } = useSession();


    function onSubmit(values: z.infer<typeof formSchema>)
    {
        console.log(values);
        if (sessionData?.user?.exchangeId)
        {
            createFavoriteCustomer.mutateAsync({
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                exchangeId: sessionData?.user?.exchangeId,
            }).then((res) =>
            {
                toast.success("تمت العملية بنجاح");
            })
                .catch((err) =>
                {
                    toast.error('لقد حدث خطأ ما');
                });

        }
    }

    return (
        <PageLayout title="العملاء الدائمين">
            <Form { ...form }>
                <form onSubmit={ form.handleSubmit(onSubmit) } className="w-[264px] m-auto space-y-8">
                    <FormField
                        control={ form.control }
                        name="firstName"
                        render={ ({ field }) => (
                            <FormItem>
                                <FormLabel>الاسم</FormLabel>
                                <FormControl>
                                    <Input placeholder="أدخل الاسم الأول" { ...field } />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        ) }
                    />
                    <FormField
                        control={ form.control }
                        name="lastName"
                        render={ ({ field }) => (
                            <FormItem>
                                <FormLabel>الاسم</FormLabel>
                                <FormControl>
                                    <Input placeholder="أدخل اسم العائلة" { ...field } />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        ) }
                    />
                    <FormField
                        control={ form.control }
                        name="phone"
                        render={ ({ field }) => (
                            <FormItem>
                                <FormLabel>الهاتف</FormLabel>
                                <FormControl>
                                    <Input placeholder="أدخل رقم الهاتف" { ...field } />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        ) }
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </PageLayout>
    );
}

