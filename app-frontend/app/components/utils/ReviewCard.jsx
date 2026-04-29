function ReviewCard(props) {
  return (
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
  );
}
