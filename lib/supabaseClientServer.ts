import { Database } from "@bitetechnology/bite-types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const supabase = createServerComponentClient<Database>({ cookies });

export default supabase;
