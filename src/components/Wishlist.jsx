import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setWishlist(userData.wishlist || []);
        }
      }
      setLoading(false);
    };

    fetchWishlist();
  }, []);

  const sortedWishlist = [...wishlist].sort((a, b) => {
    return sortOrder === "desc" ? b.ecoScore - a.ecoScore : a.ecoScore - b.ecoScore;
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Wishlist</h1>
        <div className="flex justify-end mb-4">
          <label className="mr-2">Sort by Eco Score:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="desc">Highest to Lowest</option>
            <option value="asc">Lowest to Highest</option>
          </select>
        </div>
        <ul className="space-y-4">
          {sortedWishlist.map((product, index) => (
            <li key={index} className="bg-gray-50 p-4 rounded shadow">
              <img src={product.image} alt={product.title} className="w-full h-40 object-cover rounded mb-2" />
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-gray-600">Eco Score: {product.ecoScore}</p>
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Product
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Wishlist; 