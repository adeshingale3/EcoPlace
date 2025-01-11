import React from "react";

function ProductCard({ item }) {
  // Directly use the image or fallback to placeholder
  const image = item.pagemap?.cse_image?.[0]?.src || "placeholder-image.jpg";

  // Determine the ecoScore color based on the score value
  let ecoScoreColor = "text-red-500"; // Default to red if no score or low eco score
  if (item.ecoScore >= 20) {
    ecoScoreColor = "text-green-500"; // Green for ecoScore 80 and above
  } else if (item.ecoScore >= 10) {
    ecoScoreColor = "text-yellow-500"; // Yellow for ecoScore between 50 and 79
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <img
        src={image}
        alt={item.title}
        className="w-full h-40 object-cover rounded mb-4"
        onError={(e) => (e.target.src = "placeholder-image.jpg")}
      />
      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
      <p className="text-gray-600 mb-2">{item.snippet}</p>
      <p className={`${ecoScoreColor} mb-2`}>Eco Score: {item.ecoScore}</p>
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View Product
      </a>
    </div>
  );
}

export default ProductCard;
