import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import usuariosRoutes from "./routes/usuarios.routes";
import pedidosRoutes from "./routes/pedidos.routes";
import produtosRoutes from "./routes/produtos.routes";
import carrinhosRoutes from "./routes/carrinhos.routes";
import categoriasRoutes from "./routes/categorias.routes";
import notificacoesRoutes from "./routes/notificacoes.routes";
import pagamentosRoutes from "./routes/pagamentos.routes";
import colecoesRoutes from "./routes/colecoes.routes";
import sequelize from "./configs/database";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/usuarios", usuariosRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/carrinhos", carrinhosRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/produtos", produtosRoutes);
app.use("/notificacoes", notificacoesRoutes);
app.use("/pagamentos", pagamentosRoutes);
app.use("/colecoes", colecoesRoutes);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GlStore",
      version: "1.0.0",
      description:
        "Uma aplicação backend para gerir dados de um aplicativo expo com RN",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.NODE_ENV !== "test") {
  sequelize.sync({ alter: false }).then(() => {
    console.log("banco sincronizado!");
  });

  app.listen(3000, () => {
    console.log(
      "API rodando no endereço http://localhost:3000 \n e documentação rodadndo em http://localhost:3000/api-docs/"
    );
  });
}

//export instance for test
export default app;
