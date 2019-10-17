import { Job, Subscriber, Unsubscriber, Summary, Member, Crew, MemberId, ICrewService } from './types'
import Subscription from './internals/Subscription'
import cm from './internals/crewManager'
import { delayedCall } from './internals/helpers'

class CrewService implements ICrewService {
  private onSummarySubscription = new Subscription<Summary>()

  getSummary (): Summary {
    const crew = cm.getCrew()
    return crew.reduce(
      (summary: Summary, member: Member): Summary => ({
        ...summary,
        counts: {
          medic: summary.counts.medic + (member.job === Job.medic ? 1 : 0),
          engineer: summary.counts.engineer + (member.job === Job.engineer ? 1 : 0),
          pilot: summary.counts.pilot + (member.job === Job.pilot ? 1 : 0),
          unassigned: summary.counts.unassigned + (member.job === Job.unassigned ? 1 : 0),
        },
      }),
      {
        totalMembers: crew.length,
        counts: {
          engineer: 0,
          medic: 0,
          pilot: 0,
          unassigned: 0,
        },
      }
    )
  }

  onSummary (subscriber: Subscriber<Summary>): Unsubscriber {

    const notifySummary = () => {
      const summary = this.getSummary()
      this.onSummarySubscription.notify(summary)
    }


    const unsubscribes = [
      cm.onMemberAddedSubscription.add(member => notifySummary()),
      cm.onMemberRemovedSubscription.add(member => notifySummary()),
      cm.onMemberUpdatedSubscription.add(member => notifySummary()),
      this.onSummarySubscription.add(subscriber),
    ]

    notifySummary()

    return () => {
      unsubscribes.forEach((unsubscriber): void => unsubscriber())
    }
  }

  onMemberAdded (subscriber: Subscriber<Member>): Unsubscriber {
    cm.onMemberAddedSubscription.add(subscriber)
    return () => cm.onMemberAddedSubscription.remove(subscriber)
  }

  onMemberUpdated (subscriber: Subscriber<Member>): Unsubscriber {
    cm.onMemberUpdatedSubscription.add(subscriber)
    return () => cm.onMemberUpdatedSubscription.remove(subscriber)
  }

  async assignJob (memberId: MemberId, job: any) {
    return delayedCall<void>(
      () => {
        const member = cm.getMember(memberId)
        if (member) {
          member.job = job
          cm.updateMember(member)
        }
      },
      500, 2000
    )
  }

  async getCrew (): Promise<Crew> {
    return delayedCall<Crew>(() => cm.getCrew(), 500, 2000)
  }
}

export default new CrewService()
