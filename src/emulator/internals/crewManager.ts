import {
  Crew,
  Member,
  MemberId,
  Job,
} from '../types'
import Susbscription from './Subscription'
import { getCurrentStardate } from './timeManager'
const randomName = require('node-random-name') // eslint-disable-line

let idCounter = 0

class CrewManger {
  private crew: Crew = []

  onMemberAddedSubscription = new Susbscription<Member>()
  onMemberRemovedSubscription = new Susbscription<Member>()
  onMemberUpdatedSubscription = new Susbscription<Member>()

  constructor () {
    this.addMember(this.makeMember(Job.medic))
    this.addMember(this.makeMember(Job.engineer))
    this.addMember(this.makeMember(Job.engineer))
    this.addMember(this.makeMember(Job.pilot))
  }

  getMember (id: MemberId) {
    return this.crew.find(member => member.id === id)
  }

  addMember (member: Member) {
    this.crew.push({ ...member })
    this.onMemberAddedSubscription.notify(member)
  }

  removeMember (removedMember: Member) {
    this.crew = this.crew.filter(member => member === removedMember)
    this.onMemberRemovedSubscription.notify(removedMember)
  }

  removeMemberById (id: MemberId) {
    const member = this.getMember(id)
    if (member) {
      this.removeMember(member)
    }
  }

  updateMember (updatedMember: Member) {
    const foundMember = this.getMember(updatedMember.id)
    if (foundMember) {
      this.crew = this.crew.map(
        member => member.id === updatedMember.id ? { ...updatedMember } : member
      )
      this.onMemberUpdatedSubscription.notify(updatedMember)
    }
  }

  getCrew () {
    return [ ...this.crew ]
  }

  makeMember (job?: Job): Member {
    const stardate = getCurrentStardate()
    return {
      id: 'M' + String(++idCounter),
      firstName: randomName({ first: true, random: Math.random }),
      lastName: randomName({ last: true, random: Math.random }),
      joinStardate: stardate,
      job: job || Job.unassigned,
      log: `${stardate} - joined the crew\n`,
    }
  }

  pickRandom (): Member {
    const index = Math.floor(Math.random() * this.crew.length)
    return { ...this.crew[index] }
  }
}

export default new CrewManger()
