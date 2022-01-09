import * as R from './Record' 
import * as V from './Variant' 

export type Extend<V extends V.Var<any>, R extends R.Rec>
  = { [k in (V.Keys<V> & R.Keys<R>)]
      : V.Pick<V, k> extends infer r
      ? R.At<R, k> extends infer v
      ? r & v : never : never
    }[V.Keys<V> & R.Keys<R>]

declare function extend<V extends V.Var<T>, R extends R.Rec, T extends string = string>(V: V, R: R): Extend<V, R>;

