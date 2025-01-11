import React, { useState } from "react";
import ProductCard from "./ProductCard";
import ChatBot from "./ChatBot"; // Import ChatBot component

const SEARCH_ENGINE_ID = "35d10efcfcaf140fb";
const GOOGLE_API_KEY = "AIzaSyCb4aZAisLfy4fFvC6vIpr8bxpSAkKPkCs";

function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // Toggle chatbot visibility
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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Search Products</h1>
        <div className="flex mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-grow border border-gray-300 rounded-l px-4 py-2"
            placeholder="Search for products..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
          >
            Search
          </button>
        </div>
        {loading && <p>Loading...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
        <div className="grid grid-cols-1 gap-4">
          {sortedResults.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        💬
      </button>

      {/* ChatBot Component */}
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}

export default Home;
