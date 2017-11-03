'use strict';
const pluralize = require('pluralize');
const capitalize = require('capitalize');

function getTabComponent(tab, tabname, baseURL) {
  try {
    
    return {
      component: 'Tab',
      props: {
        isActive: (tab.isActive || tab.location === tabname),
        style: {
          textAlign: 'center',
        },
      },
      children: [
        {
          component: 'ResponsiveButton',
          props: {
            onClick: 'func:this.props.reduxRouter.push',
            onclickBaseUrl: `${tab.baseUrl || baseURL}/${tab.location}`,
            style: {
              border: 'none',
            },
          },
          children: tab.label || capitalize(pluralize(tab.location)),
        },
      ],
    };
  } catch (e) {
    // console.error(e, { tab, tabname, baseURL });
    throw e;
  }
}

function appGlobalSubTabs(tabname, tabs, baseURL) {
  return {
    component: 'Tabs',
    children: [
      {
        component: 'TabGroup',
        children: tabs.map(tab => {
          return getTabComponent(tab, tabname, baseURL);
        }),
        props: {
        },
      },
    ],
  };
}

module.exports = {
  appGlobalSubTabs,
};