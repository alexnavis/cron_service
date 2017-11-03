'use strict'
const cardprops = require('../../shared/props/cardprops');
const standardTableHeader = require('../../shared/component/standardTableHeader');
const styles = require('../../constants/styles');

function crmNotes(options) {
  let { asyncprops, } = options;
  let cardPropsOptions = Object.assign({ cardTitle:'Notes', }, options.cardProps);
  return {
    component: 'ResponsiveCard',
    props: cardprops(cardPropsOptions),
    children: [
      {
        component:'ResponsiveForm',
        props: {
          onSubmit:{
            url:'/dsa/note/?format=json&unflatten=true',
            options:{
              method:'POST',
            },
            success: true,
            successCallback:'func:this.props.refresh',
          },
          validations:[{
            name:'content',
            constraints:{
              content:{
                presence: true,
                length: {
                  minimum: 1,
                  message: "Content Required"
                }
              }
            }
          }],
          'hiddenFields': [
            {
              'form_name':'sorad.applicant',
              'form_val':'applicant',
            },
            {
              'form_name':'sorad.application',
              'form_val':'application',
            },
            {
              'form_name':'sorad.customer',
              'form_val':'customer',
            },
            {
              'form_name':'sorad.file',
              'form_val':'file',
            },
            {
              'form_name':'sorad.issuedproduct',
              'form_val':'issuedproduct',
            },
            {
              'form_name':'source',
              'form_val':'source',
            },
            {
              'form_name':'username',
              'form_val':'username',
            },
            {
              'form_name':'title',
              'form_val': 'title',
              'form_static_val':options.title||'Generic note',
            },
          ],
          formgroups:[
            {
              gridProps: {
                style: {
                  marginBottom: 0,
                }
              },
              formElements:[
                {
                  type:'textarea',
                  name:'content',
                },
              ],
            },
            {
              formElements:[
                {
                  type:'submit',
                  value:'Create Note',
                  passProps: {
                    style:styles.buttons.primary,
                  },
                  layoutProps: {
                    style: {
                      paddingBottom: '20px',
                    }
                  }
                },
              ],
            },
          ],
        },
        asyncprops,
      },
      {
        component: 'ResponsiveTable',
        props: {
          flattenRowData: true,
          limit: 100,
          numItems: 100,
          numPages: 1,
          hasPagination: false,
          headers: [{
            label: 'Date',
            sortid: 'createdat',
            sortable: false,      
          }, {
            label: 'Note Type',
            sortid: 'title',
            sortable: false,
          }, {
            label: 'Author',
            sortid: 'username',
            sortable: false,
          }, {
            label: 'Content',
            sortid: 'content',
            sortable: false,
          },].map(standardTableHeader),
          headerLinkProps: {
            style: {
              textDecoration: 'none',
              color: styles.colors.darkGreyText,
              fontWeight: 400,
            },
          },
        },
        asyncprops,
      }, 
    ],
  };
}

module.exports = crmNotes;
