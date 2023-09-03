import {Collection, Document, Filter, WithId} from "mongodb";
import {WithPagination, WithPaginationQuery} from "../../types";

/**
 * @Deprecated - перейти на Model и использовать withModelPagination
 *
 * Общий метод для получения значений по фильтру с пагинацией
 * @param collection - коллекция типа T
 * @param dto - формат вывода данных с коллекции по типу O
 * @param filter - фильтр запроса типа T
 * @param query - параметры запроса пагинации
 */
export async function withMongoQueryFilterPagination<T extends Document,O>(
    collection: Collection<T>,
    dto: (input: WithPagination<WithId<T>>) => WithPagination<O>,
    filter: Filter<T>,
    query: WithPaginationQuery<T>
) : Promise<WithPagination<O>> {

    const totalCount: number = await collection.countDocuments(filter)

    const items: WithId<T>[] = await collection.find(filter)
        .sort(query.sortBy, query.sortDirection)
        .skip(Math.max(query.pageNumber - 1, 0) * query.pageSize)
        .limit(query.pageSize)
        .toArray();

    return dto({
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items,
    });
}