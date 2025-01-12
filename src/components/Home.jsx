import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ChatBot from "./ChatBot";
import { FaSearch, FaArrowUp, FaArrowDown, FaLeaf } from "react-icons/fa";

const SEARCH_ENGINE_ID = "35d10efcfcaf140fb";
const GOOGLE_API_KEY = "AIzaSyBji7yC58aKj_SlzHTIB-KTZCmFlXTv-WM";

function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger fade-in effect after component mounts
    setFadeIn(true);
  }, []);

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

      // Send the search input to the chatbot
      if (enrichedItems.length > 0) {
        const mostSustainableProduct = enrichedItems.reduce((prev, current) =>
          prev.ecoScore > current.ecoScore ? prev : current
        );
        const chatResponse = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `What are the key features of the most sustainable product: ${mostSustainableProduct.title}?`,
          }),
        });
        const chatData = await chatResponse.json();
        console.log("Chatbot response:", chatData.answer);
      }
    } 
    catch (error) {
      setErrorMessage("");
    } 
    finally {
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
      "vegetables",
      "fruits",
      "organic",
      "sustainable",
      "natural",
      "non-toxic",
      "cotton",
      "bamboo",
      "recycled",
      "silk",
      "biodegradable",
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
    <div className={`min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6 font-sans relative transition-all duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mt-20  max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaLeaf className="text-green-600 text-3xl mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">EcoPlace</h1>
            <FaLeaf className="text-green-600 text-3xl ml-3 transform rotate-90" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover sustainable products for a better tomorrow
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border-2 border-green-200 rounded-full px-6 py-3 pr-12 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Search for eco-friendly products..."
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors"
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Sort Controls */}
          {results.length > 0 && (
            <div className="flex justify-end items-center mb-4 text-gray-600">
              <span className="mr-3 text-sm font-medium">Sort by Eco Score:</span>
              <div className="flex items-center bg-green-50 rounded-lg p-1">
                <button
                  onClick={() => setSortOrder("desc")}
                  className={`p-2 rounded-md transition-colors ${
                    sortOrder === "desc" ? "bg-green-600 text-white" : "text-gray-600"
                  }`}
                >
                  <FaArrowUp />
                </button>
                <button
                  onClick={() => setSortOrder("asc")}
                  className={`p-2 rounded-md transition-colors ${
                    sortOrder === "asc" ? "bg-green-600 text-white" : "text-gray-600"
                  }`}
                >
                  <FaArrowDown />
                </button>
              </div>
            </div>
          )}

          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
            </div>
          )}
          {errorMessage && (
            <div className="text-red-500 text-center py-4 bg-red-50 rounded-lg">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {sortedResults.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </div>

        {/* Info Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: "About Us",
              content: "EcoPlace is an innovative platform dedicated to promoting sustainable living and environmental awareness. Using AI-driven analysis, we evaluate the sustainability of products and provide users with EcoScores to make eco-friendly choices easier.",
              icon: "🌱"
            },
            {
              title: "Importance of Eco-friendly Investment",
              content: "Eco-friendly products are designed to minimize harm to the environment. They use sustainable materials, reduce waste, and conserve resources, helping to combat issues like pollution and deforestation.",
              icon: "🌍"
            },
            {
              title: "Eco-friendly Products",
              content: "Eco-friendly products are designed to have a minimal negative impact on the environment. They are made using sustainable materials and processes that conserve natural resources, reduce waste, and avoid pollution.",
              icon: "♻️"
            }
          ].map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-4xl mb-4 text-center">{card.icon}</div>
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800">{card.title}</h2>
              <p className="text-gray-600 text-center">{card.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Button */}
      <button
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors transform hover:scale-110"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        💬
      </button>

      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}

export default Home;