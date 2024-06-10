import { useState, useEffect } from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import moreDetailsIcon from "../../assets/more-details/moreDetails.png";
import laundryIcon from "../../assets/delay-category/Laundry.png";
import murIcon from "../../assets/delay-category/MUR.png";
import waitingAckIcon from "../../assets/acknowledgement/Waiting.png";
import alertIcon from "../../assets/status-icons/Error.png";
import successIcon from "../../assets/status-icons/Success.png";

const TableRows = ({ page, rowsPerPage, order, orderBy, data }) => {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? "P.M." : "A.M.";
    const formattedHours = ("0" + (hours % 12 || 12)).slice(-2);
    return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
  };

  const handleAcknowledge = (id) => {
    const updatedData = localData.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          acknowledgement: "Acknowledged",
          ackTime: formatDateTime(new Date()),
          status: "Waiting Repair",
        };
      }
      return row;
    });
    setLocalData(updatedData);
  };

  const handleFix = (id) => {
    const updatedData = localData.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          status: "Fixed",
          fixedTime: formatDateTime(new Date()),
        };
      }
      return row;
    });
    setLocalData(updatedData);
  };

  const handleMoreDetails = (row) => {
    console.log(JSON.stringify(row, null, 2));
  };

  const getChipColor = (status) => {
    if (status === "Acknowledged" || status === "Fixed") {
      return { backgroundColor: "green", color: "white" };
    } else if (status === "Waiting Ack." || status === "Waiting Repair") {
      return { backgroundColor: "red", color: "white" };
    } else {
      return { backgroundColor: "default", color: "default" };
    }
  };

  const timeStyle = { color: "white", fontSize: "0.875rem", marginTop: 1 };

  const parseDateString = (dateString) => {
    if (!dateString) return new Date(0);
    const [date, time, period] = dateString.split(" ");
    const [year, month, day] = date.split("-");
    const [hours, minutes] = time.split(":");
    const hours24 =
      period === "P.M." ? (parseInt(hours) % 12) + 12 : parseInt(hours) % 12;
    return new Date(year, month - 1, day, hours24, minutes);
  };

  const sortedData = localData.sort((a, b) => {
    const aValue = a[orderBy] || "";
    const bValue = b[orderBy] || "";

    if (orderBy === "ackTime" || orderBy === "activation") {
      const dateA = parseDateString(aValue);
      const dateB = parseDateString(bValue);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getCategoryIcon = (delayCategory) => {
    switch (delayCategory) {
      case "Laundry":
        return laundryIcon;
      case "MUR":
        return murIcon;
      default:
        return null;
    }
  };

  return (
    <TableBody>
      {paginatedData.map((row) => (
        <TableRow key={row.id}>
          <TableCell sx={{ color: "white", padding: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={row.status === "Fixed" ? successIcon : alertIcon}
                alt={row.status === "Fixed" ? "Success" : "Alert"}
                style={{ width: "28px", height: "28px", marginRight: "12px" }}
              />
              <Typography sx={{ color: "white", fontSize: "18px" }}>
                {row.roomId}
              </Typography>
            </Box>
          </TableCell>

          <TableCell sx={{ color: "white", padding: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {getCategoryIcon(row.delayCategory) && (
                <img
                  src={getCategoryIcon(row.delayCategory)}
                  alt={row.delayCategory}
                  style={{ width: "28px", height: "28px", marginRight: "12px" }}
                />
              )}
              <Typography sx={{ color: "white", fontSize: "18px" }}>
                {row.delayCategory}
              </Typography>
            </Box>
          </TableCell>
          <TableCell sx={{ color: "white", padding: "16px", fontSize: "18px" }}>
            {row.activation}
          </TableCell>
          <TableCell sx={{ padding: "16px" }}>
            <Chip
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {row.acknowledgement}
                  {row.acknowledgement === "Waiting Ack." && (
                    <img
                      src={waitingAckIcon}
                      alt="Waiting Ack."
                      style={{
                        width: "20px",
                        height: "20px",
                        marginLeft: "8px",
                      }}
                    />
                  )}
                </Box>
              }
              sx={{
                ...getChipColor(row.acknowledgement),
                color: "white",
                fontSize: "16px",
                cursor:
                  row.acknowledgement === "Waiting Ack."
                    ? "pointer"
                    : "default",
                "&:hover": {
                  backgroundColor:
                    row.acknowledgement === "Waiting Ack." ? "red" : "",
                },
              }}
              onClick={() => {
                if (row.acknowledgement === "Waiting Ack.") {
                  handleAcknowledge(row.id);
                }
              }}
              clickable={row.acknowledgement === "Waiting Ack."}
            />
          </TableCell>
          <TableCell sx={{ color: "white", padding: "16px", fontSize: "18px" }}>
            {row.acknowledgement === "Waiting Ack." ? "" : row.ackTime}
          </TableCell>
          <TableCell sx={{ color: "white", padding: "16px" }}>
            {row.acknowledgement === "Acknowledged" &&
            row.status !== "Fixed" ? (
              <Chip
                label="Waiting Repair"
                sx={{
                  ...getChipColor("Waiting Repair"),
                  color: "white",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "red",
                  },
                }}
                onClick={() => handleFix(row.id)}
                style={{ cursor: "pointer" }}
              />
            ) : row.status === "Fixed" ? (
              <Box>
                <Chip
                  label="Fixed"
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    fontSize: "16px",
                  }}
                />
                <Typography sx={{ ...timeStyle, fontSize: "18px" }}>
                  {row.fixedTime}
                </Typography>
              </Box>
            ) : (
              <Chip
                label={row.acknowledgement}
                sx={{
                  ...getChipColor(row.acknowledgement),
                  color: "white",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "red",
                  },
                }}
              />
            )}
          </TableCell>
          <TableCell sx={{ padding: "16px" }}>
            <img
              src={moreDetailsIcon}
              alt="More Details"
              onClick={() => handleMoreDetails(row)}
              style={{
                paddingLeft: "20px",
                cursor: "pointer",
                width: "36px",
                height: "24px",
              }}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

TableRows.propTypes = {
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default TableRows;
