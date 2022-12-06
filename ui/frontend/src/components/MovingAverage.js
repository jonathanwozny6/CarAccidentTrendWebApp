// some aspects of this code were taken from this tutorial: https://www.youtube.com/watch?v=x7niho285qs
// https://www.freecodecamp.org/news/pass-data-between-components-in-react/ 
import React from 'react';
import {useEffect, useState} from 'react';
import "./MovingAverage.css";

function MovingAverage({placeholder, childToParent, index}) {

    // currently selected item
    const [selection, setSelection] = useState(placeholder);

    // current input in search box
    const [currVal, setCurrVal] = useState("");

    // number of elements to display in dropdown and height of input in pixel
    const numDisplay = 5;
    const dropdownHeight = 30;

    const makeSelection = (event) => {
        // close dropdown once selection is made
        setCurrVal("")

        // send data to parent
        childToParent(selection, index);
    }

    return (
        <div className="search">
            <div className="input-container">
                <input className="search-input" type="text" placeholder={selection}/>
            </div>
        </div>
    )
}

export default MovingAverage;
