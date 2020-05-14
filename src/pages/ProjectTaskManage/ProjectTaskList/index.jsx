import React from 'react';
import {
  Button,
  DatePicker,
  Dialog,
  Form,
  Grid,
  Icon,
  Input,
  Message,
  ResponsiveGrid,
  Search,
  Select,
  Table,
  Tree
} from '@alifd/next';
import $http from '@/service/Services';
import url from '@/request';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import moment from 'moment';
import BraftEditor from "braft-editor";
import Markdown from "braft-extensions/dist/markdown";
import FoundationSymbol from '@icedesign/foundation-symbol';
import CodeHighlighter from "braft-extensions/dist/code-highlighter";
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/table.css'
import 'braft-extensions/dist/code-highlighter.css'

const FormItem = Form.Item;


const {Cell} = ResponsiveGrid;
const {Row, Col} = Grid;
const Option = Select.Option;

moment.locale('zh-cn');

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


class ProjectTaskList extends React.Component {


  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      id: '1',
      current: 0,
      loading: true,
      selectRow: {},
      userList: [],
      mockData: [],
      data: [],
      name: '',
      content1: "",
      taskVisible: false,
      visible: false,
      taskDetailVisible:false,
      taskDetail:"",
      expandedKeys: ['2'],
      autoExpandParent: true,
      defaultExpandedKeys: [],
      props: ['taskName', 'userId', 'assignedTime', 'planStartTime', 'planEndTime', 'realityStartTime', 'realityEndTime']
    };
    this.pageNum = 0;
    // 分页每页显示数据条数
    this.pageSize = 10;
    // 数据总条数
    this.totalNum = 0;
    this.$http = $http;
    this.handleSearch = this.handleSearch.bind(this);
  }

// eslint-disable-next-line react/no-deprecated
  componentWillMount = () => {
    this.getProjectTree(() => {
      this.getProjectUserById();
      this.getProviderClassifyList()
    });
  };

  /**
   * 获取当前项目人员的下拉列表
   */
  getProjectUserById = () => {
    const that = this;
    this.$http.get(url.url + '/v1/projectUser/getProjectUser/' + this.state.id)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          that.setState({
            userList: data.data
          });
          that.forceUpdate();
        }
      })
      .catch(function (error) {
        Message.error(error.message);
      })
  };
  /**
   * 获取数据
   */
  getProjectTree = (fun) => {
    const that = this;
    this.$http.get(url.url + '/v1/project/getProjectTree?name=' + this.state.name)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          let defaultExpandedKeys = [];
          if (data.data.length > 0) {
            defaultExpandedKeys = data.data[0].key
          }
          that.setState({
            data: data.data,
            id: defaultExpandedKeys
          }, () => {
            if (fun && typeof fun === "function") {
              fun();
            }
            that.forceUpdate();
          });
        }
      })
      .catch(function (error) {
        Message.error(error.message);
      })
  };
  /**
   * 加载
   */
  loadingFun = () => {
    this.setState(
      {
        loading: true
      }
    )
  };

  /**
   * 不显示加载
   */
  disLoadingFun = () => {
    this.setState(
      {
        loading: false
      }
    )
  };

  /**
   *
   * 获取任务的列表详情
   */
  getProviderClassifyList = (pageNum) => {
    const that = this;
    this.loadingFun();
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
        }, () => {
          that.disLoadingFun();
        });
      })
      .catch(function (error) {
        Message.error(error.message);
        that.disLoadingFun();
      })

  };

  /**
   * 删除
   */
  deleteProjectTask = (value) => {
    const h = this.checkSelect();
    if (!h) {
      return;
    }
    this.setState({
      visible: true,
      value: value
    });
  };


  /**
   * 任务的详情
   * @param value
   */
  taskContext = (value) => {
    const h = this.checkSelect();
    if (!h) {
      return;
    }
    const {selectRow} = this.state;
    this.setState({
      content1: BraftEditor.createEditorState(selectRow.taskDetail),
      taskVisible: true,
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
   * 删除，删除成功后，删除界面的数据
   * @param arr
   * @param record
   * @param parent
   * @returns {*}
   */
  deleteForEach(arr, id, parent) {
    if (parent.id === undefined) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          arr.splice(i, 1);
          return arr;
        }
      }
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        arr.splice(i, 1);
        return arr;
      } else {
        if (arr[i].children && Array.isArray(arr[i].children)) {
          arr[i].children = this.deleteForEach(arr[i].children, id, arr[i]);
          return arr;
        }
      }
    }
  }

  /**
   * 删除
   */
  onOkDialog = () => {
    const _this = this;
    this.loadingFun();
    const {selectRow} = this.state;
    this.$http.post(url.url + '/v1/projectTask/deleteProjectTaskById?projectTaskId=' + selectRow.id, {})
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          const {mockData} = _this.state;
          const _mockData = _this.deleteForEach(mockData, selectRow.id, {});
          _this.setState({
            visible: false,
            mockData: _mockData
          }, () => {
            _this.disLoadingFun();
          });
        }
      })
      .catch(function (error) {
        Message.error(error.message);
        _this.disLoadingFun();
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
    const {props} = this.state;
    for (let i = 0; i < props.length; i++) {
      const p = props[i];
      row[p + '_selected'] = selected;
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
      if (pro === 'userName') {
        pro = 'userId';
      }
      this.selectRowInput(record, pro, e)
    }
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SPAN') {
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
        sequence: arr.sequence,
        assignedTime: data.assignedTime,
        id: data.id,
        _key: data.id + '_' + (arr.length + 1),
        _id: new Date().getTime()
      });
      return arr;
    }

    for (let i = 0; i < arr.length; i++) {
      if (parent.id === arr[i].id) {
        let children = arr[i].children;
        if (children === undefined) {
          children = [];
        }
        children.push({
          sequence: arr.sequence,
          assignedTime: data.assignedTime,
          id: data.id,
          children: [],
          _id: new Date().getTime()
        });
        arr[i].children = children;
        return arr;
      } else {
        if (arr[i].children && Array.isArray(arr[i].children)) {
          this.insertIntoDataList(arr[i].children, arr[i], data);
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
    this.loadingFun();
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
          _this.setState({
            mockData: _mockData
          }, () => {
            _this.disLoadingFun();
          });
        }
      })
      .catch(function (error) {
        Message.error(error.message);
        _this.disLoadingFun();
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
          this.checkArr(arr[i].children, record, arr[i]);
        }
      }
    }
  }

  /**
   * 添加任务
   */
  addProjectTask = () => {
    this.loadingFun();
    const {selectRow, mockData} = this.state;
    if (mockData && mockData.length > 0) {
      const h = this.checkSelect();
      if (!h) {
        this.disLoadingFun();
        return;
      }
      this.disLoadingFun();
      this.checkArr(mockData, selectRow, {});
    } else {
      this.disLoadingFun();
      this.insertProjectTask({});
    }
  };

  /**
   * 选中输入
   * @param record 显示的数据
   * @param properties 管理的属性
   * @param event 事件
   * @param value 输入的返回值
   */
  selectRowInput = (record, properties, event, value) => {
    const {props} = this.state;
    for (let i = 0; i < props.length; i++) {
      const p = props[i];
      if (properties !== p) {
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
            if (properties === 'userId') {
              const userList = this.state.userList;
              userList.forEach(
                (v, index) => {
                  if (v.id === value) {
                    record['userName'] = v.name;
                  }
                }
              )
            } else {
              record[properties] = value;
            }
            this.forceUpdate();
          })
        } else {
          record[properties + '_selected'] = !record[properties + '_selected'];
          this.forceUpdate();
        }
      }
    } else {
      //时间控件
      this.changePostChangeDate(record, properties, value, () => {
        record[properties + '_selected'] = !record[properties + '_selected'];
        if (properties === 'userId') {
          const userList = this.state.userList;
          userList.forEach(
            (v, index) => {
              if (v.id === value) {
                record['userName'] = v.name;
              }
            }
          )
        } else {
          record[properties] = value;
        }
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
    this.loadingFun();
    const obj2 = JSON.parse(JSON.stringify(record));
    obj2[properties] = value;
    const _this = this;
    this.$http.post(url.url + '/v1/projectTask/updateProjectTask', obj2)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          if (call && typeof call === 'function') {
            call();
          }
          _this.disLoadingFun();
        }
      })
      .catch(function (error) {
        Message.error(error.message);
        _this.disLoadingFun();
      })
  };

  /**
   * 向上移动一位
   * @param arr
   * @param record
   */
  moveUpItem(arr, record) {
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      if (record.id === arr[i].id) {
        index = i;
        break;
      } else {
        if (arr[i].children && Array.isArray(arr[i].children)) {
          arr[i].children = this.moveUpItem(arr[i].children, record);
        }
      }
    }
    if (index !== 0 && index - 1 >= 0) {
      let sequence = arr[index - 1];
      arr[index - 1] = arr[index];
      arr[index] = sequence;
    }
    return arr;
  }

  /**
   * 发送数据到后台
   * @param record
   * @param call
   */
  postChangeMoveUp = (record, call) => {
    this.loadingFun();
    const _this = this;
    this.$http.post(url.url + '/v1/projectTask/moveUpProjectTask?projectTaskId=' + record.id)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          if (call && typeof call === 'function') {
            call();
          }
          _this.disLoadingFun();
        }
      })
      .catch(function (error) {
        Message.error(error.message);
        _this.disLoadingFun();
      })
  };
  /**
   * 向上移动一个
   */
  moveUp = () => {
    const h = this.checkSelect();
    if (!h) {
      return;
    }
    const _this = this;
    const {selectRow, mockData} = this.state;
    this.postChangeMoveUp(selectRow, () => {
      const _mockData = this.moveUpItem(mockData, selectRow);
      _this.setState({
        mockData: _mockData
      });
    })

  };

  /**
   * 发送数据到后台
   * @param record
   * @param call
   */
  postChangeMoveDown = (record, call) => {
    this.loadingFun();
    const _this = this;
    this.$http.post(url.url + '/v1/projectTask/moveDownProjectTask?projectTaskId=' + record.id)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          if (call && typeof call === 'function') {
            call();
          }
          _this.disLoadingFun();
        }
      })
      .catch(function (error) {
        Message.error(error.message);
        _this.disLoadingFun();
      })
  };

  /**
   * 向下移动一位
   * @param arr
   * @param record
   */
  moveDownItem(arr, record) {
    let index = 99999999;
    for (let i = 0; i < arr.length; i++) {
      if (record.id === arr[i].id) {
        index = i;
        break;
      } else {
        if (arr[i].children && Array.isArray(arr[i].children)) {
          arr[i].children = this.moveDownItem(arr[i].children, record);
        }
      }
    }
    if (index !== arr.length - 1 && index + 1 <= arr.length) {
      let sequence = arr[index + 1];
      arr[index + 1] = arr[index];
      arr[index] = sequence;
    }
    return arr;
  }

  /**
   * 向上移动一个
   */
  moveDown = () => {
    const h = this.checkSelect();
    if (!h) {
      return;
    }
    const _this = this;
    const {selectRow, mockData} = this.state;
    this.postChangeMoveDown(selectRow, () => {
      const _mockData = this.moveDownItem(mockData, selectRow);
      _this.setState({
        mockData: _mockData
      });
    });
  };

  /**
   * 向上移动一位
   * @param arr
   * @param record
   */
  drawBackItem(arr, record) {
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      if (record.id === arr[i].id) {
        index = i;
        break;
      } else {
        if (arr[i].children && Array.isArray(arr[i].children)) {
          arr[i].children = this.drawBackItem(arr[i].children, record);
        }
      }
    }
    if (index !== 0 && index - 1 >= 0) {
      const thisItem = arr.splice(index, 1);
      if (arr[index - 1].children === null || arr[index - 1].children === undefined) {
        arr[index - 1].children = [];
      }
      arr[index - 1].children.push(thisItem[0]);
      for (let i = 0; i < arr.length; i++) {
        arr[i].sequence = i + 1;
        arr[i]['_key'] = arr[i].id + '_' + (i + 1);
      }
      for (let i = 0; i < arr[index - 1].children.length; i++) {
        arr[index - 1].children.sequence = i + 1;
        arr[index - 1]['_key'] = arr[index - 1].id + '_' + (i + 1);
      }
    }
    return arr;
  }

  /**
   * 发送数据到后台
   * @param record
   * @param call
   */
  drawBackTaskProject = (record, call) => {
    this.loadingFun();
    const _this = this;
    this.$http.post(url.url + '/v1/projectTask/drawBackTaskProject?projectTaskId=' + record.id)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          if (call && typeof call === 'function') {
            call();
          }
          _this.disLoadingFun();
        }
      })
      .catch(function (error) {
        Message.error(error.message);
        _this.disLoadingFun();
      })
  };

  /**
   * 向后移动一位
   */
  drawBack = () => {
    const h = this.checkSelect();
    if (!h) {
      return;
    }
    const _this = this;
    const {selectRow, mockData} = this.state;
    this.drawBackTaskProject(selectRow, () => {
      const _mockData = this.drawBackItem(mockData, selectRow);
      _this.setState({
        mockData: _mockData
      });
    })

  };

  /**
   * 向上移动一位
   * @param arr
   * @param record
   */
  drawForwardItem(arr, record, parents) {
    let index = -1, obj = null;
    for (let i = 0; i < arr.length; i++) {
      if (record.id === arr[i].id) {
        index = i;
        obj = arr.splice(i, 1)[0];
        for (let i = 0; i < arr.length; i++) {
          arr[i].sequence = i + 1;
          arr[i]['_key'] = arr[i].id + '_' + (i + 1);
        }
        break;
      } else {
        if (arr[i].children && Array.isArray(arr[i].children)) {
          arr[i].children = this.drawForwardItem(arr[i].children, record, arr);
        }
      }
    }
    if (obj !== null && index !== -1) {
      parents.push(obj);
    }
    return arr;
  }

  /**
   * 发送数据到后台
   * @param record
   * @param call
   */
  drawForwardTaskProject = (record, call) => {
    this.loadingFun();
    const _this = this;
    this.$http.post(url.url + '/v1/projectTask/forwardProjectTask?projectTaskId=' + record.id)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          if (call && typeof call === 'function') {
            call();
          }
          _this.disLoadingFun();
        }
      })
      .catch(function (error) {
        Message.error(error.message);
        _this.disLoadingFun();
      })
  };

  /**
   * 向后一步
   */
  drawForward = () => {
    const h = this.checkSelect();
    if (!h) {
      return;
    }
    const _this = this;
    const {selectRow, mockData} = this.state;
    this.drawForwardTaskProject(selectRow, () => {
      const _mockData = this.drawForwardItem(mockData, selectRow, mockData);
      _this.setState({
        mockData: _mockData
      });
    });

  };

  /**
   * 过滤器
   * @param value
   */
  handleSearch(value) {
    value = value.trim();
    this.setState(
      {
        name: value
      }, () => {
        this.getProjectTree();
      }
    )
  }

  /**
   * checkedKeys: {Array} 勾选复选框节点key的数组
   * extra: {Object} 额外参数
   * extra.checkedNodes: {Array} 勾选复选框节点的数组
   * extra.checkedNodesPositions: {Array} 包含有勾选复选框节点和其位置的对象的数组
   * extra.indeterminateKeys: {Array} 半选复选框节点 key 的数组
   * extra.node: {Object} 当前操作的节点
   * extra.checked: {Boolean} 当前操作是否是勾选
   */
  onCheckProject = (checkedKeys, extra) => {
    if (Array.isArray(checkedKeys) && checkedKeys.length > 0) {
      this.setState({
        id: checkedKeys[0]
      }, () => {
        this.getProjectUserById();
        this.getProviderClassifyList();
      });
    }
  };
  /**
   * 取消提示弹框
   */
  onTaskContextClose = reason => {
    this.setState({
      taskVisible: false
    });
  };

  /**
   * 关闭显示
   * @param reason
   */
  onCloseTaskDetailVisible = reason =>{
    this.setState({
      taskDetailVisible: false
    });
  };
  /**
   * 删除
   */
  onTaskContextOkDialog = () => {
    const {editorState} = this.state;
    this.loadingFun();
    const _this = this;
    const {selectRow} = this.state;
    this.$http.post(url.url + '/v1/projectTask/updateProjectTaskContext', {
      id: selectRow.id,
      context: editorState.toHTML()
    })
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          const {selectRow, mockData} = _this.state;
          selectRow.taskDetail = editorState.toHTML();
          _this.setState({
            taskVisible: false,
            mockData: mockData
          }, () => {
            _this.disLoadingFun();
          });
        }
      })
      .catch(function (error) {
        Message.error(error.message);
        _this.disLoadingFun();
      })
  };

  /**
   * 改变值
   * @param editorState
   */
  handleChange = (editorState) => {
    this.setState({
      editorState: editorState
    })
  };

  /**
   * 返回视图
   * @returns {*}
   */
  render() {
    const {mockData, userList, data} = this.state;
    BraftEditor.use([Markdown(markdownOptions), CodeHighlighter(codeHighlighterOptions)]);
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
            description="项目计划列表"
          />
        </Cell>
        <Cell colSpan={12}>
          <Row>
            <Col span="3" className={styles.projectList}>
              <Search shape="simple" size="medium" hasClear style={{width: '200px', marginBottom: '10px'}}
                      onChange={this.handleSearch}/>
              <Tree onSelect={this.onCheckProject.bind(this)}
                    defaultSelectedKeys={[this.state.id]}
                    dataSource={data}/>
            </Col>
            <Col span="1">
              <br/>
            </Col>
            <Col span="20">
              <div>
                <div style={{marginTop: 5, marginBottom: 5}}>
                  <Button.Group>
                    <Button size={'small'} onClick={this.addProjectTask.bind(this)}><Icon type="add"/>新建</Button>
                    <Button size={'small'} onClick={this.deleteProjectTask.bind(this)}><Icon type="close"/>删除</Button>
                  </Button.Group>
                  &nbsp;&nbsp;
                  <Button.Group>
                    <Button size={'small'} onClick={this.taskContext.bind(this)}><Icon type="form"/>详情</Button>
                  </Button.Group>
                  &nbsp;&nbsp;
                  <Button.Group>
                    <Button size={'small'} onClick={this.drawForward.bind(this)}><Icon
                      type="arrow-double-left"/>前进</Button>
                    <Button size={'small'} onClick={this.drawBack.bind(this)}>后退<Icon
                      type="arrow-double-right"/></Button>
                  </Button.Group>
                  &nbsp;&nbsp;
                  <Button.Group>
                    <Button size={'small'} onClick={this.moveUp.bind(this)}><Icon type="arrow-up"/>上移</Button>
                    <Button size={'small'} onClick={this.moveDown.bind(this)}>下移<Icon type="arrow-down"/></Button>
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
                         loading={this.state.loading}
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
                                e.stopPropagation();
                                this.selectRowInput(record, pro, e, e.target.value)
                              }} trim placeholder="输入任务名称" aria-label="不能输入空"/>
                          )
                        } else {
                          return (
                            <span onClick={(e) => {
                              if (record[pro + "_selected"]) {
                                e.stopPropagation();
                              }
                              this.selectRowInput(record, pro, e)
                            }}>{record[pro] && record[pro].length > 0 ? record[pro] : " ---- "}
                              {
                                [0].map(ooooo => {
                                  if (record.taskDetail && record.taskDetail.length > 0) {
                                    return (
                                      <a onClick={(e)=>{
                                        e.stopPropagation();
                                        this.setState({
                                          taskDetailVisible:true,
                                          taskDetail: record.taskDetail
                                        })
                                      }}>
                                        <FoundationSymbol  size="small" type={'content'}/>
                                      </a>
                                    )
                                  }
                                })
                              }
                            </span>
                          )
                        }
                      }
                    }/>
                    <Table.Column title="执行人" dataIndex="userName" align={'center'} cell={
                      (value, index, record) => {
                        const pro = 'userId';
                        if (record[pro + '_selected']) {
                          return (
                            <Select placeholder={'请选择'} showSearch hasClear onChange={(value) => {
                              this.selectRowInput(record, pro, null, value)
                            }}>
                              {
                                Array.isArray(userList) &&
                                userList.length > 0 &&
                                userList.map(
                                  u => {
                                    return (
                                      <Option value={u.id}>{u.name}</Option>
                                    )
                                  }
                                )
                              }
                            </Select>
                          )
                        } else {
                          return (
                            <span onClick={(e) => {
                              if (!record["userId_selected"]) {
                                e.stopPropagation();
                              }
                              this.selectRowInput(record, pro, e);
                            }}>{record['userName'] && record['userName'].length > 0 ? record['userName'] : " ---- "}</span>
                          )
                        }
                      }
                    }/>
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
                              if (record[pro + "_selected"]) {
                                e.stopPropagation();
                              }
                              this.selectRowInput(record, pro, e)
                            }}>{record[pro] && record[pro].length > 0 ? record[pro] : " ---- "}</span>
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
                                if (record[pro + "_selected"]) {
                                  e.stopPropagation();
                                }
                                this.selectRowInput(record, pro, e)
                              }}>{record[pro] && record[pro].length > 0 ? record[pro] : " ---- "}</span>
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
                                if (record[pro + "_selected"]) {
                                  e.stopPropagation();
                                }
                                this.selectRowInput(record, pro, e)
                              }}>{record[pro] && record[pro].length > 0 ? record[pro] : " ---- "}</span>
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
                                if (record[pro + "_selected"]) {
                                  e.stopPropagation();
                                }
                                this.selectRowInput(record, pro, e)
                              }}>{record[pro] && record[pro].length > 0 ? record[pro] : " ---- "}</span>
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
                                if (record[pro + "_selected"]) {
                                  e.stopPropagation();
                                }
                                this.selectRowInput(record, pro, e)
                              }}>{record[pro] && record[pro].length > 0 ? record[pro] : " ---- "}</span>
                            )
                          }
                        }
                      }/>
                    </Table.ColumnGroup>
                  </Table>
                </div>
              </div>
            </Col>
          </Row>
        </Cell>
        <Dialog
          className='dialog'
          title="提示信息"
          visible={this.state.visible}
          onOk={this.onOkDialog}
          onCancel={this.onCloseDialog.bind(this, 'cancelClick')}
          onClose={this.onCloseDialog}>
          删除后不能恢复，确认要删除？
        </Dialog>

        <Dialog title="任务备注"
                visible={this.state.taskVisible}
                onOk={this.onTaskContextOkDialog}
                onCancel={this.onTaskContextClose}
                onClose={this.onTaskContextClose}
        >
          <BraftEditor
            value={this.state.content1}
            className={styles.braftEditor}
            onBlur={this.handleChange}
            excludeControls={this.excludeControls}
          />
        </Dialog>

        <Dialog title="任务备注详情"
                closeable='close,esc,mask'
                onOk={this.onCloseTaskDetailVisible}
                onCancel={this.onCloseTaskDetailVisible}
                onClose={this.onCloseTaskDetailVisible}
                footerActions={[]}
                visible={this.state.taskDetailVisible}
        >
          <Form className={styles.groupItem}
                inline>
            <FormItem>
              {
                [0].map(
                  o => {
                    return (
                      <p dangerouslySetInnerHTML={{__html: this.state.taskDetail}}/>
                    )
                  }
                )
              }
            </FormItem>
          </Form>


        </Dialog>

      </ResponsiveGrid>
    );

  }
}

export default ProjectTaskList;
