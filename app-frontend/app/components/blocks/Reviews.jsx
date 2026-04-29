// components/ReviewWall.js
import { FaStar, FaGoogle } from "react-icons/fa";
import { useTheme } from "../../context/theme/context";
import RichText from "../utils/RichText";

export default async function ReviewWall(props) {
  // In a real app, you'd fetch this from:
  const block = props;

  const heading = block.heading;
  const demoReviews = block.demoReviews;
  console.log("Demo Reviews:", demoReviews);
  const googlePlacesID = block.google_places_id || [];

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || apiKey;

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlacesID}&fields=reviews,name,rating&key=${GOOGLE_API_KEY}`,
    { next: { revalidate: 3600 } }, // optional ISR: cache for 1 hour
  );

  const data = await res.json();

  let reviews = data.result?.reviews?.slice(0, 6) || [];
  if (reviews.length < 10) {
    reviews = demoReviews?.result?.reviews?.slice(0, 6) || [];
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            {heading && (
              <div>
                <RichText content={heading} />
              </div>
            )}
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700">
              <span className="text-blue-600 flex">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </span>
              {data.result?.rating || demoReviews.rating}/5 Rating on Google
            </div>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-800 transition-all"
          >
            <FaGoogle /> View All Reviews
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((review, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex text-orange-400 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-slate-700 italic leading-relaxed text-lg">
                  "{review.text}"
                </p>
              </div>
              <div className="mt-8 flex justify-between items-center">
                <span className="font-bold text-slate-900">{review.name}</span>
                <span className="text-sm text-slate-400">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
