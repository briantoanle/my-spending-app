import React, { Component, useState, useEffect } from 'react';
import './App.css';
import { Auth } from "./components/auth";

import { db } from './config/firebase';
import { getDocs, collection, addDoc, Timestamp, deleteDoc, doc} from 'firebase/firestore';
function App() {
  const [spendingList, setSpendingList] = useState([]);

  // New Spending State
  const [newSpendingDate, setNewSpendingDate] = useState("");
  const [newSpendingItem, setNewSpendingItem] = useState("");
  const [newSpendingPrice, setNewSpendingPrice] = useState(0.00);
  const [newSpendingStore, setNewSpendingStore] = useState("");



  const spendingCollectionRef = collection(db, "Budget");


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
  const deleteSpending = async (id) => {
    // doc gets name from collection, my collection name is "Budget". If you're not sure of your collection name, check firestore
    const spendingDoc = doc(db, "Budget",id);
    await deleteDoc(spendingDoc)
    getSpendingList();
  };

  useEffect(() => {
    getSpendingList();
  }, []);



  const onSubmit = async () => {
    try {
      await addDoc(spendingCollectionRef, {
        "Date of Purchase": Timestamp.fromDate(new Date(newSpendingDate)),
        "Item Description": newSpendingItem,
        "Price": newSpendingPrice,
        "Store": newSpendingStore,
      });
      getSpendingList();
    } catch (err) {
      console.error(err);
    }
    
  };
  return (
    <div className="App">
      <Auth />
      <div>
        <input
          placeholder="Date of purchase..."
          type="date" onChange={(e) => setNewSpendingDate(e.target.value)} />
        <input
          placeholder="Item..."
          onChange={(e) => setNewSpendingItem(e.target.value)} />
        <input
          placeholder="Price..."
          type="number"
          onChange={(e) => setNewSpendingPrice(e.target.value)} />
        <input
          placeholder="Store..."
          onChange={(e) => setNewSpendingStore(e.target.value)}
        />
        <button onClick={onSubmit}> Submit </button>

      </div>
      <div>
        <h1>Spending List:</h1>
        {spendingList.map((spending, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <p><strong>Date:</strong> {spending["Date of Purchase"]?.toDate().toLocaleDateString()}</p>
            <p><strong>Item:</strong> {spending["Item Description"]}</p>
            <p><strong>Price:</strong> {spending["Price"]?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}</p>
            <p><strong>Store:</strong> {spending["Store"]}</p>
            <button onClick = {() => deleteSpending (spending.id)}> Delete spending record</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;
