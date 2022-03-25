import React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanelMobile = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{padding: '0px 40px'}}
      {...other}
    >
      {value === index && (
        <div >
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}

export default TabPanelMobile