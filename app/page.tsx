import LoginForm from "@/components/LoginForm";
import Head from "next/head";

export default function Home() {
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
