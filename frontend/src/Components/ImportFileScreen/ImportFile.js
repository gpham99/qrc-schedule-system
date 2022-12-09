const ImportFile = () => {
  return (
    <div
      class="d-inline-flex align-items-center flex-column p-5 responsive bg-secondary"
      style={{ transform: "translate(0%, 250%)" }}
    >
      <label for="formFile" class="form-label">
        Input an excel file
      </label>
      <input class="form-control" type="file" id="formFile"></input>
    </div>
  );
};

export default ImportFile;
