import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Svg,
  Line,
  Font,
} from "@react-pdf/renderer";
import NepaliDate from "nepali-date-converter";
import { ReportInterface } from "@/types/ReportInterface";

// Register the font
Font.register({
  family: "OpenSans",
  fonts: [
    { src: "../../assets/fonts/OpenSans/OpenSans-Regular.ttf" },
    { src: "../../assets/fonts/OpenSans/OpenSans-Light.ttf", fontWeight: 300 },
    { src: "../../assets/fonts/OpenSans/OpenSans-Medium.ttf", fontWeight: 500 },
    {
      src: "../../assets/fonts/OpenSans/OpenSans-SemiBold.ttf",
      fontWeight: 600,
    },
    { src: "../../assets/fonts/OpenSans/OpenSans-Bold.ttf", fontWeight: 700 },
    {
      src: "../../assets/fonts/OpenSans/OpenSans-ExtraBold.ttf",
      fontWeight: 800,
    },
  ],
});

// Define styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "OpenSans",
    padding: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 20,
  },
  date: {
    position: "absolute",
    top: 30,
    right: 30,
    fontSize: 10,
    fontWeight: 500,
  },
  detailsContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    textAlign: "center",
  },
  mediumCell: {
    width: "18%",
    padding: 5,
    textAlign: "center",
  },
  customerCell: {
    width: "18%",
    flexWrap: "wrap",
    padding: 5,
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderColor: "#000",
    marginBottom: 10,
  },
  tableCell: {
    fontSize: 10,
    textAlign: "left",
  },
  headerRow: {
    backgroundColor: "#f2f2f2",
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 10,
    fontWeight: 700,
    textAlign: "center",
  },
  data: {
    fontSize: 8,
    textAlign: "center",
  },
});

// GenerateReportPDF component
const GenerateReportPDF = ({ data }: { data: ReportInterface[] }) => {
  const englishDateRaw = new Date();
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const englishDate = formatter.format(englishDateRaw);

  const nepaliDateRaw = new NepaliDate(englishDateRaw).getBS();
  const nepaliDate = `${nepaliDateRaw.date < 10 ? 0 : ""}${nepaliDateRaw.date}/${nepaliDateRaw.month < 10 ? "0" : ""}${nepaliDateRaw.month + 1}/${nepaliDateRaw.year}`;

  return (
    <Document pageLayout="singlePage">
      <Page size="A4" style={styles.page}>
        {/* Date at the top-right */}
        <Text style={styles.date}>Date: {englishDate}</Text>

        {/* Report title */}
        <Text style={styles.title}>Report</Text>

        {/* Line below the title */}
        <Svg height="10" width="800">
          <Line
            x1="0"
            y1="5"
            x2="540"
            y2="5"
            strokeWidth={2}
            stroke="rgb(0,0,0)"
          />
        </Svg>

        {/* Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.headerRow]}>
            <Text style={[styles.label, styles.mediumCell]}>Customer Name</Text>
            <Text style={[styles.label, styles.mediumCell]}>Inventory ShortName</Text>
            <Text style={[styles.label, styles.mediumCell]}>Dispatched Date</Text>
            <Text style={[styles.label, styles.mediumCell]}>Inventory Expiry Date</Text>
            <Text style={[styles.label, styles.mediumCell]}>Quantity</Text>
          </View>

          {data?.map((item, index) => (
            item.InventoryDetails.map((inventoryItem, inventoryIndex) => (
              <View style={styles.tableRow} key={`${index}-${inventoryIndex}`}>
                <Text style={[styles.tableCell, styles.customerCell]}>
                  {item.Customer}
                </Text>
                <Text style={[styles.tableCell, styles.mediumCell]}>
                  {inventoryItem.ShortName}
                </Text>
                <Text style={[styles.tableCell, styles.mediumCell]}>
                  {inventoryItem.Date}
                </Text>
                <Text style={[styles.tableCell, styles.mediumCell]}>
                  {inventoryItem.ExpirationDate}
                </Text>
                <Text style={[styles.tableCell, styles.mediumCell]}>
                  {inventoryItem.Quantity}
                </Text>
              </View>
            ))
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default GenerateReportPDF;
