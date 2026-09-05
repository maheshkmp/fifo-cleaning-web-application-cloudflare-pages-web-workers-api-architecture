import { getDatabaseAdapter, initDatabase } from "./index";

const main = async () => {
  try {
    const db = initDatabase(process.env.DATABASE_URL!);
    const adapter = getDatabaseAdapter();
    const { migrate } =
      adapter === "neon"
        ? await import("drizzle-orm/neon-http/migrator")
        : await import("drizzle-orm/node-postgres/migrator");

    await migrate(db as never, { migrationsFolder: "src/database/migrations" });

    console.log("Migration completed");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

main();
