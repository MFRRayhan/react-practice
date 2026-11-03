import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function StarRating({
  defaultValue = 0,
  maxRating = 10,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultValue);
  const [tempRating, setTempRating] = useState(0);
  const handleRating = (newRating) => {
    setRating(newRating);
    onSetRating(newRating);
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex items-center gap-1 flex-wrap">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRating={() => handleRating(i + 1)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
          />
        ))}
      </div>
      <p>
        <span className="font-semibold text-amber-400">Rating:</span>{" "}
        {tempRating ? tempRating : rating}
      </p>
    </div>
  );
}

function Star({ onRating, full, onHoverIn, onHoverOut }) {
  return (
    <button
      type="button"
      onClick={onRating}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      className="cursor-pointer text-amber-400"
    >
      {full ? <FaStar /> : <FaRegStar />}
    </button>
  );
}
