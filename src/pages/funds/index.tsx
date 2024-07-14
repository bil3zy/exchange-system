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
import PageLayout from '@/components/PageLayout';
import { api } from '@/utils/api';
import
{
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';

const formSchema = z.object({
    currency: z.string(),
    amount: z.string(),
});

export default function Index()
{
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currency: "",
            amount: "",
        },
    });

    const createFund = api.funds.create.useMutation();
    const { data: sessionData } = useSession();
    const getFunds = api.funds.getAll.useQuery({
        exchangeId: sessionData?.user?.exchangeId ?? "",
    });
    const deleteFunds = api.funds.delete.useMutation();
    async function onSubmit(values: z.infer<typeof formSchema>)
    {
        console.log(values);
        await createFund.mutateAsync({
            amount: Number(values.amount),
            currency: values.currency,
            exchangeId: sessionData?.user?.exchangeId ?? "",
        }).then(async () =>
        {
            toast.success('تم الحفظ بنجاح');
            await getFunds.refetch();
            form.reset();
        }).catch(() =>
        {
            toast.error('لقد حدث خطأ ما');
        });
    }

    return (
        <PageLayout title="الخزينة">
            <Form { ...form }>
                <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8 m-auto flex flex-col w-[264px]">
                    <FormField
                        control={ form.control }
                        name="currency"
                        render={ ({ field }) => (
                            <FormItem>
                                <FormLabel>العملة</FormLabel>
                                <FormControl>
                                    <Input placeholder="ادخل اسم العملة" { ...field } />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        ) }
                    />
                    <FormField
                        control={ form.control }
                        name="amount"
                        render={ ({ field }) => (
                            <FormItem>
                                <FormLabel>السعر</FormLabel>
                                <FormControl>
                                    <Input type='number' placeholder="ادخل القيمة" { ...field } />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        ) }
                    />
                    <Button type="submit">حفظ</Button>
                </form>
            </Form>
            <Separator orientation='vertical' />
            <Table className='mt-16 w-3/4 m-auto'>
                <TableCaption>الخزينة</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>اسم العملة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>الخيارات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        getFunds.data?.map((fund) => (
                            <TableRow key={ fund.id }>
                                <TableCell>{ fund.currency }</TableCell>
                                <TableCell>{ Number(fund.amount) }</TableCell>
                                <TableCell className='bg-red-500 w-24 m-auto  rounded-xl' onClick={ () => deleteFunds.mutateAsync({ id: fund.id }) }>حذف</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </PageLayout >
    );
}
