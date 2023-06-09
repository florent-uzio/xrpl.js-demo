import { AccountOffersRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

export const getAccountOffers = async (props: AccountOffersRequest) => {
  // Send the request
  const response = await getXrplClient().request(props)
  console.log(JSON.stringify(response, undefined, 2))
}
