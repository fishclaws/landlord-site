'use client'
import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.scss';
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { findByName, getAddresses } from './services'
import { LandlordNameFound, NameSearchResult, SearchResult } from './ResultTypes';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import Result from './Result';
import ReactGA from "react-ga4";
import Header from './Header';
import Banner from './Banner';
import Organize from './Organize';

const MEASUREMENT_ID = "G-2B5P18PPBF"; // YOUR_OWN_TRACKING_ID

// requestAnim shim layer by Paul Irish
(window as any).requestAnimFrame = (function () {
  return window.requestAnimationFrame || (window as any).webkitRequestAnimationFrame || (window as any).mozRequestAnimationFrame || (window as any).oRequestAnimationFrame || (window as any).msRequestAnimationFrame || function ( /* function */ callback: any, /* DOMElement */ element: any) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

function draw(canvas: any) {

  if (!canvas.getContext) {
    return;
  }
  const ctx = canvas.getContext('2d');

  // set line stroke and line width
  ctx.strokeStyle = '#d3ff00';
  ctx.lineWidth = 5;

  // draw a red line
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(300, 100);
  ctx.stroke();

}


function App({organize}: {organize?: boolean}) {
  const { addressSearch, query } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = React.useState('');
  const [landlord, setLandlord] = React.useState('');
  const [addressOptions, setAddressOptions] = React.useState([]);
  const [result, setResult] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [focus, setFocus] = React.useState('')
  const [searchType, setSearchType] = React.useState('address')
  const [nameNotFound, setNameNotFound] = React.useState(false)
  const [stopSearch, setStopSearch] = React.useState(false)
  const [showLandlordSearchError, setShowLandlordSearchError] = React.useState(false)


  useEffect(() => {
    ReactGA.initialize(MEASUREMENT_ID);
  })

  useEffect(() => {
    window.scrollTo(0,0); 

    if (stopSearch) {
      setStopSearch(false)
      return
    }
    let title = location.pathname.split('/')[1]?.replace('/', '')
    if (title==='') {
      title = 'landing'
    }
    console.log('title: ' + title)
    ReactGA.send({ hitType: "pageview", page: location.pathname, title });

    if (addressSearch) {
      setSearchType('address')
      search('address', addressSearch)
    } else if (query) {
      setSearchType('landlord')
      search('landlord', query)
    } else {
      setResult(null)
    }
  }, [location, addressSearch, query]);

  useEffect(() => {
    if (organize) {
      setResult(null)
    }
  }, [organize])


  const canvas = useRef(null);
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    if (!canvas || !canvas.current) {
      return
    }
    console.log(canvas.current);
    const c: any = canvas.current;
    console.log(c.parentNode);
    c.width = c.parentNode.offsetWidth;
    c.height = c.parentNode.offsetHeight;
    draw(canvas.current)
  }





  function search(searchType: string, query: string | undefined) {
    setShowLandlordSearchError(false)
    if (isLoading) return;
    setIsLoading(true)
    if (searchType === 'address') {
      getAddresses(query || address)
        .then((result: SearchResult) => {
          setIsLoading(false)

          if (result.type !== 'multiple-addresses') {
            setResult(result as any)
            setAddress('')
            setLandlord('')
            const newPath = `/address/${result.property.address_full}`;
            if (location.pathname !== newPath && !stopSearch) {
              console.log('navigate called')
              navigate(newPath)
            }
            setStopSearch(true)

          } else {
            setAddressOptions(Object.keys(result.addresses).map((key) => result.addresses[key][0].address_full) as any)
          }

        })
    } else if (searchType === 'landlord'){
      findByName(query || landlord)
        .then((result: NameSearchResult) => {
          setIsLoading(false)
          if (result.type === 'no-landlord-name-found') {
            setShowLandlordSearchError(true)
          }
          if (result.type === 'landlord-name-found') {
            setNameNotFound(false)
            setResult(result as any)
            setAddress('')
            setLandlord('')
            const newPath = `/search/${query || landlord}`;
            if (location.pathname !== newPath && !stopSearch) {
              navigate(newPath)
            }
            setStopSearch(true)

          } else if (result.type === 'no-landlord-name-found') {
            setNameNotFound(true)
          }
        })
    }
  }

  function closeResult() {
    navigate(`/`, { replace: true })
    setResult(null)
  }

  function search_selected(addy: any) {
    setAddressOptions([])
    setAddress(addy)
    search(searchType, addy)
  }

  function handleKeyPress(event: any) {
    // This is perfectly safe in react, it correctly detect the keys
    if (event.key === 'Enter') {
      search(searchType, undefined)
    }
  }


  return (

    <div>
      {
      location.pathname === '/' ? <Banner></Banner> : undefined
      }
      <Header></Header>
      <div className='body'>
      {/* <Info message="This data is collected from PortlandMaps.com and sos.oregon.gov. If something is incorrect please hover-over it and click the &quot;!&quot; button" /> */}

      {isLoading ?
        (<div className='fade'>
          <div className='loading'>Fetching Results</div>
          <div className="spinner-box">
            <div className="leo-border-1">
              <div className="leo-core-1"></div>
            </div>
            <div className="leo-border-2">
              <div className="leo-core-2"></div>
            </div>
          </div>
        </div>) : null}

      {/* <div className="banner">Vote TJ for County Commissioner</div> */}


      {/* <img className="snail" src = "images/snail.svg" alt="snail"/> */}
      <div className='main-container'>
        {/* <div className='canvas-container'>
        <canvas id="canvas" height="100%" width="100%" ref={canvas}></canvas>
        </div> */}
        <div className='headerContainer'>
          {/* <img className='post' src="/images/post.png" alt="a post"></img> */}
          <h1>
            <div className="name">
              Rate<br />Your<br />Landlord<br />PDX<br />.com
            </div>
          </h1>
        </div>
        <div className='inputs'>
          <input
            className={focus === 'address' ? 'grow' : undefined}
            value={address}
            type='text'
            onChange={event => {
              setAddress(
                event.target.value
              );
            }}
            placeholder="Street Address"
            onFocus={event => {
              setSearchType('address')
              setFocus('address')
            }}
            onKeyDown={handleKeyPress}></input>
          <div className='or'>or</div>
          <input
            className={focus === 'landlord' ? 'grow' : undefined}
            value={landlord}
            type='text'
            onChange={event => {
              setLandlord(
                event.target.value
              );
            }}
            onFocus={event => {
              setSearchType('landlord')
              setFocus('landlord')
            }}
            placeholder="Landlord Name"
            onKeyDown={handleKeyPress}></input>
        </div>
        {landlord || address ?
          <div className='search-container'>
            <button className='search' onClick={() => search(searchType, searchType === 'address' ? address: landlord)}>search</button>
          </div>
          :
          null
        }

        {/* {[0,0,0,0,0,0,0].map((a) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="200" height="300">
          <rect x="90" y="150" width="20" height="150" fill="#4c3923" />
          <g transform="scale(2,2) translate(-50, -50)">

            <polygon points="100,100 80,130 120,130" fill="#0f5b23" />
            <polygon points="100,120 70,150 130,150" fill="#0f5b23" />
            <polygon points="100,80 85,110 115,110" fill="#0f5b23" />
            <polygon points="100,90 75,120 125,120" fill="#0f5b23" />
            <polygon points="100,70 90,95 110,95" fill="#0f5b23" />
            <polygon points="100,60 95,80 105,80" fill="#0f5b23" />
          </g>
        </svg>

        ))} */}
        {addressOptions.length > 0 && !result ?
          <div className='options-container'>
            <div>Did you mean any of these?</div>
            {
              addressOptions.map((address, i) => (
                <button key={i} className='address-options' onClick={() => search_selected(address)}>{address}</button>
              ))
            }
            <button className='address-options' onClick={() => setAddressOptions([])}>None of These</button>
          </div>
          : <div></div>}

          {
            showLandlordSearchError &&
            <div className='landlord-search-error-wrapper'>
              <div className='landlord-search-error'>
                <div>Couldn't find any landlords by that name.</div>
                <br/>
                <div>It's possible you're searching the property management company, which we do not track</div>
              </div>
            </div>
          }

      </div>




    </div>
          {result &&
        <Result result={result} closeResult={closeResult} resultType={searchType}></Result>}

        {
          organize &&
          <Organize></Organize>
        }
    </div>
  );
}

export default App;
