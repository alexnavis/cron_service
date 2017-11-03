'use strict';
const path = require('path');
// const styles = require('../utilities/shared/constants/styles');
// const settingstabs = require('../utilities/views/settings/components/settingstabs').settingsTabs;
// const doctabs = require('../../utilities/views/settings/components/doctabs').docTabs;
const cardprops = require('../utilities/shared/props/cardprops');
const randomKey = Math.random;
const sharedComponents = require('../utilities/shared/settings/sharedComponents');
const standardTableHeader = require('../utilities/shared/component/standardTableHeader');
const formElements = require('../utilities/shared/formElements').formElements;

module.exports = (periodic) => {
  // let reactadmin = periodic.app.controller.extension.reactadmin;

  return {
    containers: {
      '/r-admin/extension/crons/:id': {
        layout: {
        component: 'div',
        props: {
          style: {
            marginTop: 50,
          },
          // style: styles.pageContainer,
        },
        children: [{
          component: 'Container',
          children: [{
            component: 'ResponsiveForm',
            props: {
              flattenFormData: true,
              footergroups: false,
              onSubmit:{
                url:'/crons/:id',
                options:{
                  method:'PUT',
                },
                params: [
                  { 'key': ':id', 'val': '_id', },
                ],
                success: true,
                // successCallback:'func:this.props.createNotification',
              },
              'hiddenFields':[{
                'form_name':'docid',
                'form_val':'_id',
              }, ],
              formgroups: [
                {
                  gridProps: {
                    key: randomKey(),
                    style: {
                      marginTop: 30,
                      padding: 10,
                    },
                  },
                  formElements: [{
                    type: 'layout',
                    value: {
                      component: 'div',
                      children: [{
                        component: 'Title',
                        children: 'Edit Cron',
                      }, ],
                    },
                  }, {
                    type: 'layout',
                    layoutProps: {
                      size: 'isNarrow',
                    },
                    value: {
                      component: 'ResponsiveButton',
                      thisprops: {
                        onclickPropObject: ['formdata'],
                      },
                      props: {
                        onClick: 'func:this.props.fetchAction',
                        onclickBaseUrl: '/cron/:id/run',
                        onclickLinkParams: [
                          { 'key': ':id', 'val': '_id', },
                        ],
                        'fetchProps': {
                          'method': 'POST',
                        },
                        buttonProps: {
                          size: 'isPrimary',
                        },
                        successProps: {
                          success: true,
                          successCallback:'func:this.props.createNotification',
                        }
                      },
                      children: 'Run',
                    },
                  },{
                    layoutProps: {
                      size: 'isNarrow',
                    },
                    type: 'submit',
                    value: 'Save Cron',
                    passProps: {
                      className: 'cronConfig',
                      // style: styles.buttons.primary,
                      color: 'isPrimary',
                    },
                    confirmModal: {},
                  },],
                },{
                  gridProps: {
                    key: randomKey(),
                  },
                  card: {
                    twoColumns: true,
                    props: cardprops({ 
                      cardTitle: 'Overview',
                      cardStyle: {
                      },
                    }),
                  },
                  formElements: [formElements({
                    twoColumns: true,
                    left: [{
                      name: 'name',
                      label: 'Name',
                      passProps: {
                        state: 'isDisabled',
                      },
                    }, {
                      name: 'theme',
                      label: 'Theme',
                      passProps: {
                        state: 'isDisabled',
                      },
                  }, {
                    name: 'author',
                    label: 'Author',
                    passProps: {
                      state: 'isDisabled',
                    },
                    // type: 'text',
                  },],
                  right: [{
                    name: 'createdat',
                    label: 'Create Date',
                    // momentFormat: styles.momentFormat.dates,
                    passProps: {
                      state: 'isDisabled',
                    },
                  }, {
                    label: 'Active',
                    name: 'active',
                    passProps: {
                      state: 'isDisabled',
                    },
                  }, {
                    label: 'Interval',
                    name: 'cron_interval',
                    passProps: {
                      // state: 'isDisabled',
                    },
                  },],
                  }), ],
                }, {
                  gridProps: {
                    key: randomKey(),
                    style: {
                      marginTop: 30,
                    },
                  },
                  card: {
                    props: cardprops({ cardTitle: 'Template Content', }),
                  },
                  formElements: [
                  //   {
                  //   type: 'layout',
                  //   value: {
                  //     component: 'ResponsiveButton',
                  //     props: {
                  //       onClick: 'func:this.props.createModal',
                  //       onclickProps: {
                  //         title: 'Variables - Locate & Format',
                  //         pathname: '/modal/find_variables',
                  //       },
                  //       style: {
                  //         marginLeft: '10px',
                  //       },
                  //       buttonProps: {
                  //         color: 'isPrimary',
                  //       },
                  //     },
                  //     children: 'Find Variable',
                  //   },
                  // }, 
                  {
                    type: 'code',
                    name: 'attributes.templatehtml',
                  }, ],
                }, 
              ],
            },
            asyncprops: {
              formdata: ['crondata', 'cron', ],
            },
          }, ],
        }, ],
      },
      'resources': {
        crondata: '/crons/:id?format=json',
      },
      'onFinish': 'render',
      },
    },
  };
};