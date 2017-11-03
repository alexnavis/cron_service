'use strict';
const periodic = require('periodicjs');
const client_configurations = require('../../../CIS_client_configurations.json');
let backgroundBlue = '#f5f7fb';

let colors = {
  background: '#f5f7fb',
  darkGreyText: '#333',
  regGreyText: '#69707a',
  greyInputBackground: '#f5f7fa',
  greyInputBorder: '#d3d6db',
  blackText: '#404041',
  primary: '#007aff',
  secondary: '#2b39ba',
  highlight: '#68d7e3',
  danger: '#ff6f72',
  warn: '#ffa13b',
  success: '#b8ffbf',
  info: '#fff25a',
  green: '#40C16B',
  black: '#000'
};


module.exports = {
  application: colors,
  colors,
  pageContainer: {
    backgroundColor: backgroundBlue,
    minHeight: '100%',
    paddingBottom:60,
  },
  pages: {
    login: {
      backgroundColor: colors.background,
      padding: '100px 0',
    },
  },
  buttons: {
    approve: {
      backgroundColor: client_configurations.company_color_primary,
      color: 'white',
      borderRadius: '12px',
      border: 'none',
      fontSize: '16px',
      padding: '0 40px',
    },
    clear: {
      'backgroundColor': 'none',
      // 'color': 'black',
      'borderRadius': '12px',
      border: 'none',
      fontSize: '16px',
      padding: '0 40px',
    },
    primary: {
      backgroundColor: client_configurations.company_color_primary,
      color:'white',
      // borderRadius: '12px',
      border: 'none',
    },
    primaryALink: {
      backgroundColor: client_configurations.company_color_primary,
      color: 'white',
      textDecoration:'none',
      borderRadius: '5px',
      padding: '8px 12px',
      border: 'none',
    },
    verification: {
      borderRadius: '5px',
      minWidth: '150',
    },
    approveAction: {
      backgroundColor: colors.green,
      borderRadius: '5px',
      color:'white',
      border: 'none',
      // minWidth: '150'
    },
    referAction: {
      backgroundColor: colors.warn,
      borderRadius: '5px',
      color:'white',
      border: 'none',
      // minWidth: '150'
    },
    suspiciousAction: {
      backgroundColor: colors.black,
      borderRadius: '5px',
      color:'white',
      border: 'none',
      // minWidth: '150'
    },
    rejectAction: {
      backgroundColor: colors.danger,
      borderRadius: '5px',
      color:'white',
      border: 'none',
      // minWidth: '150'
    }, 
  },
  momentFormat: {
    dates:'MM/DD/YYYY | hh:mm:ssA',
    birthdays:'MM/DD/YYYY',
  },
  inputStyle: {
    overflow: 'hidden',
    backgroundColor: colors.greyInputBackground,
    border: `1px solid ${colors.greyInputBorder}`,
    borderRadius: 3,
    display: 'inline-flex',
    height: 30,
    lineHeight: '30px',
    // padding: '0px 5px',
    margin: 0,
    width:'100%',
    boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)',
    flex:5,
  },
  images: {
    login: {
      // size: 'is128X128',
      src: client_configurations.company_logo,
      style: {
        margin: 'auto',
        marginBottom: 30,
        width:'55%',
      },
    },
  },
  shadows: {
    dcp_card: {
      boxShadow: 'rgba(17, 17, 17, 0.14) 0px 0px 4px 2px',
    },

  },
  cardProps: {
    leftIcon: true,
    headerStyle: {
      boxShadow: 'none',
      borderBottom:'1px solid lightgrey',
      // fontSize:16,
    },
    iconImage: {
      size: 'is48X48',
      style: {
        cursor:'pointer',
      },
    },
    headerTitleStyle: {
      fontSize: 20,
      left: -10,
      fontWeight: 'normal',
      position: 'relative',
    },
    cardStyle: {
      boxShadow: 'rgba(17, 17, 17, 0.14) 0px 0px 4px 2px',
      marginBottom: 20,
    },
    cardProps: {
      className:'dcp_card',
    },
    icon: '/container/digifi-core-platform-container/images/drawer-open.svg',
    iconDown: '/container/digifi-core-platform-container/images/drawer-open.svg',
    iconUp:'/container/digifi-core-platform-container/images/drawer-closed.svg',
  },
  cisPath: `/cis/configurations/content%2Fconfig%2Fcontainer%2Fclient-interface-service-container%2F${periodic.settings.application.environment}.json?format=json`,
};