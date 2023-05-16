import React, { useMemo, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const DataTableTop3 = () => {
    const [allData, setAllData] = useState([]);
    const [currentPage] = useState(0);
    const [rowsPerPage] = useState(10);
  
    const classes = useStyles();
  
    const columns = useMemo(
      () => [
        {
          Header: 'Departamento',
          accessor: 'departamento',
        },
        {
          Header: 'Total Votos',
          accessor: 'total_votos_presidente',
        },
      ],
      []
    );
  
    useEffect(() => {
        const intervaId = setInterval(() => {
          // Actualizo mi tabla cada 3 seg
          const fetchData = async () => {
            const response = await fetch('http://34.133.149.148:3001/top3');
            const jsonData = await response.json();
            setAllData(jsonData);
          };
          fetchData();
        }, 3000);
        return () => clearInterval(intervaId);
      }, []);
  

  
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const slicedData = allData.slice(startIndex, endIndex);
  
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.Header}>{column.Header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((row) => (
              <TableRow key={row.name}>
                {columns.map((column) => (
                  <TableCell key={column.Header}>
                    {row[column.accessor]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default DataTableTop3;
  