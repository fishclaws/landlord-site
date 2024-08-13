'use client'
import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.scss';

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { findByName, findPropertyManager, getAddresses, getAllReviews } from './services'
import { LandlordNameFound, NameSearchResult, SearchResult } from './ResultTypes';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import Result from './Result';
import ReactGA from "react-ga4";
import Header from './Header';
import Banner from './Banner';
import Organize from './Organize';
import Map from './Map';
import { qs } from './SurveyQuestions';
import Footer from './Footer';
import LandlordGrid from './LandlordGrid';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
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


function App({ organize }: { organize?: boolean }) {
  const { addressSearch, query, propertyManager } = useParams();
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
  const [autocomplete, setAutocomplete] = useState<any>(null);







  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyD8smkF85FEL6zYis2D3sG9PVzzfuqO3LY', // Replace with your Google Maps API key
    libraries: ['places'],
  });


  useEffect(() => {
    ReactGA.initialize(MEASUREMENT_ID);
  })

  useEffect(() => {
    window.scrollTo(0, 0);

    if (stopSearch) {
      setStopSearch(false)
      return
    }
    let title = location.pathname.split('/')[1]?.replace('/', '')
    if (title === '') {
      title = 'landing'
      setResult(null)
    }
    console.log('title: ' + title)
    ReactGA.send({ hitType: "pageview", page: location.pathname, title });

    if (addressSearch) {
      setSearchType('address')
      search('address', addressSearch)
    } else if (query) {
      setSearchType('landlord')
      search('landlord', query)
    } else if (propertyManager) {
      setSearchType('propertyManager')
      search('propertyManager', propertyManager)
    } else {
      setResult(null)
    }
  }, [location, addressSearch, propertyManager, query]);

  useEffect(() => {
    if (organize) {
      setResult(null)
    }
  }, [organize])

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
    } else if (searchType === 'landlord') {
      findByName(query || landlord)
        .then((result: NameSearchResult) => {
          setIsLoading(false)
          let foundButIncludesPropertyManagment = false
          if (result.type === 'no-landlord-name-found') {
            setShowLandlordSearchError(true)
          } else {
            foundButIncludesPropertyManagment = (result as any).data.business_owners[0].business_name.includes('PROPERTY MANAGEMENT')
          }
          
          if (result.type === 'landlord-name-found' && !foundButIncludesPropertyManagment) {
            setNameNotFound(false)
            setResult(result as any)
            setAddress('')
            setLandlord('')
            const newPath = `/search/${query || landlord}`;
            if (location.pathname !== newPath && !stopSearch) {
              navigate(newPath)
            }
            setStopSearch(true)

          } else if (result.type === 'no-landlord-name-found' || foundButIncludesPropertyManagment) {
            const name = query || landlord
            findPropertyManager(name)
            .then((result: any) => {
              setIsLoading(false)
              if (result.type === 'property-manager-found') {
                setNameNotFound(false)
                setResult(result as any)
                const newPath = `/property-manager/${name}`;
                if (location.pathname !== newPath && !stopSearch) {
                  navigate(newPath)
                }
                setStopSearch(true)
              } else {
                setNameNotFound(true)
              }
            })
          }
        })
    } else if (searchType === 'propertyManager') {
      findPropertyManager(propertyManager!)
        .then((result: any) => {
          setIsLoading(false)
          if (result.type === 'property-manager-found') {
            setNameNotFound(false)
            setResult(result as any)
            const newPath = `/property-manager/${result.name}`;
            if (location.pathname !== newPath && !stopSearch) {
              navigate(newPath)
            }
            setStopSearch(true)
          }
        })
    }
  }

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        
        let address = null
        let addresses = place.formatted_address.split(', Portland')
        if (addresses.length > 0) {
          address = addresses[0]
        } else {
          address = place.formatted_address.split(',')[0]
        }

        setAddress(address);
        search('address', address);
      }
    }
  };

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
      {<div className='body' style={{ display: !result && !organize ? 'block' : 'none' }}>
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

          {
            !addressSearch && !query && !result && !organize && <Map/>
          }
          <div className='search-title'>search your building or landlord</div>
          <div className='inputs'>

            <div className="input-container">
              {isLoaded &&
                <Autocomplete onLoad={(a) => setAutocomplete(a)} onPlaceChanged={onPlaceChanged}>
                <input
                key="address-input" 
                autoFocus={true}
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
                  setLandlord('')
                }}
                onKeyDown={handleKeyPress}></input>
              </Autocomplete>}{address && focus === 'address' && <div className='mobile-search'><button onClick={() => search(searchType, address)}>→</button></div>}
              
            </div>
            <div className='or'>or</div>
            <div  className="input-container">
              <input
                key="landlord-input"
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
                  setAddress('')
                }}
                placeholder="Landlord Name"
                onKeyDown={handleKeyPress}></input>{landlord && focus === 'landlord' && <div className='mobile-search'><button onClick={() => search(searchType, landlord)}>→</button></div>}
            </div>
          </div>
          {landlord || address ?
            <div className='search-container'>
              <button className='search' onClick={() => search(searchType, searchType === 'address' ? address : landlord)}>search</button>
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
              <button className='address-options none-of-these' onClick={() => setAddressOptions([])}>None of These</button>
            </div>
            : <div></div>}

          {
            showLandlordSearchError &&
            <div className='landlord-search-error-wrapper'>
              <div className='landlord-search-error'>
                <div>Couldn't find any landlords by that name.</div>
                <br />
                <div>It's possible you're searching the property management company, which we do not track</div>
              </div>
            </div>
          }
          <div className='app-buffer'></div>
        </div>



        {/* <LandlordGrid/> */}
      </div>}
      {result &&
        <Result result={result} closeResult={closeResult} resultType={searchType}></Result>}

      {
        organize &&
        <Organize></Organize>
      }

      {/* <Footer/> */}
    </div>
  );
}

export default App;
