import React from 'react';
import moment from 'moment';
import {Calendar} from '@alifd/next';
import styles from './index.module.scss';
const currentDate = moment();
const localeData = currentDate.clone().localeData();
const monthLocale = localeData.monthsShort();

moment.locale('zh-cn');

class ProjectTaskNotice extends React.Component {


  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {};

  }

// eslint-disable-next-line react/no-deprecated
  componentWillMount = () => {

  };

  /**
   * 自定义日期渲染函数
   * @param date
   * @returns {*}
   */
  dateCellRender = (date) => {
    const dateNum = date.date();
    if (currentDate.month() !== date.month()) {
      return dateNum;
    }

    let eventList;
    switch (dateNum) {
      case 1:
        eventList = [
          {type: 'primary', content: 'Event 1'},
          {type: 'normal', content: 'Event 2'}
        ];
        break;
      case 10:
        eventList = [
          {type: 'normal', content: 'Event 3'},
          {type: 'normal', content: 'Event 4'}
        ];
        break;
      case 11:
        eventList = [
          {type: 'primary', content: 'Event 5'},
          {type: 'primary', content: 'Event 6'}
        ];
        break;
      default:
        eventList = [];
    }

    return (<div className={styles.customCalendarCell}>
      <div className={styles.customCalendarCellValue}>{dateNum}</div>
      <div className={styles.customCalendarCellContent}>
        <ul className={styles.eventList}>
          {eventList.map((item, key) => <li className={`${item.type}-event`} key={key}>{item.content}</li>)}
        </ul>
      </div>
    </div>);
  };
  /**
   * 自定义月份渲染函数
   * @param date
   * @returns {string|*}
   */
  monthCellRender = (date) => {
    if (currentDate.month() === date.month()) {
      return (<div>
        <div>{monthLocale[date.month()]}</div>
        <div>Events</div>
      </div>);
    }
    return monthLocale[date.month()];
  };

  /**
   * 返回视图
   * @returns {*}
   */
  render() {
    return (
      <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} shape={"fullscreen"}/>
    )
  }
}

export default ProjectTaskNotice;
