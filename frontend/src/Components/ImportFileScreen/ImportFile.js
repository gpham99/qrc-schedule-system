const ImportFile = () => {
  return (
    <div
      class="d-inline-flex align-items-center flex-column p-5 responsive bg-secondary"
      style={{ transform: "translate(0%, 200%)" }}
    >
      <label for="formFile" class="form-label">
        Input an excel file
      </label>
      <input class="form-control" type="file" id="formFile"></input>
      <button class="btn btn-primary mt-3">Submit</button>
    </div>
  );
};

export default ImportFile;
