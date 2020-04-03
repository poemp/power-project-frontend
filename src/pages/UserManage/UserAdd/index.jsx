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
      value:{}
    };

    this.$http = $http;
  }

// eslint-disable-next-line react/no-deprecated
  componentWillMount = () => {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("id");
    this.setState({
      id: id
    },()=>{
      this.getProjectById();
    });
  };

  /**
   * 获取数据
   */
  getProjectById = () => {
    if (this.state.id) {
      const that = this;
      this.$http.get(url.url + '/v1/project/getProjectById/' + this.state.id)
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
            data.data["rangeDate"] = rangeDate;
            data.data["status1"] = data.data["status"] ==1 ;
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
    if (errors){
      let i = 1;
      for (let v in errors){
        if (errors[v]){
          er.push((i++) +  "、"+ errors[v].errors[0]) ;
        }
      }
      Message.warning(er.join("\n"));
      return;
    }
    let startTime = value.rangeDate[0];
    let endTime = value.rangeDate[2];
    const startValueFormat = moment(startTime).format('YYYY-MM-DD');
    const endTimeFormat = moment(endTime).format('YYYY-MM-DD');
    value["startTime"] = startValueFormat;
    value["endTime"] = endTimeFormat;
    value["status"] = value["status1"] ?1:0;
    const that = this;
    this.$http.post(url.url + '/v1/project/saveOrUpdateProject', value)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success("操作成功.");
          that.props.history.push("/list/table")
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
            title="项目管理"
            breadcrumbs={[
              {
                name: '项目管理',
              },
              {
                name: '项目列表',
              },
            ]}
            description="表格列表描述表格列表描述表格列表描述表格列表描述表格列表描述表格列表描述表格列表描述"
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
                ref={formRef => form = formRef}  style={{maxWidth: '800px'}}  {...formItemLayout} field={this.field}>
            <FormItem required label="项目名称:">
              <Input placeholder="请输入项目名称" id="name" name="name" aria-required="true"   />
            </FormItem>
            <FormItem
              label="项目时间:"
              labelCol={{span: 6}}
              required>
              <RangePicker name="rangeDate"/>
            </FormItem>
            <FormItem label="状态:">
              <Switch checkedChildren="开启" size={"medium"} unCheckedChildren="关闭" name="status1" aria-label="Accessible Switch" defaultChecked/>
            </FormItem>
            <Row style={{marginTop: 24}}>
              <Col offset="6">
                <Form.Submit validate type="primary" onClick={this.validateAllFormField} style={{marginRight: 7}}>提交</Form.Submit>
                <Form.Reset style={{marginLeft: 130}}>取消/重置</Form.Reset>
              </Col>
            </Row>
          </Form>
        </Cell>
      </ResponsiveGrid>
    );

  }
}

export default UserAdd;
