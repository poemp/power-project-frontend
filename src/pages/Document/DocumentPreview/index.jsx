import React from 'react';
import {Divider , Form, Input, Message, Radio, ResponsiveGrid} from '@alifd/next';
import styles from './index.module.scss';
import $http from '@/service/Services';
import url from '@/request';


const {Cell} = ResponsiveGrid;
let form;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};


class DocumentPreview extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      value: {
        type: 1,
        authController: 1
      }
    };

    this.$http = $http;
  }

// eslint-disable-next-line react/no-deprecated
  componentWillMount = () => {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get('id');
    this.setState({
      id: id
    }, () => {
      this.getDocumentById();
    });
  };

  /**
   * 获取数据
   */
  getDocumentById = () => {
    if (this.state.id) {
      const that = this;
      this.$http.get(url.url + '/v1/document/getDocumentPreview/' + this.state.id)
        .then(function (response) {
          const {data} = response;
          if (data.code === 1) {
            Message.warning(data.message ? data.message : data.data);
          } else {
            that.setState({
              value: data.data
            });
            that.forceUpdate();
          }
        })
        .catch(function (error) {
          Message.error(error.message);
        })
    }

  };


  render() {
    const {value} = this.state;
    return (
      <ResponsiveGrid gap={20}>
        <Cell colSpan={12}>
          <Form className={styles.groupItem}
                inline>
            <FormItem label="文档标题:">
              <div className={styles.previewDiv}>{value.name}</div>
            </FormItem>
            <FormItem label="关键字:">
              <div className={styles.previewDiv}>{value.keyWords}</div>
            </FormItem>
            <FormItem label="文档类型:">
              <div className={styles.previewDiv}>{value.type === 1 ? '文档' : '链接'}</div>
            </FormItem>
            <FormItem label="访问控制:">
              <div className={styles.previewDiv}>{value.type === 1 ? '公开' : value.type === 2 ? '自定义' : '私有'}</div>
            </FormItem>
            {
              [0].map(
                o => {
                  if (this.state.value.authController === '2') {
                    return (
                      <FormItem label="白名单:">
                        <Input className={styles.inputStyle} hasLimitHint style={{marginTop: 10}}
                               addonTextBefore="分组"
                               hasClear/>
                        <br/>
                        <Input className={styles.inputStyle} hasLimitHint style={{marginTop: 10}}
                               addonTextBefore="用户"
                               hasClear/>
                      </FormItem>
                    )
                  }
                }
              )
            }
          </Form>
          <Divider />
          <Form className={styles.groupItem}
                inline>
            <FormItem>
              {
                [0].map(
                  o => {
                    if (this.state.value.type === '2') {
                      return (
                        <p>{value.urlAddr}</p>
                      )
                    } else {
                      return (
                        <p dangerouslySetInnerHTML={{__html: value.content}}/>
                      )
                    }
                  }
                )
              }
            </FormItem>
          </Form>

        </Cell>

      </ResponsiveGrid>
    );

  }
}

export default DocumentPreview;
