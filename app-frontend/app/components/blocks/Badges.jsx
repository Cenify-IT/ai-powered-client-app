import Badge from "../utils/Badge";

export default function BadgesSection(block) {
  // block.badges is your array of badges from Strapi

  return (
    <div className="w-full bg-slate-50 border-y border-slate-200/60 py-10 mx-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {block.badges.map((badgeWrapper) => (
            <div
              key={badgeWrapper.id}
              className="flex lg:items-start items-center justify-center gap-4 group"
            >
              <Badge data={badgeWrapper.data} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
