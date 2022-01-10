import { Record as R } from './Record' 
import { meta, Variant as V } from './Variant'

export namespace Row {
  export type Lookup<V extends V.Var, T = any> = Record<V.Keys<V>, T>

  export type Extract<V extends V.Var, R extends R.Rec>
    = { $tag: V.Tag<V> } & R.Tagged<R, V.Tag<V>>[V.Keys<V>]

  export type Extend<V extends V.Var, R extends R.Rec>
    = V & R.Tagged<R, V.Tag<V>>[V.Keys<V>]

  export type Pick<K extends string, V extends V.Var, R extends R.Rec> = {
    [tag in V.Keys<V>]: V.Meta<V, tag> & { [_ in K]: R[tag] }
  }[V.Keys<V>]

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

export function lookup<
  V extends V.Var,
  R extends Record<string, any>,
>(V: V, R: R): R[V.Keys<V>] {
  return R[V[V.$tag]]
}

export function pick<
  K extends string,
  V extends V.Var,
  R extends Record<string, any>,
>(K: K, V: V, R: R): Row.Pick<K, V, R> {
  return { ...meta(V), [K]: lookup(V, R) } as any
}

export function extractMaybe<
  V extends V.Var,
  R extends Partial<Row.Lookup<V, Record<any, any>>>,
>(V: V, R: R): Row.Extract<V, R> | undefined {
  const data = lookup(V, R)
  if (!data) return undefined
  return { ...meta(V), ...data }
}

export function extract<
  V extends V.Var,
  R extends Row.Lookup<V, Record<any, any>>,
>(V: V, R: R): Row.Extract<V, R> {
  const res = lookup(V, R)
  if (!res) missingVariantKey(V)
  return { ...meta(V), ...res }
}

export function extendMaybe<
V extends V.Var,
R extends Partial<Row.Lookup<V, Record<any, any>>>,
>(V: V, R: R): Row.Extend<V, PartialIn<R>> {
  return { ...V, ...lookup(V, R) }
}

export function extend<
V extends V.Var,
R extends Row.Lookup<V, Record<any, any>>,
>(V: V, R: R): Row.Extend<V, R> {
  const res = lookup(V, R)
  if (!res) missingVariantKey(V)
  return { ...V, ...res }
}

export function map<
  V extends V.Var,
  R extends Row.Handler<V.ToRec<V>>
>(V: V, R: R): Row.Mapped<V, R> {
  const res = lookup(V, R) as Function
  if (!res) missingVariantKey(V)
  return ({...meta(V), result: res(V)})
}

const missingVariantKey = (V: V.Var): never => {
  throw new Error(`Required variant key ${V[V.$tag]} is missing.`)
}
