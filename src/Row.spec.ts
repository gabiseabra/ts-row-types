import { Row as VR, extract, extend, map, extendMaybe } from './Row'
import { EQ, StrictEquals } from '../spec/Equals.spec'
import { Variant } from './Variant'

type ID = typeof ID
const ID = "id" as const

type TYPE = typeof TYPE
const TYPE = "type" as const

type Row = {
  a: { value: string }
  b: { value: number }
  c: { value: number }
}

type Col
  = { id: "a", type: "string" }
  | { id: "b", type: "number" }
  | { id: "c", type: "number" }

const cols = {
  a: { id: "a", type: "string" },
  b: { id: "b", type: "number" },
  c: { id: "c", type: "number" },
} as const

const row: Row = {
  a: { value: "eyy" },
  b: { value: 420 },
  c: { value: 69 }
}

describe('Row', () => {
  describe("extract", () => {
    it("Narrows result if variant is known", () => {
      const res = extract({$tag: ID, ...cols.a}, row)
      const typeEquals
        : StrictEquals<
          typeof res,
          { $tag: ID, id: "a", value: string }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", value: "eyy"})
    })

    it("Distributes result if variant is unknown", () => {
      const res = extract({$tag: ID, ...(cols.a as Col)}, row)
      const typeEquals
        : StrictEquals<
          typeof res,
          | { $tag: ID, id: "a", value: string }
          | { $tag: ID, id: "b", value: number }
          | { $tag: ID, id: "c", value: number }
        > = EQ
      expect(res).toMatchObject({$tag: ID, id: "a", value: "eyy"})
    })

    it("Doesn't type check if tags don't match", () => {
      expect(() => {
        // @ts-expect-error
        const res = extract({$tag: TYPE, ...(cols.a as Col)}, row)
      }).toThrow()
    })
  })

  describe("extend", () => {
    it("Narrows result if variant is known", () => {
      const res = extend({$tag: ID, ...cols.a}, row)
      const typeEquals
        : StrictEquals<
          typeof res,
          { $tag: ID, id: "a", type: "string", value: string }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", type: "string", value: "eyy"})
    })

    it("Distributes result if variant is unknown", () => {
      const res = extend({$tag: ID, ...(cols.a as Col)}, row)
      const typeEquals
        : StrictEquals<
          typeof res,
          | { $tag: ID, id: "a", type: "string", value: string }
          | { $tag: ID, id: "b", type: "number", value: number }
          | { $tag: ID, id: "c", type: "number", value: number }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", type: "string", value: "eyy"})
    })

    it("Doesn't type check if tags don't match", () => {
      expect(() => {
        // @ts-expect-error
        const res = extend({$tag: TYPE, ...(cols.a as Col)}, row)
      }).toThrow()
    })
  })

  describe('map', () => {
    it("Narrows return value if variant is known", () => {
      const res = map({$tag: ID, ...cols.a}, {
        a: () => 1,
        b: () => "a",
        c: () => true,
      })
      const test
        : StrictEquals<
          typeof res,
          { $tag: ID, id: "a", result: number }
        > = EQ
      expect(res).toMatchObject({ $tag: "id", id: "a", result: 1 })
    })

    it("Distributes return value if variant is unknown", () => {
      const res = map({$tag: ID, ...(cols.a as Col)}, {
        a: () => 1,
        b: () => "a",
        c: () => true,
      })
      const test
        : StrictEquals<
          typeof res,
          | { $tag: ID, id: "a", result: number }
          | { $tag: ID, id: "b", result: string }
          | { $tag: ID, id: "c", result: boolean }
        > = EQ
      expect(res).toMatchObject({ $tag: "id", id: "a", result: 1 })
    })

    it("Doesn't type check if tags don't match", () => {
      expect(() => { 
        const res = map({$tag: TYPE, ...(cols.a as Col)}, {
          // @ts-expect-error
          a: () => 1,
          b: () => "a",
          c: () => true,
        })
      }).toThrow()
    })
  })
})
