import { initDatabase } from "./src/database";
import { sql } from "drizzle-orm";

const main = async () => {
    const db = initDatabase(process.env.DATABASE_URL!);
    const result = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    console.log(result.rows);
    process.exit(0);
}

main();
