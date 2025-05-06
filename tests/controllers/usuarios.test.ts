import testServer from "../jest.setup";
import AuthServices from "../../src/services/auth.service";
import { TipoUsuario } from "../../src/shared/enums/tipousuario";
import { container } from "../../src/configs/container";

describe("UsuariosController", () => {
  let tokenerror: string;
  let tokenadmin: string;

  beforeAll(() => {
    const authService = container.get(AuthServices);
    tokenerror = authService.generateToken("1", TipoUsuario.FUNCIONARIO, "web");
    tokenadmin = authService.generateToken("1", TipoUsuario.ADMIN, "web");
  });

  test("GET /usuarios - should return 401 without token", async () => {
    const response = await testServer.get("/usuarios");
    expect(response.status).toBe(401);
  });

  test("GET /usuarios - should return 403 for non-admin user", async () => {
    const response = await testServer.get("/usuarios").set("Authorization", `Bearer ${tokenerror}`);
    expect(response.status).toBe(403);
  });

  test("GET /usuarios - should return an array of users for admin", async () => {
    const response = await testServer.get("/usuarios").set("Authorization", `Bearer ${tokenadmin}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

});
