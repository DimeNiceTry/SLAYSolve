import React from 'react'
import classes from './FindPiInput.module.css'

const FindPiInput = (props) => {
  return (
    <input className = {classes.FindPiInput} {...props} />
  )
}

export default FindPiInput