export const TAG = "$tag" as const

export type TAG = typeof TAG

export type Var<tag extends string = "kind"> = { [_ in TAG]: tag } & { [_ in tag]: string }

export type Keys<V extends Var<any>> = V[V[TAG]]

/**
 * Query<
 * ( { type: "a", value: string }
 * | { type: "b", value: number }
 * ), "type", "a"> = { type: "a", value: string }
 */
 export type Query<
 V extends { [_ in K]: any },
 K extends keyof V,
 A extends V[K]
> = Extract<V, { [_ in K]: A }>

export type Pick<
  V extends Var<any>,
  K extends Keys<V> = Keys<V>
> = Query<V, V[TAG], K>

export type Get<
  V extends Var<any>,
  K extends Keys<V> = Keys<V>
> = Omit<Pick<V, K>, TAG | V[TAG]>

export type At<
  V extends Var<any>,
  P extends keyof V,
  K extends Keys<V> = Keys<V>
> = Pick<V, K>[P]

export type ToRec<V extends Var<any>> = {
  [tag in Keys<V>]: Get<V, tag>
}
