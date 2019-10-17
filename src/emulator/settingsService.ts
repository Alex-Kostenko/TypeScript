import { Subscriber, Unsubscriber, JobSplit, ISettingsService } from './types'
import Subscription from './internals/Subscription'

class SettingsService implements ISettingsService {
  private jobSplit: JobSplit = {
    medic: 30,
    engineer: 60,
    pilot: 10,
  }
  private onJobSplitSubscription = new Subscription<JobSplit>()

  onJobSplit (subscriber: Subscriber<JobSplit>): Unsubscriber {
    this.onJobSplitSubscription.addAndNotify(subscriber, this.jobSplit)
    return () => this.onJobSplitSubscription.remove(subscriber)
  }

  setJobSplit (jobSplit: JobSplit) {
    this.jobSplit = jobSplit
    this.onJobSplitSubscription.notify(jobSplit)
  }

  getJobSplit (): JobSplit {
    return this.jobSplit
  }
}

export default new SettingsService()
