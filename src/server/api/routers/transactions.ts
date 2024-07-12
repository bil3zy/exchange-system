import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Currency } from "lucide-react";
import { FaSortAmountDown } from "react-icons/fa";

export const transactionsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            amount: z.number(),
            currencySold: z.string(),
            currencyBought: z.string(),
            exchangeRate: z.number(),
            exchangeId: z.string(),

            favoriteCustomerId: z.string().optional(),
            date: z.date(),
        }))
        .mutation(async ({ ctx, input }) =>
        {

            const positiveFund = await ctx.db.funds.findFirst({
                where: {
                    currency: input.currencyBought,
                    exchangeId: input.exchangeId
                },
            });
            if (!positiveFund?.amount)
            {
                throw new Error('لقد حدث خطأ ما!');
            }
            const updatePositiveFund = await ctx.db.funds.update({
                where: {
                    id: positiveFund?.id
                }, data: {
                    amount: Number(positiveFund?.amount) + input?.amount,
                }
            });

            const negativeFund = await ctx.db.funds.findFirst({
                where: {
                    currency: input.currencySold,
                    exchangeId: input.exchangeId
                }
            });

            if (!negativeFund?.amount)
            {
                throw new Error('لقد حدث خطأ ما!');
            }

            const updateNegativeFund = await ctx.db.funds.update({
                where: {
                    id: negativeFund?.id,
                }, data: {
                    amount: Number(negativeFund?.amount) - (input.amount * input.exchangeRate)
                }
            });

            const transaction = await ctx.db.transactions.create({
                data: {
                    amount: input.amount,
                    currencySold: input.currencySold,
                    currencyBought: input.currencyBought,
                    exchangeRate: input.exchangeRate,

                    favoriteCustomerId: input.favoriteCustomerId,
                    exchangeId: input.exchangeId,
                    date: input.date,
                },
            });
            return { transaction, updatePositiveFund, updateNegativeFund, positiveFund, negativeFund };
        }),
    getAll: protectedProcedure.input(z.object({
        exchangeId: z.string()
    })).query(({ ctx, input }) =>
    {
        return ctx.db.transactions.findMany({
            where: {
                exchangeId: input.exchangeId
            }, include: {
                FavoriteCustomer: true
            }
        });
    }),
});