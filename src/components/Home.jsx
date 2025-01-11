import React, { useState } from "react";
import ProductCard from "./ProductCard";
import ChatBot from "./ChatBot";
import { FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";

const SEARCH_ENGINE_ID = "35d10efcfcaf140fb";
const GOOGLE_API_KEY = "AIzaSyCb4aZAisLfy4fFvC6vIpr8bxpSAkKPkCs";

function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  const handleSearch = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${searchInput}`
      );
      const data = await response.json();
      const enrichedItems = data.items.map((item) => ({
        ...item,
        ecoScore: calculateEcoScore(item.title, item.snippet),
      }));
      setResults(enrichedItems);
    } catch (error) {
      setErrorMessage("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  const calculateEcoScore = (title, description) => {
    let score = 0;
    const ecoTerms = [
      "biodegradable",
      "recyclable",
      "eco-friendly",
      "sustainable",
      "green",
    ];
    ecoTerms.forEach((term) => {
      if (title.toLowerCase().includes(term)) score += 20;
      if (description.toLowerCase().includes(term)) score += 10;
    });
    return Math.min(score, 100);
  };

  const sortedResults = [...results].sort((a, b) => {
    const ecoScoreA = a.ecoScore || 0;
    const ecoScoreB = b.ecoScore || 0;
    return sortOrder === "desc" ? ecoScoreB - ecoScoreA : ecoScoreA - ecoScoreB;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Search Products</h1>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-grow border border-gray-300 rounded-l-full px-4 py-2"
            placeholder="Search for products..."
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-4 py-2 rounded-r-full"
          >
            <FaSearch />
          </button>
        </div>
        {loading && <p>Loading...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex justify-end mb-4 items-center">
          <label className="mr-2">Sort by Eco Score:</label>
          <div className="flex items-center">
            <FaArrowUp
              className={`cursor-pointer ${sortOrder === "asc" ? "text-gray-400" : "text-black"}`}
              onClick={() => setSortOrder("desc")}
            />
            <FaArrowDown
              className={`cursor-pointer ml-2 ${sortOrder === "desc" ? "text-gray-400" : "text-black"}`}
              onClick={() => setSortOrder("asc")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedResults.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-12 space-x-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
          <h2 className="text-xl font-bold mb-2">About Us</h2>
          <p className="text-gray-700">Learn more about our mission and values.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
          <h2 className="text-xl font-bold mb-2">Importance of Eco-friendly Investment</h2>
          <p className="text-gray-700">Discover why investing in eco-friendly products matters.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
          <h2 className="text-xl font-bold mb-2">Eco-friendly Products</h2>
          <p className="text-gray-700">Explore our range of eco-friendly products.</p>
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        💬
      </button>

      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}

export default Home;
