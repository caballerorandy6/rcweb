/**
 * Google antepone «(Translated by Google) …» y añade «(Original) …» al texto
 * de las reseñas escritas en otro idioma. En la web mostramos solo la
 * traducción; en la base de datos queda el texto completo.
 */
export function reviewDisplayText(comment: string): string {
  const match = comment.match(/^\s*\(Translated by Google\)\s*([\s\S]*?)\s*\(Original\)/);
  return (match ? match[1] : comment).trim();
}
