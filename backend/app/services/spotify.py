import httpx
from app.core.config import settings

SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE = "https://api.spotify.com/v1"


async def get_spotify_token() -> str:
    """Fetch a client-credentials access token from Spotify."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            SPOTIFY_TOKEN_URL,
            data={"grant_type": "client_credentials"},
            auth=(settings.SPOTIFY_CLIENT_ID, settings.SPOTIFY_CLIENT_SECRET),
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        response.raise_for_status()
        return response.json()["access_token"]


async def get_track_metadata(track_id: str) -> dict:
    """
    Fetch track metadata (name, artists, album art, duration, preview_url)
    from the Spotify Web API.
    """
    token = await get_spotify_token()
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPOTIFY_API_BASE}/tracks/{track_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
        response.raise_for_status()
        data = response.json()

    # Extract the largest available album image
    images = data.get("album", {}).get("images", [])
    cover_url = images[0]["url"] if images else None

    return {
        "id": data["id"],
        "title": data["name"],
        "artist": ", ".join(a["name"] for a in data["artists"]),
        "album": data["album"]["name"],
        "cover": cover_url,
        "duration_ms": data["duration_ms"],
        "preview_url": data.get("preview_url"),  # 30-second preview (may be None)
        "spotify_url": data["external_urls"]["spotify"],
        "release_date": data["album"]["release_date"][:4],
    }
