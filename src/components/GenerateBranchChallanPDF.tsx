"use client";
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

import {
  CheckoutBranchDetailsInterface,
  CheckoutCompanyDetailsInterface,
  CheckoutInventoryDescriptionInterface,
} from "@/types/CheckoutInterface";

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

  product: {
    flex: 1,
    textAlign: "center",
  },
  smallCell: {
    width: "5%",
  },
  mediumCell: {
    width: "12%",
  },
  descriptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    backgroundColor: "#c2c2c2",
    padding: 5,
  },
  descriptionText: { fontWeight: 600 },
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
  receiverBlock: {
    width: "20%",
    alignItems: "center",
    borderTop: "1 solid black",
    marginRight: 10,
  },
  receiverText: {
    marginTop: -50,
    fontSize: 15,
    border: "1 solid black",
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

  align: {
    textAlign: "right",
  },
});

const chunkArray = (array: any[], size: number) => {
  const result: any[] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const GenerateBranchChallanPDF = ({
  companyDetails,
  branchDetails,
  checkoutList,
  remarks,
  poNumber,
  date,
  nepaliDate,
  totalQuantity,
}: {
  companyDetails: CheckoutCompanyDetailsInterface | undefined;
  branchDetails: CheckoutBranchDetailsInterface | undefined;
  checkoutList: CheckoutInventoryDescriptionInterface[] | undefined;
  poNumber: string;
  remarks?: string;
  date: string;
  nepaliDate: string;
  totalQuantity: Number;
}) => {
  const chunks = chunkArray(
    checkoutList
      ?.flatMap((items) =>
        items.SelectedInventories.map((inventory) => ({
          ...inventory,
          description: items.ShortName
            ? `${items.Description || ""}(${items.ShortName || ""})`
            : `${items.Description || ""}`,
        }))
      )
      ?.filter((inventory) => inventory !== null && inventory !== undefined) ||
      [],
    15
  );

  let serialNumber = 1;
  const hasPartNumber = checkoutList?.some((item) =>
    item.SelectedInventories.some((inventory) => inventory.PartNumber !== null)
  );

  return (
    <Document title={branchDetails?.ChallanNumber} pageLayout="singlePage">
      {chunks.map((chunk, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex}>
          <View style={styles.companySection}>
            <Text style={styles.companyName}>
              {companyDetails?.CompanyFrom}
            </Text>
            <Text style={styles.companyAddress}>Tinkune, Kathmandu</Text>
            <Text style={styles.companyVAT}>
              VAT/PAN No: {companyDetails?.CompanyFromPanNumber}
            </Text>
            <Text style={styles.companyVAT}>
              Phone: {branchDetails?.BranchFromPhoneNumber}
            </Text>
          </View>
          <View
            style={{
              borderColor: "#000",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "auto",
              marginBottom: 20,
              marginLeft: "35%",
              marginRight: "5%",
            }}
          >
            <Text style={styles.title}>Branch Transfer Challan</Text>
            <Text style={styles.title}>Head Office</Text>
          </View>
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
                <Text style={styles.label}>From Branch: </Text>
                <Text style={styles.value}>{branchDetails?.BranchFrom}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>To Branch: </Text>
                <Text style={styles.value}>{branchDetails?.BranchTo}</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailRow}>
                <Text style={styles.boldLabel}>Challan Number: </Text>
                <Text style={styles.value}>
                  {branchDetails?.SaleChallanNumber!}
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

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.headerRow]}>
              <Text style={[styles.tableCell, styles.smallCell]}>S.N.</Text>

              {hasPartNumber && (
                <Text style={[styles.tableCell, styles.productCell]}>
                  Part Number
                </Text>
              )}
              <Text style={[styles.tableCell, styles.productCell]}>
                Product
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  hasPartNumber ? styles.mediumCell : styles.productCell,
                ]}
              >
                Pack Size
              </Text>
              <Text style={[styles.tableCell, styles.productCell]}>
                Batch No.
              </Text>
              <Text style={[styles.tableCell, styles.productCell]}>
                Expiry Date
              </Text>
              <Text style={[styles.tableCell, styles.productCell]}>Qty</Text>
              <Text style={[styles.tableCell, styles.align]}>UoM</Text>
            </View>
            {chunk.map((inventory: any, invIndex: any) => (
              <View key={invIndex} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.smallCell]}>
                  {serialNumber++}
                </Text>
                {hasPartNumber && (
                  <Text style={[styles.tableCell, styles.productCell]}>
                    {inventory.PartNumber}
                  </Text>
                )}
                <Text style={[styles.tableCell, styles.productCell]}>
                  {inventory.description}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    hasPartNumber ? styles.mediumCell : styles.productCell,
                  ]}
                >
                  {inventory.PackSize}
                </Text>
                <Text style={[styles.tableCell, styles.productCell]}>
                  {inventory.BatchNumber}
                </Text>
                <Text style={[styles.tableCell, styles.productCell]}>
                  {inventory.ExpiryDate}
                </Text>
                <Text style={[styles.tableCell, styles.productCell]}>
                  {parseFloat(inventory.Quantity).toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.align]}>
                  {inventory.ContainerType}
                </Text>
              </View>
            ))}
            {pageIndex === chunks.length - 1 && (
              <View
                style={{
                  flexDirection: "row",
                  borderTop: "1 solid black",
                  width: "100%",
                }}
              >
                {Array(hasPartNumber ? 6 : 5)
                  .fill(null)
                  .map((_, index) => (
                    <Text key={index} style={[styles.tableCell]}></Text>
                  ))}
                <Text
                  style={[
                    styles.tableCell,
                    styles.productCell,
                    {
                      fontWeight: "bold",
                      width: "100%",
                      marginLeft: hasPartNumber ? "10%" : "-4%",
                    },
                  ]}
                >
                  Total:
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.productCell,
                    {
                      fontWeight: "bold",
                      marginLeft: hasPartNumber ? "38%" : "50%",
                    },
                  ]}
                >
                  {totalQuantity ? totalQuantity.toFixed(2) : "0.00"}
                </Text>
                <Text style={[styles.tableCell, styles.align]}></Text>
              </View>
            )}
          </View>

          {pageIndex === chunks.length - 1 && (
            <>
              <View style={styles.remarksSection}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>
                    Challan Against P.O. Number:{" "}
                  </Text>
                  <Text style={styles.value}>{poNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Remarks: </Text>
                  <Text style={styles.value}>{remarks}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Shipment Via:- Air/Road </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Tracking Details: </Text>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    marginLeft: "360px",
                    marginTop: -65,
                  }}
                >
                  <View style={{ marginBottom: 10 }}>
                    <Text
                      style={[
                        styles.label,
                        { fontWeight: "bold", marginRight: 10 },
                      ]}
                    >
                      Received By
                    </Text>
                    <Text style={styles.value}></Text>
                  </View>

                  <View style={{ marginBottom: 10 }}>
                    <Text
                      style={[styles.label, { marginRight: 10, marginLeft: 3 }]}
                    >
                      Name:
                    </Text>
                    <Text style={[styles.value, { marginBottom: 10 }]}></Text>
                  </View>

                  <Text
                    style={[styles.label, { marginRight: 10, marginLeft: 3 }]}
                  >
                    Date:
                  </Text>
                </View>
              </View>

              <View style={styles.signatureSection}>
                <View style={styles.signatureBlock}>
                  <Text style={styles.signatureText}>Prepared By</Text>
                </View>
                <View style={styles.signatureBlock}>
                  <Text style={styles.signatureText}>Packing Verified By</Text>
                </View>
                <View style={styles.signatureBlock}>
                  <Text style={styles.signatureText}>Authorized By</Text>
                </View>
                <View style={styles.signatureBlock}>
                  <Text style={styles.signatureText}>Stamp</Text>
                </View>
              </View>
            </>
          )}
        </Page>
      ))}
    </Document>
  );
};

export default GenerateBranchChallanPDF;
