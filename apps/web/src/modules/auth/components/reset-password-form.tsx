"use client";
import { CheckIcon, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema, type ResetPasswordSchemaT } from "../schemas";
import { OTPInput } from "@/components/otp-input";
import { PasswordInput } from "@/components/ui/password-input";

export function ResetPasswordForm() {
  const toastId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const [otpCode, setOtpCode] = useState("");
  const [hasOtpError, setHasOtpError] = useState(false);

  const form = useForm<ResetPasswordSchemaT>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });

  const maskEmail = (email: string) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const maskedLocal = local[0] + "***" + (local.length > 1 ? local[local.length - 1] : "");
    return `${maskedLocal}@${domain}`;
  };

  const handleResetPassword = async (values: ResetPasswordSchemaT) => {
    try {
      if (!email) {
        toast.error("Email address missing", {
          id: toastId,
          description: "Please return to the forgot password page and try again."
        });
        return;
      }

      if (!otpCode || otpCode.length !== 6) {
        toast.error("Please enter the verification code", { id: toastId });
        setHasOtpError(true);
        return;
      }

      toast.loading("Resetting password...", { id: toastId });

      const result = await authClient.emailOtp.resetPassword({
        email,
        otp: otpCode,
        password: values.newPassword,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success("Password reset successfully!", { 
        id: toastId,
        description: "You can now sign in with your new password."
      });
      
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
    } catch (err) {
      const error = err as Error;
      console.error("[ResetPassword] Error:", error);

      if (error.message.toLowerCase().includes("invalid") ||
          error.message.toLowerCase().includes("incorrect")) {
        toast.error("Invalid verification code", {
          id: toastId,
          description: "Please check the code and try again."
        });
        setHasOtpError(true);
      } else if (error.message.toLowerCase().includes("expired")) {
        toast.error("Code has expired", {
          id: toastId,
          description: "Please request a new verification code."
        });
        setHasOtpError(true);
      } else {
        toast.error(`Failed: ${error.message}`, { id: toastId });
      }
    }
  };

  if (!email) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-card/90 shadow-sm p-5">
        <h1 className="text-sm font-semibold mb-1">Email Address Required</h1>
        <p className="text-xs text-muted-foreground mb-4">
          Please return to the forgot password page to request a code.
        </p>
        <Button asChild className="w-full" size="sm">
          <Link href="/forgot-password">Go to Forgot Password</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <div className="rounded-xl border border-border bg-card">
            {/* Icon + heading */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800 text-center">
              <div className="mx-auto w-9 h-9 rounded-lg bg-muted flex items-center justify-center mb-3">
                <KeyRound className="text-foreground" style={{ width: 18, height: 18 }} />
              </div>
              <h1 className="text-base font-semibold tracking-tight text-foreground">
                Reset Password
              </h1>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Enter the 6-digit code sent to{" "}
                <strong className="text-foreground font-medium">{maskEmail(email)}</strong>{" "}
                and create a new password
              </p>
            </div>

            {/* Form body */}
            <div className="px-5 py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleResetPassword)}>
                  <div className="space-y-4">
                    {/* OTP */}
                    <div className="space-y-1.5">
                      <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Verification Code
                      </FormLabel>
                      <OTPInput
                        length={6}
                        onComplete={(code) => {
                          setOtpCode(code);
                          setHasOtpError(false);
                        }}
                        disabled={form.formState.isSubmitting}
                        error={hasOtpError}
                      />
                      {hasOtpError && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-500 dark:text-red-400 text-center"
                        >
                          Invalid code. Please try again.
                        </motion.p>
                      )}
                    </div>

                    {/* New Password */}
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">New Password</FormLabel>
                          <FormControl>
                            <PasswordInput
                              placeholder="Enter new password"
                              className="h-9 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Confirm Password</FormLabel>
                          <FormControl>
                            <PasswordInput
                              placeholder="Confirm new password"
                              className="h-9 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Submit */}
                    <div className="pt-1 space-y-3">
                      <Button
                        type="submit"
                        className="w-full h-9 text-sm"
                        loading={form.formState.isSubmitting}
                        icon={form.formState.isSubmitSuccessful && <CheckIcon />}
                      >
                        Reset Password
                      </Button>
                      <div className="text-center">
                        <Link
                          href="/forgot-password"
                          className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
                        >
                          Need a new code?
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </motion.div>
  );
}
