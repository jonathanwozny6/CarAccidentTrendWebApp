// from tutorial: https://www.youtube.com/watch?v=x7niho285qs

import React from 'react';
import {useEffect, useState} from 'react';
import "./SearchBar.css";

function SearchBar({placeholder, data, childToParent}) {
    const [dataFiltered, setDataFiltered] = useState(data.map(item => {return item}));
    const [filterOpen, setFilterOpen] = useState(false);
    const [firstOpen, setFirstOpen] = useState(true);
    const [resBoxHeight, setResBoxHeight] = useState(120);
    const [selection, setSelection] = useState("");

    const numDisplay = 5;

    const FilterSearch = (event) => {
        const currSearch = event.target.value;
        const currFilter = data.filter((item) => {
            return item.state.toLowerCase().startsWith(currSearch.toLowerCase());
        });

        if (currSearch === "" && filterOpen===false){
          setDataFiltered([]);
          setResBoxHeight(numDisplay*20)
        }
        else if(currSearch ==="" && filterOpen===true && firstOpen===true){
          const allItems = data.map((item) => {
            return item;
          })
          setDataFiltered(allItems);
        }
        else if (currSearch !== "" && filterOpen === false){
          setFilterOpen(true)
          setDataFiltered(currFilter);
          setResBoxHeight(Math.min(dataFiltered.length*20, numDisplay*20))
        }
        else if (currSearch !== ""){
          setFilterOpen(true)
          setDataFiltered(currFilter);
          setFirstOpen(false)
          setResBoxHeight(Math.min(dataFiltered.length*20, numDisplay*20))
          console.log(selection)
        }
        else{
          setFilterOpen(false)
          setFirstOpen(false)
          setDataFiltered([])
          setResBoxHeight(numDisplay*20)
        }
    }

    const OpenFilter = () => {
        setFilterOpen(!filterOpen);   
        setDataFiltered(data.map(item => {return item}))    
    }

    const makeSelection = (event) => {
        setSelection(String(event.target.innerText));
        childToParent(String(event.target.innerText));
    }

    return (
        <div className="search">
            <div className="input-container">
                <input className="search-input" type="text" placeholder={placeholder} onChange={FilterSearch}/>
                <div className="down-arrow" onClick={OpenFilter}>
                  <svg width="20" height="20">
                    <polygon points="4,7 12,7 8,11"/>
                  </svg>
                </div>
            </div>
            {filterOpen===true && 
            (<div className="data-results" style={{height: resBoxHeight}}>
                {dataFiltered.slice(0, 30).map((item, index) => {
                    return <div className="search-item" key={index} onClick={makeSelection}>{item.state}</div>
                })}
            </div>
            )}
        </div>
        
    )
}

export default SearchBar;