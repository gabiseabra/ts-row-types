import { Record as R } from './Record' 
import { Variant as V } from './Variant'

export namespace Row {
  export type Extract<V extends V.Var<any>, R extends R.Rec>
    = { [k in (V.Keys<V> & R.Keys<R>)]
        : V.Pick<V, k> extends any
        ? R.Get<R, k> extends infer r
        ? r & V.Meta<V, k>
        : never : never
      }[V.Keys<V> & R.Keys<R>]

  export type Extend<V extends V.Var<any>, R extends R.Rec>
    = { [k in (V.Keys<V> & R.Keys<R>)]
        : V.Pick<V, k> extends infer v
        ? R.Get<R, k> extends infer r
        ? r & v : never : never
      }[V.Keys<V> & R.Keys<R>]

  export type Handler<V extends V.Var<any>> = {
    [tag in V.Keys<V>]: (v: V.Get<V, tag>) => any
  }

  // export type VarMap<
  //   V extends V.Var<any>,
  //   R extends Handler<V>,
  // > = {
  //   [k in V.Keys<V>]: { result: ReturnType<R[k]> } & V.Meta<V, k>
  // }[V.Keys<V>]
}

export function extract<
  V extends V.Var<T>,
  R extends R.Rec,
  T extends string = V["$tag"]
>(V: V, R: R): Row.Extract<V, R> {
  return { $tag: V.$tag, [V.$tag]: V[V.$tag], ...R[V[V.$tag]] }
}

export function extend<
  V extends V.Var<T>,
  R extends R.Rec,
  T extends string = V["$tag"]
>(V: V, R: R): Row.Extend<V, R> {
  return { ...V, ...R[V[V.$tag]] }
}

// export declare function map<
//   V extends V.Var<T>,
//   R extends Handler<V>,
//   T extends string = string
// >(R: R): (V: V) => VarMap<V, R> {
//   return (V) => ({
//     $tag: V.$tag,
//     []
//     const v = V[V.$tag]
//   }
// }
