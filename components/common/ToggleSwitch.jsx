import React from "react";
import styles from "./ToggleSwitch.module.scss";

const ToggleSwitch = ({ checked, onChange, id }) => (
  <label className={styles.toggleSwitch}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      id={id}
    />
    <span className={styles.slider} />
  </label>
);

export default ToggleSwitch;
