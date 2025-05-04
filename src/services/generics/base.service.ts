import { injectable } from "inversify";
import { Model } from "sequelize";
import BaseRepository from "../../repositories/generics/base.repository";
import { MakeNullishOptional } from "sequelize/types/utils";
import {InternalServerError,NotFoundError} from "../../shared/middlewares/error";

@injectable()
class BaseService<T extends Model> {
  private repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  public async create(data: MakeNullishOptional<T["_creationAttributes"]>): Promise<T> {
    return await this.repository.create(data);
  }

  public async getById(id: number): Promise<T> {
    const resource = await this.repository.getById(id);
    if (resource === null || resource === undefined) {
      throw new NotFoundError("Recource with this id not found.");
    }
    return resource;
  }

  public async getAll(): Promise<T[]> {
    const resources = await this.repository.getAll();
    if (!resources) throw new InternalServerError("Erro interno: o recurso não pôde ser retornado!");
    return resources;
  }

  public async update(id: number, data: Partial<T>): Promise<[number]> {
    return await this.repository.update(id, data);
  }

  public async delete(id: number): Promise<void> {
    await this.getById(id);
    const linhasAfetadas = await this.repository.delete(id);
    if (linhasAfetadas < 1) throw new InternalServerError("Erro interno: o recurso não pôde ser deletado!");
  }
}

export default BaseService;
