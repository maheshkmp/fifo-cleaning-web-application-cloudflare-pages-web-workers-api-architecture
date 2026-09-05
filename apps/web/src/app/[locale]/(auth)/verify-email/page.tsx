"use client";

import { useEffect, useState, useId, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";

export const runtime = "edge";

import { authClient } from "@/lib/auth-client";
import { OTPInput } from "@/components/otp-input";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const toastId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [isVerifying, setIsVerifying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setCanResend(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Mask email for privacy
  const maskEmail = (email: string) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const maskedLocal = local[0] + "***" + (local.length > 1 ? local[local.length - 1] : "");
    return `${maskedLocal}@${domain}`;
  };

  const handleVerify = async (code: string) => {
    if (!email) {
      toast.error("Email address missing", {
        description: "Please return to the signup page and try again.",
      });
      return;
    }

    setIsVerifying(true);
    setHasError(false);

    try {
      toast.loading("Verifying code...", { id: toastId });

      const result = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      console.log("[VerifyEmail] Verification result:", {
        hasError: !!result?.error,
        hasData: !!result?.data,
        hasUser: !!result?.data?.user,
        hasToken: !!result?.data?.token
      });

      if (result.error) {
        throw new Error(result.error.message || "Verification failed");
      }

      // Email verified successfully - check if we have a session now
      console.log("[VerifyEmail] Email verification successful, checking session...");
      
      // Wait a moment for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to get the current session
      const sessionResult = await authClient.getSession();
      
      console.log("[VerifyEmail] Session check result:", {
        hasSession: !!sessionResult?.data?.session,
        hasUser: !!sessionResult?.data?.user
      });

      if (sessionResult?.data?.session) {
        // Session exists - user is signed in
        toast.success("Email verified!", {
          id: toastId,
          description: "Welcome to GhostCod! You're now signed in.",
        });

        // Redirect to home page
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        // No session found - redirect to signin
        console.warn("[VerifyEmail] No session found after verification");
        toast.success("Email verified!", {
          id: toastId,
          description: "Please sign in to continue.",
        });
        setTimeout(() => {
          window.location.href = "/signin?email=" + encodeURIComponent(email);
        }, 1500);
      }
    } catch (err) {
      const error = err as Error;
      console.error("[VerifyEmail] Error:", error);

      setHasError(true);
      setFailedAttempts((prev) => prev + 1);

      let errorMessage = "Incorrect code, please try again";
      let errorDescription = "";

      if (error.message.toLowerCase().includes("expired")) {
        errorMessage = "Code has expired";
        errorDescription = "Please request a new verification code.";
        setCanResend(true);
      } else if (error.message.toLowerCase().includes("rate limit") ||
                 error.message.toLowerCase().includes("too many")) {
        errorMessage = "Too many attempts";
        errorDescription = "Please wait before trying again.";
      }

      toast.error(errorMessage, {
        id: toastId,
        description: errorDescription,
      });

      // Auto-trigger resend after 5 failed attempts
      if (failedAttempts >= 4) {
        toast.info("Too many failed attempts", {
          description: "Sending you a new code...",
        });
        handleResend();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);

    try {
      toast.loading("Sending new code...", { id: toastId });

      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to send code");
      }

      toast.success("New code sent!", {
        id: toastId,
        description: "Check your inbox for the new verification code.",
      });

      // Reset timer and state
      setTimeLeft(600);
      setCanResend(false);
      setFailedAttempts(0);
      setHasError(false);
    } catch (err) {
      const error = err as Error;
      console.error("[VerifyEmail] Resend error:", error);

      toast.error("Failed to send code", {
        id: toastId,
        description: error.message,
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-card/90 shadow-sm p-5">
        <h1 className="text-sm font-semibold mb-1">Email required</h1>
        <p className="text-xs text-muted-foreground mb-4">
          Please return to the signup page to create your account.
        </p>
        <Button asChild className="w-full" size="sm">
          <Link href="/signup">Go to Sign Up</Link>
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
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </Link>
          <span className="text-xs font-medium text-muted-foreground">Verify Email</span>
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-5 space-y-4">
          {/* Icon + heading */}
          <div>
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-2.5">
              <Mail className="text-violet-600 dark:text-violet-400" style={{ width: 16, height: 16 }} />
            </div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">Enter your code</h1>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              We sent a 6‑digit code to{" "}
              <span className="font-medium text-foreground">{maskEmail(email)}</span>
            </p>
          </div>

          {/* OTP */}
          <div className="space-y-2">
            <OTPInput
              length={6}
              onComplete={handleVerify}
              disabled={isVerifying}
              error={hasError}
            />
            {hasError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 dark:text-red-400 text-center"
              >
                Invalid code — please try again.
              </motion.p>
            )}
          </div>

          {/* Timer + resend */}
          <div className="rounded-lg border border-gray-100 dark:border-gray-800 bg-muted/30 px-3 py-2 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {timeLeft > 0 ? (
                <>
                  Expires in{" "}
                  <span className={`font-semibold tabular-nums ${timeLeft < 60 ? "text-red-500" : "text-foreground"}`}>
                    {formatTime(timeLeft)}
                  </span>
                </>
              ) : (
                <span className="text-red-500 font-medium">Code expired</span>
              )}
            </p>
            <button
              onClick={handleResend}
              disabled={!canResend || isResending}
              className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline disabled:opacity-35 disabled:no-underline flex items-center gap-1 transition-opacity"
            >
              <RefreshCw className={`w-3 h-3 ${isResending ? "animate-spin" : ""}`} />
              {isResending ? "Sending…" : "Resend"}
            </button>
          </div>

          {/* Wrong email */}
          <p className="text-center text-xs text-muted-foreground">
            Wrong email?{" "}
            <Link href="/signup" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
              Go back
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground/70">
        Tip: Check spam or promotions if you don&apos;t see the email.
      </p>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-card/90 p-8 text-center">
        <p className="text-xs text-muted-foreground">Loading...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
