/**
 * Google antepone «(Translated by Google) …» y añade «(Original) …» al texto
 * de las reseñas escritas en otro idioma. En la web mostramos solo lo que
 * escribió el cliente; en la base de datos queda el texto completo.
 */
const TRANSLATED = /^\s*\(Translated by Google\)\s*([\s\S]*?)\s*\(Original\)/;

const ORIGINAL = /\(Original\)\s*([\s\S]*)$/;

/** Lo que escribió el cliente, sin la traducción de Google. */
export function reviewOriginalText(comment: string): string {
  const match = TRANSLATED.test(comment) ? comment.match(ORIGINAL) : null;
  return (match ? match[1] : comment).trim();
}
