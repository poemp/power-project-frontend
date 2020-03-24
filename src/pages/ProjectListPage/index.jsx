import React from 'react';
import {Button, Message, ResponsiveGrid, Table, Tag,} from '@alifd/next';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import {Link} from 'react-router-dom';
import $http from '@/service/Services';
import PowerDialog from '@/components/PowerDialog';
import url from '@/request';

const {Group: TagGroup, Selectable: SelectableTag} = Tag;
const {Cell} = ResponsiveGrid;

class ProjectListPage extends React.Component {


  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      mockData: [],
      config: {
        data: null,
        visible: false,
        title: '',
        content: ''
      }
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
    this.getProviderClassifyList();
  };

  /**
   * 获取数据
   */
  getProviderClassifyList = (pageNum) => {
    const _this = this;
    const that = this;
    that.pageNum = typeof (pageNum) == 'number' ? pageNum : that.pageNum;
    let address = url.url + '/v1/project/queryProject/' + that.pageSize + '/' + that.pageNum;
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
          current: data.data.current
        });
      })
      .catch(function (error) {
        Message.error(error.message);
      })

  };

  deleteTenantRole = () => {

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


  /**
   * 删除
   */
  okCall = (data) => {
    this.setState({
      config: {
        visible: false
      }
    });
    const _this = this;
    this.$http.post(url.url + '/v1/project/deleteRole?roleId=' + data.id, {})
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          _this.getProviderClassifyList();
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
        </Cell>

        <Cell colSpan={12}>
          <Button style={{marginBottom: 10}} type="primary">添加</Button>
          <div>
            <div className='container-table'>
              <Table dataSource={mockData} primaryKey="id" className={styles.table}>
                <Table.Column align="center" title="序号" dataIndex="number"/>
                <Table.Column align="center" title="项目名称" dataIndex="name"/>
                <Table.Column align="center" title="开始时间" dataIndex="startTime"/>
                <Table.Column align="center" title="结束时间" dataIndex="endTime"/>
                <Table.Column align="center" title="状态" dataIndex="status" cell={
                  (value, index, record) => {
                    if (record.status == 0) {
                      return (
                        <span>不可用</span>
                      )
                    } else {
                      return (
                        <span>可用</span>
                      )
                    }
                  }
                }/>
                <Table.Column align="center" title="操作" cell={
                  (value, index, record) => {
                    return (
                      <div>

                        <Button type="primary">
                          <Link
                            to={'project-task-list?id=' + record.id}>编辑</Link>
                        </Button>
                        &nbsp;&nbsp;
                        <Button type="normal" onClick={this.deleteTenantRole.bind(this, record)} warning>
                          <a onClick={() => {
                          }}>删除 </a>
                        </Button>
                      </div>
                    )
                  }
                }/>
              </Table>
              <PowerDialog config={this.state.config} cancelCall={this.cancelCall} okCall={this.okCall}/>
            </div>
          </div>
        </Cell>
      </ResponsiveGrid>
    );

  }
}

export default ProjectListPage;
