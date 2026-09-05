"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema, type ForgotPasswordSchemaT } from "../schemas";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();

  const form = useForm<ForgotPasswordSchemaT>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const handleForgotPassword = async (values: ForgotPasswordSchemaT) => {
    try {
      toast.loading("Sending verification code...", { id: toastId });

      const result = await authClient.emailOtp.sendVerificationOtp({
        email: values.email,
        type: "forget-password",
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to send code");
      }

      toast.success("Verification code sent!", {
        id: toastId,
        description: "Check your email inbox for the 6-digit code"
      });

      // Redirect to reset-password page with email as query param
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed: ${error.message}`, { id: toastId });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-violet-100 dark:border-violet-900/30 shadow-lg shadow-violet-100/20 dark:shadow-violet-900/10">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-heading font-bold bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-base">
            Enter your email and we'll send you a 6-digit verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleForgotPassword)}>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6">
                  <Button
                    type="submit"
                    className="w-full bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
                    loading={form.formState.isSubmitting}
                    icon={form.formState.isSubmitSuccessful && <CheckIcon />}
                  >
                    Send Code
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {`Don't have an account?`}
                  {` `}
                  <Link href="/signup" className="underline underline-offset-4">
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
