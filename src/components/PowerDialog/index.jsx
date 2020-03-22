/**
  * @description: Dialog组件封装
  * @author: hj
  * @update: hj(2020-01-14)
  */
 import {Dialog} from '@alifd/next';
import React from 'react';


class PowerDialog extends React.Component {

    constructor(props) {
        super(props);
        const {config} = props;
        this.state = {
            visible: config.visible,
            title: config.title,
            content: config.content
        };
        // this.clickCancel = this.clickCancel.bind(this);
        this.clickSuccess = this.clickSuccess.bind(this);
    }

    /**
     * 修改状态
     */
    componentWillReceiveProps = (nextProps) => {
        const {config} = nextProps;
        this.setState({
            data:config.data,
            visible: config.visible,
            title: config.title,
            content: config.content
        });
    };

    /**
     * 点击取消
     */
    onClose = () => {
        this.setState({
            visible: false
        });
    };
    // clickCancel = () => {
    //     if (this.props.cancelCall && typeof this.props.cancelCall === "function"){
    //         this.props.cancelCall();
    //     }
    // };

    /**
     * 点击成功
     */
    clickSuccess = () => {
        // 关闭弹窗
        this.setState({
            visible: false
        });

        setTimeout(() => {
            if (this.props.okCall && typeof this.props.okCall === "function" ){
                const {config} = this.props;
                this.props.okCall(config.data);
            }
        },100);
    };




  render() {
    return (
        <Dialog
            className='zgph-dialog'
            autoFocus={true}
            title={this.state.title}
            visible={this.state.visible}
            onOk={this.clickSuccess.bind(this)}
            // onCancel={this.clickCancel.bind(this)}
            onCancel={this.onClose.bind(this, 'cancelClick')}
            onClose={this.onClose}>
            {this.state.content}
        </Dialog>
    );
  }
}

export default PowerDialog;
