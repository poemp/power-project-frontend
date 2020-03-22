import React, {useState, useEffect} from 'react';
import {
  Box,
  Search,
  Card,
  Tag,
  ResponsiveGrid,
  Divider,
  Typography,
  Icon,
  Loading,
} from '@alifd/next';
import styles from './index.module.scss';
import {Button, Form, Grid, Icon, Input, Message, Select, Table} from '@alifd/next';
import Container from '@icedesign/container';
import {Link} from 'react-router-dom';

const {Group: TagGroup, Selectable: SelectableTag} = Tag;
const {Cell} = ResponsiveGrid;
import $http from '@/service/Services';
import PowerDialog from '@/components/PowerDialog';


class ProjectList extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.$http = $http;
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillMount = () => {
    this.getProviderClassifyList();
  };

  /**
   * 获取数据
   */
  getProviderClassifyList = () => {
    const _this = this;
    let address = url.url + '/v1/goodsType/getPcProviderGoodsType';
    this.$http.get(address)
      .then(function (response) {
        const {data} = response;
        data.data.forEach((o, i) => {
          o.number = i + 1;
        });
        _this.setState({
          mockData: data.data,
          config: {
            data: null,
            visible: false,
            title: '',
            content: ''
          },
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
    this.$http.post(url.url.url + '/v1/goodsType/deleteRole?roleId=' + data.id, {})
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          _this.getProviderList();
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
            <Table.Column align="center" title="序号" dataIndex="number"/>
            <Table.Column align="center" title="项目名称" dataIndex="name"/>
            <Table.Column align="center" title="开始时间" dataIndex="startTime"/>
            <Table.Column align="center" title="结束时间" dataIndex="endTime"/>
            <Table.Column align="center" title="状态" dataIndex="status" cell={
              (value, index, record) => {
                if (record.status == 0){
                  return (
                    <span>不可用</span>
                  )
                }else{
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

export default ProjectList;
