const DefaultCheckBox = ({ box_label }) => {
  return (
    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        value=""
        id="flexCheckDefault"
      />
      <label class="form-check-label text-white" for="flexCheckDefault">
        {box_label}
      </label>
    </div>
  );
};

export default DefaultCheckBox;
