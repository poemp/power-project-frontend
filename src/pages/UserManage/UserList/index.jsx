import React from 'react';
import {Button, Dialog, Message, ResponsiveGrid, Table, Tag,Transfer } from '@alifd/next';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import {Link} from 'react-router-dom';
import $http from '@/service/Services';
import url from '@/request';

const {Group: TagGroup, Selectable: SelectableTag} = Tag;
const {Cell} = ResponsiveGrid;

class UserList extends React.Component {


  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      mockData: [],
      dataSource:[],
      visible: false,
      bindUserDialog:false,
    };
    this.pageNum = 0;
    // 分页每页显示数据条数
    this.pageSize = 10;
    // 数据总条数
    this.totalNum = 0;
    this.$http = $http;
    this.handleChange = this.handleChange.bind(this);
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
          visible: false,
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
  deleteTenantRole = (value) => {
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
      bindUserDialog:false
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
    this.$http.post(url.url + '/v1/project/deleteProject?id=' + this.state.value.id, {})
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

  /****************************** y用户绑定 ******************************************/

  /**
   *
   */
  bindUser = (row)=>{
    this.setState({
      bindUserDialog:true
    })
  };
  /**
   * 绑定用户弹框
   * @param value
   * @param data
   * @param extra
   */
  handleChange(value, data, extra) {
    console.log(value, data, extra);
  }
  render() {
    const {mockData,dataSource} = this.state;
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
          <Button style={{marginBottom: 10}}> <Link to={'/list/project-add-update?id='}>添加</Link></Button>
          <div>
            <div className='container-table'>
              <Table  size={'small'} dataSource={mockData} primaryKey="id" className={styles.table}>
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
                        <Button size={"small"}  style={{marginRight: 10}}>
                          <Link
                            to={'/list/project-add-update?id=' + record.id}>编辑</Link>
                        </Button>
                        &nbsp;&nbsp;
                        <Button  size={"small"} disabled={record.status === 0} onClick={this.bindUser.bind(this, record)}>
                          <a onClick={() => {
                          }}>绑定用户 </a>
                        </Button>
                        &nbsp;&nbsp;
                        <Button type="normal" size={"small"} onClick={this.deleteTenantRole.bind(this, record)} warning>
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
          className='zgph-dialog'
          title="提示信息"
          visible={this.state.visible}
          onOk={this.onOkDialog}
          onCancel={this.onCloseDialog.bind(this, 'cancelClick')}
          onClose={this.onCloseDialog}>
          删除后不能恢复，确认要删除？
        </Dialog>

        {/*  添加用户弹框  */}
        <Dialog
          className='zgph-dialog'
          title="提示信息"
          visible={this.state.bindUserDialog}
          onOk={this.onOkDialog}
          onCancel={this.onCloseDialog.bind(this, 'cancelClick')}
          onClose={this.onCloseDialog}>
          <Transfer showSearch defaultValue={['3']}
                    dataSource={dataSource}
                    defaultLeftChecked={['1']}
                    onChange={this.handleChange}
                    titles={['候选', '已选']} />;
        </Dialog>
      </ResponsiveGrid>
    );

  }
}

export default UserList;
