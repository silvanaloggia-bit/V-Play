const CARD_NUMBER_LENGTH = 16
const CARD_EXPIRY_LENGTH = 4

export function getCardDigits(cardText: string): string {
  return cardText.replace(/\D/g, '')
}

export function formatCardNumber(cardNumber: string): string {
  const cardDigits = getCardDigits(cardNumber).slice(0, CARD_NUMBER_LENGTH)
  const digitGroups = cardDigits.match(/.{1,4}/g)
  if (!digitGroups) {
    return ''
  }
  return digitGroups.join(' ')
}

export function formatCardExpiry(cardExpiry: string): string {
  const expiryDigits = getCardDigits(cardExpiry).slice(0, CARD_EXPIRY_LENGTH)
  if (expiryDigits.length <= 2) {
    return expiryDigits
  }
  return `${expiryDigits.slice(0, 2)}/${expiryDigits.slice(2)}`
}

export function getCardBrand(cardNumber: string): string {
  const cardDigits = getCardDigits(cardNumber)
  if (cardDigits.startsWith('4')) {
    return 'Visa'
  }
  if (/^5[1-5]/.test(cardDigits)) {
    return 'Mastercard'
  }
  return 'Tarjeta'
}

export function passesLuhnCheck(cardNumber: string): boolean {
  const cardDigits = getCardDigits(cardNumber)
  let digitSum = 0
  let shouldDouble = false

  for (let digitIndex = cardDigits.length - 1; digitIndex >= 0; digitIndex--) {
    let currentDigit = Number(cardDigits[digitIndex])
    if (shouldDouble) {
      currentDigit = currentDigit * 2
      if (currentDigit > 9) {
        currentDigit = currentDigit - 9
      }
    }
    digitSum = digitSum + currentDigit
    shouldDouble = !shouldDouble
  }

  return digitSum % 10 === 0
}

export function isCardExpired(cardExpiry: string): boolean {
  const [expiryMonth, expiryYear] = cardExpiry.split('/').map(Number)
  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear() % 100

  if (expiryYear < currentYear) {
    return true
  }
  return expiryYear === currentYear && expiryMonth < currentMonth
}