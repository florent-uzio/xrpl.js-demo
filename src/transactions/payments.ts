import color from "colors"
import { Payment, xrpToDrops } from "xrpl"
import {
  convertCurrencyCodeToHex,
  isString,
  multiSignAndSubmit,
  prepareSignSubmit,
} from "../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../models"

type SendPaymentProps = TransactionPropsForMultiSign | TransactionPropsForSingleSign<Payment>

/**
 * Send a payment
 */
export const sendPayment = async (props: SendPaymentProps) => {
  console.log(color.bold("******* LET'S SEND A PAYMENT *******"))
  console.log()

  if (props.isMultisign) {
    // Handle the multi-sign scenario
    await multiSignAndSubmit(props.signatures, props.client)
  } else {
    let { Amount, ...rest } = props.txn

    // Convert the amount to drops (1 drop = .000001 XRP)
    if (isString(Amount)) {
      Amount = xrpToDrops(Amount)
    } else {
      Amount.currency = convertCurrencyCodeToHex(Amount.currency)
    }

    // Construct the base transaction
    const transaction: Payment = {
      Account: props.wallet.address,
      Amount,
      TransactionType: "Payment",
      ...rest,
    }

    // Autofill transaction with additional fields, sign and submit
    await prepareSignSubmit(transaction, props)
  }
}
