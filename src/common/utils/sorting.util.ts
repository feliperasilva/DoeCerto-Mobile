/**
 * Utilitário para ordenação de resultados do catálogo
 */

export type SortDirection = 'asc' | 'desc';

/**
 * Compara dois valores considerando null/undefined
 * @returns número negativo se a < b, positivo se a > b, 0 se iguais
 */
function compareValues(a: any, b: any, direction: SortDirection): number {
  // Trata null/undefined como menor valor
  if (a == null && b == null) return 0;
  if (a == null) return direction === 'desc' ? 1 : -1;
  if (b == null) return direction === 'desc' ? -1 : 1;

  // Comparação para datas
  if (a instanceof Date && b instanceof Date) {
    const diff = a.getTime() - b.getTime();
    return direction === 'desc' ? -diff : diff;
  }

  // Comparação numérica/string
  if (a === b) return 0;
  const comparison = a > b ? 1 : -1;
  return direction === 'desc' ? -comparison : comparison;
}

/**
 * Ordena itens do catálogo por múltiplos critérios:
 * 1. matchCount (descendente) - prioriza ONGs com mais categorias correspondentes
 * 2. orderByField (conforme direction) - critério específico da seção
 * 3. userId (ascendente) - tie-breaker determinístico
 */
export function sortCatalogItems<T extends { matchCount: number; userId: number; [key: string]: any }>(
  items: T[],
  orderByField: string,
  orderByDirection: SortDirection,
): T[] {
  return items.sort((a, b) => {
    // Critério 1: Quantidade de match de categorias (sempre descendente)
    if (a.matchCount !== b.matchCount) {
      return b.matchCount - a.matchCount;
    }

    // Critério 2: Campo específico da seção (averageRating, createdAt, etc)
    const fieldComparison = compareValues(a[orderByField], b[orderByField], orderByDirection);
    if (fieldComparison !== 0) {
      return fieldComparison;
    }

    // Critério 3: userId como tie-breaker (sempre ascendente)
    return a.userId - b.userId;
  });
}
