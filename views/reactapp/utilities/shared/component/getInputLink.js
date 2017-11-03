'use strict';
const styles = require('../../constants/styles');

function getInputLink(link) {
  return {
    'type': 'link',
    'name': link.name,
    'label': link.label,
    wrapperProps: {
      style: styles.inputStyle,
    },
    'linkWrapperProps':{
      'style': {
        'padding': '0 5px',
        'width':'100%',
      },
    },
    'value': Object.assign({
      'component': 'ResponsiveButton',
      'props': {
        'onClick': 'func:this.props.reduxRouter.push',
        'onclickBaseUrl': link.baseurl, //'/r-admin/contentdata/accounts/:id',
        'onclickThisProp': link.thisprop,
        displayThisProps: link.displayprop,
        'onclickLinkParams': link.params, //[{ 'key':':id', 'val':'headerHost', },],
        'style': {
          color: styles.colors.primary,
          width:'100%',
        },
      },
      'children': link.displayprop,
    }, link.passProps),
  };
}

module.exports = getInputLink;