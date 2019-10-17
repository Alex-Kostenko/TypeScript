import { random, randomIndex } from './helpers'
import { EventType } from '../types'
import cm from './crewManager'
import { startTime, stopTime, getCurrentStardate } from './timeManager'

const eventMap = [
  EventType.addMember,
  EventType.updateLastName,
  EventType.updateLog,
]
const eventWeigths = [
  70,
  20,
  10,
]

class EventEmulator {
  private nextEventHandler?: NodeJS.Timeout
  private nextDelay?: number
  private timeScheduled?: number
  private timeRemaining?: number

  private eventVariation = [0.1, 5]
  private baseDelay = 1000

  // increase this to speed up events
  private speed = 1

  private isRunning = false

  schedule (delay?: number) {
    this.isRunning = true
    if (!delay) {
      delay = random(
        this.eventVariation[0] * this.baseDelay / this.speed,
        this.eventVariation[1] * this.baseDelay / this.speed
      )
    }
    this.timeScheduled = Date.now()
    this.nextDelay = delay

    this.nextEventHandler = setTimeout(
      () => {
        this.fireRandomEvent()
        this.schedule()
      },
      delay
    )
  }

  play () {
    if (!this.isRunning) {
      this.schedule(this.timeRemaining)
      this.isRunning = true
      startTime()
    }
  }

  pause () {
    if (this.isRunning && this.nextDelay && this.timeScheduled && this.nextEventHandler) {
      this.timeRemaining = Math.max(0, this.nextDelay - (Date.now() - this.timeScheduled))
      clearTimeout(this.nextEventHandler)
      this.isRunning = false
      stopTime()
    }
  }

  fireEvent (eventType: EventType) {
    switch (eventType) {
      case EventType.updateLog: {
        const member = cm.pickRandom()
        member.log += String(getCurrentStardate()) + ' - log updated\n'
        cm.updateMember(member)
        break
      }

      case EventType.updateLastName: {
        const member = cm.pickRandom()
        const spouse = cm.pickRandom()
        member.lastName = spouse.lastName
        cm.updateMember(member)
        break
      }

      case EventType.addMember: {
        cm.addMember(cm.makeMember())
        break
      }
    }
  }

  fireRandomEvent () {
    // this allows to slow down influx of new members when the ship is full
    // eventWeigths[0] = 500 / (cm.getCrew().length + 5)

    const eventIndex = randomIndex(eventWeigths)
    this.fireEvent(eventMap[eventIndex])
  }
}

export default EventEmulator
