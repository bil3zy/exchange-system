import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const favoriteCustomerRouter = createTRPCRouter({
    create: protectedProcedure.input(z.object({
        firstName: z.string(),
        lastName: z.string(),
        phone: z.string(),
        exchangeId: z.string(),

    })).mutation(({ ctx, input }) =>
    {
        return ctx.db.favoriteCustomer.create({
            data: {
                firstName: input.firstName,
                lastName: input.lastName,
                phone: input.phone,
                exchangeId: input.exchangeId
            }
        });
    }),
    getAll: protectedProcedure.input(z.object({
        exchangeId: z.string(),
    })).query(({ ctx, input }) =>
    {
        return ctx.db.favoriteCustomer.findMany({
            where: {
                exchangeId: input.exchangeId
            }
        });
    }),
});