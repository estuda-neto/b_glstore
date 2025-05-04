import testServer from "../jest.setup";
import AuthServices from "../../src/services/auth.service";
import { TipoUsuario } from "../../src/shared/enums/tipousuario";
import { container } from "../../src/configs/container";

describe("UsuariosController", () => {

  let tokenerror: string;

  beforeAll(() => {
    const authService = container.get(AuthServices);
    tokenerror = authService.generateToken("1", TipoUsuario.FUNCIONARIO, "web");
  });

  test("GET /usuarios - should return 401 without token", async () => {
    const response = await testServer.get("/usuarios");
    expect(response.status).toBe(401);
  });

  test("GET /usuarios - should return 403 for non-admin user", async () => {
    const response = await testServer.get("/usuarios").set("Authorization", `Bearer ${tokenerror}`);
    expect(response.status).toBe(403);  // Ou o status de erro apropriado
  });
  
});
