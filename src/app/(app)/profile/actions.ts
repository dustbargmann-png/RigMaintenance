"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function changePassword(formData: FormData) {
  const password = formData.get("password") as string;
  if (!password || password.length < 6) {
    redirect(`/profile?error=${encodeURIComponent("Password must be at least 6 characters")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/profile?success=1");
}
