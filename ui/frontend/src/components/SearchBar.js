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
            return item.value.toLowerCase().startsWith(currSearch.toLowerCase());
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
        // get inner text of div element (full state name) and set selection
        setSelection(event.target.innerText);

        // get code and return for database query
        let code = ""
        for (const [key, value] of Object.entries(data)) {
            if  (value.value === event.target.innerText){
                code = value.code;
            }
        }
        childToParent(code);
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
                {dataFiltered.slice(0, 55).map((item, index) => {
                    return <div className="search-item" key={index} onClick={makeSelection}>{item.value}</div>
                })}
            </div>
            )}
        </div>
        
        
    )
}

export default SearchBar;