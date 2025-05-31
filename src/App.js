import React, { Component, useState, useEffect } from 'react';
import './App.css';
import { Auth } from "./components/auth";

import { db } from './config/firebase';
import { getDocs, collection } from 'firebase/firestore';
function App() {
  const [spendingList, setSpendingList] = useState([]);
  const spendingCollectionRef = collection(db, "Budget");

  useEffect(() => {
    const getSpendingList = async () => {
      // Read list from database, set spending list
      try {
        const data = await getDocs(spendingCollectionRef);
        const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(filteredData);
        setSpendingList(filteredData)
      } catch (err) {
        console.error(err);
      }

    };
    getSpendingList();
  }, []);
  return (
    <div className="App">
      <Auth />
      
      <div>
        {spendingList.map((spending) =>(
          <div>
          <h1>
            Spending list:
            <p>
            Date: {spending["Date of Purchase"]?.toDate().toLocaleDateString()}
            Item: {spending["Item Description"]}
            Price: {spending["Price"]}
            Store: {spending["Store"]}
            </p>
          </h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;
