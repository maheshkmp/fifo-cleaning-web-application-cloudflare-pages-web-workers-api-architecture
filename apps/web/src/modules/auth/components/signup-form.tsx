"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
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
import { signupSchema, type SignupSchema } from "../schemas";
import { PasswordInput } from "@/components/ui/password-input";
import { trackSignup } from "@/lib/analytics";

interface SignupFormProps {
  type?: "agent" | "user";
}

export function SignupForm({
  className,
  type = "user",
  ...props
}: React.ComponentProps<"div"> & SignupFormProps) {
  const toastId = useId();
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true);
      toast.loading("Redirecting to Google...", { id: toastId });
      
      // Track Google signup attempt
      trackSignup("google");
      
      await authClient.signIn.social({
        provider: "google",
        callbackURL: type === "agent" ? `${window.location.origin}/setup` : `${window.location.origin}/`
      });
    } catch (err) {
      const error = err as Error;
      toast.error("Google sign up failed.", { id: toastId, description: error.message });
      setIsGoogleLoading(false);
    }
  };

  const handleSignup = async (values: SignupSchema) => {
    try {
      toast.loading("Creating your account...", { id: toastId, description: "Please wait a moment." });

      console.log("[Signup] Attempting signup for:", values.email);

      const result = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: "/verify-email", // This won't auto-redirect, we handle it manually
      });

      console.log("[Signup] Result:", {
        hasError: !!result?.error,
        hasData: !!result?.data,
        hasSession: !!(result?.data as any)?.session,
        emailVerified: result?.data?.user?.emailVerified
      });

      if (result?.error) {
        throw new Error(result.error.message);
      }

      // Security check: Ensure no session was created before email verification
      if ((result?.data as any)?.session) {
        console.warn("[Signup] WARNING: Session was created before email verification!");
      }

      // Account created successfully - send OTP verification email
      console.log("[Signup] Account created, sending OTP...");
      
      try {
        const otpResult = await authClient.emailOtp.sendVerificationOtp({
          email: values.email,
          type: "email-verification",
        });

        console.log("[Signup] OTP send result:", {
          hasError: !!otpResult?.error,
          error: otpResult?.error
        });

        if (otpResult?.error) {
          console.error("[Signup] Failed to send OTP:", otpResult.error);
          toast.warning("Account created", {
            id: toastId,
            description: "Please request a new verification code on the next page."
          });
        }
      } catch (otpError) {
        console.error("[Signup] OTP send exception:", otpError);
        toast.warning("Account created", {
          id: toastId,
          description: "Please request a new verification code on the next page."
        });
      }

      toast.success("Account created!", { 
        id: toastId, 
        description: "Please check your email for a verification code." 
      });
      
      // Track successful signup in Google Analytics
      trackSignup("email");
      
      console.log("[Signup] Registration successful, redirecting to verify-email...");
      
      // Redirect to verify-email page with email as query param
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      const error = err as Error;
      console.error("[Signup] Error:", error);
      
      // Provide helpful error messages
      if (error.message.toLowerCase().includes("already exists")) {
        toast.error("Email already registered.", { 
          id: toastId,
          description: "An account with this email already exists. Please sign in instead.",
          action: {
            label: "Sign In",
            onClick: () => router.push("/signin")
          }
        });
      } else {
        toast.error("Sign up failed.", { id: toastId, description: error.message });
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-heading font-bold">
            Create your Fifo account
          </CardTitle>
          <CardDescription className="text-base">
            Sign up to request quotes and track your bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignup)}>
              <div className="grid gap-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleGoogleSignup}
                  disabled={isGoogleLoading || form.formState.isSubmitting}
                >
                  <svg className="size-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
                </Button>
                
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with email
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6">
                  <Button
                    type="submit"
                    className="w-full"
                    loading={form.formState.isSubmitting}
                    icon={form.formState.isSubmitSuccessful && <CheckIcon />}
                  >
                    Sign Up
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {`Already have an account? `}
                  <Link href="/signin" className="underline underline-offset-4">
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="/terms">Terms of Service</a>{" "}
        and <a href="/privacy">Privacy Policy</a>.
      </div>
    </div>
  );
}
