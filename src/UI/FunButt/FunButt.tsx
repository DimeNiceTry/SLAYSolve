import React from 'react'
import classes from './FunButt.module.css'
const FunButt = (props) => {
  return (
    <button className= {classes.fndBtn}{...props}>
        
    </button>
  )
}

export default FunButt