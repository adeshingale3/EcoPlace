import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { FaHeart, FaLeaf, FaTrash, FaExternalLinkAlt, FaMinus, FaPlus, FaSort } from "react-icons/fa";

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


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4 mt-8">
            <FaHeart className="text-green-600 text-3xl mr-3" />
            <h1 className="text-4xl font-bold text-gray-800 ">My Eco Wishlist</h1>
          </div>
          <p className="text-gray-600">Your curated collection of sustainable products</p>
        </div>

        {/* Sort Controls */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaSort className="text-green-600 mr-2" />
              <span className="text-gray-700">Sort by Eco Score</span>
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="desc">Highest to Lowest</option>
              <option value="asc">Lowest to Highest</option>
            </select>
          </div>
        </div>

        {/* Wishlist Items */}
        {sortedWishlist.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <FaHeart className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-600">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedWishlist.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex">
                  {/* Product Image */}
                  <div className="w-48 h-48 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.title}</h3>
                        <div className="flex items-center mb-4">
                          <FaLeaf className="text-green-500 mr-2" />
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            Eco Score: {product.ecoScore}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(product)}
                        className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors duration-300"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-gray-600">Quantity:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(product, -1)}
                          className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="w-12 text-center font-medium">{product.quantity || 0}</span>
                        <button
                          onClick={() => updateQuantity(product, 1)}
                          className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* View Product Link */}
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                    >
                      View Product
                      <FaExternalLinkAlt className="ml-2 text-sm" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Section */}
        {sortedWishlist.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                Total Items: <span className="font-medium">{sortedWishlist.length}</span>
              </div>
              <div className="text-gray-600">
                Average Eco Score:{" "}
                <span className="font-medium">
                  {Math.round(
                    sortedWishlist.reduce((acc, item) => acc + item.ecoScore, 0) / sortedWishlist.length
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;