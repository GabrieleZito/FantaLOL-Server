const z = require("zod");

const signUpSchema = z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(10, "At least 10 characters"),
});

module.exports = { signUpSchema };
