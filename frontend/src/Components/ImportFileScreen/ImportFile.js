const ImportFile = () => {
  return (
    <div
      class="d-inline-flex flex-column align-items-center responsive"
      style={{
        position: "absolute",
        bottom: "50%",
        lexDirection: "column",
        margin: "auto",
      }}
    >
      <div class="mb-3">
        <label for="formFile" class="form-label">
          Input an excel file
        </label>
        <input class="form-control" type="file" id="formFile"></input>
      </div>
    </div>
  );
};

export default ImportFile;
