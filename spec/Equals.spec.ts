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

describe("StrictEqual", () => {
  it("number", () => {
    const eq: StrictEquals<1, 1> = EQ
    // @ts-expect-error Type 'any' is not assignable to type 'never'.
    const neq: StrictEquals<1, 2> = EQ
  })

  it("string", () => {
    const eq0: StrictEquals<"a", "a"> = EQ
    const eq1: StrictEquals<"a" | "b", "b" | "a"> = EQ
    // @ts-expect-error Type 'any' is not assignable to type 'never'.
    const neq0: StrictEquals<"a", "b"> = EQ
    // @ts-expect-error Type 'any' is not assignable to type 'never'.
    const neq1: StrictEquals<"a" | "b", "b"> = EQ
    // @ts-expect-error Type 'any' is not assignable to type 'never'.
    const neq2: StrictEquals<"a", "a" | "b"> = EQ
  })

  it("objects", () => {
    const eq: StrictEquals<{ a: number }, { a: number }> = EQ
    // @ts-expect-error Type 'any' is not assignable to type 'never'.
    const neq0: StrictEquals<{ a: number }, { b: number }> = EQ
    // @ts-expect-error Type 'any' is not assignable to type 'never'.
    const neq1: StrictEquals<{ a: number }, { a: number, b: number }> = EQ
  })

  // Note: order matters
  it("unions", () => {
    const eq: StrictEquals<{ a: number } | { b: string }, { a: number } | { b: string }> = EQ
    // @ts-expect-error Type 'any' is not assignable to type 'never'.
    const neq0: StrictEquals<{ a: number }| { b: string }, { a: number }> = EQ
    // @ts-expect-error Type 'any' is not assignable to type 'never'.
    const neq1: StrictEquals<{ a: number } | { b: string }, { a: number } | { b: number }> = EQ
    // @ts-expect-error Type 'any' is not assignable to type 'never'.
    const neq2: StrictEquals<{ a: number } | { b: string }, { a: number } | { b: string } | { c: any }> = EQ
  })
})
