export function buildBlockId({
  unidadId,
  leccionId,
  bloqueId,
  index,
}: {
  unidadId: string;
  leccionId: string;
  bloqueId?: string;
  index: number;
}) {
  if (bloqueId && bloqueId.trim()) {
    return `${unidadId}:${leccionId}:${bloqueId.trim()}`;
  }
  return `${unidadId}:${leccionId}:bloque-${index + 1}`;
}
