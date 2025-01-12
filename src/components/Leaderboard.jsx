import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => doc.data());
      usersList.sort((a, b) => b.points - a.points);
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          {/* Decorative Leaf SVG */}
          <svg className="w-8 h-8 text-green-600 mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,4c0,0-3-3-8-3S5,4,5,4s3-1,6-1S21,4,21,4z M3,21c0,0,3,3,8,3s8-3,8-3s-3,1-6,1S3,21,3,21z"/>
          </svg>
          <h1 className="text-3xl font-bold text-gray-800">Sustainability Leaders</h1>
          <svg className="w-8 h-8 text-green-600 ml-3 transform rotate-180" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,4c0,0-3-3-8-3S5,4,5,4s3-1,6-1S21,4,21,4z M3,21c0,0,3,3,8,3s8-3,8-3s-3,1-6,1S3,21,3,21z"/>
          </svg>
        </div>

        <div className="overflow-hidden rounded-xl border border-green-200">
          <table className="min-w-full">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="py-4 px-6 text-left">Rank</th>
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-right">Impact Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr 
                  key={index} 
                  className={`
                    ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}
                    hover:bg-green-100 transition-colors duration-150 ease-in-out
                  `}
                >
                  <td className="py-4 px-6">
                    {index < 3 ? (
                      <span className={`
                        inline-flex items-center justify-center w-8 h-8 rounded-full 
                        ${index === 0 ? 'bg-yellow-400' : 
                          index === 1 ? 'bg-gray-300' : 
                          'bg-amber-600'} 
                        text-white font-bold
                      `}>
                        {index + 1}
                      </span>
                    ) : (
                      <span className="text-gray-600">{index + 1}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-800">{user.name}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center bg-green-100 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="font-semibold text-green-800">{user.points}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Message */}
        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">
            Making a positive impact on our planet, one action at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;