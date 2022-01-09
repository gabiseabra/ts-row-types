export type Rec<K extends string = string> = { [_ in K]: any }

export type Keys<R extends Rec> = keyof R

export type Pick<
  R extends Rec,
  K extends Keys<R> = Keys<R>
> = {
  [k in K]: R[k]
}

export type Get<
  R extends Rec,
  K extends Keys<R> = Keys<R>
> = R[K]

export type At<
  R extends Rec,
  T extends keyof R[K],
  K extends Keys<R> = Keys<R>
> = Get<R, K>[T]

type QueryKeys<
  R extends Rec,
  K extends keyof R[Keys<R>],
  A extends R[Keys<R>][K]
> = { [id in Keys<R>] : R[id][K] extends A ? id : never }[Keys<R>]

/**
 * Query<{
 *   a: { type: "a" },
 *   b: { type: "b" }
 * }, "type", "a"> = {
 *   a: { type: "a" }
 * }
 */
export type Query<
  R extends Rec,
  K extends keyof R[Keys<R>],
  V extends R[Keys<R>][K]
> = { [id in QueryKeys<R, K, V>]: R[id] }


/**
 * Maps record type R to a record with values from property K
 * PickProp<{
 *  a: { value: number }
 *  b: { value: string }
 * }, "value"> = {
 *  a: number
 *  b: string
 * }
 */
export type PickAt<
  R extends { [_ in string]: { [_ in K]: any } },
  K extends string
> = {
  [key in keyof R]: R[key][K]
}

export type ToVar<
  R extends Rec,
  tag extends string
> = { [k in keyof R]: { [_ in tag]: k } & R[k] }[keyof R]
