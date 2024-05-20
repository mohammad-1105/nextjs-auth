"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/schema/loginSchema";
import Link from "next/link";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  // define form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // handle submit
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post<ApiResponse>("/api/users/login", data);

      toast.success("Success", {
        description: response.data.message,
        action: {
          label: "close",
          onClick: () => console.log("close"),
        },
      });
      
      // clear login form 
      form.reset()

      // redirect to dashboard
      router.push("/dashboard");
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Failed", {
        description: axiosError?.response?.data.message,
        action: {
          label: "close",
          onClick: () => console.log("close"),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto border p-3 bg-white text-black">
      <div className="mb-5">
     <h1 className="text-2xl font-bold text-center">Login</h1>
     <p className="text-center">Don&apos;t have an account ? <Link className="text-blue-500" href={"/register"}>register</Link></p>
     </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button aria-disabled={isSubmitting} type="submit">
            {isSubmitting ? "please wait..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
