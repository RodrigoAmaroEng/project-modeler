import React, { useEffect, useState } from "react";
import "./TabLayout.css";

export function Tab(props: any) {
  return <div className="tab-content">{props.children}</div>;
}

export function TabLayout(props: any) {
  const [selectedTab, setSelectedTab] = useState(0);

  const selectTab= (tab: any, index: number) => {
    setSelectedTab(index);
    tab.props.onShow?.()
  }

  return (
    <div className="tab-layout">
      <div className="tabs-placeholder">
        {props.children.map((child: any, index: number) => {
          return (
            <div
              key={index}
              className="tab"
              onClick={() => selectTab(child, index)}
              aria-selected={index === selectedTab}
            >
              {child.props.title}
            </div>
          );
        })}
      </div>
      {props.children.map((child: any, index: number) => {
        return (
          <div key={index}
            className={`flex-col tab-content-holder${
              index !== selectedTab ? " hidden" : ""
            }`}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
