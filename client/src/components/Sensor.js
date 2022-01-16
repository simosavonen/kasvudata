import React from 'react'
import * as dayjs from 'dayjs'

const Sensor = ({ sensor, expandedRow, handleRowExpansion }) => {
    const isExpanded = expandedRow === sensor.id
    return (
        <>
        <tr className={isExpanded ? 'is-selected' : ''}
         onClick={(e) => handleRowExpansion(sensor.id)}>
          <td>{sensor.name}</td>
          <td>{dayjs(sensor.readings[0]?.datetime).format('DD.MM.YYYY HH:mm')}</td>
          <td>{sensor.sensorType === 'rainFall' ? sensor.readings[0]?.value : ''}</td>
          <td>{sensor.sensorType === 'temperature' ? sensor.readings[0]?.value : ''}</td>
          <td>{sensor.sensorType === 'pH' ? sensor.readings[0]?.value : ''}</td>          
        </tr>
        {isExpanded && sensor.readings.map(reading => {
            return (
            <tr key={reading.datetime}>
                <td></td>
                <td>{dayjs(reading.datetime).format('DD.MM.YYYY HH:mm')}</td>
                <td>{sensor.sensorType === 'rainFall' ? reading.value : ''}</td>
                <td>{sensor.sensorType === 'temperature' ? reading.value : ''}</td>
                <td>{sensor.sensorType === 'pH' ?reading.value : ''}</td>
            </tr>
            )
        })}
        </>
    )
}

export default Sensor