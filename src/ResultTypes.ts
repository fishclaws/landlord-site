export interface PropertyAddress {
  objectid: string
  owner: string
  property_id: string
  address_id: string
  address_full: string
  unit: string
  unit_type: string
  mail_city: string
  jurisdiction_name: string
  state: string
  zip_code: string
  county: string
  address_type: string
  building_id: string
  simplified_address: string
  confidence: number
}

export interface PropertyLocation {
  property_id: string
  latitude: string
  longitude: string
  mercator_x: string
  mercator_y: string
}

export interface Name {
  reg_num: string
  name_type: string
  first_name: string
  middle_name: string
  last_name: string
  addr_1: string
  addr_2: string
  parent_num: string
  name: string
}

export interface BusinessOwner {
  sim: number
  reg_num: string
  business_name: string
  mailing_address_1: string
  place_of_bus_1: string
  name_history: Array<string>
  mailing_address_2: string
  place_of_bus_2: string
}

export interface BusinessMember {
  id: string;
  name: string | null;
  addr_1: string;
  addr_2: string | null;
  reg_num: string;
  last_name: string | null;
  name_type: string;
  first_name: string | null;
  parent_num: string | null;
  middle_name: string | null;
}

export interface HierarchyNode {
  current?: boolean
  reg_num: string;
  parent_num: string | null;
  business_name: string;
  child_reg_nums: string[];
  business_members: BusinessMember[];
  ids?: string[]
  names?: string[]
}

export interface HierarchyNodeGroup {
  top_reg_num: string
  nodes_array: HierarchyNode[]
}

export interface Eviction {
  zip: string;
  city: string;
  county: string;
  status: string;
  case_code: string;
  filed_date: string;
  directional: string;
  case_description: string;
  evicting_landlords: string[];
  evicting_property_managers: string[] | null;
}

export interface UnitCounts {
  [property_id: string]: number;
}

export interface Review {
  id: number,
  review_text: string,
  selected_answers: number[]
}

export interface ReviewResult {
  id: number,
  review_text: string,
  selected_answers: number[]
  address: string
  longitude: string
  latitude: string
}

export interface DataResult {
  business_owners: Array<BusinessOwner>
  related_businesses: Array<BusinessOwner>
  owned_addresses: Array<PropertyAddress>
  locations: Array<PropertyLocation>
  hierarchy_nodes: Array<HierarchyNodeGroup>
  evictions: Array<Eviction>
  unit_counts: UnitCounts
  businesses_with_same_owners: Array<BusinessOwner>
  market_value_sum: number
  reviews: Review[]
}

export interface DataResultNoBusiness {
  business_owners: undefined
  related_businesses: undefined
  owned_addresses: Array<PropertyAddress>
  locations: Array<PropertyLocation>
  hierarchy_nodes: undefined
  evictions: Array<Eviction>
  unit_counts: UnitCounts
  businesses_with_same_owners: undefined
  market_value_sum: undefined
  reviews: Review[]

}

export interface SubmittedReview {
  id: number,
  review_text: string,
  selected_answers: number[]
}

export interface PropertyResult {
  objectid: string
  property_id: string
  address_id: string
  address_full: string
  unit: string
  unit_type: string
  mail_city: string
  jurisdiction_name: string
  state: string
  zip_code: string
  county: string
  address_type: string
  building_id: string
  simplified_address: string
  sim: number
  owner: string
  owner_address: string
  description: string
  owner_name: null
  landlord_id: null
  latitude: string
  longitude: string
  reviews: SubmittedReview[]
}

export interface FoundBusiness {
  type: 'found-business'
  data: DataResult
  property: PropertyResult
  reviews?: []

}

export interface NoBusinessFound {
  type: 'no-businesses'
  data: DataResultNoBusiness
  property: PropertyResult
  reviews?: []

}

export interface NoLandlordFound {
  type: 'no-landlord'
  data: null
  property: PropertyResult
  reviews?: []
}

export interface MultipleAddresses {
  type: 'multiple-addresses'
  addresses: any
}

export interface OneLandlordFound {
  data: DataResult
  property: undefined

}

export type SearchResult = MultipleAddresses | NoLandlordFound | NoBusinessFound | FoundBusiness

export interface PropertyManagerProperty {
  property_id: string
  address: string,
  longitude: string,
  latitude: string,
  unit_count: number | null
}
export interface FoundPropertyManagerResult {
  property: undefined
  data: undefined

  type: 'property-manager-found'
  name: string
  properties: PropertyManagerProperty[]
  businesses: string[]
  owners: string[]
  eviction_count: number
 }


export type SearchResultPicked = NoLandlordFound | NoBusinessFound | FoundBusiness | OneLandlordFound | FoundPropertyManagerResult

export interface OneLandlordFound {
  type: undefined
  data: DataResult
  reviews: SubmittedReview[]
}

export type LandlordResult = null | OneLandlordFound

export interface LandlordNameFound {
  type: 'landlord-name-found'
  data: DataResult
 }

export interface NoLandlordNameFound {
  type: 'no-landlord-name-found'
 }


 export type NameSearchResult =  LandlordNameFound | NoLandlordNameFound


 export interface PropertyManagerResult {
  name: string
  locations: PropertyLocation[]
  addresses: PropertyAddress[]
 }