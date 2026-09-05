"use client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function SignoutButton({ className }: Props) {
  const [loading, setLoading] = useState(false);
  const toastId = useId();
  const router = useRouter();

  const handleSignout = async () => {
    try {
      setLoading(true);
      toast.loading("User signing out...", { id: toastId });

      const result = await authClient.signOut();

      if (result?.error) {
        throw new Error(result.error.message);
      }

      toast.success("Signed out successfully!", { id: toastId });
      router.refresh();
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      icon={<LogOutIcon />}
      loading={loading}
      className={cn("", className)}
      onClick={handleSignout}
    >
      Signout
    </Button>
  );
}
