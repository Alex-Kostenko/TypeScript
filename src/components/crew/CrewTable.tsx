import React from 'react'
import { Crew } from '../../emulator/types'

export default function CrewTable (props: { crew: Crew }) {
  const { crew } = props
  return <table>
    <tbody>
      {crew.map(member => <tr key={member.id}>
        <td>{member.id}</td>
        <td>{member.lastName}, {member.firstName}</td>
        <td>
          <span className={member.job}>
            {member.job}
          </span>
        </td>
      </tr>)}
    </tbody>
  </table>
}
