import { Sequelize } from "sequelize";
import path from "path";
import fs from "fs";

const sequelize = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "root",
    password: "root",
    database: "glstore_api",
});

const modelFiles = fs.readdirSync(path.join(__dirname, "../../models")).filter((file) =>(file.endsWith(".ts") || file.endsWith(".js")) &&file !== "index.ts");

const setupAssociations = async () => {
    try {
        await Promise.all(modelFiles.map((file) => import(path.join(__dirname, `../../models/${file}`))));

        const { setupRelationships } = await import(
            path.join(__dirname, "../../models/index")
        );
        setupRelationships();
    } catch (error) {
        console.error("Erro ao configurar associações:", error);
        process.exit(1);
    }
};

setupAssociations();

export default sequelize;
