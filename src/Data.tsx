'use client'
import React from 'react';
import './App.scss';
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'


function Data() {
  const [address, setAddress] = React.useState('');
  const [landlord, setLandlord] = React.useState('');

  return (

    <div>
        <div>Are these two entities the same?</div>
        <div className='options-list'>
        <button>Yes</button>
        <button>Kinda</button>
        <button>No</button>
        </div>
    </div>
  );
}

export default Data;
