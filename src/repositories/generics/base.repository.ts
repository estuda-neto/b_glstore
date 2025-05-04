import { injectable } from "inversify";
import { Model, ModelStatic, FindOptions, UpdateOptions, DestroyOptions, WhereOptions, FindAndCountOptions, CreationAttributes} from "sequelize";

@injectable()
class BaseRepository<T extends Model> {
    private model: ModelStatic<T>;
    private primaryKey: string;

    constructor(model: ModelStatic<T>) {
        this.model = model;
        this.primaryKey = this.model.primaryKeyAttribute;
    }

    public async create(data: CreationAttributes<T>): Promise<T> {
        return await this.model.create(data);
    }

    public async getById(id: number, options?: FindOptions): Promise<T | null> {
        return await this.model.findByPk(id, options);
    }

    public async getAll(options?: FindOptions): Promise<T[]> {
        return await this.model.findAll(options);
    }

    public async update(id: number, data: Partial<T>, options?: UpdateOptions): Promise<[number]> {
        return await this.model.update(data, { where: { [this.primaryKey]: id } as WhereOptions, ...options});
    }

    public async delete(id: number, options?: DestroyOptions): Promise<number> {
        return await this.model.destroy({ where: { [this.primaryKey]: id } as WhereOptions, ...options});
    }

    public async findWithPagination(limit: number,offset: number,options?: Omit<FindAndCountOptions, "group">): Promise<{ rows: T[]; count: number }> {
        return await this.model.findAndCountAll({ limit, offset, ...options });
    }

    public async findByIds(ids: number[], options?: FindOptions): Promise<T[]> {
        return await this.model.findAll({ where: { id: ids } as WhereOptions, ...options});
    }
}

export default BaseRepository;
