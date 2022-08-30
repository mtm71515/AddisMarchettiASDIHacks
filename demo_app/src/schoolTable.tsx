import * as React from 'react';
import _ from 'lodash'
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { getSchoolFromCoordinates, getData } from './apiController/apiControllor';
import ControlledAccordion from './recommendedExplanation'

export interface Data {
  schoolName: string,
  schoolLocation: string, 
  schoolRating: number, 
  schoolCurrentRent: number, 
  schoolCurrentHouse: number,
  schoolPredRent: number, 
  schoolPredHouse: number,
  schoolCity: string
}

function createData(
  givenRow: any
): Data {
    const returnSchoolObject = {
      schoolName: givenRow.schoolName,
      schoolLocation: givenRow.schoolLocation,
      schoolRating: (givenRow.schoolRating) ? parseInt(givenRow.schoolRating) : 0,
      schoolCurrentRent: ( givenRow.schoolCurrentRent  > 0 ) ? parseFloat(givenRow.schoolCurrentRent) : 0,
      schoolPredRent: ( givenRow.schoolPredRent > 0 ) ? parseFloat(givenRow.schoolPredRent) : 0,
      schoolCurrentHouse: ( givenRow.schoolCurrentHouse ) > 0 ? parseFloat(givenRow.schoolCurrentHouse) : 0,
      schoolPredHouse: ( givenRow.schoolPredHouse  > 0 ) ? parseFloat(givenRow.schoolPredHouse) : 0,
      schoolLat: givenRow.schoolLatitude,
      schoolLong: givenRow.schoolLongitude,
      schoolCity: givenRow.schoolCity
  };
  return returnSchoolObject;
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'schoolName',
    numeric: false,
    disablePadding: false,
    label: 'School',
  },
  {
    id: 'schoolLocation',
    numeric: false,
    disablePadding: false,
    label: 'Location',
  },
  {
    id: 'schoolRating',
    numeric: true,
    disablePadding: false,
    label: 'School Rating \n (0 indicates no rating)',
  },
  {
    id: 'schoolCurrentRent',
    numeric: true,
    disablePadding: false,
    label: 'Current Median Rent Price',
  },
  {
    id: 'schoolPredRent',
    numeric: true,
    disablePadding: false,
    label: 'Predicted Median Rent Price',
  },
  {
    id: 'schoolCurrentHouse',
    numeric: true,
    disablePadding: false,
    label: 'Current Median House price',
  },
  {
    id: 'schoolPredHouse',
    numeric: true,
    disablePadding: false,
    label: 'Predicted Median House Price',
  },


  
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

export const EnhancedTable = ( props: {
  userCoordinates: string[],
  schoolType: string,
  view: string,
  usersIncome: string,
  usersName: string
}) => {
  const [rows, setRows] = React.useState([] as any[])
  const [recommendedRows, setRecommendedRows] = React.useState([] as any[])
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('schoolRating');
  const [page, setPage] = React.useState(0);
  const [recPage, setRecPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rowsPerRecPage, setRowsPerRecPage] = React.useState(5)

React.useEffect(() => {

  const fetchSchoolArray = async () => {
    const arrayWant = await getSchoolFromCoordinates(props.userCoordinates[0], props.userCoordinates[1], props.schoolType)
    let response = await getData(arrayWant);
    response = response.filter((value: any, index: any, self: any) =>
                                index === self.findIndex((t: any) => (
        t.schoolName == value.schoolName
      ))
    )
    response = response.filter(noRentData)
    setRows(state => (createRows(response)))
    const recRows = response.filter(isRecommended)
    setRecommendedRows(state => (createRows(recRows)))
  }
  fetchSchoolArray()

}, [props.view])

const isRecommended = (givenRow: any) => {
  if (givenRow.schoolPredRent == -1){
    return false;
  }
  const threshold = (parseFloat(props.usersIncome) / 12) * .30
  console.log("Threshold: ",threshold)
  const meetsRent = givenRow.schoolPredRent <= threshold;
  const monthlyInterestRate = (.06/12)
  const fractionalNumerator = (monthlyInterestRate) * ((1 + monthlyInterestRate) ** 360)
  const fractionalDenominator = ((1 + monthlyInterestRate) ** 360) - 1
  const monthlyHousePayment = (givenRow.schoolPredHouse) * ((fractionalNumerator)/(fractionalDenominator))
  console.log("Monthly house payment: ", monthlyHousePayment)
  const meetsMortgage = (threshold) >= monthlyHousePayment
  const meetsCrit = (meetsRent || meetsMortgage)
  console.log("meets rent")
  console.log(meetsRent)
  console.log("meets mortgage")
  console.log(meetsMortgage)
  console.log("meets crit? ")
  console.log(meetsCrit)
  return meetsCrit
}

const noRentData = (givenRow: any) => {
    if (givenRow.schoolPredRent == -1){
    return false;
  } return true;
}

const createRows = (givenData: any) => {
  const rowsArray = _.map(givenData, createData);
  return rowsArray
}


  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRecPage = (event: unknown, newPage: number) => {
    setRecPage(newPage);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerRecPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerRecPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
      <Box sx={{ width: '100%',
        top: 150,
        height: '50%'
        }}>
        <Paper sx={{ width: '100%', mb: 2}}>
          <TableContainer>
            <Table
              sx={{ minWidth: 300
              }}
              aria-labelledby="tableTitle"
              size={'medium'}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                        key={row.schoolName}>
                          <TableCell sx={{minWidth: 80}}align="left">{row.schoolName}</TableCell>
                          <TableCell sx={{minWidth: 180}}align="left">{`${row.schoolLocation}, ${row.schoolCity}`}</TableCell>
                          <TableCell sx={{minWidth: 200}}align="right">{row.schoolRating}</TableCell>
                          <TableCell sx={{minWidth: 180}}align="right">{row.schoolCurrentRent}</TableCell>
                          <TableCell sx={{minWidth: 180}}align="right">{row.schoolPredRent}</TableCell>
                          <TableCell sx={{minWidth: 180}}align="right">{row.schoolCurrentHouse}</TableCell>
                          <TableCell sx={{minWidth: 180}}align="right">{row.schoolPredHouse}</TableCell>
                        </TableRow>
                      );
                  }
                )}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <ControlledAccordion />
        <Paper sx={{ width: '100%', top: 150, mb: 2}}>
          <TableContainer>
            <Table
              sx={{ minWidth: 300
              }}
              aria-labelledby="tableTitle"
              size={'medium'}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={recommendedRows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(recommendedRows, getComparator(order, orderBy))
                  .slice(recPage * rowsPerRecPage, recPage * rowsPerRecPage + rowsPerRecPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                        key={row.schoolName}>
                          <TableCell sx={{minWidth: 80}}align="left">{row.schoolName}</TableCell>
                          <TableCell sx={{minWidth: 180}}align="left">{`${row.schoolLocation}, ${row.schoolCity}`}</TableCell>
                          <TableCell sx={{minWidth: 200}}align="right">{row.schoolRating}</TableCell>
                          <TableCell sx={{minWidth: 180}}align="right">{row.schoolCurrentRent}</TableCell>
                          <TableCell sx={{minWidth: 180}}align="right">{row.schoolPredRent}</TableCell>
                          <TableCell sx={{minWidth: 180}}align="right">{row.schoolCurrentHouse}</TableCell>
                          <TableCell sx={{minWidth: 180}}align="right">{row.schoolPredHouse}</TableCell>
                        </TableRow>
                      );
                  }
                )}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5,10, 25]}
            component="div"
            count={recommendedRows.length}
            rowsPerPage={rowsPerRecPage}
            page={recPage}
            onPageChange={handleChangeRecPage}
            onRowsPerPageChange={handleChangeRowsPerRecPage}
          />
        </Paper>
      </Box>
  );
}
