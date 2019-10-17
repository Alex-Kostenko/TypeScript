import React from 'react'
import { Link } from 'react-router-dom'
import StatusWidget from './StatusWidget'
import PlayToggle from './PlayToggle'

export default function Header (props: {}) {
  return <header>
    <div className='buttonPanel'>
      <Link to='/'>
        <button>Settings</button>
      </Link>

      <Link to='/crew'>
        <button>Crew Members</button>
      </Link>

      <PlayToggle />
    </div>

    <StatusWidget />
  </header>
}
