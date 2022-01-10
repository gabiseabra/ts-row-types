import { Record as R } from './Record'
import { EQ, StrictEquals } from '../spec/Equals.spec'

type Row = {
  a: { value: string }
  b: { value: number }
  c: { value: number }
}

describe('Rec', () => {
  describe("Keys", () => {
    it("Extracts keys from record", () => {
      const test
        : StrictEquals<
          R.Keys<Row>,
          "a" | "b" | "c"
        > = EQ
    })
  })

  describe("Query", () => {
    it("Picks keys that match key & value from record", () => {
      const test
        : StrictEquals<
          R.Query<Row, "value", string>,
          { a: { value: string } }
        > = EQ
    })
  })

  describe("Pick", () => {
    it("Picks a set of keys from record", () => {
      const test
        : StrictEquals<
          R.Pick<Row, "a" | "b">,
          { a: { value: string }
          , b: { value: number }
          }
        > = EQ
    })
  })

  describe("Get", () => {
    it("Gets a value by key from record", () => {
      const test
        : StrictEquals<
          R.Get<Row, "a">,
          { value: string }
        > = EQ
      const test2
        : StrictEquals<
          R.Get<Row, "a" | "b">,
          | { value: string }
          | { value: number }
        > = EQ
    })
  })

  describe("At", () => {
    it("Gets a value by key from record", () => {
      const test
        : StrictEquals<
          R.Get<Row, "a">,
          { value: string }
        > = EQ
      const test2
        : StrictEquals<
          R.Get<Row, "a" | "b">,
          | { value: string }
          | { value: number }
        > = EQ
    })
  })

  describe("PickAt", () => {
    it("Gets a value by key from a record's each property", () => {
      const test
        : StrictEquals<
          R.PickIn<Row, "value">,
          { a: string
          , b: number
          , c: number
          }
        > = EQ
    })
  })

  describe("ToVar", () => {
    it("Creates a union type from a record", () => {
      const test
        : StrictEquals<
          R.ToVar<Row, "id">,
          | { id: "a", value: string }
          | { id: "b", value: number }
          | { id: "c", value: number }
        > = EQ
    })
  })
})
