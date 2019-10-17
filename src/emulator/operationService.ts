import {
  getCurrentStardate,
} from './internals/timeManager'
import EventEmulator from './internals/EventEmulator'
import { IOperationService } from './types'

class OperationService implements IOperationService {
  private emu: EventEmulator

  constructor () {
    this.emu = new EventEmulator()
  }

  getStardate () {
    return getCurrentStardate()
  }

  play () {
    this.emu.play()
  }

  pause () {
    this.emu.pause()
  }
}

export default new OperationService()
