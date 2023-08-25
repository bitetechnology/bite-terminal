import LoginForm from "@/components/LoginForm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    redirect("/orders");
  }

  return (
    <>
      <LoginForm />;
    </>
  );
}
