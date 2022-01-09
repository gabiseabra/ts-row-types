export namespace Variant {
  export type Var<tag extends string = "kind">
    = { $tag: tag }
    & { [_ in tag]: string }

  export type Keys<V extends Var<any>> = V[V["$tag"]]

  export type Query<
  V extends { [_ in K]: any },
  K extends keyof V,
  A extends V[K]
  > = Extract<V, { [_ in K]: A }>

  export type Pick<
    V extends Var<any>,
    K extends Keys<V> = Keys<V>
  > = Query<V, V["$tag"], K>

  export type Get<
    V extends Var<any>,
    K extends Keys<V> = Keys<V>
  > = Omit<Pick<V, K>, "$tag" | V["$tag"]>

  export type Meta<
    V extends Var<string>,
    K extends Keys<V> = Keys<V>
  > = { $tag: V["$tag"] }
    & { [_ in V["$tag"]]: K }

  export type At<
    V extends Var<any>,
    P extends keyof V,
    K extends Keys<V> = Keys<V>
  > = Pick<V, K>[P]

  export type ToRec<V extends Var<any>> = {
    [tag in Keys<V>]: Get<V, tag>
  }
}

export function meta<V extends Variant.Var<string>>(V: V): Variant.Meta<V> {
  // @ts-expect-error — Type '{ [x: string]: string }' is not assignable to type '{ [_ in V["$tag"]]: string; }'
  // A Variant's tag key `V["$tag"]` could be a union type, which would cause `[_ in V["$tag"]]` to distribute
  // over multiple keys, making the value level type of the discriminant `V[V["$tag"]]` incompatible.
  // This only breaks with union tag keys, and I can't find a legitimate use case for that, so let's pretend
  // they don't exist.
  return { $tag: V.$tag, [V["$tag"]]: V[V.$tag] }
}
