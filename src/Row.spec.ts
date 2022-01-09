import { Row as VR, extract, extend, mapOr } from './Row'
import { EQ, StrictEquals } from '../spec/Equals.spec'

type ID = typeof ID
const ID = "id" as const

type Row = {
  a: { value: string }
  b: { value: number }
  c: { value: number }
}

type Col
  = { id: "a", type: "string" }
  | { id: "b", type: "number" }
  | { id: "c", type: "number" }

const cols: { [id in Col['id']]: Extract<Col, { id: id }> } = {
  a: { id: "a", type: "string" },
  b: { id: "b", type: "number" },
  c: { id: "c", type: "number" },
}

const row: Row = {
  a: { value: "eyy" },
  b: { value: 420 },
  c: { value: 69 }
}

describe('Row', () => {
  describe("extract", () => {
    it("Narrows result if variant is known", () => {
      const res = extract({...cols.a, $tag: ID}, row)
      const typeEquals
        : StrictEquals<
          typeof res,
          { $tag: ID, id: "a", value: string }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", value: "eyy"})
    })

    it("Distributes result if variant is unknown", () => {
      const res = extract({...(cols.a as Col), $tag: ID}, row)
      const typeEquals
        : StrictEquals<
          typeof res,
          | { $tag: ID, id: "a", value: string }
          | { $tag: ID, id: "b", value: number }
          | { $tag: ID, id: "c", value: number }
        > = EQ
      expect(res).toMatchObject({$tag: ID, id: "a", value: "eyy"})
    })
  })

  describe("extend", () => {
    it("Narrows result if variant is known", () => {
      const res = extend({...cols.a, $tag: ID}, row)
      const typeEquals
        : StrictEquals<
          typeof res,
          { $tag: "id", id: "a", type: "string", value: string }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", type: "string", value: "eyy"})
    })

    it("Distributes result if variant is unknown", () => {
      const res = extend({...(cols.a as Col), $tag: ID}, row)
      const typeEquals
        : StrictEquals<
          typeof res,
          | { $tag: ID, id: "a", type: "string", value: string }
          | { $tag: ID, id: "b", type: "number", value: number }
          | { $tag: ID, id: "c", type: "number", value: number }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", type: "string", value: "eyy"})
    })
  })

  // describe('mapOr', () => {
  //   it("Narrows return value if variant is known", () => {
  //     const res = mapOr({
  //       a: () => 1,
  //       b: () => "a",
  //       c: () => true,
  //     }, (): null => null)({
  //       $tag: "id",
  //       ...cols.a
  //     })
  //     const test
  //       : StrictEquals<
  //         typeof res,
  //         { $tag: "id", id: "a", result: number }
  //       > = EQ
  //     expect(res).toMatchObject({ $tag: "id", id: "a", result: 1 })
  //   })

  //   it("Distributes return value if variant is unknown", () => {
  //     const res = mapOr({
  //       a: () => 1,
  //       b: () => "a",
  //       c: () => true,
  //     }, (): null => null)({
  //       $tag: "id",
  //       ...(cols.a as Col)
  //     })
  //     const test
  //       : StrictEquals<
  //         typeof res,
  //         | { $tag: "id", id: "a", result: number }
  //         | { $tag: "id", id: "b", result: string }
  //         | { $tag: "id", id: "c", result: boolean }
  //       > = EQ
  //     expect(res).toMatchObject({ $tag: "id", id: "a", result: 1 })
  //   })

  //   it("Returns fallback value if variant is unhandled", () => {
  //     const fn = mapOr({
  //       a: () => 1,
  //       b: () => "a",
  //       c: () => true,
  //     }, (): null => null)
  //     const res = fn({
  //       $tag: "type",
  //       ...cols.a
  //     })
  //     const test: StrictEquals<typeof res, null> = EQ
  //     expect(res).toBe(null)
  //   })
  // })
})
