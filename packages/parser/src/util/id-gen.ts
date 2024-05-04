//@ts-expect-error
// biome-ignore lint/suspicious/noAssignInExpressions: it's easier to read
const idMap = (globalThis.__kita__id__map__ ??= new Map<string, number>());

/** Simply returns a unique id for a given name. */
export function getIdFor(name: string) {
  const id = idMap.get(name);

  if (id) {
    return id;
  }

  const size = idMap.size + 1;

  idMap.set(name, size);

  return size;
}
