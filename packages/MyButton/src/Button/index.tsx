/*
 * @Author: linkenzone
 * @Date: 2021-07-05 14:50:17
 * @Descripttion: Do not edit
 */

import React from "react";
import styles from "./index.less";

type ButtonProps = {
  color: string;
};

const Button: React.FC<ButtonProps> = (props) => {
  const { color } = props;
  return (
    <button
      className={`${styles.large} ${styles.bold}`}
      style={{ color }}
    >
      {props.children}
    </button>
  );
};

export default Button;
