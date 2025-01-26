import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import logo from '/tom.svg';  // Add logo import

const apiKey = 'AHCWCOLDD4CY0EHG';

function Tom() {
  const [stock, setStock] = useState("");
  const [stockprice, setStockprice] = useState("");
  const [stockalert, setStockalert] = useState("");
  const [stockquan, setStockquan] = useState("");
  const [totlprice, setTotlprice] = useState("");

  const [data, setData] = useState(null);  // API data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Arrays
  const [stocklist, setStocklist] = useState([]);
  const [showFinished, setShowFinished] = useState(true); // stocked which are checked

  useEffect(() => {
    // To get the stocklist from the local storage
    let stocksstring = localStorage.getItem("stocklist");

    if (stocksstring) {
      let storedStocklist = JSON.parse(stocksstring);
      setStocklist(storedStocklist);
    }
  }, []);

  // To save to local storage
  const saveToLocalStorage = (updatedStocklist) => {
    localStorage.setItem("stocklist", JSON.stringify(updatedStocklist));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleAdd = () => {
    let total = stockquan * stockalert;

    const newStocklist = [
      ...stocklist,
      { id: uuidv4(), stock, stockprice, stockalert, stockquan, total, isCompleted: false }
    ];

    setStocklist(newStocklist);
    setStock(stock);
    setStockprice(stockprice);
    setStockalert(stockalert);
    setStockquan(stockquan);
    setTotlprice(`${total} for ${stock} (${stockquan})`);


    saveToLocalStorage(newStocklist); // Save after updating stocklist
  };

  const handleChange = (e) => {
    setStock(e.target.value.toUpperCase());
  };

  const handlePrice = (e) => {
    setStockprice(e.target.value);
  };

  const handleAlertChange = (e) => {
    setStockalert(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setStockquan(e.target.value);
  };

  const handleCheck = (e) => {
    const id = e.target.name;
    const index = stocklist.findIndex(item => item.id === id);

    let newStocklist = [...stocklist];
    newStocklist[index].isCompleted = !newStocklist[index].isCompleted;

    setStocklist(newStocklist);
    saveToLocalStorage(newStocklist);
  };

  const handleEdit = (e, id) => {
    let editStock = stocklist.find(i => i.id === id);

    setStock(editStock.stock);
    setStockprice(editStock.stockprice);
    setStockalert(editStock.stockalert);
    setStockquan(editStock.stockquan);

    let newStocklist = stocklist.filter(item => item.id !== id);
    setStocklist(newStocklist);
    saveToLocalStorage(newStocklist);
  };

  const handleDelete = (e, id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      let newStocklist = stocklist.filter(item => item.id !== id);
      setStocklist(newStocklist);
      saveToLocalStorage(newStocklist);
    }
  };

  const fetchStockData = async () => {
    if (!stock || stock.length < 1) {
      alert("Please enter a valid stock symbol!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${apiKey}`
      );

      if (response.data['Error Message']) {
        setError(new Error('Invalid stock symbol or no data available'));
        return;
      }

      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the latest date from the response
  const getLatestStockInfo = (data) => {
    if (data && data["Time Series (Daily)"]) {
      const timeSeries = data["Time Series (Daily)"];
      const latestDate = Object.keys(timeSeries)[0]; // Get the latest date
      return timeSeries[latestDate];
    }
    return null;
  };

  const latestStockInfo = data ? getLatestStockInfo(data) : null;

  useEffect(() => {
    if (latestStockInfo) {
      setStockprice(latestStockInfo["1. open"]); // Set stock price when data is loaded
    }
  }, [latestStockInfo]);

  return (
    <>
      <header>
        <nav>


          <div className="mainlogo flex items-center space-x-6">
            <div className="logo">
              <img className="log w-14 h-16" src={logo} alt="Tom Stock Logo" />
            </div>
            <h1>TOM StockAlert</h1>
          </div>

          
          <div className="form">
            <input
              onChange={handleChange}
              value={stock}
              placeholder="Enter Stock Name"
              type="text"
              className="searchbox w-3/5 inbox rounded-md p-2"
            />
            <button
              className="searchbutton font-bold disabled:bg-black"
              type="submit"
              onClick={fetchStockData}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Search"}
            </button>
          
          </div>
        
        
        </nav>
      </header>

      {error && <div>Error fetching data: {error.message}</div>}

      <div className="container rounded-lg">
        <h1 className="text-2xl font-bold text-red-900">Stocks Alert App !!</h1>
        <p>Set stocks prices here!</p>

        <div>
          <h2>Stock Information</h2>
          {latestStockInfo && (
            <div>
              <h2>Stock Information for: {data["Meta Data"]["2. Symbol"]}</h2>
              <ul>
                <li>Open: {latestStockInfo["1. open"]}</li>
                <li>High: {latestStockInfo["2. high"]}</li>
                <li>Low: {latestStockInfo["3. low"]}</li>
                <li>Close: {latestStockInfo["4. close"]}</li>
                <li>Volume: {latestStockInfo["5. volume"]}</li>
              </ul>
            </div>
          )}
        </div>

        <div className="addstock m-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold">Add Your stocks Here.....</h2>

          <div className="total">Total price is: {totlprice}</div>
          <div className="inputs flex flex-col">
            <label className="mx-2" htmlFor="show">Stock Name</label>
            <input value={stock} type="text" className="inbox rounded-md p-2" />
            
            <div className="prices flex gap-5">
              <div className="stockprice flex flex-col">
                <label className="mx-2" htmlFor="show">Stock Price</label>
                <input onChange={handlePrice} value={stockprice} type="number" className="inbox rounded-md p-2" disabled="true"/>
              </div>

              <div className="stockalert flex flex-col">
                <label className="mx-2" htmlFor="show">Price Alert</label>
                <input onChange={handleAlertChange} value={stockalert} type="number" className="inbox rounded-md p-2" />
              </div>
            </div>

            <label className="mx-2" htmlFor="show">Stock Quantity</label>
            <input onChange={handleQuantityChange} value={stockquan} type="number" className="inbox w-1/5 rounded-md p-2" />
          </div>

          <button
            disabled={stock.length <= 2 || !stockquan || !stockalert || !stockprice}
            onClick={handleAdd}
            className="submit bg-black text-white p-2 mx-6 font-bold rounded-md hover:bg-slate-600 disabled:bg-black"
          >
            Set Alert!!
          </button>
        </div>

        <input className="my-4" id="show" onChange={toggleFinished} type="checkbox" checked={showFinished} />
        <label htmlFor="show">Show completed stocks</label>

        <ul className="list-group">
          {stocklist.filter(item => showFinished || !item.isCompleted).map(item => (
            <li key={item.id}>
              <div className="stcklist justify-between items-center">
                <div>
                  <input onChange={handleCheck} checked={item.isCompleted} name={item.id} type="checkbox" />
           
                  <span>{item.stock}</span>
                  <span>{item.stockprice}</span>
                  <span>{item.stockquan}</span>
                  <span>{item.stockalert}</span>
                  <span>{item.total}</span>
                </div>
                <div className="buttons flex gap-4">
                  <button onClick={(e) => handleEdit(e, item.id)}>Edit</button>
                  <button onClick={(e) => handleDelete(e, item.id)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Tom;
