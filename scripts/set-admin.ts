import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local
const envFile = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8");
const envVars: Record<string, string> = {};
envFile.split("\n").forEach((line) => {
  const parts = line.trim().split("=");
  if (parts.length >= 2 && !line.startsWith("#")) {
    envVars[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
});

const supabaseUrl = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const serviceKey = envVars["SUPABASE_SERVICE_ROLE_KEY"] || envVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  const email = process.argv[2] || "mverdiansyah00@gmail.com";
  console.log(`Promoting ${email} to admin role via service key...`);

  const { data, error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("email", email)
    .select();

  if (error) {
    console.error("Error promoting user:", error.message);
  } else if (!data || data.length === 0) {
    console.log(`User with email ${email} not found.`);
  } else {
    console.log(`✅ Success! User ${data[0].full_name} (${data[0].email}) is now an ADMIN.`);
  }
}

main().catch(console.error);
