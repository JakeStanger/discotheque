export type UpdatePartial<T> = Omit<T, 'createdAt' | 'updatedAt'>;

interface ICrud<TData, TUnique, TWhere> {
  getAll: (where?: TWhere) => Promise<TData[]>;
  getById: (id: TUnique) => Promise<TData>;
  add: (data: UpdatePartial<TData>) => Promise<TData>;
  update: (id: TUnique, data: Partial<UpdatePartial<TData>>) => Promise<TData>;
  delete: (id: TUnique) => void;
}

export default ICrud;
