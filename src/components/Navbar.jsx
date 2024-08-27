import React from 'react'
import { useState } from 'react'





function navbar(){
    return (


        <header>
            <nav>
                <div className="mainlogo flex items-center space-x-6">
                    <div className="logo"><img className='log w-14 h-16'
                        src="./public/tom.svg" alt="" />


                    </div>
                    <h1>TOM StockAlert</h1>
                </div>


                <div className='form'>
                    <input type="text" placeholder="Enter Stock here......" class="searchbox" />
                    <button type="submit" class="searchbutton">search</button>





                </div>
            </nav>
        </header>




        /*  <nav className='nav flex justify-between bg-blue-800 py-1'>
              <div className="mainlogo flex items-center space-x-4"><div className="logo"><img className='log w-12 h-12'
  
                  src="./public/tom.svg" alt="" /></div>
  
                  <div> <h1 className="appname text-white font-serif font-bold text-2xl">TOM StockAlert </h1></div>
  
              </div>
  
              <ul className='flex justify-between text-white space-x-8 mx-8'><li>Home</li>
                  <li>Your Stocks</li>
                  <li>About</li>
                  <li>Contact me</li>
  
              </ul>
  
          </nav>   */
    )
}

export default navbar
