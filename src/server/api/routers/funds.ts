import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";


export const fundsRouter = createTRPCRouter({
    getAll: protectedProcedure.input(z.object({
        exchangeId: z.string()
    })).query(({ ctx }) =>
    {
        return ctx.db.funds.findMany({
            where: {
                exchangeId: ctx.session?.user?.exchangeId
            }
        });
    }),
    delete: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(({ ctx, input }) =>
        {
            return ctx.db.funds.delete({
                where: {
                    id: input.id
                }
            });
        }),
    create: protectedProcedure
        .input(z.object({
            amount: z.number(),
            currency: z.string(),
            exchangeId: z.string()
        }))
        .mutation(({ ctx, input }) =>
        {
            return ctx.db.funds.create({
                data: {
                    amount: input.amount,
                    currency: input.currency,
                    exchangeId: input.exchangeId,

                },
            });
        }),
});