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
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";

import { authClient } from "@/lib/auth-client";
import { signinSchema, type SigninSchemaT } from "../schemas";
import { trackLogin } from "@/lib/analytics";

interface SigninFormProps {
  type?: "agent" | "user";
}

export function SigninForm({
  className,
  // type = "user",
  ...props
}: SigninFormProps & React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SigninSchemaT>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const isInvalidCredentialsError = (message?: string) => {
    if (!message) return false;
    const normalized = message.toLowerCase();
    return (
      normalized.includes("invalid") ||
      normalized.includes("password") ||
      normalized.includes("credentials")
    );
  };

  const showInvalidCredentialsToast = () =>
    toast.error("Invalid email or password.", {
      id: toastId,
      description: "Double-check your credentials and try again.",
      action: {
        label: "Sign Up",
        onClick: () => router.push("/signup")
      }
    });

  const handleGoogleSignin = async () => {
    try {
      setIsGoogleLoading(true);
      toast.loading("Redirecting to Google...", { id: toastId });
      
      // Track Google signin attempt
      trackLogin("google");
      
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`
      });
    } catch (err) {
      const error = err as Error;
      toast.error("Google sign in failed.", { id: toastId, description: error.message });
      setIsGoogleLoading(false);
    }
  };

  const handleSignin = async (values: SigninSchemaT) => {
    try {
      toast.loading("Signing in...", { id: toastId, description: "Please wait a moment." });

      console.log("[Signin] Attempting signin for:", values.email);

      // NOTE: Do NOT try to clear better-auth.session_token via document.cookie.
      // That cookie is HttpOnly — JS cannot read, write, or delete it.
      // Attempting to set it via JS creates a duplicate non-HttpOnly cookie with
      // the same name, which the server then picks up instead of the real one,
      // causing session-null after a successful sign-in.

      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      console.log("[Signin] Result:", {
        hasError: !!result?.error,
        hasData: !!result?.data
      });

      if (result?.error) {
        // Check if error is about unverified email
        const errorMessage = result.error.message || "";
        // Email verification check commented out for now
        /*
        if (errorMessage.toLowerCase().includes("verify") ||
            errorMessage.toLowerCase().includes("not verified")) {
          // Trigger OTP send for unverified user
          try {
            await authClient.emailOtp.sendVerificationOtp({
              email: values.email,
              type: "email-verification",
            });

            toast.info("Please verify your email", {
              id: toastId,
              description: "We've sent a new verification code to your inbox.",
            });

            // Redirect to verify page
            router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
            return;
          } catch (otpErr) {
            console.error("[Signin] Failed to send OTP:", otpErr);
          }
        }
        */

        if (isInvalidCredentialsError(result.error.message)) {
          showInvalidCredentialsToast();
          return;
        }

        throw new Error(result.error.message);
      }

      toast.success("Welcome back!", { id: toastId, description: "You have signed in successfully. Redirecting..." });

      // Track successful login in Google Analytics
      trackLogin("email");

      // Full page reload so the middleware picks up the new session cookie
      // (window.location.href triggers a hard navigation → middleware re-runs → session found)
      // Note: document.cookie won't show the session_token here because it is HttpOnly.
      window.location.href = "/";
    } catch (err) {
      const error = err as Error;

      if (isInvalidCredentialsError(error.message)) {
        showInvalidCredentialsToast();
        return;
      }

      console.error("[Signin] Error:", error);
      toast.error("Sign in failed.", { id: toastId, description: error.message });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-heading font-bold">
            Sign in to Fifo Städfirma
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignin)}>
              <div className="grid gap-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleGoogleSignin}
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
                      <div className="w-full flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-secondary-foreground underline-offset-4 hover:underline"
                        >
                          Forgot Password?
                        </Link>
                      </div>
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
                    Sign In
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
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="/terms">Terms of Service</a>{" "}
        and <a href="/privacy">Privacy Policy</a>.
      </div>
    </div>
  );
}
