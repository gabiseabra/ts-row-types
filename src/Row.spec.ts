import * as VR from './Row'
import { EQ, StrictEquals } from '../spec/Equals'

type Row = {
  a: { value: string }
  b: { value: number }
  c: { value: number }
}

type Col
  = { id: "a", type: "string" }
  | { id: "b", type: "number" }
  | { id: "c", type: "number" }

type Cell
  = { type: "string", value: string }
  | { type: "number", value: number }

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
      const res = VR.extract({...cols.a, $tag: "id"}, row)
      const test
        : StrictEquals<
          typeof res,
          { $tag: "id", id: "a", value: string }
        > = EQ
    })

    it("Distributes result if variant is unknown", () => {
      const res = VR.extract({...(cols.a as Col), $tag: "id"}, row)
      const test
        : StrictEquals<
          typeof res,
          | { $tag: "id", id: "a", value: string }
          | { $tag: "id", id: "b", value: number }
          | { $tag: "id", id: "c", value: number }
        > = EQ
    })
  })

  describe("extend", () => {
    it("Narrows result if variant is known", () => {
      const res = VR.extend({...cols.a, $tag: "id"}, row)
      const test
        : StrictEquals<
          typeof res,
          { $tag: "id", id: "a", type: "string", value: string }
        > = EQ
    })

    it("Distributes result if variant is unknown", () => {
      const res = VR.extend({...(cols.a as Col), $tag: "id"}, row)
      const test
        : StrictEquals<
          typeof res,
          | { $tag: "id", id: "a", type: "string", value: string }
          | { $tag: "id", id: "b", type: "number", value: number }
          | { $tag: "id", id: "c", type: "number", value: number }
        > = EQ
    })
  })
})
