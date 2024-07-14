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
import { api } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PageLayout from '@/components/PageLayout';
import toast, { Toaster } from 'react-hot-toast';
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
const formSchema = z.object({
    amount: z.string(),
    currencySold: z.string(),
    currencyBought: z.string(),
    exchangeRate: z.string(),
    date: z.string(),
    favoriteCustomerId: z.string().optional(),
    exchangeId: z.string(),
});

export default function Index()
{
    const [favoriteCustomerState, setFavoriteCustomerState] = React.useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
            currencySold: "",
            currencyBought: "",
            exchangeRate: '',
            date: new Date().toISOString(),
            favoriteCustomerId: "",
            exchangeId: "",
        },
    });

    const { data: sessionData } = useSession();
    console.log(sessionData);
    const createTransaction = api.transactions.create.useMutation();
    const getFavoriteCustomer = api.favoriteCustomer.getAll.useQuery({
        exchangeId: sessionData?.user?.exchangeId ?? ""
    });
    const getFunds = api.funds.getAll.useQuery({

        exchangeId: sessionData?.user?.exchangeId ?? ""
    });

    const getTransactions = api.transactions.getAll.useQuery({
        exchangeId: sessionData?.user?.exchangeId ?? ""
    });
    async function onSubmit(values: z.infer<typeof formSchema>)
    {
        console.log(values);
        if (sessionData?.user?.exchangeId)
            await createTransaction.mutateAsync({
                amount: Number(values.amount),
                currencySold: values.currencySold,
                currencyBought: values.currencyBought,
                exchangeRate: Number(values.exchangeRate),
                date: new Date(values.date),
                favoriteCustomerId: values.favoriteCustomerId,
                exchangeId: sessionData?.user?.exchangeId,

            }).then((res) =>
            {
                toast.success("تمت العملية بنجاح");
                form.reset();
            })
                .catch((err) =>
                {
                    toast.error('لقد حدث خطأ ما');
                });
    }

    return (
        <PageLayout title="المعاملات">
            <Toaster />
            <Form { ...form }>
                <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8 ">
                    <div className="flex flex-wrap w-4/5 gap-x-16 gap-y-4">

                        <FormField
                            control={ form.control }
                            name="currencySold"
                            render={ ({ field }) => (
                                <FormItem>
                                    <FormLabel>العملة المباعة</FormLabel> {/* Arabic for 'Currency Sold' */ }
                                    <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="العملة المباعة" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                getFunds.data?.map((fund) => (
                                                    <SelectItem key={ fund.id } value={ fund.currency }>
                                                        { fund.currency }
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={ form.control }
                            name="amount"
                            render={ ({ field }) => (
                                <FormItem>
                                    <FormLabel>القيمة</FormLabel>
                                    <FormControl>
                                        <Input placeholder="القيمة" { ...field } type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={ form.control }
                            name="currencyBought"
                            render={ ({ field }) => (
                                <FormItem>
                                    <FormLabel>العملة المشتراة</FormLabel>
                                    <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="العملة المشتراة" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                getFunds.data?.map((fund) => (
                                                    <SelectItem key={ fund.id } value={ fund.currency }>
                                                        { fund.currency }
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={ form.control }
                            name="exchangeRate"
                            render={ ({ field }) => (
                                <FormItem>
                                    <FormLabel>سعر الصرف</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ادخل سعر الصرف" { ...field } type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />

                        <FormField
                            control={ form.control }
                            name="date"
                            render={ ({ field }) => (
                                <FormItem>
                                    <FormLabel>التاريخ</FormLabel>
                                    <FormControl>
                                        <Input type='date' defaultValue={ new Date().toISOString() }  { ...field } />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                    </div>

                    <div className="flex flex-col gap-4">

                        <div className="items-top flex gap-2 space-x-2">
                            <Checkbox
                                checked={ favoriteCustomerState }
                                onCheckedChange={ () => setFavoriteCustomerState(!favoriteCustomerState) }
                            />
                            <div className="grid gap-1.5  leading-none">
                                <label
                                    htmlFor="terms1"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    عميل الدائم
                                </label>

                            </div>
                        </div>
                        <FormField
                            control={ form.control }
                            name="favoriteCustomerId"
                            disabled={ !favoriteCustomerState }
                            render={ ({ field }) => (
                                <FormItem className='w-[180px]'>
                                    <FormLabel>العميل الدائم</FormLabel> {/* Arabic for 'Favorite Customer ID' */ }
                                    <Select disabled={ !favoriteCustomerState }
                                        onValueChange={ field.onChange } defaultValue={ field.value }>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="العميل الدائم" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                getFavoriteCustomer.data?.map((customer) => (
                                                    <SelectItem key={ customer.id } value={ customer.id }>
                                                        { `${customer.firstName} ${customer.lastName}` }
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                    </div>

                    <Button type="submit">حفظ</Button>
                </form>
            </Form>
            <Table>
                <TableCaption>المعاملات</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>العملة المباعة</TableHead>
                        <TableHead>القيمة</TableHead>
                        <TableHead>سعر الصرف</TableHead>
                        <TableHead>العملة المشتراة</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>العميل الدائم</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        getTransactions.data?.map((transaction) => (
                            <TableRow key={ transaction.id }>
                                <TableCell>{ transaction.currencySold }</TableCell>
                                <TableCell>{ Number(transaction.amount) }</TableCell>
                                <TableCell>{ Number(transaction.exchangeRate) }</TableCell>
                                <TableCell>{ transaction.currencyBought }</TableCell>
                                <TableCell>{ transaction.date.toISOString() }</TableCell>
                                <TableCell>{ transaction.FavoriteCustomer?.firstName + " " + transaction.FavoriteCustomer?.lastName }</TableCell>
                            </TableRow>

                        ))
                    }
                </TableBody>
            </Table>
        </PageLayout>
    );
}