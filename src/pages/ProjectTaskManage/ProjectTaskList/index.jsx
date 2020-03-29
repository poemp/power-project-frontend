import React from 'react';
import {Balloon, Button, DatePicker, Dialog, Icon, Input, Message, ResponsiveGrid, Table} from '@alifd/next';
import $http from '@/service/Services';
import url from '@/request';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import moment from 'moment';

const Tooltip = Balloon.Tooltip;
const {Cell} = ResponsiveGrid;

moment.locale('zh-cn');

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
        that.forEachSetKey(mockData);
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
    this.$http.post(url.url + '/v1/projectTask/deleteProject?id=' + this.state.value.id, {})
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
  rowProps = (record, index) => {
    if (record.selected) {
      return {className: styles.rowSelect};
    }
  };

  /**
   * 单元格的属性
   * @param rowIndex {Number} 该行所对应的序列
   * @param colIndex  {Number} 该列所对应的序列
   * @param dataIndex {String} 该列所对应的字段名称
   * @param record {Object} 该行对应的记录
   * @returns {{colSpan: number}|{rowSpan: number}}
   */
  cellProps = (rowIndex, colIndex, dataIndex, record) => {
    return {
      id: rowIndex + '@' + colIndex + '@' + dataIndex
    }
  };

  /**
   * 循环
   * @param arr
   * @param record
   */
  forEachSetKey(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].children && Array.isArray(arr[i].children)) {
        this.forEachSetKey(arr[i].children);
      }
    }
  }

  /**
   * 某一列的选中
   * @param row
   * @param selected true 选中 falese 没有选中
   */
  propertiesChecked(row, selected) {
    for (let r in row) {
      row[r + '_selected'] = selected;
    }
  }

  /**
   * 循环
   * @param arr
   * @param record
   */
  forEachRow(arr, record) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].selected = record.id === arr[i].id;
      this.propertiesChecked(arr[i], false);
      arr[i].sequence = i + 1;
      arr[i]['_key'] = arr[i].id + '_' + arr[i].sequence;
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
    e.stopPropagation();
    //点击的单元格
    if (e.target.tagName === 'DIV') {
      const parentId = e.target.parentNode.id;
      let ids = parentId.split('@');
      let pro = ids[ids.length - 1];
      this.selectRowInput(record, pro, e)
    }
    if (e.target.tagName === 'INPUT') {
      return;
    }
    const r = record.selected ? {id: -1} : record;
    const {mockData} = this.state;
    this.forEachRow(mockData, r);
    this.setState({
      selectRow: r,
      mockData: mockData
    });
  };

  /**
   * 选中的验证
   */
  checkSelect = () => {
    const {selectRow} = this.state;
    if (selectRow.id && selectRow.id !== -1) {
      return true;
    }
    Message.warning('请选择需要操作列');
    return false;
  };

  /**
   * 插入数据中，页面渲染
   * @param arr
   * @param parent
   * @param data
   * @returns {*}
   */
  insertIntoDataList = (arr, parent, data) => {
    if (parent.id === undefined) {
      arr.push({
        sequence: arr.length + 1,
        assignedTime: data.assignedTime,
        id: data.id,
        _key: data.id + '_' + (arr.length + 1),
        _id: new Date().getTime()
      });
      return arr;
    }
    for (let i = 0; i < arr.length; i++) {
      if (parent.id === arr[i].id) {
        arr.push({
          sequence: arr.length,
          assignedTime: data.assignedTime,
          id: data.id,
          children: [],
          _id: new Date().getTime()
        });
        return arr;
      } else {
        if (arr[i].children && Array.isArray(arr[i].children)) {
          arr[i].children = this.checkArr(arr[i].children, record, arr[i]);
          return arr;
        }
      }
    }
  };

  /**
   * 发送请求
   * @param parent
   * @param call
   */
  insertProjectTask = (parent) => {
    const _this = this;
    this.$http.post(url.url + '/v1/projectTask/insertProjectTask', {
      projectId: this.state.id,
      parentId: parent.id
    })
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          const {mockData} = _this.state;
          const d = data.data;
          const _mockData = _this.insertIntoDataList(mockData, parent, d);
          console.log(_mockData);
          _this.setState({
            mockData: _mockData
          });
        }
      })
      .catch(function (error) {
        Message.error(error.message);
      })
  };

  /**
   * 查询循环查询，找到插入的位置
   * @param arr
   * @param record
   * @param parent
   * @returns {*}
   */
  checkArr(arr, record, parent) {
    for (let i = 0; i < arr.length; i++) {
      if (record.id === arr[i].id) {
        this.insertProjectTask(parent);
      } else {
        if (arr[i].children && Array.isArray(arr[i].children)) {
          arr[i].children = this.checkArr(arr[i].children, record, arr[i]);
          return arr;
        }
      }
    }
  }

  /**
   * 添加任务
   */
  addProjectTask = () => {
    const h = this.checkSelect();
    if (!h) {
      return;
    }
    const {selectRow, mockData} = this.state;
    const data = this.checkArr(mockData, selectRow, {});
    this.setState({
      mockData: data
    })
  };

  /**
   * 选中输入
   * @param record 显示的数据
   * @param properties 管理的属性
   * @param event 事件
   * @param value 输入的返回值
   */
  selectRowInput = (record, properties, event, value) => {
    for (let p in record) {
      if (p !== properties) {
        record[p + '_selected'] = false;
      }
    }
    if (event) {
      //如果没有选中，则向上传输事件
      if (true === record['selected']) {
        event.stopPropagation();
      }
      if ((event.target === event.currentTarget && record.selected) || event.target.tagName === 'DIV') {
        if (record[properties + '_selected']) {
          this.changePostChangeDate(record, properties, value, () => {
            record[properties + '_selected'] = false;
            record[properties] = value;
            this.setState({});
          })
        }
        record[properties + '_selected'] = !record[properties + '_selected'];
        this.setState({});
      }
    } else {
      //时间控件
      this.changePostChangeDate(record, properties, value, () => {
        record[properties + '_selected'] = !record[properties + '_selected'];
        record[properties] = value;
        this.setState({});
      })
    }
  };

  /**
   * 发送数据到后台
   * @param record 记录值
   * @param properties 属性
   * @param value 新的值
   * @param call 回调函数
   */
  changePostChangeDate = (record, properties, value, call) => {
    const obj2 = JSON.parse(JSON.stringify(record));
    obj2[properties] = value;
    this.$http.post(url.url + '/v1/projectTask/updateProjectTask', obj2)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          if (call && typeof call === 'function') {
            call();
          }
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
                <Button size={'small'} onClick={this.addProjectTask.bind(this)}><Icon type="add"/>新建</Button>
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
                     primaryKey="_key"
                     cellProps={this.cellProps}
                     isTree={true}
                     rowProps={this.rowProps.bind(this)}
              >
                <Table.Column title="任务" dataIndex="taskName" cell={
                  (value, index, record) => {
                    const pro = 'taskName';
                    if (record[pro + '_selected']) {
                      return (
                        <Input
                          defaultValue={record[pro]}
                          onBlur={(e) => {
                            this.selectRowInput(record, pro, e, e.target.value)
                          }} trim placeholder="输入任务名称" aria-label="不能输入空"/>
                      )
                    } else {
                      return (
                        <span onClick={(e) => {
                          this.selectRowInput(record, pro, e)
                        }}>{record[pro]}</span>
                      )
                    }
                  }
                }/>
                <Table.Column title="执行人" dataIndex="userName" align={'center'}/>
                <Table.Column title="交办时间" dataIndex="assignedTime" align={'center'} cell={
                  (value, index, record) => {
                    const pro = 'assignedTime';
                    if (record[pro + '_selected']) {
                      return (
                        <DatePicker size={'small'}
                                    value={record[pro]}
                                    onChange={(val) => {
                                      const v = moment(val).format('YYYY-MM-DD');
                                      this.selectRowInput(record, pro, null, v)
                                    }}/>
                      )
                    } else {
                      return (
                        <span onClick={(e) => {
                          this.selectRowInput(record, pro, e)
                        }}>{record[pro]}</span>
                      )
                    }
                  }
                }/>
                <Table.ColumnGroup title="计划" align={'center'}>
                  <Table.Column title="计划开始时间" dataIndex="planStartTime" align={'center'} cell={
                    (value, index, record) => {
                      const pro = 'planStartTime';
                      if (record[pro + '_selected']) {
                        return (
                          <DatePicker size={'small'}
                                      value={record[pro]}
                                      onChange={(val) => {
                                        const v = moment(val).format('YYYY-MM-DD');
                                        this.selectRowInput(record, pro, null, v)
                                      }}/>
                        )
                      } else {
                        return (
                          <span onClick={(e) => {
                            this.selectRowInput(record, pro, e)
                          }}>{record[pro]}</span>
                        )
                      }
                    }
                  }/>
                  <Table.Column title="计划结束时间" dataIndex="planEndTime" align={'center'} cell={
                    (value, index, record) => {
                      const pro = 'planEndTime';
                      if (record[pro + '_selected']) {
                        return (
                          <DatePicker size={'small'}
                                      value={record[pro]}
                                      onChange={(val) => {
                                        const v = moment(val).format('YYYY-MM-DD');
                                        this.selectRowInput(record, pro, null, v)
                                      }}/>
                        )
                      } else {
                        return (
                          <span onClick={(e) => {
                            this.selectRowInput(record, pro, e)
                          }}>{record[pro]}</span>
                        )
                      }
                    }
                  }/>
                </Table.ColumnGroup>
                <Table.ColumnGroup title="实际" align={'center'}>
                  <Table.Column title="实际开始时间" dataIndex="realityStartTime" align={'center'} cell={
                    (value, index, record) => {
                      const pro = 'realityStartTime';
                      if (record[pro + '_selected']) {
                        return (
                          <DatePicker size={'small'}
                                      value={record[pro]}
                                      onChange={(val) => {
                                        const v = moment(val).format('YYYY-MM-DD');
                                        this.selectRowInput(record, pro, null, v)
                                      }}/>
                        )
                      } else {
                        return (
                          <span onClick={(e) => {
                            this.selectRowInput(record, pro, e)
                          }}>{record[pro]}</span>
                        )
                      }
                    }
                  }/>
                  <Table.Column title="实际结束时间" dataIndex="realityEndTime" align={'center'} cell={
                    (value, index, record) => {
                      const pro = 'realityEndTime';
                      if (record[pro + '_selected']) {
                        return (
                          <DatePicker size={'small'}
                                      value={record[pro]}
                                      onChange={(val) => {
                                        const v = moment(val).format('YYYY-MM-DD');
                                        this.selectRowInput(record, pro, null, v)
                                      }}/>
                        )
                      } else {
                        return (
                          <span onClick={(e) => {
                            this.selectRowInput(record, pro, e)
                          }}>{record[pro]}</span>
                        )
                      }
                    }
                  }/>
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
