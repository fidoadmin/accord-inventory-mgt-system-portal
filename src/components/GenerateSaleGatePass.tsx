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

const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const GenerateSaleGatePassPDF = ({
  companyDetails,
  checkoutList,
  date,
  nepaliDate,
  totalQuantity,
}: {
  companyDetails: CheckoutCompanyDetailsInterface | undefined;
  checkoutList: CheckoutInventoryDescriptionInterface[] | undefined;
  date: string;
  nepaliDate: string;
  totalQuantity: Number;
}) => {
  const chunks = chunkArray(
    checkoutList
      ?.flatMap((items) =>
        items.SelectedInventories.map((inventory) => ({
          ...inventory,
          description: `${items.Description || ""}${
            items.ShortName ? `(${items.ShortName})` : ""
          }`,
        }))
      )
      ?.filter((inventory) => inventory !== null && inventory !== undefined) ||
      [],
    20
  );

  let serialNumber = 1;
  const hasPartNumber = checkoutList?.some((item) =>
    item.SelectedInventories.some((inventory) => inventory.PartNumber !== null)
  );

  return (
    <Document
      title={`${companyDetails?.SaleChallanNumber} - Gate Pass`}
      pageLayout="singlePage"
    >
      {chunks.map((chunk, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex}>
          <View style={styles.companySection}>
            <Text style={styles.companyName}>
              {companyDetails?.CompanyFrom}
            </Text>
            <Text style={styles.companyAddress}>
              {companyDetails?.CompanyFromAddress}
            </Text>
          </View>

          <Text style={styles.title}>Gate Pass</Text>

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
              {hasPartNumber && (
                <Text style={[styles.tableCell, styles.product]}>
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
              <Text style={[styles.tableCell, styles.mediumCell]}>Qty</Text>
              <Text style={[styles.tableCell, styles.mediumCell]}>UoM</Text>
            </View>

            {chunk.map((inventory, invIndex) => (
              <View key={invIndex} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.smallCell]}>
                  {serialNumber++}
                </Text>
                {hasPartNumber && (
                  <Text style={[styles.tableCell, styles.product]}>
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
                <Text style={[styles.tableCell, styles.mediumCell]}>
                  {parseFloat(inventory.Quantity).toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.mediumCell]}>
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
                      marginLeft: hasPartNumber ? "34%" : "54%",
                    },
                  ]}
                >
                  {totalQuantity ? totalQuantity.toFixed(2) : "0.00"}
                </Text>
              </View>
            )}
          </View>

          {pageIndex === chunks.length - 1 && (
            <View style={styles.signatureSection}>
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureText}>Issued By</Text>
              </View>
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureText}>Gatekeeper</Text>
              </View>
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};

export default GenerateSaleGatePassPDF;
