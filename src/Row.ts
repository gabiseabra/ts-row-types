import { Record as R } from './Record' 
import { meta, Variant as V } from './Variant'

export namespace Row {
  export type Extract<V extends V.Var, R extends R.Rec>
    = { [k in (V.Keys<V> & R.Keys<R>)]
        : V.Pick<V, k> extends any
        ? R.Get<R, k> extends infer r
        ? r & V.Meta<V, k>
        : never : never
      }[V.Keys<V> & R.Keys<R>]

  export type Extend<V extends V.Var, R extends R.Rec>
    = { [k in (V.Keys<V> & R.Keys<R>)]
        : V.Pick<V, k> extends infer v
        ? R.Get<R, k> extends infer r
        ? r & v : never : never
      }[V.Keys<V> & R.Keys<R>]

  export type Handler = Record<string, (v: any) => any>

  export interface Map<R extends Handler, E = never> {
    <V extends V.Var>(V: V): Mapped<R, V> extends never ? E : Mapped<R, V>
  }

  export type Mapped<
    R extends Handler,
    V extends V.Var
  > = {
    [k in V.Keys<V>]
      : R[k] extends (v: V.Get<V, k>) => infer A
      ? { result: A } & V.Meta<V, k>
      : never
  }[V.Keys<V>]
}

export function extract<
  V extends V.Var,
  R extends R.Rec,
>(V: V, R: R): Row.Extract<V, R> {
  return { ...meta(V), ...R[V[V.$tag]] }
}

export function extend<
  V extends V.Var,
  R extends R.Rec,
>(V: V, R: R): Row.Extend<V, R> {
  return { ...V, ...R[V[V.$tag]] }
}

export function mapOr<R extends Row.Handler, E>(R: R, E: (V: V.Var<any>) => E): Row.Map<R, E> {
  return (V) => {
    const k = V[V.$tag]
    if (!R[k]) return E(V) as any
    return {...meta(V), result: R[k](V)}
  }
}

export function map<R extends Row.Handler>(R: R): Row.Map<R> {
  return mapOr(R, (V) => {
    throw new Error(`Unhandled variant: ${V}`)
  })
}
