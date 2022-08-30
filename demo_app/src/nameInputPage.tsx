
/* eslint-disable */
import logo from './logo.svg';
import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import { Container } from "@mui/material";
import './cssFiles/nameInputCss.css'
import LocationSelect from './locationSelect';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Location } from './App'

export const NameInputForm = (props: { usersName: string,
                              usersIncome: string,
                              onNameEnter: (event: any) => void, 
                              onIncomeEnter: (event: any) => void,
                              schoolLocation: Location;
                              handleCityChange: (event: string) => void, 
                              handleStateChange: (event: string) => void,
                              handleCoordChange: (coord: string[]) => void,
                              handleStateCodeChange: (event: string) => void,
                              userCoordinates: string[],
                              handleViewChange: (e: any) => void,
                              handleSchoolTypeChange: (event: any) => void
                              }) => {
  useEffect(() => {
  })

  return (
      <form id="contact" action="" method="post">
        <h3>Welcome to SchoolAssist!</h3>
        <h4>Please enter your information to get started</h4>
        <fieldset>
          <input placeholder="Your name" type="text" autoFocus required tabIndex={1} onChange={props.onNameEnter}></input>
        </fieldset>
        <fieldset>
          <input placeholder="Your Annual Income" type="tel" required tabIndex={3} onChange={props.onIncomeEnter}></input>
        </fieldset>
        <fieldset>
          <LocationSelect 
            schoolLocation={props.schoolLocation}
            handleStateChange={props.handleStateChange}
            handleCityChange={props.handleCityChange}
            handleStateCodeChange={props.handleStateCodeChange}
            handleCoordChange={props.handleCoordChange}
            userCoordinates={props.userCoordinates}
            handleSchoolTypeChange={props.handleSchoolTypeChange}
          />
        </fieldset>
        <fieldset>
          <button name="submit" type="button" id="contact-submit" onClick={props.handleViewChange} data-submit="...Sending">Submit</button>
        </fieldset>
      </form>
  )
}

export default NameInputForm;
