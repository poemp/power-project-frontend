import React from 'react';
import {Button, Dialog, Icon, Message, ResponsiveGrid, Table, Tag, Radio} from '@alifd/next';
import $http from '@/service/Services';
import url from '@/request';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';

const {Group: TagGroup, Selectable: SelectableTag} = Tag;
const {Cell} = ResponsiveGrid;

class ProjectTaskList extends React.Component {


  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      id: '1',
      current: 0,
      selectRow: {},
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
    const params = new URLSearchParams(this.props.location.search);
    // const id = params.get('id');
    const id = 1;
    this.setState({
      id: id
    }, () => {
      this.getProviderClassifyList();
    });
  };

  /**
   * 获取数据
   */
  getProviderClassifyList = (pageNum) => {
    const that = this;
    that.pageNum = typeof (pageNum) == 'number' ? pageNum : that.pageNum;
    let address = url.url + '/v1/projectTask/queryByProjectId/' + this.state.id + '/' + that.pageSize + '/' + that.pageNum;
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
        that.forEachRow(mockData, {});
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
      visible: false
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

  /**
   *
   * @param record
   * @param index
   * @returns {{className: string}}
   */
  rowProps = (record, index)=> {
    if (record.selected){
      return {className: styles.rowSelect};
    }
  };
  /**
   * 循环
   * @param arr
   * @param record
   */
  forEachRow(arr, record) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].selected = record.id === arr[i].id;
      if (arr[i].children && Array.isArray(arr[i].children)) {
        this.forEachRow(arr[i].children, record);
      }
    }
  }

  /**
   *
   * @param record  {Object} 该行所对应的数据
   * @param index {Number} 该行所对应的序列
   * @param e  {Event} DOM事件对象
   */
  onRowClick = (record, index, e) => {
    const r = record.selected ? {}:record;
    const {mockData} = this.state;
    this.forEachRow(mockData,r);
    this.setState({
      selectRow: record,
      mockData:mockData
    });
  };

  render() {
    const {mockData} = this.state;
    return (
      <ResponsiveGrid gap={20}>
        <Cell colSpan={12}>
          <PageHeader
            title="项目计划"
            breadcrumbs={[
              {
                name: '项目计划',
              },
              {
                name: '计划列表',
              },
            ]}
            description="表格列表描述表格列表描述表格列表描述表格列表描述表格列表描述表格列表描述表格列表描述"
          />
        </Cell>

        <Cell colSpan={12}>
          <div>
            <div style={{marginTop: 5, marginBottom: 5}}>
              <Button.Group>
                <Button size={'small'}><Icon type="add"/>新建</Button>
                <Button size={'small'}><Icon type="close"/>删除</Button>
              </Button.Group>
              &nbsp;&nbsp;
              <Button.Group>
                <Button size={'small'}><Icon type="arrow-double-left"/>前进</Button>
                <Button size={'small'}>后退<Icon type="arrow-double-right"/></Button>
              </Button.Group>
              &nbsp;&nbsp;
              <Button.Group>
                <Button size={'small'}><Icon type="arrow-up"/>上移</Button>
                <Button size={'small'}>下移<Icon type="arrow-down"/></Button>
              </Button.Group>
            </div>
            <div className='container-table'>
              <Table dataSource={mockData}
                     size={'small'}
                     isZebra={true}
                     onRowClick={this.onRowClick}
                     primaryKey="id"
                     isTree={true}
                     rowProps={this.rowProps.bind(this)}
              >
                <Table.Column title="任务" dataIndex="taskName"/>
                <Table.Column title="执行人" dataIndex="userName" align={'center'}/>
                <Table.Column title="交办时间" dataIndex="assignedTime" align={'center'}/>
                <Table.ColumnGroup title="计划" align={'center'}>
                  <Table.Column title="计划开始时间" dataIndex="planStartTime" align={'center'}/>
                  <Table.Column title="计划结束时间" dataIndex="planEndTime" align={'center'}/>
                </Table.ColumnGroup>
                <Table.ColumnGroup title="实际" align={'center'}>
                  <Table.Column title="实际开始时间" dataIndex="realityStartTime" align={'center'}/>
                  <Table.Column title="实际结束时间" dataIndex="realityEndTime" align={'center'}/>
                </Table.ColumnGroup>
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
      </ResponsiveGrid>
    );

  }
}

export default ProjectTaskList;
