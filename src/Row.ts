import { Record as R } from './Record' 
import { meta, Variant as V } from './Variant'

export namespace Row {
  export type Extract<V extends V.Var, R extends R.Rec>
    = { $tag: V.Tag<V> } & R.Tagged<R, V.Tag<V>>[V.Keys<V>]

  export type Extend<V extends V.Var, R extends R.Rec>
    = V & R.Tagged<R, V.Tag<V>>[V.Keys<V>]

  export type Handler<R> = {
    [k in keyof R]: (a: R[k]) => any
  }

  export type Mapped<
    V extends V.Var,
    R extends Handler<V.ToRec<V>>,
  > = {
    [k in V.Keys<V>]: { result: ReturnType<R[k]> } & V.Meta<V, k>
  }[V.Keys<V>]
}

type PartialIn<R> = { [k in keyof R]: Partial<R[k]> }

export function pickMaybe<
  V extends V.Var,
  R extends Partial<Record<V.Keys<V>, any>>,
>(V: V, R: R): R[V.Keys<V>] | undefined {
  const k = V[V.$tag] as V.Keys<V>
  return R[k]
}

export function pick<
  V extends V.Var,
  R extends Record<V.Keys<V>, any>,
>(V: V, R: R): R[V.Keys<V>] {
  return pickMaybe(V, R)!
}

export function extractMaybe<
  V extends V.Var,
  R extends Partial<Record<V.Keys<V>, any>>,
>(V: V, R: R): Row.Extract<V, R> | undefined {
  const data = pickMaybe(V, R)
  if (!data) return undefined
  return { ...meta(V), ...data }
}

export function extract<
  V extends V.Var,
  R extends Record<V.Keys<V>, any>,
>(V: V, R: R): Row.Extract<V, R> {
  const res = pick(V, R)
  if (!res) missingVariantKey(V)
  return { ...meta(V), ...res }
}

export function extendMaybe<
V extends V.Var,
R extends Partial<Record<V.Keys<V>, Record<any, any>>>,
>(V: V, R: R): Row.Extend<V, PartialIn<R>> {
  return { ...meta(V), ...pickMaybe(V, R) } as any
}

export function extend<
V extends V.Var,
R extends Record<V.Keys<V>, Record<any, any>>,
>(V: V, R: R): Row.Extend<V, R> {
  const res = pick(V, R)
  if (!res) missingVariantKey(V)
  return { ...V, ...res }
}

export function map<
  V extends V.Var,
  R extends Row.Handler<V.ToRec<V>>
>(V: V, R: R): Row.Mapped<V, R> {
  const res = pick(V, R) as Function
  if (!res) missingVariantKey(V)
  return ({...meta(V), result: res(V)})
}

const missingVariantKey = (V: V.Var): never => {
  throw new Error(`Required variant key ${V[V.$tag]} is missing.`)
}
