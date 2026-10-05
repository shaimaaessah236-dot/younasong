import axios from 'axios';

// جلب معلومات المغني من MusicBrainz & Wikipedia تلقائياً
export async function enrichArtistData(artistName: string) {
  try {
    // 1. الاستعلام من MusicBrainz API
    const mbResponse = await axios.get(
      `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(artistName)}&fmt=json`,
      { headers: { 'User-Agent': 'YonaSongs/1.0.0 (contact@yonasongs.com)' } }
    );

    const artistData = mbResponse.data.artists?.[0];
    if (!artistData) return { bio: null, country: null };

    const country = artistData.country || null;
    let bio = artistData.disambiguation || null;

    // 2. محاولة دعم السيرة الذاتية من Wikipedia API
    try {
      const wikiResponse = await axios.get(
        `https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artistName)}`
      );
      if (wikiResponse.data?.extract) {
        bio = wikiResponse.data.extract;
      }
    } catch (_) {
      // إهمال الخطأ في حال عدم وجود صفحة ويكيبيديا
    }

    return { bio, country };
  } catch (error) {
    console.error(`Error enriching artist ${artistName}:`, error);
    return { bio: null, country: null };
  }
}

// جلب معلومات وغلاف الأنمي من AniList GraphQL API تلقائياً
export async function enrichAnimeData(animeTitle: string) {
  const query = `
    query ($search: String) {
      Media (search: $search, type: ANIME) {
        id
        title { romaji english native }
        coverImage { extraLarge large }
        description
        startDate { year }
        studios(isMain: true) { nodes { name } }
      }
    }
  `;

  try {
    const response = await axios.post('https://graphql.anilist.co', {
      query,
      variables: { search: animeTitle },
    });

    const media = response.data?.data?.Media;
    if (!media) return null;

    return {
      title: media.title.english || media.title.romaji || animeTitle,
      cover_image: media.coverImage?.extraLarge || media.coverImage?.large,
      description: media.description?.replace(/<[^>]*>?/gm, ''), // تنظيف الـ HTML
      year: media.startDate?.year,
      studio: media.studios?.nodes?.[0]?.name || null,
    };
  } catch (error) {
    console.error(`Error enriching anime ${animeTitle}:`, error);
    return null;
  }
}
