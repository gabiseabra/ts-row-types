import { Row as VR, extract, extend, map, extendMaybe, extractMaybe, pick, lookup } from './Row'
import { EQ, StrictEquals } from '../spec/Equals.spec'

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
  describe("lookup", () => {
    it("With shared key", () => {
      const res = lookup({$tag: ID, ...cols.a}, { a: "lmao" })
      const typeEquals: StrictEquals<typeof res, string> = EQ
      expect(res).toBe("lmao")
    })

    it("Without shared key", () => {
      const t1 = lookup({$tag: ID, ...cols.b}, { a: "lmao" })
      const typeEquals1: StrictEquals<typeof t1, unknown> = EQ
      expect(t1).toBe(undefined)
    })
  })

  describe("pick", () => {
    it("With shared key", () => {
      const res = pick("test", {$tag: ID, ...cols.a}, { a: "lmao" })
      const typeEquals
        : StrictEquals<
          typeof res,
          { $tag: ID, id: "a", test: string }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", test: "lmao"})  
    })

    it("Without shared key", () => {
      const res = pick("test", {$tag: ID, ...cols.b}, { a: "lmao" })
      const typeEquals
        : StrictEquals<
          typeof res,
          { $tag: ID, id: "b", test: unknown }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a"})
    })
  })

  describe("extractMaybe", () => {
    it("Narrows result if variant is known", () => {
      const res = extractMaybe({$tag: ID, ...cols.a}, {} as Partial<Row>)
      const typeEquals
        : StrictEquals<
          typeof res,
          { $tag: ID, id: "a", value: string } | undefined
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", value: "eyy"})
    })

    it("Distributes result if variant is unknown", () => {
      const res = extractMaybe({$tag: ID, ...(cols.a as Col)}, row)
      const typeEquals
        : StrictEquals<
          typeof res,
          | { $tag: ID, id: "a", value: string }
          | { $tag: ID, id: "b", value: number }
          | { $tag: ID, id: "c", value: number }
          | undefined
        > = EQ
      expect(res).toMatchObject({$tag: ID, id: "a", value: "eyy"})
    })
  })

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

  describe("extendMaybe", () => {
    it("Narrows result if variant is known", () => {
      const res = extendMaybe({$tag: ID, ...cols.a}, {} as Partial<Row>)
      const typeEquals
        : StrictEquals<
          typeof res,
          { $tag: ID, id: "a", type: "string", value?: string }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", type: "string"})
    })

    it("Distributes result if variant is unknown", () => {
      const res = extendMaybe({$tag: ID, ...(cols.a as Col)}, {} as Partial<Row>)
      const typeEquals
        : StrictEquals<
          typeof res,
          | { $tag: ID, id: "a", type: "string", value?: string }
          | { $tag: ID, id: "b", type: "number", value?: number }
          | { $tag: ID, id: "c", type: "number", value?: number }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", type: "string"})
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
        extend({$tag: TYPE, ...(cols.a as Col)}, row)
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
