import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

interface PDFDownloadButtonProps {
  data: any;
  inventoryNumber: string;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  data,
  inventoryNumber,
}) => {
  const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 20, marginBottom: 10 },
    section: { marginBottom: 10 },
    //table: { display: "table", width: "auto" },
    tableRow: { flexDirection: "row" },
    tableCol: { flex: 1, border: "1px solid black", padding: 5 },
    tableHeader: { fontWeight: "bold" },
    text: { fontSize: 12 },
  });

  const PDFDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Checkout Verification Report</Text>
        <Text style={styles.section}>
          Checkout Number: {inventoryNumber}
        </Text>
        <Text style={styles.section}>
          Date: {new Date().toLocaleDateString()}
        </Text>
        <View>
          <View style={styles.tableRow}>
            {[
              "S.N.",
              "Product",
              "Batch",
              "Expiry",
              "Location",
              "Pack",
              "Qty",
              "Barcode",
            ].map((header, index) => (
              <Text key={index} style={[styles.tableCol, styles.tableHeader]}>
                {header}
              </Text>
            ))}
          </View>
          {data?.map((item: any, itemIndex: number) =>
            item.SelectedInventories.map((inventory: any, index: number) => (
              <View style={styles.tableRow} key={inventory.InventoryId}>
                <Text style={styles.tableCol}>{itemIndex + index + 1}</Text>
                <Text style={styles.tableCol}>{item.Description}</Text>
                <Text style={styles.tableCol}>{inventory.BatchNumber}</Text>
                <Text style={styles.tableCol}>{inventory.ExpiryDate}</Text>
                <Text style={styles.tableCol}>{inventory.Location}</Text>
                <Text style={styles.tableCol}>{inventory.PackSize}</Text>
                <Text style={styles.tableCol}>{inventory.Quantity}</Text>
                <Text style={styles.tableCol}>{inventory.Barcode}</Text>
              </View>
            ))
          )}
        </View>
      </Page>
    </Document>
  );

  return (
    <PDFDownloadLink
      document={PDFDocument}
      fileName={`Checkout_Report_${inventoryNumber}.pdf`}
    >
      {({ loading }) =>
        loading ? (
          <button className="bg-primary text-white px-4 py-2 rounded">
            Preparing PDF...
          </button>
        ) : (
          <button className="bg-primary text-white px-4 py-2 rounded">
            Download PDF
          </button>
        )
      }
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
