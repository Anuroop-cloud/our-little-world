/**
 * Fetches real Spotify album art for a track using Spotify's public oEmbed endpoint.
 * No API key required. Works for any public track.
 *
 * @param {string} spotifyUrl - Full Spotify track URL e.g. "https://open.spotify.com/track/..."
 * @returns {Promise<string|null>} - CDN thumbnail URL or null on failure
 */
export async function fetchSpotifyThumbnail(spotifyUrl) {
  try {
    const encoded = encodeURIComponent(spotifyUrl);
    const res = await fetch(`https://open.spotify.com/oembed?url=${encoded}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail_url || null;
  } catch {
    return null;
  }
}
