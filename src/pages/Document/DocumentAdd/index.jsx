import React from 'react';
import {Button, Form, Grid, Input, Message, Radio, ResponsiveGrid} from '@alifd/next';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import $http from '@/service/Services';
import url from '@/request';
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/table.css'
import 'braft-extensions/dist/code-highlighter.css'
import BraftEditor from 'braft-editor'
import Table from 'braft-extensions/dist/table'
import Markdown from 'braft-extensions/dist/markdown'
import CodeHighlighter from 'braft-extensions/dist/code-highlighter'


const {Cell} = ResponsiveGrid;
let form;
const {Row, Col} = Grid;
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

const options = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: false, // 插入表格前是否弹出下拉菜单
  columnResizable: false, // 是否允许拖动调整列宽，默认false
  exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
};
const markdownOptions = {};
const codeHighlighterOptions = {
  syntaxs: [
    {
      name: 'JavaScript',
      syntax: 'javascript'
    }, {
      name: 'HTML',
      syntax: 'html'
    }, {
      name: 'CSS',
      syntax: 'css'
    }, {
      name: 'Java',
      syntax: 'java',
    }, {
      name: 'PHP',
      syntax: 'php'
    }
  ],
};

class DocumentAdd extends React.Component {
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
      this.$http.get(url.url + '/v1/document/getDocumentById/' + this.state.id)
        .then(function (response) {
          const {data} = response;
          if (data.code === 1) {
            Message.warning(data.message ? data.message : data.data);
          } else {
            data.data['content1'] = BraftEditor.createEditorState(data.data['content']);
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
    const {editorState} = this.state;
    value['content'] = editorState.toHTML();
    this.$http.post(url.url + '/v1/document/saveOrUpdateDocument', value)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          that.props.history.push('/list/document')
        }
      })
      .catch(function (error) {
        Message.error(error.message);
      })
  };

  handleChange = (editorState) => {
    this.setState({
      editorState: editorState
    })
  };

  render() {
    BraftEditor.use([Table(options), Markdown(markdownOptions), CodeHighlighter(codeHighlighterOptions)]);
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
                ref={formRef => form = formRef} style={{width: '90%'}}  {...formItemLayout} field={this.field}>
            <FormItem required label="文档标题:">
              <Input className={styles.inputStyle} placeholder="请输入文档标题" id="name" name="name" aria-required="true"/>
            </FormItem>
            <FormItem required label="关键字:">
              <Input className={styles.inputStyle} placeholder="请输入关键字" id="keyWords" name="keyWords"
                     aria-required="true"/>
            </FormItem>
            <FormItem required label="文档类型:">
              <RadioGroup name="type">
                <Radio value={1}>文档</Radio>
                <Radio value={2}>链接</Radio>
              </RadioGroup>
            </FormItem>
            {
              [0].map(
                o => {
                  if (this.state.value.type === '2') {
                    return (
                      <FormItem required label="文档URL:">
                        <Input className={styles.inputStyle} placeholder="请输入文档URL" id="urlAddr" name="urlAddr"
                               aria-required="true"/>
                      </FormItem>
                    )
                  } else {
                    return (
                      <FormItem {...formItemLayout} label="文档正文">
                        <BraftEditor
                          value={this.state.value.content1}
                          contentStyle={{height: 200}}
                          className={styles.braftEditor}
                          onBlur={this.handleChange}
                          excludeControls={this.excludeControls}
                        />
                      </FormItem>
                    )
                  }
                }
              )
            }

            <FormItem required label="访问控制:">
              <RadioGroup name="authController">
                <Radio value={1}>公开</Radio>
                <Radio value={2}>自定义</Radio>
                <Radio value={3}>私有</Radio>
              </RadioGroup>
            </FormItem>
            {
              [0].map(
                o => {
                  if (this.state.value.authController === '2') {
                    return (
                      <FormItem required label="白名单:">
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
            <Row style={{marginTop: 24}}>
              <Col offset="6">
                <Form.Submit validate type="primary" onClick={this.validateAllFormField}
                             style={{marginRight: 7}}>提交</Form.Submit>
                <Form.Reset style={{marginLeft: 130}}>取消</Form.Reset>
              </Col>
            </Row>
          </Form>
        </Cell>
      </ResponsiveGrid>
    );

  }
}

export default DocumentAdd;
