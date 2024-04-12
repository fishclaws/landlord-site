import { useEffect, useRef, useState } from "react"
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.scss';
import { getAllReviews } from "./services";
import {qs} from './SurveyQuestions'


import mapboxgl from 'mapbox-gl';
const AnimatedPopup = require('mapbox-gl-animated-popup');

mapboxgl.accessToken = 'pk.eyJ1IjoibXNnc2x1dCIsImEiOiJja2NvZmFpbjAwMW84MnJvY3F1d2hzcW5nIn0.xMAHVsdszfolXUOk9_XI4g';

function Map() {

    
    const map = useRef(null);
    const mapContainer = useRef(null);
    const [zoom, setZoom] = useState(12);
    const [allReviews, setAllReviews] = useState([])
    const [markerEls, setMarkerEls] = useState([] as HTMLElement[])


    function getLabelText(rev: any) {
        console.log(rev)
        if (rev.review_text && rev.review_text !== 'null' && rev.review_text !== 'undefined') {
            if (rev.review_text.length > 15) {
              return {
                type: 'comment',
                text: (rev.review_text as string).slice(0, 15) + '...'
              }
            } else {
              return {
                type: 'comment',
                text: rev.review_text
              }
            }
        }
        if (rev.selected_answers) {
          const emojis = rev.selected_answers.map((sa: any, i: number) => {
            if (sa === null) {
              return null
            }
            if (qs[i].answersOfNote.includes(sa))
                return qs[i].emoji
          }).filter((a: any) => a)
    
          if (emojis.length !== 0) {
            return {
              type: 'emoji',
              text: (emojis as string[]).join(' ')
            };
          }
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
    
        map.current = new mapboxgl.Map(mapOptions) as any;

      })

      

      useEffect(() => {
        if (allReviews.length === 0)
          getAllReviews().then((reviews) => {
            setAllReviews(reviews)
            const coords: Array<[number, number]> = []
            const els = []
            const propertyIds = {} as any
            let counter = 0;
            for (const rev of reviews) {
              const latlng = [parseFloat(rev.longitude), parseFloat(rev.latitude)]
              const el = document.createElement('div');
              els.push(el as any)
    
              const text = getLabelText(rev)
              if (text && !propertyIds[rev.property_id]) {
                propertyIds[rev.property_id] = true
    
                const popupHtml = `<a class="${text.type}-text" href="/address/${rev.address}"></a>`;
                
                const typeOut = (text: string, el: HTMLElement) => {
                  const a = el.getElementsByTagName('a')[0]
                  const addLetters = (index: number) => {
                    if (index > text.length || text[index] === undefined) {
                      return
                    }
                    a.innerText += text[index]
                    setTimeout(addLetters, 100, index + 1)
                  }
                  addLetters(0)
                }
                // const popup = new mapboxgl.Popup({ className: 'review-marker' })
                setTimeout(() => {
                  const popup = new AnimatedPopup({
                    openingAnimation: {
                        duration: 1000,
                        easing: 'easeOutElastic',
                        transform: 'scale'
                    },
                    closingAnimation: {
                        duration: 300,
                        easing: 'easeInBack',
                        transform: 'scale'
                    },
                    className: text.type + '-marker'
              })
                  .setLngLat(latlng as any)
                  .setHTML(popupHtml)
                  .setMaxWidth("300px")
                  .addTo(map.current as any);
              if (text.type === 'emoji') {
                (popup._content as HTMLElement).style.scale = '1.8'
              }
              console.log(popup);
              typeOut(text.text, popup._container)
            
            }, 1000 + counter * 500);
    

                coords.push(latlng as any)
                counter++

              }
            }
    
            if (coords.length > 1) {
              const bounds = new mapboxgl.LngLatBounds();
    
              for (let coord of coords) {
                bounds.extend(coord);
              }
    
              (map.current as any).fitBounds(bounds, { padding: 3, pitch: 55, maxZoom: 15 });
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