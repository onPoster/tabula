import { gql } from "urql"

export const GET_ENS_NAMES_QUERY = gql`
  query getNames($id: String!) {
    account(id: $id) {
      wrappedDomains(first: 1000) {
        expiryDate
        fuses
        domain {
          id
          labelName
          labelhash
          name
          isMigrated
          parent {
            name
            id
          }
        }
      }
    }
  }
`
