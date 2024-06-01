import { useEffect, useRef, useState } from "react"
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.scss';
import { getAllReviews } from "./services";
import { Question, qs, selectionQuestions } from './SurveyQuestions'


import mapboxgl from 'mapbox-gl';
import { Review, ReviewResult } from "./ResultTypes";
const AnimatedPopup = require('mapbox-gl-animated-popup');

mapboxgl.accessToken = 'pk.eyJ1IjoibXNnc2x1dCIsImEiOiJja2NvZmFpbjAwMW84MnJvY3F1d2hzcW5nIn0.xMAHVsdszfolXUOk9_XI4g';

function setTimeoutRAF<T extends any[]>(callback: (...args: T) => void, delay: number, ...args: any[]) {
  let start = null as number | null;
  const rafCallback = (timestamp: number) => {
    if (!start) start = timestamp;
    if (timestamp - start >= delay) {
      callback(...args as any);
    } else {
      requestAnimationFrame(rafCallback);
    }
  };
  requestAnimationFrame(rafCallback);
}

interface EmojiIssue {
  emoji: string;
  selected: boolean;
}

type ReviewEmoji = [ReviewResult, string]


function Map() {


  const map = useRef(null);
  const mapContainer = useRef(null);
  const [zoom, setZoom] = useState(12);
  const [allReviews, setAllReviews] = useState([] as ReviewResult[])
  const [markerEls, setMarkerEls] = useState([] as HTMLElement[])
  const [issueEmojis, setIssueEmojis] = useState([] as EmojiIssue[])
  const animating = useRef(true)
  const [selectedReviews, setSelectedReviews] = useState([] as ReviewEmoji[])
  const [textReviewSelected, setTextReviewSelected] = useState(false)

  function getLabelText(rev: Review) {
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
        if (qs[i] === undefined) {
          return selectionQuestions.questions[i - qs.length].emoji
        }
        else if (qs[i].answersOfNote && qs[i].answersOfNote!.includes(sa))
          return qs[i].emoji
      }).filter((a: any) => a)

      if (emojis.length !== 0) {
        return {
          type: 'emoji',
          text: (emojis as string[]).join('')
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

    let emojiList = qs.map(q => q.emoji).concat(selectionQuestions.questions.map(e => e.emoji))
    emojiList = emojiList.filter((e, i) => emojiList.indexOf(e) === i)

    setIssueEmojis(
      emojiList.map(emoji => ({
        emoji,
        selected: false
      }))
    )
  }, [])


  useEffect(() => {
    const reviews = [] as ReviewEmoji[]
    for (const emoji of issueEmojis) {
      if (emoji.selected) {
        animating.current = false
        const selectedId = qs.findIndex(q => q.emoji === emoji.emoji)
        if (selectedId !== -1) { 
          reviews.push(...allReviews.filter(rev => 
            rev.selected_answers.findIndex((answer, i) => i === selectedId && qs[selectedId].answersOfNote.includes(answer)) !== -1)
            .map(rev => [rev, emoji.emoji] as ReviewEmoji))
        }
        const issueEmojiId = selectionQuestions.questions.findIndex(q => q.emoji === emoji.emoji)
        if (issueEmojiId !== -1) {
          reviews.push(...allReviews.filter(rev => 
            rev.selected_answers.findIndex((answer, i) => i === issueEmojiId + qs.length && answer === 1) !== -1)
            .map(rev => [rev, emoji.emoji] as ReviewEmoji))
        }
      }
    }
    setSelectedReviews(reviews)

  }, [issueEmojis])

  

  function addReview(rev: ReviewEmoji, els: any[], isText = false) {
    const divType = 'div'
    const className = !isText ? `emoji-text` : 'comment-text'
    const popupHtml = `<${divType} class="${className}"></${divType}>`;
    const latlng = [parseFloat(rev[0].longitude), parseFloat(rev[0].latitude)]
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
      className: (isText ? 'comment' : 'emoji') + '-marker'
    })
      .setLngLat(latlng as any)
      .setHTML(popupHtml)
      .setMaxWidth("300px")
      .addTo(map.current as any);

    console.log(popup);
    popup._container.addEventListener('click', () => {
      window.location.href=`/address/${rev[0].address}`
    });
    if (!isText) {
      (popup._content as HTMLElement).style.scale = '.7'
    }
    popup._container.getElementsByClassName(className)[0].textContent = isText ? getLabelText(rev[0])!.text : rev[1];
    els.push(popup)
  }


  useEffect(() => {
    if (textReviewSelected)
      animating.current = false
    for (const el of markerEls) {
      el.remove()
    }
    const els = [] as any[]
    for (const rev of selectedReviews) {
      addReview(rev, els)
    }
    if (textReviewSelected) {
      for (const rev of allReviews) {
        if (rev.review_text && rev.review_text.length > 0) {
          addReview([rev, ''], els, true)
        }
      }
    }
    setMarkerEls(els)
  }, [selectedReviews, textReviewSelected])



  useEffect(() => {
    if (allReviews.length === 0)
      getAllReviews().then((reviews) => {
        setAllReviews(reviews)
        const coords: Array<[number, number]> = []
        const els = [] as any[]
        const propertyIds = {} as any
        let counter = 0;
        for (const rev of reviews) {
          const latlng = [parseFloat(rev.longitude), parseFloat(rev.latitude)]
          
          const marker = document.createElement('div');
          marker.className = 'circle-marker';
          new mapboxgl.Marker(marker)
          .setLngLat(latlng as any)
          .addTo(map.current as any);
          marker.addEventListener('click', () => {
            window.location.href=`/address/${rev.address}`
          });
          // coords.push(latlng as any)

          const el = document.createElement('div');

          // el.setAttribute('style', 'pointer-events: none;')
          // el.inert = true
          // el.setAttribute('tabindex', '-1');

          const text = getLabelText(rev)
          if (text && !propertyIds[rev.property_id]) {
            propertyIds[rev.property_id] = true

            const divType = 'div'
            const className = `${text.type}-text`
            const popupHtml = `<${divType} class="${className}"></${divType}>`;
            const typeOut = (text: string, el: HTMLElement, popup: any) => {
              console.log(popup)
              const a = el.getElementsByClassName(className)[0]
              const addLetters = (index: number) => {
                if (index > text.length || text[index] === undefined) {
                  setTimeoutRAF(() => {
                    popup._onClose()
                  }, 2000)
                  return
                }
                if (text[index] === ' ') {
                  a.textContent += '\u00A0'
                } else {
                  a.textContent += text[index]
                }
                setTimeoutRAF(addLetters, 100, index + 1)
              }
              addLetters(0)
            }
            // const popup = new mapboxgl.Popup({ className: 'review-marker' })
            // setTimeoutRAF(() => {
            //   if (!animating.current) {
            //     return
            //   }
            //   const popup = new AnimatedPopup({
            //     openingAnimation: {
            //       duration: 1000,
            //       easing: 'easeOutElastic',
            //       transform: 'scale'
            //     },
            //     closingAnimation: {
            //       duration: 300,
            //       easing: 'easeInBack',
            //       transform: 'scale'
            //     },
            //     className: text.type + '-marker'
            //   })
            //     .setLngLat(latlng as any)
            //     .setHTML(popupHtml)
            //     .setMaxWidth("300px")
            //     .addTo(map.current as any);
            //   if (text.type === 'emoji') {
            //     (popup._content as HTMLElement).style.scale = '.8'
            //   }
            //   console.log(popup);
            //   popup._container.addEventListener('click', () => {
            //     window.location.href=`/address/${rev.address}`
            //   });
            //   els.push(popup as any)
            //   typeOut(text.text, popup._container, popup)

            // }, 1000 + counter * 3000);

            coords.push(latlng as any)
            counter++

          }
        }

        if (coords.length > 1) {
          const bounds = new mapboxgl.LngLatBounds();

          for (let coord of coords) {
            bounds.extend(coord);
          }

          (map.current as any).fitBounds(bounds, { padding: 50, maxZoom: 15 });
        }

        setMarkerEls(els)
      })

  }, [])

  return (
    <div className='map-wrapper'>
      <div ref={mapContainer} className="map-container-2" >

      </div>
      <div className="issue-emoji-buttons">
        <div className="fade-out"></div>
          <button
            onClick={() => {
              setTextReviewSelected(!textReviewSelected)
            }} 
            className={textReviewSelected ? 'selected': ''}>🖋️</button>
          {
           issueEmojis.map(e => 
            <button
              onClick={() => {
                e.selected = !e.selected;
                setIssueEmojis([...issueEmojis])
              }} 
              className={e.selected ? 'selected': ''}>{e.emoji}</button>) 
          }
        <div className="buffer-zone"></div>
      </div>
      {/* <div className='map-reviews'>
          {
            allReviews.map(review =>
            <div>
              {review.review_text}
            </div>)
          }
          </div> */}
    </div>

  )
}

export default Map;