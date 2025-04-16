"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Line,
  Svg,
  Font,
} from "@react-pdf/renderer";
import {
  CheckoutBarcodeListInterface,
  CheckoutCompanyDetailsInterface,
  CheckoutInventoryDescriptionInterface,
} from "@/types/CheckoutInterface";

Font.register({
  family: "OpenSans",
  src: "../../assets/fonts/OpenSans/OpenSans-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "OpenSans",
    padding: 30,
  },
  companySection: {
    marginBottom: 15,
    textAlign: "center",
  },
  companyName: {
    fontSize: 16,
    fontWeight: 800,
  },
  companyAddress: {
    fontSize: 12,
    fontWeight: 300,
  },
  companyVAT: {
    fontSize: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 10,
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    width: "auto",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
  },
  boldLabel: {
    fontSize: 10,
    fontWeight: 700,
  },
  value: {
    flexDirection: "row",
    fontSize: 10,
    fontWeight: 400,
    textAlign: "left",
    flexWrap: "wrap",

    paddingLeft: 10,
    // paddingRight: 50,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  headerRow: {
    backgroundColor: "#f2f2f2",
    fontWeight: 700,
  },
  tableCell: {
    fontSize: 8,
    padding: 5,
    textAlign: "center",
  },
  productCell: {
    flex: 1,
    textAlign: "left",
  },
  smallCell: {
    width: "5%",
  },
  mediumCell: {
    width: "12%",
  },
  align: {
    textAlign: "right",
  },
  remarksSection: {
    fontSize: 10,
    position: "absolute",
    bottom: 120,
    left: "12%",
  },
  signatureSection: {
    position: "absolute",
    bottom: "50",
    left: "12%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "20%",
    alignItems: "center",
    borderTop: "1 solid black",
    paddingTop: 5,
    marginRight: 10,
  },
  signatureText: {
    fontSize: 10,
  },
});

const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const GenerateBarcodeList = ({
  companyDetails,
  date,
  nepaliDate,
  CheckoutNumber,
  barcodeList,
}: {
  companyDetails: CheckoutCompanyDetailsInterface | undefined;
  date: string;
  nepaliDate: string;
  CheckoutNumber: string;
  barcodeList?: CheckoutBarcodeListInterface;
}) => {
  const productChunks = chunkArray(barcodeList?.BarcodeDetails || [], 20);

  return (
    <Document
      title={`${companyDetails?.SaleChallanNumber} - Barcode List`}
      pageLayout="singlePage"
    >
      {productChunks.map((productPage, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex}>
          <View style={styles.companySection}>
            <Text style={styles.companyName}>
              {companyDetails?.CompanyFrom}
            </Text>
            <Text style={styles.companyAddress}>
              {companyDetails?.CompanyFromAddress}
            </Text>
          </View>

          <Text style={styles.title}>Barcode List</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.column}>
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

              <View style={styles.detailsContainer}>
                <View style={styles.column}>
                  <View style={styles.detailRow}>
                    <Text style={styles.boldLabel}>Customer: </Text>
                    <Text style={styles.value}>
                      {companyDetails?.CompanyTo}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Address: </Text>
                    <Text style={styles.value}>
                      {companyDetails?.CompanyToAddress}
                    </Text>
                  </View>
                </View>
                <View style={styles.column}>
                  <View style={styles.detailRow}>
                    <Text style={styles.boldLabel}>Challan Number: </Text>
                    <Text style={styles.value}>
                      {barcodeList?.ChallanNumber}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Date: </Text>
                    <Text style={styles.value}>{date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Miti: </Text>
                    <Text style={styles.value}>{nepaliDate}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.headerRow]}>
              <Text style={[styles.tableCell, styles.smallCell]}>S.N.</Text>
              <Text style={[styles.tableCell, styles.productCell]}>
                Product
              </Text>
              <Text style={[styles.tableCell, styles.productCell]}>
                Pack Size
              </Text>
              <Text style={[styles.tableCell, styles.productCell]}>
                Barcode
              </Text>
              <Text style={[styles.tableCell, styles.mediumCell]}>Qty</Text>
            </View>

            {productPage.map((inventory, invIndex) => (
              <View key={invIndex} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.smallCell]}>
                  {String(invIndex + 1)}
                </Text>
                <Text style={[styles.tableCell, styles.productCell]}>
                  {inventory.Product}
                </Text>
                <Text style={[styles.tableCell, styles.productCell]}>
                  {inventory.PackSize}
                </Text>
                <Text style={[styles.tableCell, styles.productCell]}>
                  {inventory.Barcode}
                </Text>
                <Text style={[styles.tableCell, styles.mediumCell]}>
                  {inventory.Quantity?.toFixed(2)}
                </Text>
              </View>
            ))}
            {pageIndex === productChunks.length - 1 && (
              <View
                style={{
                  flexDirection: "row",
                  borderTop: "1 solid black",
                  width: "100%",
                }}
              >
                <Text
                  style={[
                    styles.tableCell,
                    styles.productCell,
                    {
                      fontWeight: "bold",
                      width: "100%",
                      marginLeft: "5%",
                    },
                  ]}
                >
                  Total:
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.mediumCell,
                    { fontWeight: "bold", width: "12%", textAlign: "center" },
                  ]}
                >
                  {barcodeList?.TotalQuantity
                    ? barcodeList.TotalQuantity.toFixed(2)
                    : "0.00"}
                </Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default GenerateBarcodeList;
