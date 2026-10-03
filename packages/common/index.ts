import z from "zod";


export const registerSchema = z.object({
    email:z.email(),
    password : z.string().min(3, "passoword is too short")
})

export const loginSchema = z.object({
    email:z.email(),
    password : z.string().min(3, "passoword is too short")
})