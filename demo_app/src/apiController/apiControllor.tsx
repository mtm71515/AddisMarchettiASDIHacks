
/* eslint-disable */
import Amplify, { API } from 'aws-amplify'
import React, { useEffect, useState } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import awsExports from '../aws-exports'

const myAPI = "returnZipCode"
const path = '/userZip'; 
import _ from 'lodash'

const baseSchoolAPI = "https://gs-api.greatschools.org/"

const getSchoolsFromCoordinatesURL = (lat: string, long: string, schoolType: string) => {
  return `${baseSchoolAPI}/nearby-schools?lat=${lat}&lon=${long}&limit=50&distance=30&level_codes=${schoolType}`
}

export const getSchoolFromCoordinates = async (lat: string, long: string, schoolType: string) => {
  try {
    const  response = await fetch(`http://localhost:8080/${getSchoolsFromCoordinatesURL(lat, long, schoolType)}`, {
    headers: {
    "X-Api-Key": "RRueMP9HGj7nl9gYA8lfV9cDqSF0Etps8SyCplHR"
    }
  })

  const data = await response.clone().json() 
  const initialArray = makeInitialSchoolObjects(data.schools)
  let goodArray = await Promise.all(_.map(initialArray, attachSingleGeoId));
  console.log("BEST ARAY")
  console.log(goodArray)
 // await getData(data);
  return initialArray;
  } catch (error) {
    console.log(error)
  }
}



const baseFCCApi = "https://geo.fcc.gov/api/census/"  

const getFccCall = (lat: string, long: string) => {
  return `${baseFCCApi}area?lat=${lat}&lon=${long}&censusYear=2010&format=json`
}

export const getGeoIdFromZip = async (lat: string, long: string) => {
  try {
  const response = await fetch(`http://localhost:8080/${getFccCall(lat, long)}`)   
  const data = await response.clone().json()
  let fips_code = data.results[0].block_fips.substring(0,11)
  let finalCode
  if(fips_code.charAt(0)==='0'){
    finalCode = fips_code.substr(1) + ".0";
  } else {
    finalCode = fips_code + ".0"
  }
  return finalCode
  } catch (error) {
    console.log(error)
  }
}

const attachSingleGeoId = async (school: any) => {
  const geoID = await getGeoIdFromZip(school.schoolLat, school.schoolLong)
  school.GeoID = geoID;
  return school
}

export const attachGeoIdToSchools = async (schools: any) => {
  console.log("attach all ids")
  const goodArray = _.map(schools, attachSingleGeoId)
  console.log("GOOD ARRAY")
  console.log(goodArray)
  return goodArray;
}

interface SchoolData {
  schoolName: string,
  schoolLocation: string, 
  schoolRating: number, 
  schoolCurrentRent?: number, 
  schoolCurrentHouse?: number,
  schoolPredRent?: number, 
  schoolPredHouse?: number,
  schoolLat?: string,
  schoolLong?: string,
  schoolCity?: string
}
const makeSchoolObject = (school: any): SchoolData => {
    return {
      schoolName: school.name,
      schoolLocation: school.street,
      schoolRating: school.rating,
      schoolLat: school.lat,
      schoolLong: school.lon,
      schoolCity: school.city
    }
} 

export const makeInitialSchoolObjects = (schools: any): SchoolData[] => {
    const schoolArray = _.map(schools, makeSchoolObject)
    return schoolArray
}

export const getData = async (schoolJson: any) => {
  try {
    console.log("API CALLED WITH ")
    console.log(schoolJson)
    const response = await API.post(myAPI, path+"/30", {
      body: JSON.stringify(schoolJson),
    })
    return response
  } catch (error) {
    console.log(error)
  }
}

  
