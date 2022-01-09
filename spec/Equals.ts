// https://github.com/microsoft/TypeScript/issues/13298#issuecomment-885980381
export type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never;

export type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

export const EQ = null

export type Equals<A, B>
  = A extends B
  ? B extends A
  ? typeof EQ : never : never

export type StrictEquals<A, B> = Equals<UnionToTuple<A>, UnionToTuple<B>>
