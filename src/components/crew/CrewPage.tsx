import React, { useState, useEffect } from 'react'
import { Crew } from '../../emulator/types'
import crewService from '../../emulator/crewService'
import CrewTable from './CrewTable'

function CrewPage (props: {}) {
  const [ crew, setCrew ] = useState<Crew>([])

  useEffect(
    () => {
      crewService.getCrew().then(crew => setCrew(crew))
    },
    []
  )

  return <div className='tableContainer'>
    <CrewTable crew={crew} />
  </div>
}

export default CrewPage
