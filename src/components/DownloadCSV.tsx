// // CSVDownload.tsx
// import { useFetchReportExport } from "@/app/hooks/report/useFecthReportExport";
// import React, { useState } from "react";

// interface CSVDownloadProps {
//   params: Record<string, any>;
//   authKey: string;
// }

// const CSVDownload: React.FC<CSVDownloadProps> = ({ params, authKey }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const downloadCSV = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const exportedData = await useFetchReportExport(authKey, params);

//       if (exportedData) {

//       } else {
//         throw new Error("No data available for CSV export");
//       }
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={downloadCSV}
//         disabled={isLoading}
//         className="px-4 py-2 bg-secondary text-white rounded-xl hover:opacity-80"
//       >
//         {isLoading ? "Downloading CSV..." : "Download CSV"}
//       </button>
//       {error && <p className="text-red-500">{error}</p>}
//     </>
//   );
// };

// export default CSVDownload;
