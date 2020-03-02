import React from 'react';
import { Collapse } from 'antd';

const { Panel } = Collapse;

function CollapseComponent({children}) {
  return (
    <>
    <Collapse defaultActiveKey={['0']} >
    <Panel header="Add Contact" key="1">
      {children}
    </Panel>
    </Collapse>
    </>
  );
}

export default CollapseComponent;
