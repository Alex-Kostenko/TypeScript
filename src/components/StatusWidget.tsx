import React, { useState, useEffect } from 'react'
import operationService from '../emulator/operationService'
import crewService from '../emulator/crewService'
import SettingsService from '../emulator/settingsService'
import { Stardate, Summary, Job, JobSplit } from '../emulator/types'
import cm from '../emulator/internals/crewManager'

export default function StatusWidget (props: {}) {
  const [stardate, setStardate] = useState<Stardate>(operationService.getStardate())
  const [summary, setSummary] = useState<Summary>({
    totalMembers: 0,
    counts: {
      engineer: 0,
      medic: 0,
      pilot: 0,
      unassigned: 0,
    },
  })

  useEffect(
    () => {
      const intervalHandler = setInterval(
        () => setStardate(operationService.getStardate()),
        1000
      )
      return () => { clearInterval(intervalHandler) }
    },
    []
  )

  useEffect(
    () => {
      const allUnassigned = cm.getCrew().filter(item => item.job === 'unassigned');
      const countUser = crewService.getSummary().totalMembers;
      const jobSplit = SettingsService.getJobSplit();
      const keys = Object.keys(jobSplit);

      allUnassigned.map((item) => {
        keys.map((key) => {
          const keyObj = key as keyof(Summary['counts']);
          const keyJob = key as keyof (JobSplit);
          const proc = (summary.counts[keyObj] / countUser) * 100;

          if (proc < jobSplit[keyJob]) {
            return crewService.assignJob(item.id, key)
          }
        })
      }
      )
    },
    [summary] // on set state
  )

  // subscribe to onSummary() to display grand total and totals for each job
  useEffect(
    () => {
      const unsub = crewService.onSummary(
        data => setSummary(data)
      )

      return unsub
    },
    []
  )

  return <div className='statusWidget'>
    <div className='summaryLine'>Stardate: {stardate}</div>
    {Object.keys(Job).map(job => (
      <div key={job} className={`summaryLine ${job}`}>{job}: {summary.counts[job as Job]}</div>
    ))}
    <div className='summaryLine'>total members: {summary.totalMembers}</div>
  </div>
}
