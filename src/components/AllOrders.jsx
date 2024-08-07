import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InfoIcon from "@mui/icons-material/Info";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const AllOrders = () => {
  const [orders] = useState([
    {
      id: "1",
      orderTime: "25 July 2024 at 15:30:00 UTC+00:00",
      orderType: "Delivery",
      totalPrice: 25.5,
      clientId: "c1",
      deliveryGuy: { name: "John Doe" },
      location: { name: "123 Elm Street" },
      orders: [
        { foodName: "Pizza", quantity: 1, foodPrice: 15.0 },
        { foodName: "Soda", quantity: 2, foodPrice: 5.0 },
      ],
    },
    {
      id: "2",
      orderTime: "25 July 2024 at 16:00:00 UTC+00:00",
      orderType: "Pickup",
      totalPrice: 18.75,
      clientId: "c2",
      deliveryGuy: { name: "Jane Smith" },
      location: { name: "456 Oak Avenue" },
      orders: [
        { foodName: "Burger", quantity: 1, foodPrice: 10.0 },
        { foodName: "Fries", quantity: 1, foodPrice: 3.75 },
      ],
    },
  ]);

  const [customers] = useState({
    c1: "Alice Johnson",
    c2: "Bob Brown",
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportExcel = () => {
    console.log("Excel printing");
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(
      orders.map((order) => ({
        "Order Time": formatDate(order.orderTime),
        "Order Type": order.orderType,
        "Total Price": `GH₵ ${order.totalPrice.toFixed(2)}`,
        "Customer Name": customers[order.clientId] || "Unknown",
        "Delivery Guy Name": order.deliveryGuy?.name || "N/A",
      }))
    );

    XLSX.utils.book_append_sheet(workBook, workSheet, "Orders");
    XLSX.writeFile(workBook, "orders.xlsx");
  };

  const handleExportPDF = () => {
    console.log("PDF printing");

    const doc = new jsPDF();
    doc.text("All Orders", 20, 10);
    doc.autoTable({
      head: [
        [
          "Order Time",
          "Order Type",
          "Total Price",
          "Customer Name",
          "Delivery Guy Name",
        ],
      ],
      body: orders.map((order) => [
        formatDate(order.orderTime),
        order.orderType,
        `GH₵ ${order.totalPrice.toFixed(2)}`,
        customers[order.clientId] || "Unknown",
        order.deliveryGuy?.name || "N/A",
      ]),
    });
    doc.save("orders.pdf");
  };

  const formatDate = (dateString) => {
    dateString = dateString.replace(/^"|"$/g, "");

    if (dateString.includes(" at ")) {
      const [datePart, timePart] = dateString.split(" at ");
      const [day, month, year] = datePart.split(" ");
      const [time, timezone] = timePart.split(" ");
      const [hours, minutes, seconds] = time.split(":");

      const date = new Date(
        Date.UTC(year, getMonthIndex(month), day, hours, minutes, seconds)
      );

      const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        timeZone: "UTC",
      };

      return date.toLocaleString("en-US", options) + " " + timezone;
    } else {
      // If it's not in the custom format, try to parse it as a standard date string
      const date = new Date(dateString);
      return date.toLocaleString();
    }
  };

  // Helper function to get month index
  const getMonthIndex = (monthName) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.indexOf(monthName);
  };

  return (
    <>
      <div>
        <Button
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant="contained"
          sx={{ mb: 2 }}
        >
          <ShoppingCartIcon />
          PRINT ORDERS
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleExportPDF}>
            <Button
              sx={{
                "&:hover": {
                  background: "#1565C0",
                  color: "white",
                },
              }}
            >
              PDF
            </Button>
          </MenuItem>
          <MenuItem onClick={handleExportExcel}>
            <Button
              sx={{
                "&:hover": {
                  background: "#1565C0",
                  color: "white",
                },
              }}
            >
              Excel
            </Button>
          </MenuItem>
        </Menu>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Order Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Order Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Price GH₵</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatDate(order.orderTime)}</TableCell>
                <TableCell>{order.orderType}</TableCell>
                <TableCell>
                  GH₵ {parseFloat(order.totalPrice).toFixed(2)}
                </TableCell>
                <TableCell>{customers[order.clientId] || "Unknown"}</TableCell>
                <TableCell>
                  <Tooltip
                    title={
                      <React.Fragment>
                        <strong>Delivery Guy:</strong>{" "}
                        {order.deliveryGuy?.name || "N/A"}
                        <br />
                        <strong>Location:</strong>{" "}
                        {order.location?.name || "N/A"}
                        <br />
                        <strong>Orders:</strong>
                        <ul>
                          {order.orders?.map((item, index) => (
                            <li key={index}>
                              {item.foodName} x {item.quantity} - GH₵{" "}
                              {item.foodPrice.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </React.Fragment>
                    }
                  >
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AllOrders;
