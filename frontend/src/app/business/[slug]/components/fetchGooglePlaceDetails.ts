export interface GooglePhoto {
  photoUrl: string;
  width: number;
  height: number;
}

export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
}

export interface GoogleTimeObject {
  day: number; // 0 (Sunday) to 6 (Saturday)
  time: string; // "HHmm" format
}

export interface GooglePeriod {
  open: GoogleTimeObject;
  close: GoogleTimeObject;
}

export interface GoogleOpeningHours {
  open_now: boolean;
  periods: GooglePeriod[];
  weekday_text: string[];
}

export interface OpeningHourDay {
  day: string; // e.g. "Monday"
  hours: string; // e.g. "11:45 AM – 2:15 PM, 6:00 – 10:00 PM"
}

export interface GooglePlaceDetails {
  name: string;
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
  photos: GooglePhoto[];
  openingHours: OpeningHourDay[];
  isOpenNow: boolean;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export async function fetchGooglePlaceDetails(placeId: string): Promise<GooglePlaceDetails> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) throw new Error("Google API key is not set");
  if (!placeId) throw new Error("Place ID is required");

  const proxy = "https://cors-anywhere.herokuapp.com/";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,url,opening_hours,formatted_phone_number,website,photos,geometry&key=${apiKey}`;

  try {
    const res = await fetch(proxy + url);
    const data = await res.json();

    if (data.status !== "OK") {
      throw new Error(data.error_message || "Failed to fetch place details");
    }

    const reviews: GoogleReview[] = (data.result.reviews || []).slice(0, 5).map((review: any) => ({
      author_name: review.author_name,
      rating: review.rating,
      text: review.text,
      relative_time_description: review.relative_time_description,
      profile_photo_url: review.profile_photo_url,
    }));

    const photos: GooglePhoto[] = (data.result.photos || []).map((photo: any) => ({
      photoUrl: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`,
      width: photo.width,
      height: photo.height,
    }));

    // Parse opening hours
    let openingHours: OpeningHourDay[] = [];
    if (data.result.opening_hours && data.result.opening_hours.weekday_text) {
      openingHours = data.result.opening_hours.weekday_text.map((text: string) => {
        const [day, ...hoursArr] = text.split(": ");
        return {
          day,
          hours: hoursArr.join(": ") || "Closed",
        };
      });
    }

    const isOpenNow = data.result.opening_hours?.open_now ?? false;

    return {
      name: data.result.name,
      rating: data.result.rating,
      totalReviews: data.result.user_ratings_total,
      reviews,
      photos,
      openingHours,
      isOpenNow,
      geometry: data.result.geometry,
    };
  } catch (err) {
    console.error("Error fetching place details:", err);
    throw err;
  }
}
