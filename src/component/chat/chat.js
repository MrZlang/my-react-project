import React from 'react'
import { List, InputItem, NavBar, Icon, Grid } from 'antd-mobile';
import io from 'socket.io-client'
import { connect } from 'react-redux'
import { getMsgList, sendMsg, recvmsg, readMsg } from '../../redux/chat.redux'
import { getChatId } from '../../util'
const socket = io('ws://localhost:9999')

@connect(
    state=>state,
    { getMsgList, sendMsg, recvmsg, readMsg }
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
        //刷新聊天页面数据
        if(!this.props.chat.chatmsg.length){
            this.props.getMsgList()
            this.props.recvmsg()
        }
        // 测试
        //on监听
        // socket.on('recvmsg',(data)=>{
        //     this.setState({
        //         msg: [...this.state.msg,data.text]
        //     })
        // })
    }
    componentWillUnmount(){
        const to = this.props.match.params.user
        this.props.readMsg(to)
    }
    //girl跑马灯效果bug解决
    fixCarousel(){
        setTimeout(function(){
			window.dispatchEvent(new Event('resize'))
		},0)
    }
    handleSubmit(){
        // socket.emit('sendmsg',{text:this.state.text})
        const from = this.props.user._id
        const to = this.props.match.params.user
        const msg = this.state.text
        this.props.sendMsg({from,to,msg})
        this.setState({
            text: '',
            showEmoji: false
        })
    }
    render(){
        const emoji = '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐 😷 🤒 🤕 😈 👿 👹 👺 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👐 🙌 👏 🙏 👍 👎 👊 ✊ 🤘 👌 👈 👉 👆 👇 ✋  🖐 🖖 👋  💪 🖕 ✍️  💅 🖖 💄 💋 👄 👅 👂 👃 👁 👀 '
										.split(' ')
										.filter(v=>v)
										.map(v=>({text:v}))
        const userid = this.props.match.params.user
        const Item = List.Item
        const users = this.props.chat.users
        if(!users[userid]){
            return null
        }
        const chatid = getChatId(userid,this.props.user._id)
        //通过chatid过滤信息
        const chatmsgs = this.props.chat.chatmsg.filter(v=>v.chatid===chatid)
        return(
            <div id='chat-page'>
                <NavBar
                    icon={<Icon type="left" />}
                    mode='dark'
                    onLeftClick={()=>{
                        this.props.history.goBack()
                    }}
                >
                    {users[userid].name}
                </NavBar>
                {chatmsgs.map(v=>{
                    const avatar = require(`../img/${users[v.from].avatar}.png`)
                    return v.from===userid?
                    (<List 
                        key={v._id}>
                        <Item
                            thumb={avatar}
                        >{v.content}</Item>
                    </List>):
                    (<List key={v._id}>
                        <Item
                            extra={<img src={avatar} alt=''/>}
                            className='chat-me'
                        >{v.content}</Item>
                    </List>)
                })}
                <div className="stick-footer">
                    <List>
                        <InputItem
                            placeholder='请输入'
                            value={this.state.text}
                            onChange={v=>{
                                this.setState({text:v})
                            }}
                            extra={
                                <div style={{padding:5}}>
                                    <span 
                                        style={{marginRight:20}}
                                        onClick={()=>{
                                            this.setState({
                                                showEmoji : !this.state.showEmoji
                                            })
                                            this.fixCarousel()
                                        }}
                                    >😀</span>
                                    <span onClick={()=>this.handleSubmit()}>发送</span>
                                </div>
                                
                            }
                        ></InputItem>
                    </List>
                    {this.state.showEmoji?<Grid
                        data={emoji}
                        columnNum={9}
                        carouselMaxRow={4}
                        isCarousel={true}
                        onClick={el=>{
                            this.setState({
                                text: this.state.text + el.text
                            })
                        }}
                    />:null}
                </div>
            </div>
        )
    }
}

export default Chat