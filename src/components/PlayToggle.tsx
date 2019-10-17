import React, { useState } from 'react'
import operationService from '../emulator/operationService'

export default function PlayToggle (props: {}) {
  const [playing, setPlaying] = useState(false)

  function onClick () {
    if (playing) {
      operationService.pause()
    } else {
      operationService.play()
    }
    setPlaying(!playing)
  }

  return <button onClick={onClick}>
    {playing ? 'Pause Emulation' : 'Run Emulation'}
  </button>
}
