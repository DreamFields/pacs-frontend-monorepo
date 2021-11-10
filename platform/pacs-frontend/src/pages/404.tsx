/*
 * @Descripttion: 404页面，目前很简陋
 * @Author: linkenzone
 * @Date: 2020-09-06 21:24:32
 */

import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

import { SketchPicker } from 'react-color';

import { Button as MyButton } from 'rayplus-my-button';

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <>
        <Button type="primary" onClick={() => history.push('/')}>
          Back Home
        </Button>
        <SketchPicker />
        <MyButton color="red">233</MyButton>
      </>
    }
  />
);

export default NoFoundPage;
