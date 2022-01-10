/* eslint-disable @typescript-eslint/no-unused-vars */
import { Variant as V } from './Variant'
import { EQ, StrictEquals } from '../spec/Equals.spec'

type ID = typeof ID
const ID = "id" as const

type Col
  = { id: "a", type: "string" }
  | { id: "b", type: "number" }
  | { id: "c", type: "number" }

const a: Col = { id: "a", type: "string" }
const $a = { $tag: ID, ...a }
const $col = { $tag: ID, ...(a as Col) } 

describe('Variant', () => {
  describe('Keys', () => {
    it("Extracts keys from tag", () => {
      const idTag
        : StrictEquals<
          V.Keys<Col & { $tag: "id" }>,
          "a" | "b" | "c"
        > = EQ
      const typeTag
        : StrictEquals<
          V.Keys<Col & { $tag: "type" }>,
          "string" | "number"
        > = EQ
    })

    it('Extracts keys from known variant', () => {
      const equalKeys0
        : StrictEquals<V.Keys<typeof $a>, "a"> = EQ
      const equalKeys1
        : StrictEquals<
          V.Keys<typeof $a>,
          typeof $a[typeof $a.$tag]
        > = EQ
    })

    it('Extracts keys from unknown variant', () => {
      const equalKeys0
        : StrictEquals<
          V.Keys<typeof $col>,
          "a" | "b" | "c"
        > = EQ
      const equalKeys1
        : StrictEquals<
          V.Keys<typeof $col>,
          typeof $col[typeof $col.$tag]
        > = EQ
    })
  })

  describe('Meta', () => {
    it("Extracts meta keys from variant", () => {
      const many
        : StrictEquals<
          V.Meta<Col & { $tag: "id" }>,
          { $tag: "id", id: "a" | "b" | "c" }
        > = EQ
      const one
        : StrictEquals<
          V.Meta<Col & { $tag: "id" }, "a">,
          { $tag: "id", id: "a" }
        > = EQ
    })
  })

  describe('Query', () => {
    it("Queries a variant case by prop", () => {
      const idTag
        : StrictEquals<
          V.Query<Col, "id", "a">,
          { id: "a", type: "string" }
        > = EQ
      const typeTag
        : StrictEquals<
          V.Query<Col, "type", "number">,
          | { id: "b", type: "number" }
          | { id: "c", type: "number" }
        > = EQ
    })
  })

  describe('Pick', () => {
    it("Picks a variant case by tag", () => {
      const idTag
        : StrictEquals<
          V.Pick<Col & { $tag: "id" }, "a">,
          { $tag: "id", id: "a", type: "string" }
        > = EQ
      const typeTag
        : StrictEquals<
          V.Pick<Col & { $tag: "type" }, "number">,
          | { $tag: "type", id: "b", type: "number" }
          | { $tag: "type", id: "c", type: "number" }
        > = EQ
    })
  })

  describe('Get', () => {
    it("Picks a variant case by tag without the meta properties", () => {
      const idTag
        : StrictEquals<
          V.Get<Col & { $tag: "id" }, "a">,
          { type: "string" }
        > = EQ
        const typeTag
        : StrictEquals<
          V.Get<Col & { $tag: "type" }, "number">,
          { id: "b" | "c" }
        > = EQ
    })
  })

  describe("At", () => {
    it("Returns possible values of a variant's property", () => {
      const idTag
        : StrictEquals<
          V.At<Col & { $tag: "id" }, "id">,
          "a" | "b" | "c"
        > = EQ
      const typeTag
        : StrictEquals<
          V.At<Col & { $tag: "type" }, "id">,
          "a" | "b" | "c"
        > = EQ
    })

    it("Returns value of a property at a given tag", () => {
      const idTag
        : StrictEquals<
          V.At<Col & { $tag: "id" }, "type", "a">,
          "string"
        > = EQ
      const typeTag
        : StrictEquals<
          V.At<Col & { $tag: "type" }, "id", "number">,
          "b" | "c"
        > = EQ
    })
  })

  describe('ToRec', () => {
    it("Creates a record with keys from a variant's tags", () => {
      const idTag
        : StrictEquals<
          V.ToRec<Col & { $tag: "id" }>,
          { a: { type: "string" }
          , b: { type: "number"}
          , c: { type: "number"}
          }
        > = EQ
      const typeTag
        : StrictEquals<
          V.ToRec<Col & { $tag: "type" }>,
          { string: { id: "a" }
          , number: { id: "b" | "c" }
          }
        > = EQ
    })

    it("Has all keys from variant", () => {
      const typeEquals
      : StrictEquals<
          keyof V.ToRec<Col & { $tag: ID }>,
          V.Keys<Col & { $tag: ID }>
        > = EQ
    })
  })
})
