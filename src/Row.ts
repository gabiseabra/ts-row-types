import * as R from './Record' 
import * as V from './Variant' 

export type VarExtract<V extends V.Var<any>, R extends R.Rec>
  = { [k in (V.Keys<V> & R.Keys<R>)]
      : V.Pick<V, k> extends any
      ? R.Get<R, k> extends infer r
      ? r & { [_ in V[V.TAG]]: k } & { $tag: V[V.TAG] }
      : never : never
    }[V.Keys<V> & R.Keys<R>]

export function extract<
  V extends V.Var<T>,
  R extends R.Rec,
  T extends string = string
>(V: V, R: R): VarExtract<V, R> {
  return { $tag: V.$tag, id: V[V.$tag], ...R[V.$tag] }
}

export type VarExtend<V extends V.Var<any>, R extends R.Rec>
  = { [k in (V.Keys<V> & R.Keys<R>)]
      : V.Pick<V, k> extends infer v
      ? R.Get<R, k> extends infer r
      ? r & v : never : never
    }[V.Keys<V> & R.Keys<R>]

export function extend<
  V extends V.Var<T>,
  R extends R.Rec,
  T extends string = string
>(V: V, R: R): VarExtend<V, R> {
  return { ...V, ...R[V.$tag] }
}

