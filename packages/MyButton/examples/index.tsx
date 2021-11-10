/*
 * @Author: linkenzone
 * @Date: 2021-07-06 11:07:00
 * @Descripttion: Do not edit
 */
import React from "react";
import { render } from "react-dom";

import { Button } from "../src";

const App = () => (
  <>
    <Button color="red">第一个组件</Button>
  </>
);

render(<App />, document.getElementById("root"));
