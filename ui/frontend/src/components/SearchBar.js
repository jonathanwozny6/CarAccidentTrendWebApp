// from tutorial: https://www.youtube.com/watch?v=x7niho285qs
import React from 'react';
import {useEffect, useState} from 'react';
import "./SearchBar.css";

function SearchBar({placeholder, data, childToParent}) {
    // stores list of filtered data
    const [dataFiltered, setDataFiltered] = useState(data.map(item => {return item.value}));

    // state of whether the dropdown is open or not
    const [filterOpen, setFilterOpen] = useState(false);

    // height in pixels of the dropdown display
    const [resBoxHeight, setResBoxHeight] = useState(120);

    // currently selected item
    const [selection, setSelection] = useState(placeholder);

    // current input in search box
    const [currSearch, setCurrSearch] = useState(1);

    // number of elements to display in dropdown
    const numDisplay = 5;

    // function for display of dropdown on user text input
    const FilterSearch = (event) => {

        // set the current search to the user input
        setCurrSearch(event.target.value);

        // get the current filtered data
        const currFilter = data.filter((item) => {
            return item.value.toLowerCase().startsWith(currSearch.toLowerCase());
        });


        // if the search bar is empty and dropdown closed
        if (currSearch === "" && filterOpen===false){
          // filtered data is empty
          setDataFiltered([]);

          // initialize display so that it will show at most 5 elements at once
          setResBoxHeight(numDisplay*20)
        }
        // if the search bar is empty and dropdown open
        else if(currSearch ==="" && filterOpen===true){
          // show all options
          const allItems = data.map((item) => {
            return item;
          })
          setDataFiltered(allItems);

          // set display to show at most 5 elements at once
          setResBoxHeight(numDisplay*20)
        }
        // if the search bar is not empty and dropdown is not open
        else if (currSearch !== "" && filterOpen === false){
          // open the dropdown
          setFilterOpen(true)

          // only show filtered data
          setDataFiltered(currFilter);

          // set the dropdown to show either the specific maximum value or the filtered values if lower
          setResBoxHeight(Math.min(dataFiltered.length*20, numDisplay*20))
        }
        // if the search bar is not empty and the dropdown is open
        else if (currSearch !== "" && filterOpen === true){
          // set dropdown to open
          setFilterOpen(true)

          // only show filtered data
          setDataFiltered(currFilter);

          // set the dropdown to show either the specific maximum value or the filtered values if lower
          setResBoxHeight(Math.min(dataFiltered.length*20, numDisplay*20))
        }
    }

    // function to open dropdown on click
    const OpenFilter = () => {
        // open/close filter
        setFilterOpen(!filterOpen);   

        // set filtered data to display all entries
        setDataFiltered(data.map(item => {return item}))    
    }

    // function to make selection on click
    const makeSelection = (event) => {
        // close dropdown once selection is made
        setCurrSearch("")
        setFilterOpen(false)

        // get inner text of div element (full state name) and set selection
        setSelection(event.target.innerText);

        // get code and return for database query
        let code = ""
        for (const [key, value] of Object.entries(data)) {
            if  (value.value === event.target.innerText){
                code = value.code;
            }
        }

        // send data to parent
        childToParent(code);
    }

    return (
        <div className="search">
            <div className="input-container">
                <input className="search-input" type="text" placeholder={selection} onChange={FilterSearch}/>
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
