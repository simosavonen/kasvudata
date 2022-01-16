import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import SensorTable from './components/SensorTable'
import axios from 'axios'
import 'bulma/css/bulma.min.css'


const App = () => {
  const [sensors, setSensors] = useState([])
  const [expandedRow, setExpandedRow] = useState('')
  
  useEffect(() => {
    axios
      .get('http://localhost:6868/api/sensors')
      .then(response => {
        setSensors(response.data)
      })
  }, [])

  const handleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? '' : id )
  }

  return (
    <>
      <Header />
      <div className='container'>
        <SensorTable 
          sensors={sensors} 
          expandedRow={expandedRow} 
          handleRowExpansion={handleRowExpansion} 
        />
      </div>          
    </>
  )
}

export default App;
