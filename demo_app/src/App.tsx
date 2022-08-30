/* eslint-disable */
import logo from './logo.svg';
import './cssFiles/nameInputCss.css'
import Amplify, { API } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { getGeoIdFromZip, getSchoolFromCoordinates } from './apiController/apiControllor';
import NameInputForm from './nameInputPage'
import Select, { SelectChangeEvent } from '@mui/material/Select';
const myAPI = "api66e4ce48"
const path = '/customers'; 
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {  EnhancedTable } from './schoolTable'
import { makeInitialSchoolObjects } from './apiController/apiControllor';
import { getData, attachGeoIdToSchools } from './apiController/apiControllor'

export interface Location {
  schoolLong?: string;
  schoolLat?: string;
  schoolCity: string;
  schoolState: string;
  schoolStateCode: string;
}

export const defaultLocation: Location = {
  schoolLong: "-85.25049000",
  schoolLat: "31.57184000", 
  schoolCity: 'Abbeville',
  schoolState: "Alabama",
  schoolStateCode: "AL"
}

const App = () => {

  const [schoolType, setSchoolType] = useState("h")

  const schoolCountry = "USA"
  const [view, setView] = useState("NameInputForm");
  const [schoolLocation, setSchoolLocation] = useState(defaultLocation)
  const [usersName, setUsersName] = useState("")
  const [usersIncome, setUsersIncome] = useState("")
  const [userCoordinates, setUserCoordinates] = useState(["31.57184000","-85.25049000"])
  const [finalSchoolArray, setFinalSchoolArray] = useState([] as any[])

  const onNameEnter = (event: any) => {
    setUsersName(event.target.value);
  }

  const handleSchoolTypeChange = (event: any) => {
    setSchoolType(event.target.value)
  }

  const onIncomeEnter = (event: any) => {
    setUsersIncome(event.target.value);
  }

  const handleViewChange = (e: any) => {
    e.preventDefault();
    if(checkView("NameInputForm")){
      setView("TableView")
    }
    else {
      setView("NameInputForm")
    }
  }

  const handleStateChange = (stateName: string) => {
    setSchoolLocation(state => ({...state, schoolState: stateName, schoolCity: ''}))
  };
  const handleCityChange = (event: string) => {
    setSchoolLocation(state => ({...state, schoolCity: event}))
  };
  const handleStateCodeChange = (stateCode: string) => {
    setSchoolLocation(state => ({...state, schoolStateCode: stateCode}))
  };
  const handleLongLatChange = (coordinates: string[]) => {
    setUserCoordinates([coordinates[0], coordinates[1]])
  }

  const checkView = (given: string): boolean => {
    return (given === view)
  }


  return (
    <div className={checkView("NameInputForm") ? "container" : "containerSchoolTable"}>    
    {  
      !checkView("NameInputForm") ? 
    <EnhancedTable 
      userCoordinates={userCoordinates}
      schoolType={schoolType}
      view={view}
      usersIncome={usersIncome}
      usersName={usersName}
    /> : 
    <NameInputForm
      usersName={usersName}
      usersIncome={usersIncome}
      onNameEnter={onNameEnter}
      onIncomeEnter={onIncomeEnter}
      handleCityChange={handleCityChange}
      handleStateChange={handleStateChange}
      handleStateCodeChange={handleStateCodeChange}
      schoolLocation={schoolLocation}
      handleCoordChange={handleLongLatChange}
      userCoordinates={userCoordinates}
      handleViewChange={handleViewChange}
      handleSchoolTypeChange={handleSchoolTypeChange}
    />

    }
</div>

  )
}

export default App;
