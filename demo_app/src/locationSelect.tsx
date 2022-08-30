/* eslint-disable */
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import _ from 'lodash'
import { ExtendButtonBase, MenuItemTypeMap } from '@mui/material/'
import { Location } from './App'

const countrystatecity = require('country-state-city')

const getCityItem: ExtendButtonBase<MenuItemTypeMap<{}, "li">> = (row: any) => {
  const cityitemval = [row.name as string, row.latitude as string, row.longitude as string];
    return (
      <MenuItem value={cityitemval + ""}>{row.name}</MenuItem>
    )   
}
const getStateItem: ExtendButtonBase<MenuItemTypeMap<{}, "li">> = (row: any) => {
  const menuitemval = [row.name as string, row.isoCode as string]
//  console.log(menuitemval + "")
  return (
      <MenuItem value={menuitemval + ""}>{row.isoCode}</MenuItem>
    )   
}

function getNameObject(row: any) {
  return [row.name, row.latitude, row.longitude]+"";
}

const LocationSelect = ( props: {
                                schoolLocation: Location,
                                 handleStateChange: (event: string) => void, 
                                 handleCityChange: (event: string) => void,
                                 handleStateCodeChange: (event: string) => void,
                                 handleCoordChange: (coords: string[]) => void,
                                 userCoordinates: string[],
                                 handleSchoolTypeChange: (event: any) => void
})  => {

  const getNames = (given: any) => {
    return _.map(given, getNameObject)
  }
//{_.map(countrystatecity.City.getCitiesOfState('US',props.schoolState), (row: any) => getMenuItem)}
  React.useEffect(() => {
    console.log("Re rendered"); 
    setCityOptions(getNames(countrystatecity.City.getCitiesOfState('US',props.schoolLocation.schoolStateCode)))
    console.log(props.schoolLocation.schoolCity)
  }, [props.schoolLocation.schoolState, props.schoolLocation.schoolCity])

  const customStateSelector = (event: SelectChangeEvent) => {
    const stateString = event.target.value;
    const stringArr = stateString.split(",");
    props.handleStateCodeChange(stringArr[1]);
    props.handleStateChange(stringArr[0]);
  }

  const customCitySelector = (event: SelectChangeEvent) => {
    const cityString = event.target.value;
    const stringArr = cityString.split(",");
    props.handleCityChange(stringArr[0]);
    props.handleCoordChange([stringArr[1],stringArr[2]]);
  }

  const [cityOptions, setCityOptions] = React.useState(getNames(countrystatecity.City.getCitiesOfState('US',props.schoolLocation.schoolStateCode)))
  return (
    <div>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">State</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={[props.schoolLocation.schoolState, props.schoolLocation.schoolStateCode] + ""}
            label="Age"
            onChange={customStateSelector}
          >
            {_.map(countrystatecity.State.getStatesOfCountry('US'), getStateItem)}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">City</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue=''
            value={[props.schoolLocation.schoolCity,props.userCoordinates[0],props.userCoordinates[1]]+""}
            label="Age"
            onChange={customCitySelector}
          >
            {_.map(countrystatecity.City.getCitiesOfState('US',props.schoolLocation.schoolStateCode), getCityItem)}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">School Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={"h"}
            label=""
            onChange={props.handleSchoolTypeChange}
          >
            <MenuItem value={"h"}>High School</MenuItem>
            <MenuItem value={"m"}>Middle School</MenuItem>
            <MenuItem value={"e"}>ElementarySchools</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}

export default LocationSelect;
