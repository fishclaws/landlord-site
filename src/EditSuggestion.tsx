
export interface EditSuggestion {
  id: number;

  landlord: string;

  propertyId: string;

  data: string;

  time: Date;

  type: string;

  votesUp: number;

  votesDown: number;
}

export interface NewEditSuggestion {
    landlord: string;

    propertyId: string;

    data: string;

    type: string;
  }