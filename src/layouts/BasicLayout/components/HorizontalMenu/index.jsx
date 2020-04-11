import React from 'react';
import {Balloon, Button, DatePicker, Dialog, Icon, Input, Message, ResponsiveGrid, Table, Select} from '@alifd/next';
import $http from '@/service/Services';
import url from '@/request';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import moment from 'moment';
import {asideMenuConfig} from '../../menuConfig';

const Tooltip = Balloon.Tooltip;
const {Cell} = ResponsiveGrid;

const Option = Select.Option;

moment.locale('zh-cn');

import {Menu, Box, Typography} from '@alifd/next';

const {SubMenu, Item, PopupItem, Divider} = Menu;
const popupProps = {
  align: 'tc bc',
  triggerType: 'click'
};
const ds = [{
  title: '库存管理',
  children: [{
    title: '部门库存管理',
    link: ''
  }, {
    title: '小二库存管理',
    link: ''
  }]
}, {
  title: '功能模块管理',
  children: [{
    title: '功能模块管理',
    link: ''
  }, {
    title: '卡片管理',
    link: ''
  }, {
    title: '首页布局',
    link: ''
  }, {
    title: '页面管理',
    link: ''
  }]
}, {
  title: '系统管理',
  children: [{
    title: '角色管理',
    link: ''
  }, {
    title: '标签管理',
    link: ''
  }, {
    title: '字典管理',
    link: ''
  }]
}];

const Panel = props => {
  const {dataSource, ...others} = props;

  return (<div className={styles.myCustomContent} {...others}>
    <Box direction="row">
      {dataSource.map((item, i) => {
        return (
          <Menu embeddable key={i}>
            <Menu.Item>
              <div className={styles.title}>{item.title}</div>
            </Menu.Item>
            <Divider/>
            {item.dataSource.map((child, g) => {
              const a = child.children && child.children.map((c, j) => {
                return <Menu.Item key={j}><a href={c.link}>{c.title} aaa</a></Menu.Item>;
              });
              return [<div className={styles.subTitle} key={`title`}>{child.title}aaa</div>, ...a];
            })}
          </Menu>);
      })}
    </Box>
  </div>);
};


const SubPanel = props => {
  const {dataSource, ...others} = props;
  return (
    <div className={styles.myCustomContent2} {...others}>
      <Box direction="row">
        {dataSource.children.map((item, i) => {
          return (<Menu embeddable key={i}>
            <div className={styles.subHeadTitle}>{item.name}</div>
            {item.children && item.children.map((child, j) => {
              return (
                <Menu.Item className={styles.subTitle} key={j}>
                  {child.name}
                </Menu.Item>
              );
            })}
          </Menu>);
        })}
      </Box>
    </div>);
};

class HorizontalMenu extends React.Component {


  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {};

  }

// eslint-disable-next-line react/no-deprecated
  componentWillMount = () => {

  };

  /**
   * 返回视图
   * @returns {*}
   */
  render() {
    return (
      <Menu hozInLine direction="hoz" mode="popup" className={styles.myHozMenu} popupClassName={styles.myHozMenu}
            popupProps={popupProps}
            renderMore={(more) => {
              const newDs = more.map((item, i) => {
                const data = item.props.children.props;
                return {
                  title: item.props.label,
                  dataSource: data.dataSource
                };
              });

              return (<PopupItem noIcon triggerType="click" key="0-more" label="更多">
                <Panel dataSource={newDs}/>
              </PopupItem>);
            }}>
        {
          Array.isArray(asideMenuConfig) &&
          asideMenuConfig.length > 0 &&
          asideMenuConfig.map(
            (o, i)=>{
              return (
                <PopupItem key={i} label={o.name} noIcon>
                  <SubPanel dataSource={o}/>
                </PopupItem>
              )
            }
          )
        }
      </Menu>
    );

  }
}

export default HorizontalMenu;
