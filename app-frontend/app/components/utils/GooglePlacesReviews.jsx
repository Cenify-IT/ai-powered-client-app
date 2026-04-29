// app/components/GoogleReviews.tsx
import React from "react";
// Server Component
import ReviewCard from "../components/utils/ReviewCard";
export default async function GoogleReviews({
  placeId,
  maxReviews = 5,
  demoReviews,
}) {
  // Fetch the reviews from Google Places API
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || apiKey;

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,name,rating&key=${GOOGLE_API_KEY}`,
    { next: { revalidate: 3600 } }, // optional ISR: cache for 1 hour
  );

  const data = await res.json();

  const reviews = data.result?.reviews?.slice(0, maxReviews) || [];

  if (reviews.length < 2) {
    reviews = demoReviews;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4"
        >
          {review.profile_photo_url && (
            <img
              src={review.profile_photo_url}
              alt={review.author_name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <h4 className="font-semibold">{review.author_name}</h4>
            <div className="flex items-center gap-2 text-yellow-500 text-sm">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
            <p className="text-gray-700 mt-1">{review.text}</p>
            <p className="text-gray-400 text-xs mt-1">
              {review.relative_time_description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
