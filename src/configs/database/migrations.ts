import { Umzug, SequelizeStorage } from "umzug";
import path from "path";
import sequelize from "./index";

const umzug = new Umzug({
    migrations: { glob: path.resolve(__dirname, "../../../migrations/*.ts") },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

export const runMigrations = async () => {
    try {
        console.log("🚀 Rodando migrações...");
        await umzug.up();
        console.log("✅ Migrações concluídas!");
    } catch (error) {
        console.error("❌ Erro ao rodar migrações:", error);
    }
};

export const rollbackMigration = async () => {
    try {
        console.log("🔄 Revertendo última migração...");
        await umzug.down({ to: 0 });
        console.log("✅ Migração revertida!");
    } catch (error) {
        console.error("❌ Erro ao reverter migração:", error);
    }
};

// roda se for executado diretamente
if (require.main === module) {
    const arg = process.argv[2];

    if (arg === "rollback") {
        rollbackMigration();
    } else {
        runMigrations();
    }
}
