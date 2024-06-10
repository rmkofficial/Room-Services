import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
import PropTypes from "prop-types";

const TableHeader = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = (property) => () => {
    onRequestSort(property);
  };

  const headCells = [
    { id: "malfunction", label: "Malfunction" },
    { id: "delayCategory", label: "Delay Category" }, // category değiştirildi
    { id: "activation", label: "Activation" }, // incidentTime değiştirildi
    { id: "acknowledgement", label: "Acknowledgement" },
    { id: "ackTime", label: "Ack. Time" },
    { id: "status", label: "Status" },
    { id: "moreDetails", label: "More Details" },
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ color: "white", fontSize: "16px" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                color: "white",
                fontSize: "20px",
                "&:hover": {
                  color: "lightgray",
                },
                "& .MuiTableSortLabel-icon": {
                  color: orderBy === headCell.id ? "white" : "white",
                },
                "&.Mui-active": {
                  color: "white",
                },
              }}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

TableHeader.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

export default TableHeader;
