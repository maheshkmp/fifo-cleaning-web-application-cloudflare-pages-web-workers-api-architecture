"use client";

import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";
import { Suspense } from "react";

export const runtime = "edge";

export default function SigninPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
