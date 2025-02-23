import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
      } else {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setName(userDoc.data().name);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserData((prevData) => ({
            ...prevData,
            points: doc.data().points,
          }));
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    const user = auth.currentUser;
    
    try {
      if (name && name !== user.displayName) {
        await updateProfile(user, { displayName: name });
        await updateDoc(doc(db, "users", user.uid), { name });
        console.log("Profile updated successfully");
      }

      if (password) {
        if (!currentPassword) {
          alert("Please enter your current password to change the password.");
          return;
        }

        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, password);
        console.log("Password updated successfully");
      }

      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>No user data found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {editMode ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-300"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-300"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-300"
          />
          <button onClick={handleSave} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">Save</button>
          <button onClick={() => setEditMode(false)} className="ml-4 text-red-500">Cancel</button>
        </div>
      ) : (
        <div>
          <p className="font-medium">Name: {userData.name}</p>
          <p className="font-medium">Email: {auth.currentUser.email}</p>
          <p className="font-medium">Points: {userData.points ?? 0}</p>
          <p className="font-medium">Joined: {userData.createdAt?.toDate ? userData.createdAt.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}</p>
          <button onClick={() => setEditMode(true)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">Edit</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
