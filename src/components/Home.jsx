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

  const searchProducts = async () => {
    if (!searchInput) {
      alert("Please enter a search term");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(
        searchInput
      )}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch data from Google Custom Search API: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        setResults([]);
        setErrorMessage("No results found.");
        return;
      }

      const enrichedItems = data.items.map((item) => ({
        ...item,
        ecoScore: calculateEcoScore(item.title, item.snippet),
      }));
      setResults(enrichedItems);
    } catch (error) {
      setErrorMessage(error.message || "An error occurred while fetching data.");
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

  const sendMessageToChatbot = async (message) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};


  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Product Search</h1>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          className="w-1/2 px-4 py-2 border rounded-l-lg"
          placeholder="Search for products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg"
          onClick={searchProducts}
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : errorMessage ? (
        <p className="text-center text-red-500">{errorMessage}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </div>
      )}

      {/* Circular Button */}
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
