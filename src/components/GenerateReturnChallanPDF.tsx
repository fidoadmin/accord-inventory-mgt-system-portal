"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import {
  CheckoutCompanyDetailsInterface,
  CheckoutInventoryDescriptionInterface,
} from "@/types/CheckoutInterface";

Font.register({
  family: "OpenSans",
  fonts: [
    {
      src: "../../assets/fonts/OpenSans/OpenSans-Regular.ttf",
      fontWeight: 400,
    },
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
    left: "18%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  signatureBlock: {
    width: "45%",
    alignItems: "center",
    borderTop: "1 solid black",
    paddingTop: 5,
    marginRight: 10,
  },

  signatureText: {
    fontSize: 10,
  },
});

const GenerateReturnChallanPDF = ({
  companyDetails,
  checkoutList,
  poNumber,
  remarks,
  date,
  NepaliDate,
  totalQuantity,
  ReturnBy,
  ReturnReason,
}: {
  companyDetails: CheckoutCompanyDetailsInterface | undefined;
  checkoutList: CheckoutInventoryDescriptionInterface[] | undefined;
  poNumber: string;
  remarks?: string;
  date?: string;
  NepaliDate?: string;
  totalQuantity: Number;
  ReturnBy?: string;
  ReturnReason?: string;
}) => {
  let serialNumber = 1;

  const hasPartNumber = checkoutList?.some((item) =>
    item.SelectedInventories.some((inventory) => inventory.PartNumber !== null)
  );

  const chunkArray = (arr: any[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };
  console.log(totalQuantity);

  const inventories = checkoutList
    ?.flatMap((items) =>
      items.SelectedInventories.map((inventory) => ({
        ...inventory,
        description: `${items.Description || ""}${
          items.ShortName ? `(${items.ShortName})` : ""
        }`,
      }))
    )
    ?.filter((inventory) => inventory !== null && inventory !== undefined);

  const pages = inventories ? chunkArray(inventories, 15) : [];

  return (
    <Document
      title={companyDetails?.SaleChallanNumber!}
      pageLayout="singlePage"
    >
      {pages.map((pageItems, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={styles.companySection}>
            <Text style={styles.companyName}>
              {companyDetails?.CompanyFrom}
            </Text>
            <Text style={styles.companyAddress}>
              {companyDetails?.CompanyFromAddress}
            </Text>
            <Text style={styles.companyVAT}>
              VAT/PAN No: {companyDetails?.CompanyFromPanNumber}
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
            <Text style={styles.title}>Return Challan</Text>
            <Text style={styles.title}>Head Office</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.column}>
              <View style={styles.detailRow}>
                <Text style={styles.boldLabel}>Customer: </Text>
                <Text style={styles.value}>{companyDetails?.CompanyTo}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Address: </Text>
                <Text style={styles.value}>
                  {companyDetails?.CompanyToAddress}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>VAT/PAN No:</Text>
                <Text style={styles.value}>
                  {companyDetails?.CompanyToPanNumber}
                </Text>
              </View>
            </View>

            <View style={styles.column}>
              <View style={styles.detailRow}>
                <Text style={styles.boldLabel}>Return Challan Number: </Text>
                <Text style={styles.value}>
                  {companyDetails?.ReturnChallanNumber!}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Date: </Text>
                <Text style={styles.value}>{date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Miti: </Text>
                <Text style={styles.value}>{NepaliDate}</Text>
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
              <Text style={[styles.tableCell, styles.mediumCell]}>Qty</Text>
              <Text style={[styles.tableCell, styles.align]}>UoM</Text>
            </View>

            {pageItems.map((inventory, invIndex) => (
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
                <Text style={[styles.tableCell, styles.mediumCell]}>
                  {parseFloat(inventory.Quantity).toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.align]}>
                  {inventory.ContainerType}
                </Text>
              </View>
            ))}

            {pageIndex === pages.length - 1 && (
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
                      marginLeft: hasPartNumber ? "51%" : "70%",
                    },
                  ]}
                >
                  {totalQuantity ? totalQuantity.toFixed(2) : "0.00"}
                </Text>
                <Text style={[styles.tableCell, styles.align]}></Text>
              </View>
            )}
          </View>

          {pageIndex === pages.length - 1 && (
            <View style={styles.remarksSection}>
              <View style={styles.detailRow}>
                <Text style={styles.label}>
                  Goods Return Against Sales Challan Number:{" "}
                </Text>
                <Text style={styles.value}>
                  {companyDetails?.SaleChallanNumber!}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Reason: </Text>
                <Text style={styles.value}>{ReturnReason}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Shipment Via:- Air/Road </Text>
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
                    <Text style={styles.value}>{ReturnBy}</Text>
                  </Text>
                  <Text style={[styles.value, { marginBottom: 10 }]}></Text>
                </View>

                <Text
                  style={[styles.label, { marginRight: 10, marginLeft: 3 }]}
                >
                  Date:
                  <Text style={styles.value}>{date}</Text>
                </Text>
              </View>
            </View>
          )}

          {pageIndex === pages.length - 1 && (
            <View style={styles.signatureSection}>
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureText}>Authorized By</Text>
              </View>
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureText}>Signature</Text>
              </View>
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};

export default GenerateReturnChallanPDF;
