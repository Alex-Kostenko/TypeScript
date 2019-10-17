let initialTime = Date.now()
let initialStardate = 1207.3

let speed = 0

/** number of milliseconds in one stardate year */
const baseStardateYear = 10000

function getExactStardate () {
  if (!speed) {
    return initialStardate
  }
  return (Date.now() - initialTime) / speed / baseStardateYear + initialStardate
}

export function stopTime () {
  initialStardate = getExactStardate()
  speed = 0
}

export function startTime () {
  initialTime = Date.now()
  speed = 1
}

export function getCurrentStardate () {
  const exact = getExactStardate()
  return Math.floor(exact * 10) / 10
}
