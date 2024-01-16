import { Database } from "@bitetechnology/bite-types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient<Database>();

export default supabase;
