import React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "30px 48px",
            borderRadius: "4px",
          }}
        >
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}
export default TabPanel;



