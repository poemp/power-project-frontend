import React from 'react';
import {Button, Message, ResponsiveGrid, Table, Tag,} from '@alifd/next';
import styles from './index.module.scss';
import {Link} from 'react-router-dom';
import $http from '@/service/Services';
import PowerDialog from '@/components/PowerDialog';
import url from '@/request';

const {Group: TagGroup, Selectable: SelectableTag} = Tag;
const {Cell} = ResponsiveGrid;


class ProjectTaskList extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      mockData: [],
      config: {
        data: null,
        visible: false,
        title: "",
        content: ""
      }
    };
    this.pageNum = 1;
    // 分页每页显示数据条数
    this.pageSize = 10;
    // 数据总条数
    this.totalNum = 0;
    this.$http = $http;
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillMount = () => {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("id");
    this.setState({
      id: id
    },()=>{
      this.getProviderClassifyList();
    });

  };

  /**
   * 获取数据
   */
  getProviderClassifyList = (pageNum) => {
    const that = this;
    let address = url.url + '/v1/projectTask/queryByProjectId/' + this.state.id ;
    this.$http.get(address)
      .then(function (response) {
        const {data} = response;
        const mockData = data.data;
        mockData.forEach(
          (o, index) => {
            o["number"] = index + 1;
          }
        );
        that.setState({
          mockData: mockData,
        });
      })
      .catch(function (error) {
        Message.error(error.message);
      })

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
      <div>
        <div className='container-table'>
          <Table dataSource={mockData} primaryKey="id" className={styles.table}>
            <Table.Column align="center" title="任务的执行人" dataIndex="number"/>
            <Table.Column align="center" title="交办时间" dataIndex="name"/>
            <Table.Column align="center" title="计划开始时间" dataIndex="startTime"/>
            <Table.Column align="center" title="计划结束时间" dataIndex="endTime"/>
            <Table.Column align="center" title="实际开始时间" dataIndex="endTime"/>
            <Table.Column align="center" title="实际结束时间" dataIndex="endTime"/>
            <Table.Column align="center" title="进度" dataIndex="endTime"/>
            <Table.Column align="center" title="操作" cell={
              (value, index, record) => {
                return (
                  <div>

                    <Button type="normal" size="small" text className='zgph-btn-edit'>
                      <Link
                        to={'add-goods-type?id=' + record.id}>编辑</Link>
                    </Button>

                    <Button type="normal" size="small" text className='zgph-btn-delete'
                            onClick={this.deleteTenantRole.bind(this, record)} warning>
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
    )
  }
}

export default ProjectTaskList;
