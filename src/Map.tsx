import { useEffect, useRef, useState } from "react"
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.scss';
import { getAllReviews } from "./services";
import {qs} from './SurveyQuestions'


var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxgl.accessToken = 'pk.eyJ1IjoibXNnc2x1dCIsImEiOiJja2NvZmFpbjAwMW84MnJvY3F1d2hzcW5nIn0.xMAHVsdszfolXUOk9_XI4g';

function Map() {

    
    const map = useRef(null);
    const mapContainer = useRef(null);
    const [zoom, setZoom] = useState(12);
    const [allReviews, setAllReviews] = useState([])
    const [markerEls, setMarkerEls] = useState([] as HTMLElement[])


    function getLabelText(rev: any) {
        console.log(rev)
        if (rev.selected_answers) {
          const emojis = rev.selected_answers.map((sa: any, i: number) => {
            if (sa === null) {
              return null
            }
            if (qs[i].answersOfNote.includes(sa))
                return qs[i].emoji
          }).filter((a: any) => a)
    
          if (emojis.length !== 0) {
            return (emojis as string[]).join(' ');
          }
        }
        if (rev.review_text && rev.review_text !== 'null')
          if (rev.review_text.length > 8) {
            return (rev.review_text as string).slice(0, 8) + '...'
          } else {
            return rev.review_text;
          }
    
        return null
      }

      useEffect(() => {
        if (map.current) return; // initialize map only once
        const mapOptions: any = {
          container: mapContainer.current,
          style: 'mapbox://styles/msgslut/cltktk1uv013901oi98k5fir8',
          zoom: zoom,
          pitch: 70, // pitch in degrees
        }
    
        mapOptions['center'] = [-122.676483, 45.523064]
    
        map.current = new mapboxgl.Map(mapOptions);
      })

      useEffect(() => {
        if (allReviews.length === 0)
          getAllReviews().then((reviews) => {
            setAllReviews(reviews)
            const coords: Array<[number, number]> = []
            const els = []
            const propertyIds = {} as any
            for (const rev of reviews) {
              const latlng = [parseFloat(rev.longitude), parseFloat(rev.latitude)]
              const el = document.createElement('div');
              els.push(el as any)
    
              const text = getLabelText(rev)
              if (text && !propertyIds[rev.property_id]) {
                propertyIds[rev.property_id] = true
    
                const popupHtml = `<a class="marker-text" href="/address/${rev.address}">` + text + '</a>';
    
                const popup = new mapboxgl.Popup({ className: 'review-marker' })
                  .setLngLat(latlng)
                  .setHTML(popupHtml)
                  .setMaxWidth("300px")
                  .addTo(map.current);
    
    
                coords.push(latlng as any)
              }
            }
    
            if (coords.length > 1) {
              const bounds = new mapboxgl.LngLatBounds();
    
              for (let coord of coords) {
                bounds.extend(coord);
              }
    
              (map.current as any).fitBounds(bounds, { padding: 60, pitch: 70, maxZoom: 15 });
            }
    
            setMarkerEls(els)
          })
    
      })

    return (
      <div className='map-wrapper'>
        <div ref={mapContainer} className="map-container-2" >
        </div>
      </div>
    )
}

export default Map;