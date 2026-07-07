import { CatType } from "@/lib/catTypes";

interface CatCardProps {
  catType: CatType;
  verdict: string;
  catName?: string;
  catImage?: string;
}

export default function CatCard({ catType, verdict, catName, catImage }: CatCardProps) {
  return (
    <div className="cat-card" style={{ borderColor: catType.color }}>
      <div className="cat-card-header" style={{ background: catType.color }}>
        <span className="cat-card-name pixel-font">
          {catName ? catName : catType.name}
        </span>
        <span className="cat-card-hp pixel-font">MeowBTI</span>
      </div>

      <div
        className="cat-card-art"
        style={{ background: `radial-gradient(circle, ${catType.color}33, #14111f 75%)` }}
      >
        {catImage ? (
          <img
            src={catImage}
            alt={catName ? `${catName}'s photo` : "Your cat's photo"}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }}
          />
        ) : (
          <div className="cat-card-icon">{catType.icon}</div>
        )}
      </div>

      <div className="cat-card-tagline">
        {catName ? catType.name : catType.tagline}
      </div>

      <div className="cat-card-verdict-box">
        <p className="cat-card-verdict">{verdict}</p>
      </div>

      <div className="cat-card-traits">
        {catType.traits.map((t) => (
          <div key={t} className="cat-card-trait-row">
            <span className="cat-card-trait-dot" style={{ background: catType.color }} />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}