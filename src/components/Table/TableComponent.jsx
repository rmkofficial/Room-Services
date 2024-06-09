import { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  Container,
  TablePagination,
} from "@mui/material";
import TableHeader from "./TableHeader";
import TableRows from "./TableRows";

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("malfunction");

  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "90%",
        marginTop: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <TableContainer
        sx={{
          padding: 2,
          backgroundColor: "rgba(71,70,71,255)",
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableRows
            page={page}
            rowsPerPage={rowsPerPage}
            order={order}
            orderBy={orderBy}
            data={data}
          />
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ color: "white", fontSize: "1rem" }}
        />
      </TableContainer>
    </Container>
  );
};

export default TableComponent;
