import { Row as VR, extract, extend, mapOr } from './Row'
import { EQ, StrictEquals } from '../spec/Equals.spec'

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
      const res = extract({...cols.a, $tag: "id"}, row)
      const test
        : StrictEquals<
          typeof res,
          { $tag: "id", id: "a", value: string }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", value: "eyy"})
    })

    it("Distributes result if variant is unknown", () => {
      const res = extract({...(cols.a as Col), $tag: "id"}, row)
      const test
        : StrictEquals<
          typeof res,
          | { $tag: "id", id: "a", value: string }
          | { $tag: "id", id: "b", value: number }
          | { $tag: "id", id: "c", value: number }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", value: "eyy"})
    })
  })

  describe("extend", () => {
    it("Narrows result if variant is known", () => {
      const res = extend({...cols.a, $tag: "id"}, row)
      const test
        : StrictEquals<
          typeof res,
          { $tag: "id", id: "a", type: "string", value: string }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", type: "string", value: "eyy"})
    })

    it("Distributes result if variant is unknown", () => {
      const res = extend({...(cols.a as Col), $tag: "id"}, row)
      const test
        : StrictEquals<
          typeof res,
          | { $tag: "id", id: "a", type: "string", value: string }
          | { $tag: "id", id: "b", type: "number", value: number }
          | { $tag: "id", id: "c", type: "number", value: number }
        > = EQ
      expect(res).toMatchObject({$tag: "id", id: "a", type: "string", value: "eyy"})
    })
  })

  describe('mapOr', () => {
    it("Narrows return value if variant is known", () => {
      const res = mapOr({
        a: () => 1,
        b: () => "a",
        c: () => true,
      }, (): null => null)({
        $tag: "id",
        ...cols.a
      })
      const test
        : StrictEquals<
          typeof res,
          { $tag: "id", id: "a", result: number }
        > = EQ
      expect(res).toMatchObject({ $tag: "id", id: "a", result: 1 })
    })

    it("Distributes return value if variant is unknown", () => {
      const res = mapOr({
        a: () => 1,
        b: () => "a",
        c: () => true,
      }, (): null => null)({
        $tag: "id",
        ...(cols.a as Col)
      })
      const test
        : StrictEquals<
          typeof res,
          | { $tag: "id", id: "a", result: number }
          | { $tag: "id", id: "b", result: string }
          | { $tag: "id", id: "c", result: boolean }
        > = EQ
      expect(res).toMatchObject({ $tag: "id", id: "a", result: 1 })
    })

    it("Returns fallback value if variant is unhandled", () => {
      const res = mapOr({
        a: () => 1,
        b: () => "a",
        c: () => true,
      }, (): null => null)({
        $tag: "type",
        ...cols.a
      })
      const test: StrictEquals<typeof res, null> = EQ
      expect(res).toBe(null)
    })
  })
})
