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

const DataTable = () => {
    const [allData, setAllData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage] = useState(10);
  
    const classes = useStyles();
  
    const columns = useMemo(
      () => [
        {
          Header: 'Sede',
          accessor: 'sede',
        },
        {
          Header: 'Municipio',
          accessor: 'municipio',
        },
        {
          Header: 'Departamento',
          accessor: 'departamento',
        },
        {
          Header: 'Papeleta',
          accessor: 'papeleta',
        },
        {
          Header: 'Partido',
          accessor: 'partido',
        },
      ],
      []
    );
  
    useEffect(() => {
        const intervaId = setInterval(() => {
          // Actualizo mi tabla cada 3 seg
          const fetchData = async () => {
            const response = await fetch('http://34.133.149.148:3001/all');
            const jsonData = await response.json();
            setAllData(jsonData);
          };
          fetchData();
        }, 3000);
        return () => clearInterval(intervaId);
      }, []);
  
    const handlePreviousPageClick = () => {
      setCurrentPage((prevPage) => prevPage - 1);
    };
  
    const handleNextPageClick = () => {
      setCurrentPage((prevPage) => prevPage + 1);
    };
  
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const slicedData = allData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allData.length / rowsPerPage);
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPages - 1;
  
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.Header} align="center">{column.Header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((row) => (
              <TableRow key={row.name} align="center">
                {columns.map((column) => (
                  <TableCell key={column.Header} align="center">
                    {row[column.accessor]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          <button onClick={handlePreviousPageClick} disabled={isFirstPage}>
            Anterior
          </button>
          <button onClick={handleNextPageClick} disabled={isLastPage}>
            Siguiente
          </button>
        </div>
      </TableContainer>
    );
  };
  
  export default DataTable;
  