import React from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

function ProductCard({ item }) {
  // Directly use the image or fallback to placeholder
  const image = item.pagemap?.cse_image?.[0]?.src || "placeholder-image.jpg";

  // Calculate the eco score based on specific attributes
  const calculateEcoScore = () => {
    const ecoAttributes = {
      materials: ["bamboo", "hemp", "organic cotton", "recycled plastic"],
      recyclability: ["recyclable", "recycled"],
      biodegradability: ["biodegradable", "compostable"],
    };

    let score = 0;

    // Check for materials
    ecoAttributes.materials.forEach((material) => {
      if (item.title.toLowerCase().includes(material) || item.snippet.toLowerCase().includes(material)) {
        score += 30; // Assign 30 points for eco-friendly materials
      }
    });

    // Check for recyclability
    ecoAttributes.recyclability.forEach((term) => {
      if (item.title.toLowerCase().includes(term) || item.snippet.toLowerCase().includes(term)) {
        score += 20; // Assign 20 points for recyclability
      }
    });

    // Check for biodegradability
    ecoAttributes.biodegradability.forEach((term) => {
      if (item.title.toLowerCase().includes(term) || item.snippet.toLowerCase().includes(term)) {
        score += 20; // Assign 20 points for biodegradability
      }
    });

    return Math.min(score, 100); // Ensure the score does not exceed 100
  };

  const ecoScore = calculateEcoScore();

  // Determine the ecoScore color based on the score value
  let ecoScoreColor = "text-red-500"; // Default to red if no score or low eco score
  if (ecoScore >= 60) {
    ecoScoreColor = "text-green-500"; // Green for high eco score
  } else if (ecoScore >= 30) {
    ecoScoreColor = "text-yellow-500"; // Yellow for medium eco score
  }

  // Generate a detailed explanation for the eco score
  const getEcoScoreExplanation = () => {
    const reasons = [];
    const ecoAttributes = {
      materials: ["bamboo", "hemp", "organic cotton", "recycled plastic"],
      recyclability: ["recyclable", "recycled"],
      biodegradability: ["biodegradable", "compostable"],
    };

    // Check for materials
    ecoAttributes.materials.forEach((material) => {
      if (item.title.toLowerCase().includes(material) || item.snippet.toLowerCase().includes(material)) {
        reasons.push(`made from eco-friendly material: ${material}`);
      }
    });

    // Check for recyclability
    ecoAttributes.recyclability.forEach((term) => {
      if (item.title.toLowerCase().includes(term) || item.snippet.toLowerCase().includes(term)) {
        reasons.push(`recyclable: ${term}`);
      }
    });

    // Check for biodegradability
    ecoAttributes.biodegradability.forEach((term) => {
      if (item.title.toLowerCase().includes(term) || item.snippet.toLowerCase().includes(term)) {
        reasons.push(`biodegradable: ${term}`);
      }
    });

    if (reasons.length > 0) {
      return `This product has a high eco score because it is ${reasons.join(", ")}.`;
    } else {
      return "This product has a low eco score due to the lack of eco-friendly materials, recyclability, or biodegradability.";
    }
  };

  // Award points to the user for viewing a product with a high eco score
  const awardPoints = async () => {
    if (ecoScore > 10) {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          points: increment(0.5),
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4" onClick={awardPoints}>
      <img
        src={image}
        alt={item.title}
        className="w-full h-40 object-cover rounded mb-4"
        onError={(e) => (e.target.src = "placeholder-image.jpg")}
      />
      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
      <p className="text-gray-600 mb-2">{item.snippet}</p>
      <p className={`${ecoScoreColor} mb-2`}>Eco Score: {ecoScore}</p>
      <p className="text-gray-500 text-sm mb-2">{getEcoScoreExplanation()}</p>
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
