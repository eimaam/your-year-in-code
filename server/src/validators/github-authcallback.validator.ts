import z from "zod";

export const githubAuthCallbackSchema = z.object({
    query: z.object({
        code: z
            .string()
            .min(1, 'Code is required')
            .trim()
    })
})