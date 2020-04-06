import React from 'react';
import {Button, DatePicker, Form, Grid, Input, Message, ResponsiveGrid, Select, Switch, Tag} from '@alifd/next';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import $http from '@/service/Services';
import url from '@/request';
import moment from 'moment';

const {Group: TagGroup, Selectable: SelectableTag} = Tag;
const {Cell} = ResponsiveGrid;
let form;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const {Row, Col} = Grid;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14}
};

class UserAdd extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      value: {}
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
      this.getProjectById();
    });
  };

  /**
   * 获取数据
   */
  getProjectById = () => {
    if (this.state.id) {
      const that = this;
      this.$http.get(url.url + '/v1/user/getUserDetailById/' + this.state.id)
        .then(function (response) {
          const {data} = response;
          if (data.code === 1) {
            Message.warning(data.message ? data.message : data.data);
          } else {
            let rangeDate = [];
            let start = data.data.startTime;
            let end = data.data.endTime;
            rangeDate.push(moment(start));
            rangeDate.push(moment(end));
            data.data['rangeDate'] = rangeDate;
            data.data['status1'] = data.data['status'] == 1;
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

  /**
   * 取消按钮的操作
   */
  cancelCall = () => {
    this.setState({
      config: {
        visible: false
      }
    });
    console.log('点击取消按钮 .');
  };


  /** 表改变
   * @param formValue
   */
  formChange = (formValue) => {
    this.setState({
      value: formValue
    })
  };
  /**
   * value: {Object} 数据
   errors: {Object} 错误数据
   field: {class} 实例
   * 表验证
   */
  validateAllFormField = (value, errors, field) => {
    let er = [];
    if (errors) {
      let i = 1;
      for (let v in errors) {
        if (errors[v]) {
          er.push((i++) + '、' + errors[v].errors[0]);
        }
      }
      Message.warning(er.join('\n'));
      return;
    }
    const that = this;
    this.$http.post(url.url + '/v1/user/addOrUpdateUser', value)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.data ? data.data : data.message);
        } else {
          Message.success('操作成功.');
          that.props.history.push('/list/user')
        }
      })
      .catch(function (error) {
        Message.error(error.message);
      })
  };

  render() {
    return (
      <ResponsiveGrid gap={20}>
        <Cell colSpan={12}>
          <PageHeader
            title="权限与用户"
            breadcrumbs={[
              {
                name: '权限与用户',
              },
              {
                name: this.state.id ? '修改用户' : '添加用户',
              },
            ]}
            description="添加修改用户"
          />
          <Button type="normal" size="small"
                  style={{float: 'right'}}>
            <a onClick={() => {
              this.props.history.go(-1)
            }}> 返回</a>
          </Button>
        </Cell>

        <Cell colSpan={12}>
          <Form className={styles.groupItem}
                value={this.state.value}
                onChange={this.formChange}
                ref={formRef => form = formRef} style={{maxWidth: '800px'}}  {...formItemLayout} field={this.field}>
            <FormItem required label="用户名字:">
              <Input placeholder="请输入用户名字" id="name" name="name" aria-required="true"/>
            </FormItem>
            <FormItem required label="登录名:">
              <Input placeholder="请输入登录名" id="loginName" name="loginName" aria-required="true"/>
            </FormItem>
            {
              [0].map(
                o => {
                  if (this.state.id) {
                    return null;
                  } else {
                    return (
                      <FormItem required label="密码:">
                        <Input placeholder="请输入密码" id="password" name="password" aria-required="true"/>
                      </FormItem>
                    )
                  }
                }
            )
            }
            {
              [0].map(
                o => {
                  if (this.state.id) {
                    return null;
                  } else {
                    return (
                      <FormItem required label="重复密码:">
                        <Input placeholder="请输入重复密码" id="rePassword" name="rePassword" aria-required="true"/>
                      </FormItem>
                    )
                  }
                }
              )
            }
            <FormItem label="邮箱:">
              <Input placeholder="请输入邮箱" id="email" name="email" aria-required="true"/>
            </FormItem>
            <FormItem label="手机号:">
              <Input placeholder="请输入手机号" id="phone" name="phone" aria-required="true"/>
            </FormItem>
            <Row style={{marginTop: 24}}>
              <Col offset="6">
                <Form.Submit validate type="primary" onClick={this.validateAllFormField}
                             style={{marginRight: 7}}>提交</Form.Submit>
              </Col>
            </Row>
          </Form>
        </Cell>
      </ResponsiveGrid>
    );

  }
}

export default UserAdd;
