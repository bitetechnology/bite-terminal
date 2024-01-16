import LoginForm from "@/components/LoginForm";
import SWRProvider from "@/providers/SWRProvider";

export const dynamic = "force-dynamic";

export default async function Home() {
  return <LoginForm />;
}
