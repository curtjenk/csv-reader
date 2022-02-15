import { useCSVReader } from "react-papaparse";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    // marginTop: 10,
    // marginRight: 40,
    // marginBottom: 10,
    // marginLeft: 40,
  },
  browseFile: {
    // width: "15%",
    backgroundColor: "red",
  },
  acceptedFile: {
    border: "1px solid #ccc",
    // height: 30,
    lineHeight: 1.5,
    paddingLeft: 10,
    width: "80%",
  },
  remove: {
    borderRadius: 0,
    padding: "0 20px",
    backgroundColor: "red",
  },
  progressBarBackgroundColor: {
    backgroundColor: "red",
  },
};

export default function GenericCsvReader({ uploadAccepted }) {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      config={{ header: false }}
      onUploadAccepted={(results) => uploadAccepted(results)}
    >
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
        <>
          <div style={styles.csvReader}>
            <button type="button" {...getRootProps()} style={styles.browseFile}>
              Browse file
            </button>
            <div style={styles.acceptedFile}>
              {acceptedFile && acceptedFile.name}
            </div>
            {/* <button {...getRemoveFileProps()} style={styles.remove}>
              Remove
            </button> */}
          </div>
          <ProgressBar style={styles.progressBarBackgroundColor} />
        </>
      )}
    </CSVReader>
  );
}
