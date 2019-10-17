export type MemberId = string
export type Stardate = number

export enum EventType {
  addMember = 'addMember',
  updateLastName = 'updateLastName',
  updateLog = 'updateLog',
}

export interface Member {
  id: MemberId
  firstName: string
  lastName: string
  joinStardate: Stardate
  log: string
  job: Job
}

export enum Job {
  medic = 'medic',
  engineer = 'engineer',
  pilot = 'pilot',
  unassigned = 'unassigned'
}

export type Crew = Member[]

type SummaryCounts = {
  [x in Job]: number
}

export interface JobSplit {
  [Job.engineer]: number
  [Job.medic]: number
  [Job.pilot]: number
}

export interface Summary {
  totalMembers: number
  counts: SummaryCounts
}

export type Unsubscriber = () => void
export type Subscriber<T> = (value: T) => void

export interface ICrewService {
  /**
   * synchronously returns an object containing job totals
   * and grand total of crew members
   */
  getSummary (): Summary

  /**
   * fires an event each time there is a member added
   * or changed proving Summary (same one as returned in getSummary())
   */
  onSummary (subscriber: Subscriber<Summary>): Unsubscriber

  /**
   * fired each time the a member is added
   */
  onMemberAdded (subscriber: Subscriber<Member>): Unsubscriber

  /**
   * fired each time the member information is updated, e.g.
   * - when the last name is changed
   * - when the job is changed
   *
   * NOTE: the event is fired even for the client which
   * previously called assignJob()
   */
  onMemberUpdated (subscriber: Subscriber<Member>): Unsubscriber

  /**
   * ASYNCHRONOUS call assigning Job to a crew member.
   * The subject member is identified by member.id field
   */
  assignJob (memberId: MemberId, job: Job): Promise<void>

  /**
   * ASYNCHRONOUS call retrieving all crew members as an array
   */
  getCrew (): Promise<Crew>
}

export interface ISettingsService {
  onJobSplit (subscriber: Subscriber<JobSplit>): Unsubscriber
  setJobSplit (jobSplit: JobSplit): void
  getJobSplit (): JobSplit
}

export interface IOperationService {
  getStardate (): Stardate
  play(): void
  pause(): void
}
