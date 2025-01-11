import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";

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

  const removeFromWishlist = async (product) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        wishlist: arrayRemove(product),
      });
      setWishlist(wishlist.filter((item) => item.title !== product.title));
    }
  };

  const updateQuantity = (product, delta) => {
    setWishlist((prevWishlist) =>
      prevWishlist.map((item) =>
        item.title === product.title
          ? { ...item, quantity: Math.max(0, (item.quantity || 0) + delta) }
          : item
      )
    );
  };

  const sortedWishlist = [...wishlist].sort((a, b) => {
    return sortOrder === "desc" ? b.ecoScore - a.ecoScore : a.ecoScore - b.ecoScore;
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 font-sans">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">Wishlist</h1>
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
            <li key={index} className="bg-gray-50 p-4 rounded shadow flex items-center">
              <img src={product.image} alt={product.title} className="w-20 h-20 object-cover rounded mr-4" />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-gray-600">Eco Score: {product.ecoScore}</p>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline"
                >
                  View Product
                </a>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(product, -1)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="mx-2">{product.quantity || 0}</span>
                  <button
                    onClick={() => updateQuantity(product, 1)}
                    className="bg-green-500 text-white px-2 py-1 rounded-md text-sm font-medium hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromWishlist(product)}
                className="ml-4 bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Wishlist; 