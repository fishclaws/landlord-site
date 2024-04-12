'use client'
import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { BusinessOwner, HierarchyNode, HierarchyNodeGroup, PropertyAddress, PropertyLocation, SearchResultPicked } from './ResultTypes';
import 'mapbox-gl/dist/mapbox-gl.css';
import Survey from './Survey';
import Info from './Info';
import { Hierarchy } from './Hierarchy'
import markerSrc from './marker.png'; // Import your image
import Disclaimer from './Disclaimer';
import Collapsible from './Collapsible';
import Reviews from './Reviews';
import ReactGA from "react-ga4";
import { useNavigate } from 'react-router-dom';
import Join from './Join';

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxgl.accessToken = 'pk.eyJ1IjoibXNnc2x1dCIsImEiOiJja2NvZmFpbjAwMW84MnJvY3F1d2hzcW5nIn0.xMAHVsdszfolXUOk9_XI4g';

interface GroupedLocation {
  location: PropertyLocation
  addresses: PropertyAddress[]
}

function removeDuplicateBusinesses(arr: Array<BusinessOwner> | undefined) {
  if (!arr) {
    return []
  }
  return arr.filter(item => item).filter((item,
    index) => arr.findIndex(bus => bus.business_name === item.business_name) === index);
}

function getUnitTotalCount(result: SearchResultPicked) {
  if (!result || !result.data || !result.data.unit_counts || !result.data.owned_addresses) {
    return null
  }

  const units = result.data.unit_counts
  let count = 0
  for (let key of Object.keys(units)) {
    count += units[key]
  }

  count += result.data.owned_addresses.filter(address => !units[address.property_id]).length

  return count
}

function generateHierarchies(result: SearchResultPicked): HierarchyNodeGroup[] | null {
  if (!result.data || !result.data.hierarchy_nodes) {
    return null
  }
  const hierarchies = []
  for (const hierarchy of result.data.hierarchy_nodes) {
    const nodes = [...hierarchy.nodes_array]
    console.log(nodes)
    const top = nodes.find(n => !n.parent_num)

    if (top?.business_members.length === 0) {
      hierarchies.push(hierarchy)
      continue
    }

    let top_names = top?.business_members
      .map(mem => `${mem.first_name}${mem.middle_name ? ' ' + mem.middle_name : ''} ${mem.last_name}`)

    top_names = top_names!.filter((name, index) => top_names!.indexOf(name) === index)
    const new_top: HierarchyNode = {
      names: top_names,
      ids: ([] as any).concat(...top_names.map(tn => top?.business_members.map(bm => bm.id))),
      reg_num: "0",
      parent_num: null,
      business_name: '',
      child_reg_nums: [],
      business_members: []
    }


    top!.parent_num = "0"
    nodes.push(new_top)

    if (result.data.businesses_with_same_owners) {
      for (const bwso of result.data.businesses_with_same_owners) {
        nodes.push({
          reg_num: bwso.reg_num,
          parent_num: "0",
          business_name: bwso.business_name,
          child_reg_nums: [],
          business_members: []
        })
      }
    }

    for (const node of nodes) {
      if (result.data.business_owners.find(bo => bo.reg_num === node.reg_num)) {
        node.current = true
      }
    }

    hierarchies.push({
      top_reg_num: hierarchy.top_reg_num,
      nodes_array: nodes
    })
  }
  return hierarchies
}

function getHierarchyTopNames(h: HierarchyNodeGroup) {
  if (!h || !h.nodes_array) {
    return null
  }
  const top = h.nodes_array.find(node => !node.parent_num) as any
  if (top && top.names) {
    return (top.names as string[]).join(', ')
  }
}

function getOwners(hierarchies: HierarchyNodeGroup[], result: SearchResultPicked) {
  if (hierarchies && hierarchies.length > 0) {
    let owners: string[] = []
    hierarchies.forEach(h => {
      const top_node = h.nodes_array.find(n => n.parent_num == null)
      console.log(top_node)
      if (top_node) {
        owners = owners.concat((top_node as any).names ? (top_node as any).names : top_node.business_name)
      }
    })
    return owners.reverse()
  } else {
    if (result.property) {
      return result.property.owner.split('&')
        .map(owner => owner.trim())
        .map(owner => {
          const input = owner;
          const regex = /(?: \b\d{4})? REV(?: LIV)? TR\b/;
          return input.replace(regex, '').trim();
        })
        .map(owner => owner.includes(',') ? (() => {
          const [last, first] = owner.split(',')
          return `${first.trim()} ${last.trim()}`
        })() : owner)
    } else if (result.data?.business_owners) {
      return result.data?.business_owners?.map(bo => bo.business_name)
    }
  }
}

function convertToUSD(value: number) {

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(value / 100)
}

function getLandlordList(result: SearchResultPicked, hierarchies: HierarchyNodeGroup[] | null) {
  const list: { name: string, origin: string }[] = []
  if (hierarchies && hierarchies.length) {
    const top_name_ids =
      hierarchies
        .map(h => h.nodes_array
          .find(node => node.ids))
        .filter(h => h)
        .map(h => h!.ids) as unknown as string[]
    list.push(
      ...top_name_ids.flat().map((id: string) => (
        {
          name: id,
          origin: 'business_names'
        }))
    )

  } else if (result.property) {
    list.push({
      name: result.property.owner,
      origin: 'property_owners'
    })
  }
  if (hierarchies) {
    for (const group of hierarchies) {
      let current = group.nodes_array.find(node => node.current)

      while (current) {
        current = group.nodes_array.find(node => node.reg_num === current?.parent_num)
        if (current) {
          list.push({
            name: current.business_name,
            origin: 'businesses'
          })
        }
      }
    }
  }
  return list.filter(name => name.name)
}

function dedup(names: string[] | undefined) {
  if (!names) {
    return names
  }

  const obj = names.reduce((agg, n) => {
    agg[n] = true
    return agg;
  }, {} as { [key: string]: boolean })
  return Object.keys(obj)
}


type ResultType = string | 'address' | 'landlord'

class OnOpen {
  callback: any = null
  func = () => this.callback && this.callback()
}

function Result({ result, closeResult, resultType }: { result: SearchResultPicked, closeResult: () => void, resultType: ResultType }) {
  console.log(result)
  const navigate = useNavigate();

  const property = result.property
  const mapContainer = useRef(null);
  const map = useRef(null);
  const survey = useRef(null);
  const collapsible = useRef(null);

  const [lng, setLng] = useState(property && parseFloat(property.longitude));
  const [lat, setLat] = useState(property && parseFloat(property.latitude));
  const [zoom, setZoom] = useState(12);
  const [related_businesses, setRelatedBusinesses] = useState(result.data && removeDuplicateBusinesses(result.data.related_businesses))
  const [markersDisplayed, setMarkersDisplayed] = useState(false)
  const [locations, setLocations] = useState(linkLocations())
  const [markerElements, setMarkerElements]: [HTMLDivElement[], any] = useState([])
  const [pageType, setPageType] = useState(resultType)
  const [selectedLocation, setSelectedLocation]: [GroupedLocation | null, any] = useState(null)
  const [hierarchies, setHierarchies]: [HierarchyNodeGroup[], any] = useState([])
  const [showingLocations, setShowingLocations] = useState(false)
  const [viewBusinessInfo, setViewBusinessInfo] = useState(false)
  const [unitTotal] = useState(getUnitTotalCount(result))
  const [addressTotal] = useState(result.data && result.data?.owned_addresses ? 1 + (result.data?.owned_addresses.filter(a => a).length) : undefined)
  const [owners, setOwners]: [string[], any] = useState([])
  const [atBottom, setAtBottom]: [boolean, any] = useState(true)
  const [scrolled, setScrolled]: [boolean, any] = useState(false)
  const [showEvictions, setShowEvictions]: [boolean, any] = useState(false)
  const [landlordList, setLandlordList]: [{ name: string, origin: string }[], any] = useState([])
  const [showSurvey, setShowSurvey]: [boolean, any] = useState(true)
  const [alreadyScrolled, setAlreadyScrolled]: [boolean, any] = useState(false)
  const [showHierarchy, setShowHierarchy]: [number | null, any] = useState(null)
  const [propertyManagers]: [string[] | undefined, any] = useState(dedup(result.data?.evictions?.reduce((agg, e, i) => e.evicting_property_managers ? agg.concat(e.evicting_property_managers) : agg, [] as string[])))
  const [extraPadding, setExtraPadding] = useState(true)

  const [openHandler] = useState(new OnOpen())

  useEffect(() => {
    if (viewBusinessInfo) {
      ReactGA.event({
        category: "result_page",
        action: "button_click",
        label: "view business data", // optional
      });
    }
  }, [viewBusinessInfo])

  useEffect(() => {
    if (showHierarchy) {
      ReactGA.event({
        category: "result_page",
        action: "button_click",
        label: "show hierarchy", // optional
      });
    }
  }, [showHierarchy])

  useEffect(() => {
    if (map.current) return; // initialize map only once
    const mapOptions: any = {
      container: mapContainer.current,
      style: 'mapbox://styles/msgslut/cltktk1uv013901oi98k5fir8',
      zoom: zoom
    }

    if (result.property) {
      mapOptions['center'] = [lng, lat]
    } else {
      mapOptions['center'] = [-122.676483, 45.523064]
    }

    map.current = new mapboxgl.Map(mapOptions);

    if (result.property) {

      const el = document.createElement('div');
      el.className = 'main-marker';
      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current);


      (map.current as any).setCenter([lng, lat])

    }

    const hier = generateHierarchies(result)

    setHierarchies(hier)
    // generateHierarchy(result))
    const o = getOwners(hier!, result)
    setOwners(o)

    const observer = new IntersectionObserver((entries, observer) => {
      const entry = entries[0];
      console.log('entry', entry);
      console.log('entry.isIntersecting', entry.isIntersecting);
      setAtBottom(entry.isIntersecting)
    });

    observer.observe(survey.current!)

    showAllLocations()
    setLandlordList(getLandlordList(result, hier))
  });

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const target = event.target! as any
    console.log('Current Scroll Position:', target.scrollTop)
    setScrolled(target.scrollTop > 20)
    if (target.scrollTop > 20) {
      setAlreadyScrolled(true)
    }

  }

  function linkLocations(): Array<GroupedLocation> {
    if (!result.data || !result.data.locations || !result.data.owned_addresses) {
      return []
    }
    const res = []
    for (const location of result.data.locations) {
      if (!location) continue;
      const addresses = result.data.owned_addresses.filter(a => a && a.property_id === location.property_id)
      res.push({
        location,
        addresses
      })
    }
    return res
  }




  function showAllLocations() {
    if (markersDisplayed) return;
    const coords: Array<[number, number]> = []
    if (result.property) {
      coords.push([lng, lat])
    }

    if (result.data && result.data.locations) {
      const markerEls = []
      for (const loc of locations) {
        if (!loc) continue;
        const latlng = [parseFloat(loc.location.longitude), parseFloat(loc.location.latitude)]
        if (latlng[1] === lat && latlng[0] === lng && loc.addresses.length < 2) continue;
        const el = document.createElement('div');
        markerEls.push(el)
        if (loc.addresses.length > 1) {
          el.innerHTML = `<span class="dot">${loc.addresses.length}</span>`
        }
        // el.innerHTML += loc.addresses.map(a => a)
        el.className = 'marker';
        el.onclick = (ev) => {
          const menu = el.getElementsByClassName('menu-container')[0]
          if (loc.addresses.length === 1) {
            //search(loc.addresses[0].address_full)
            window.location.href = `/address/${loc.addresses[0].address_full}`;
          } else {
            setSelectedLocation(loc as any)
          }

        }
        new mapboxgl.Marker(el)
          .setLngLat(latlng)
          .addTo(map.current);

        coords.push(latlng as any)
      }
      setMarkerElements(markerEls)
    }
    if (coords.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();

      for (let coord of coords) {
        bounds.extend(coord);
      }

      (map.current as any).fitBounds(bounds, { padding: 60 });
    }
    // (map.current as any).setCenter([lng, lat])
    setMarkersDisplayed(true)
  }

  function hideAllMarkerMenus() {
    setSelectedLocation(null)
  }

  function toggleLocations() {
    if (!markersDisplayed) {
      showAllLocations()
      setShowingLocations(true)
    } else {
      setShowingLocations(!showingLocations)
    }
  }

  function hideSurvey() {
    setShowSurvey(false)
  }

  const resultRef = useRef(null)

  function checkBrowser() {
    let browser = "";
    let c = navigator.userAgent.search("Chrome");
    let f = navigator.userAgent.search("Firefox");
    let m8 = navigator.userAgent.search("MSIE 8.0");
    let m9 = navigator.userAgent.search("MSIE 9.0");
    if (c > -1) {
      browser = "Chrome";
    } else if (f > -1) {
      browser = "Firefox";
    } else if (m9 > -1) {
      browser = "MSIE 9.0";
    } else if (m8 > -1) {
      browser = "MSIE 8.0";
    }
    return browser;
  }

  function scrollToReviews() {
    setScrolled(true)
    // if (checkBrowser() !== 'Firefox') {
    //   setTimeout(() => {
    //     if (resultRef.current) {
    //       let padding = 0;
    //       let paddingStr = (resultRef.current as any).style.getPropertyValue('padding-top');
    //       if (paddingStr === '') {
    //         padding = 130
    //       } else {
    //         padding = Number(paddingStr.replace('px', ''))
    //       }
    //       (resultRef.current as any).style.setProperty('padding-top', `${padding + 130}px`);

    //     }
    //   }, 100)
    // }
    setExtraPadding(false)
    setTimeout(() => setExtraPadding(true), 2000)
    setTimeout(() => setExtraPadding(false), 2100)
    setTimeout(() => setExtraPadding(true), 2200)

    if (survey && survey.current) {
      (survey.current as any).scrollIntoView({ behavior: "smooth", block: "nearest", inline: 'start' }) 

    }
  }

  const rightRef = useRef(null)

  function scrollToTop() {
    if (rightRef.current) {
      (rightRef.current as HTMLElement).scrollTo(0, 0)
    }
  }

  return (
    <div className={'result ' + (extraPadding ? 'extra-padding' : '')} ref={resultRef}>
      <Disclaimer />
      {/* {
        (!scrolled && !alreadyScrolled) &&
        <div className='full-screen'>
        </div>
      } */}
      <div className='headerContainer small-header'>
        {/* <img className='post' src="/images/post.png" alt="a post"></img> */}
        {/* <h1 onClick={() => closeResult()}>
          <div className="name">
            <div>Rate</div>
            <div>Your</div>
            <div>Landlord</div>
            <div>PDX</div>
            <div>.com</div>
          </div>
        </h1> */}
      </div>
      <div className='result-container'>
        <div className='left'>
          {selectedLocation ? <div className='screen' onClick={() => hideAllMarkerMenus()}></div> : undefined}
          {selectedLocation ?
            <div className='address-menu-container'>
              <div className="menu-container" onClick={(ev) => ev.stopPropagation()}>
                {(selectedLocation as any)
                  .addresses.map(
                    (a: PropertyAddress) =>
                    (
                      <div className="menu-item">
                        <div className="address">{a.address_full}<a className="menu-link" href={`/address/${a.address_full}`}>&gt;</a></div>

                      </div>
                    ))}
              </div>
            </div>
            : undefined
          }
          <div ref={mapContainer} className="map-container" >
          </div>
        </div>

        <div className={scrolled ? 'right right-up' : 'right right-down'} onScroll={handleScroll} ref={rightRef}>

          <div className='data-container'>
            <h3 className='address-title-container'>
              {
                result.property &&
                <div className='address-title'>{result.property.address_full}</div>
              }
              {
                resultType === 'landlord' && result.data && result.data?.business_owners &&
                <div className='address-title'>{result.data?.business_owners![0].business_name}</div>
              }
              <div className='main-marker-inline' />
            </h3>
            {/* {result.property.description !== "undefined" ?
              (<div className='address-description'>{result.property.description}</div>) : undefined
            } */}
            <div className='owner-container'>
              {
                <div className='owned_by'>owned by</div>
              }
              {owners ? owners.map((o, i) =>
                (<>{i !== 0 ? <div className='ampersand'>&amp;</div> : undefined}<div className='owner-name'>{o}</div></>))
                : (result.data?.owned_addresses && result.data?.owned_addresses.length &&
                  <div className='owner-name'>{result.data?.owned_addresses[0].owner}</div>
                )
              }
              {
                result && result.property && result.property.owner && hierarchies && hierarchies.length > 0 ?
                  (
                    <div className='via-wrapper'>
                      <div className='via'><span className='via-text'>via</span> </div>
                      <div>
                        <div className='via'>{result.property.owner} </div>
                        {
                          landlordList ? landlordList
                            .filter(l => l.origin === 'businesses')
                            .map(l =>
                              <div className='via'>{l.name}</div>
                            )
                            : undefined
                        }
                      </div>
                    </div>
                  ) : undefined
              }


            </div>




            {
              result.data && result.data.evictions && result.data.evictions.length &&
              <div className='evictions-wrapper'>
                <div className='evictions' onClick={() => false && setShowEvictions(!showEvictions)}>{result.data.evictions.length !== 1 ? result.data.evictions.length + ' EVICTIONS ON RECORD' : '1 EVICTION ON RECORD'} </div>
                {/* <button className='evictions' onClick={() => setShowEvictions(!showEvictions)}>Found {result.data.evictions.length} eviction court-records associated with this landlord</button> */}

                {
                  showEvictions &&
                  <div className='table-wrapper'>
                    <table>
                      <tr>
                        <th>case code</th>
                        <th>filed date</th>
                        <th>landlords</th>
                        <th>property managers</th>
                        <th>case description</th>
                      </tr>
                      {
                        result.data.evictions.map(ev =>
                          <tr>
                            <td>{ev.case_code}</td>
                            <td>{ev.filed_date}</td>
                            <td>{ev.evicting_landlords}</td>
                            <td>{ev.evicting_property_managers}</td>
                            <td>{ev.case_description}</td>
                          </tr>
                        )}

                    </table>
                  </div>
                }
              </div>
            }
            {result.data &&
              <div className='properties'>
                {
                  result.data.market_value_sum === 0 || !result.data.market_value_sum?
                  undefined :
                  <><div className='market-value-str'>total market-value of properties:</div><div className='market-value'>{convertToUSD(result.data.market_value_sum!)}<Info message="calculated using tax information collected from PorlandMaps.com" /></div></>
                }
                {
                  result.data.locations && result.data.locations.length > 0 ?
                    (
                      <div className='locations-container'>
                        {
                          result.data?.owned_addresses && result.data?.owned_addresses.length > 0 && locations && locations.length > 0 ?
                            (

                              <div className='counts-container'>
                                {/* <div className='also-owns'>{'who also own' + (owners.length > 0 ? '': 's')}</div> */}

                                {unitTotal == null || unitTotal === addressTotal ? undefined : (
                                  <div className='counts-element'>
                                    <span className='count-number'>{unitTotal}</span>
                                    <br />
                                    units
                                  </div>)
                                }
                                <div className='counts-element'>
                                  <span className='count-number'>{addressTotal}</span>
                                  <br></br>
                                  addresses
                                </div>
                                <div className='counts-element'>
                                  <div className='marker-inline-wrapper'>
                                    <span className='count-number'>{locations ? locations.length : 1}</span>
                                    <div onClick={() => scrollToTop()} className='marker-inline' />
                                    <br></br>
                                    locations
                                  </div>
                                </div>
                              </div>


                            ) : undefined
                        }
                        {/* <div className='owns-button-container'>
                      <button className='owns-button' onClick={() => toggleLocations()}>{showingLocations ? 'HIDE' : 'SHOW'}</button>
                    </div> */}
                        {showingLocations ?
                          <div className='address-groups'>
                            {locations ? locations.filter(loc => loc).map(loc => (
                              <div className='address-group'>
                                {loc.addresses.map(address =>
                                (
                                  <><a className='address-link' href={`/address/${address.address_full}`}>{address.address_full}</a><br /></>
                                ))}
                              </div>
                            )) : undefined
                            }
                          </div> : undefined
                        }
                      </div>
                    ) : undefined
                }
              </div>
            }

            {
              hierarchies || (related_businesses && related_businesses.length) ?
                <div className='business-info'>
                  <button className='view-business-data-button' onClick={() => setViewBusinessInfo(!viewBusinessInfo)}>{viewBusinessInfo ? 'Hide Data' : 'View Business Data'}</button>
                  {viewBusinessInfo ? (
                    <div className='business-data'>
                      <div className='tree-list'>
                        {
                          hierarchies ?
                            hierarchies
                              .filter(h => h.nodes_array.length)
                              .map((h, index) =>
                                <div className='hiearchy-name'>
                                  {getHierarchyTopNames(h)}
                                  <svg onClick={() => setShowHierarchy(index)} width="80" height="80" className='hierarchy-icon'>
                                    <g transform="scale(.24 .24) translate(-50 0)">
                                      <circle cx="200" cy="50" r="20" fill="white" />
                                      <circle cx="150" cy="150" r="20" fill="white" />
                                      <circle cx="250" cy="150" r="20" fill="white" />
                                      <circle cx="100" cy="250" r="20" fill="white" />
                                      <circle cx="200" cy="250" r="20" fill="white" />
                                      <circle cx="300" cy="250" r="20" fill="white" />
                                      <line x1="200" y1="50" x2="150" y2="150" stroke="white" className='hierarchy-line' />
                                      <line x1="200" y1="50" x2="250" y2="150" stroke="white" className='hierarchy-line' />
                                      <line x1="150" y1="150" x2="100" y2="250" stroke="white" className='hierarchy-line' />
                                      <line x1="150" y1="150" x2="200" y2="250" stroke="white" className='hierarchy-line' />
                                      <line x1="250" y1="150" x2="300" y2="250" stroke="white" className='hierarchy-line' />
                                    </g>
                                  </svg>
                                  {
                                    showHierarchy === index ?
                                      <div className="hierarchy-wrapper">
                                        <div className='button-close-wrapper'>
                                          <button className="button-close" onClick={() => setShowHierarchy(null)}></button>
                                        </div>
                                        <Hierarchy hierarchyNodes={h.nodes_array} />
                                      </div>
                                      : undefined
                                  }
                                </div>
                              ) : undefined
                        }
                      </div>

                      {related_businesses && related_businesses.length > 0 ?
                        <div className='related-businesses-list'>
                          <div className='related-businesses-title'>Related Businesses</div>
                          <div className='data-rows'>
                            {related_businesses ?
                              related_businesses.map((name: any) => (<button className='data-row' onClick={() => {
                                window.location.href = `/search/${name.business_name}`
                              }}>{name.business_name}</button>)) : undefined}
                          </div>
                        </div>
                        : undefined
                      }

                    </div>) : undefined
                  }
                </div>
                : undefined
            }
            {
              result.data && result.reviews && result.reviews.length > 0 ?
                // 
                <div className='ratings-wrapper'>
                  <Reviews
                    property_reviews={result.property && result.property.reviews}
                    other_reviews={result.data && result.reviews}
                    onOpen={openHandler}
                    scrollToReviews={scrollToReviews} />
                </div> : (
                  result.property && result.property.reviews && result.property.reviews.length > 0 ?
                    <div className='ratings-wrapper'>
                      <Reviews
                        property_reviews={result.property && result.property.reviews}
                        other_reviews={null}
                        onOpen={openHandler}
                        scrollToReviews={scrollToReviews} />
                    </div> : undefined

                )
            }

            <hr className="dashed" />
            <div ref={survey} className='survey-container'>
              {
                showSurvey ?
                  <Survey
                    landlordList={landlordList}
                    hideSurvey={hideSurvey}
                    address={result.property && result.property.address_full}
                    propertyId={result.property && result.property.property_id}></Survey>
                  :
                  <div className='thanks'>Thanks for your feedback
                    <div className='action-items'>
                      {/* <button className='action orange'><div className='report'></div>report your landlord</button> */}
                      
                      <button onClick={() => navigate('/organize')} className='action green'>connect with your neighbors</button>
                    </div>
                  </div>
              }
            </div>
            <div className='join-wrapper'>
            {
              !showSurvey && <Join text={"Join the Portland Metro Tenant Union! Together we can build renter power in this city."}/>
            }
            </div>

            <div className='buffer'>

            </div>

          </div>
        </div>
      </div >
      {
        showSurvey &&
        <div className='jump-to-reviews-wrapper'><button className={'jump-to-reviews ' + (atBottom ? 'hide-jump' : 'show-jump')} onClick={() => scrollToReviews()}>leave a review</button></div>
      }
    </div >
  );
}

export default Result;


