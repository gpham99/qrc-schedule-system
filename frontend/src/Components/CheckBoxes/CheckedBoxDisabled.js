const CheckedBoxDisabled = () => {
  return (
    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        value=""
        id="flexCheckCheckedDisabled"
        checked
        disabled
      />
      <label class="form-check-label" for="flexCheckCheckedDisabled"></label>
    </div>
  );
};

export default CheckedBoxDisabled;
