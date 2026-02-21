import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    full_name: z.string().min(2, "Full name is required").max(50, "Full name too long"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const articleSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
    excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(300, "Excerpt too long"),
    content: z.string().min(1, "Content is required"),
    category_id: z.string().min(1, "Please select a category"),
    featured_image: z.string().optional(),
    tags: z.string().optional(),
    meta_description: z.string().max(160, "Meta description must be under 160 characters").optional(),
});

export const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters"),
    description: z.string().optional(),
});

export const profileSchema = z.object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    bio: z.string().max(500, "Bio must be under 500 characters").optional(),
    location: z.string().max(100, "Location too long").optional(),
    paypal_me_link: z.string().optional(),
});

export const passwordChangeSchema = z.object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(6, "New password must be at least 6 characters"),
    confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
});
