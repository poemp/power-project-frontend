import React from 'react';
import {Button, Dialog, Message, ResponsiveGrid, Table, Tag, Transfer} from '@alifd/next';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import {Link} from 'react-router-dom';
import $http from '@/service/Services';
import url from '@/request';
import moment from 'moment';

const {Group: TagGroup, Selectable: SelectableTag} = Tag;
const {Cell} = ResponsiveGrid;

class DocumentList extends React.Component {


  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      mockData: [],
      visible: false,
    };
    this.pageNum = 0;
    // 分页每页显示数据条数
    this.pageSize = 10;
    // 数据总条数
    this.totalNum = 0;
    this.$http = $http;
  }

// eslint-disable-next-line react/no-deprecated
  componentWillMount = () => {
    this.getDocumentList();
  };

  /**
   * 获取数据
   */
  getDocumentList = (pageNum) => {
    const that = this;
    that.pageNum = typeof (pageNum) == 'number' ? pageNum : that.pageNum;
    let address = url.url + '/v1/document/queryDocument/' + that.pageSize + '/' + that.pageNum;
    this.$http.get(address)
      .then(function (response) {
        const {data} = response;
        const mockData = data.data.dataList;
        that.totalNum = data.data.total;
        mockData.forEach(
          (o, index) => {
            o['number'] = index + 1;
          }
        );
        that.setState({
          mockData: mockData,
          visible: false,
          bindUserDialog: false,
          current: data.data.current
        });
      })
      .catch(function (error) {
        Message.error(error.message);
      })

  };


  /**
   * 删除
   */
  deleteDocument = (value) => {
    this.setState({
      visible: true,
      value: value
    });
  };
  /**
   * 取消提示弹框
   */
  onCloseDialog = reason => {
    this.setState({
      visible: false,
    });
  };


  /**
   * 删除
   */
  onOkDialog = () => {
    this.setState({
      visible: false
    });
    const _this = this;
    this.$http.post(url.url + '/v1/document/deleteDocument?id=' + this.state.value.id, {})
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          _this.getDocumentList();
        }
      })
      .catch(function (error) {
        Message.error(error.message);
      })
  };


  render() {
    const {mockData} = this.state;
    return (
      <ResponsiveGrid gap={20}>
        <Cell colSpan={12}>
          <PageHeader
            title="文档管理"
            breadcrumbs={[
              {
                name: '文档管理',
              },
              {
                name: '文档库',
              },
            ]}
            description="文档库列表"
          />
        </Cell>

        <Cell colSpan={12}>
          <Button style={{marginBottom: 10}}> <Link to={'/list/addDocument?id='}>添加</Link></Button>
          <div>
            <div className='container-table'>
              <Table size={'small'} dataSource={mockData} primaryKey="id" className={styles.table}>
                <Table.Column align="center" title="序号" dataIndex="number"/>
                <Table.Column align="center" title="文档标题" dataIndex="name"/>
                <Table.Column align="center" title="关键字" dataIndex="keyWords"/>
                <Table.Column align="center" title="文档的类型" dataIndex="type" cell={
                  (value, index, record) => {
                    if (record.type === 1) {
                      return (
                        <span>文档</span>
                      )
                    } else {
                      return (
                        <span>链接</span>
                      )
                    }
                  }
                }/>
                <Table.Column align="center" title="阅读量" dataIndex="readCount"/>
                <Table.Column align="center" title="创建时间" dataIndex="createTime"/>
                <Table.Column align="center" title="创建人" dataIndex="createUser"/>
                <Table.Column align="center" title="操作" cell={
                  (value, index, record) => {
                    return (
                      <div>
                        <Button size={'small'} style={{marginRight: 10}}>
                          <Link
                            to={'/list/addDocument?id=' + record.id}>编辑</Link>
                        </Button>
                        &nbsp;&nbsp;
                        <Button size={'small'} style={{marginRight: 10}}>
                          <Link target={"_blank"}
                            to={'/preview/list/detailDocument?id=' + record.id}>查看</Link>
                        </Button>
                        &nbsp;&nbsp;
                        <Button type="normal" size={'small'} onClick={this.deleteDocument.bind(this, record)} warning>
                          <a onClick={() => {
                          }}>删除 </a>
                        </Button>
                      </div>
                    )
                  }
                }/>
              </Table>
            </div>
          </div>
        </Cell>
        <Dialog
          title="提示信息"
          visible={this.state.visible}
          onOk={this.onOkDialog}
          onCancel={this.onCloseDialog.bind(this, 'cancelClick')}
          onClose={this.onCloseDialog}>
          删除后不能恢复，确认要删除？
        </Dialog>
      </ResponsiveGrid>
    );

  }
}

export default DocumentList;
