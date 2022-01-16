import React from 'react'
import Sensor from './Sensor'

const SensorTable = ({sensors, expandedRow, handleRowExpansion}) => {
  return (
    <table className='table is-fullwidth is-hoverable'>
    <tbody>
      <tr>
        <th>Location</th>
        <th>Date and time</th>
        <th>Rainfall</th>
        <th>Temperature</th>
        <th>pH</th>
      </tr>
    {sensors.map(sensor => 
    <Sensor 
      key={sensor.id} 
      sensor={sensor} 
      expandedRow={expandedRow} 
      handleRowExpansion={handleRowExpansion} />)
    }
    </tbody>
    </table>
  )
}

export default SensorTable