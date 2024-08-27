
import axios from 'axios';
import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';



const apiKey = '6VT1XMF68FGGYM6';



function Tom() {

  const [stock, setstock] = useState("")
  const [stockprice, setstockprice] = useState("")
  const [stockalert, setstockalert] = useState("")
  const [stockquan, setstockquan] = useState("")
  const [totlprice, settotlprice] = useState("")


  const [data, setData] = useState(null);  // api data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);





  // arrays 
  const [stocklist, setstocklist] = useState([])

  const [showFinished, setshowFinished] = useState(true)// stocked which are checked 







  useEffect(() => {
    // to get the stocklist from the local storage
    let stocksstring = localStorage.getItem("stocklist")

    // to run if list is non empty 
    if (stocksstring) {
      let stocklist = JSON.parse(localStorage.getItem("stocklist"))

      // pass the data in the setstocklist
      setstocklist(stocklist)
    }

  }, [])




  //to savae in local storage 
  const savetolstorage = (params) => {

    localStorage.setItem("stocklist", JSON.stringify(stocklist))
  }






  const toggleFinished = (e) => {   // checkbox
    setshowFinished(!showFinished)
  }





  const handladd = () => {   // SET ALERT -BUTTON

    let total = stockquan * stockalert;


    setstocklist([...stocklist, { id: uuidv4(), stock, stockprice, stockalert, stockquan, total, isCompleted: false }])


    setstock("")
    setstockprice("")
    setstockalert("")
    setstockquan("")
    settotlprice(total + " for " + stock + " (" + stockquan + ")")


    savetolstorage()

  }



  const handlchange = (e) => {

    setstock(e.target.value.toUpperCase())


  }
  const handlprice = (e) => {
    setstockprice(e.target.value)

  }

  const handlalert = (e) => {
    setstockalert(e.target.value)

  }

  const handlquan = (e) => {
    setstockquan(e.target.value)

  }

  const handlcheck = (e) => {
    console.log(e, e.target)

    let id = e.target.name;
    let index = stocklist.findIndex(item => {
      return item.id === id;
    })

    let newstocks = [...stocklist];

    // newtodos if true make false,if false make true
    newstocks[index].isCompleted = !newstocks[index].isCompleted;

    // update the todolist with new items list
    setstocklist(newstocks)

    savetolstorage()
  }



  const handledit = (e, id) => {

    let edit = stocklist.filter(i => i.id === id)
    setstock(edit[0].stock)
    setstockprice(edit[0].stockprice)
    setstockalert(edit[0].stockalert)
    setstockquan(edit[0].stockquan)

    let newstocks = stocklist.filter(item => {
      return item.id !== id;
    });

    setstocklist(newstocks)

    savetolstorage()

  }


  const handldelete = (e, id) => {

    if (confirm("Are you sure want to delete this item ?") == true) {

      console.log("hello delete ")

      // new array of list
      let newstocks = stocklist.filter(item => {

        // change the item id
        return item.id !== id;
      });

      //to save it in local storage 
      savetolstorage()
      setstocklist(newstocks)

    }
  }



  const fetchStockData = async () => {

    if (!stock) {

      return ; // Don't fetch data if ther is no stockname
    }

    setIsLoading(true);
    setError(null);


    try {
      const response = await axios.get(
       `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}.BSE&outputsize=full&apikey=${apiKey}`
      );
console.log(response.data);
      setData(response.data);
    }

    catch (error) {
      setError(error);
    }

    finally {
      setIsLoading(false);
    }

  };











  return (
    <>

      <header>
        <nav>
          <div className="mainlogo flex items-center space-x-6">
            <div className="logo"><img className='log w-14 h-16'
              src="./public/tom.svg" alt="" />


            </div>
            <h1>TOM StockAlert</h1>
          </div>


          <div className='form'>
            

            <input onChange={handlchange} value={stock} placeholder="Enter Stock Name" type='text' className='searchbox w-3/5 inbox rounded-md p-2' />

            <button className='searchbutton font-bold 
               disabled:bg-black'
              type="submit"
              onClick={fetchStockData} disabled={isLoading}>

              {isLoading ? 'Loading...' : 'search'}
            </button>

            </div>


         
        </nav>
      </header>

      {error && <div>Error fetching data: {error.message}</div>}


      


      <div className="container rounded-lg">

        <h1 className='text-2xl font-bold text-red-900'>Stocks Alert App !!</h1>
        <p>
          set stocks prices here !
          {error && <div>there is no such stock !!</div>}
        </p>

        
        
        
        
        
        <div>
        <h2>Stock Information </h2>



        {data && (




          <div>
            <h2>Stock Information for :- {data["Meta Data"]["2. Symbol"]}</h2>
            <ul>


              <li>OPEN: {data[""].open}</li>
              
              <li>HIGH: {data.high}</li>
              <li>LOW: {data.low}</li>
              
 <li>CLOSE: {data.close}</li>
              <li>VOLUME: {data.volume}</li>
              

            </ul>
          </div>
        )}
      </div>




        <div className="addstock m-5 flex flex-col gap-4 ">


          <h2 className="text-lg font-bold">Add Your stocks Here.....</h2>




          <div className="total">total price is :{totlprice}</div>
          <div className="inputs flex flex-col">





            <label className='mx-2 
        ' htmlFor="show">Stock Name</label>

            
            





            <div className="prices flex  gap-5">

              <div className="stockprice flex flex-col">
                <label className='mx-2
        ' htmlFor="show">Stock Price</label>
                <input onChange={handlprice} value={stockprice} type='numerical' className='inbox rounded-md p-2' />
              </div>

              <div className="stockalert flex flex-col">
                <label className='mx-2 
        ' htmlFor="show">Price Alert</label>
                <input onChange={handlalert} value={stockalert} type='numerical' className='inbox rounded-md p-2' /></div>



            </div>

            <label className='mx-2 
        ' htmlFor="show">Stock Quantity</label>
            <input onChange={handlquan} value={stockquan} type='numerical' className='inbox w-1/5 rounded-md p-2' />



          </div>



          <button disabled={stock.length <= 2}
            onClick={handladd} className='sumbit bg-black text-white p-2 mx-6 font-bold rounded-md hover:bg-slate-600
          disabled:bg-black'>Set Alert !! </button>



        </div>



        <input className='my-4' id='show' onChange={toggleFinished} type="checkbox" checked={showFinished} />
        <label className='mx-2 font-lighter
         font-serif
         ' htmlFor="show">Show Finished</label>






        <h2 className='text-lg font-bold
         '>Your Stocks List !</h2>
        <div className="stocklist">



          { // show message if stocklist is empty any item is not added to it.

            stocklist.length === 0 && <div className='message m-3 w-45 text-bold text-black'>Stock list is empty</div>

          }



          {stocklist.map(item => {
            // to acces the stocklist array items

            return (showFinished || !item.isCompleted) && <div key={item.id}

              className="stock my-3 flex w-3/5 items-center justify-between gap-8">


              <input
                //
                name={item.id} type="checkbox" onChange={handlcheck}
                //value 
                checked={stock.isCompleted} id="" />


              <div className={item.isCompleted ? "line-through" : ""}>
                <div className="stocklabel flex space-x-3">



                  <div className="stockname">{item.stock}</div>
                  <div className="stockprice">{item.stockprice}</div>
                  <div className="stockalert">{item.stockalert}</div>
                  <div className="stockalert">{item.stockquan}</div>
                  <div className="totlprice">{item.total}</div>


                </div>



              </div>
              <div className="buttons">


                <button onClick={(e) => { handledit(e, item.id) }}
                  className="edit  bg-black text-white p-2 mx-1 font-bold rounded-md hover:bg-slate-600"> Edit </button>

                <button onClick={(e) => { handldelete(e, item.id) }}
                  className="delete  bg-black text-white p-2 mx-1 font-bold rounded-md hover:bg-slate-600"> Delete </button>


              </div>

            </div>

          })}
        </div>


      </div>





      





    </>
  )
}

export default Tom



