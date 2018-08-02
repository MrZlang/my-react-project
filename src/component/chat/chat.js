import React from 'react'
import io from 'socket.io-client'
import { List, InputItem } from 'antd-mobile';
import { getMsgList } from '../../redux/chat.redux'
import { connect } from 'react-redux'
const socket = io('ws://localhost:9999')

@connect(
    state=>state,
    {getMsgList}
)
class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            text: '',
            msg: []
        }
    }
    componentDidMount(){
        this.props.getMsgList()
        //on监听
        // socket.on('recvmsg',(data)=>{
        //     this.setState({
        //         msg: [...this.state.msg,data.text]
        //     })
        // })
    }
    handleSubmit(){
        socket.emit('sendmsg',{text:this.state.text})
        this.setState({
            text: ''
        })
    }
    render(){
        return(
            <div>
                {this.state.msg.map(v=>{
                    return <p key={v}>{v}</p>
                })}
                <div className="stick-footer">
                    <List>
                        <InputItem
                            placeholder='请输入'
                            value={this.state.text}
                            onChange={v=>{
                                this.setState({text:v})
                            }}
                            extra={<span onClick={()=>this.handleSubmit()}>发送</span>}
                        ></InputItem>
                    </List>
                </div>
            </div>
        )
    }
}

export default Chat