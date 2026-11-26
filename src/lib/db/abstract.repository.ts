import { Model, QueryFilter, QueryOptions } from "mongoose";

export abstract class AbstractRepository<T> {
    constructor(private readonly model: Model<T, any, any, any, any>) {}

    async create(data: Partial<T>) {
        return this.model.create(data);
    }

    async update(
        filter: QueryFilter<T>,
        data: Partial<T>,
        options?: QueryOptions
    ) {
        return this.model.findOneAndUpdate(filter, data, options);
    }

    async delete(filter: QueryFilter<T>) {
        return this.model.deleteOne(filter);
    }

    async getOne(filter: QueryFilter<T>) {
        return this.model.findOne(filter);
    }
}