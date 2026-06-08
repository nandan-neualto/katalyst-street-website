export const SANITY_PROJECT_ID = 'bs10tt9p';
export const SANITY_DATASET = 'production';

/**
 * Lightweight client-side fetch helper for Sanity CMS
 * @param {string} groqQuery 
 * @returns {Promise<any>}
 */
export async function fetchFromSanity(groqQuery) {
  const encodedQuery = encodeURIComponent(groqQuery);
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${encodedQuery}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('[SANITY API ERROR]:', error);
    throw error;
  }
}
