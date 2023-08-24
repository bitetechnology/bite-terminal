import LoginForm from "@/components/LoginForm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
      <Head>
        <title>Bite terminal | login</title>
        <meta property="og:title" content="Bite terminal | login" key="title" />
      </Head>
      <LoginForm />;
    </>
  );
}
