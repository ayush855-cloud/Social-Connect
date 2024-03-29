import React, { useState, useEffect, useRef } from 'react'
import { useParams,useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import RightCard from '../RightCard';
import MsgDisplay from '../MsgDisplay';
import { TYPE } from '../../redux/actions/notifyActions';
import { imageShow, videoShow } from '../../utils/mediaShow';
import Icons from '../Icons';
import { imageUpload } from '../../utils/imageUpload.';
// import { imageUpload } from "../../utils/imageUpload";
import { addMessage, deleteConversation, getMessages,loadMoreMessages } from '../../redux/actions/messageAction';
import Loading from '../Loading';
import { CALL } from '../../redux/type/globalType';

function RightSide() {
    const history=useHistory();
    const [user, setUser] = useState([]);
    const [text, setText] = useState('');
    const [media, setMedia] = useState([]);
    const [loadMedia, setLoadMedia] = useState(false);
    const refDisplay = useRef();
    const pageEnd = useRef();
    
    const [data,setData]=useState([]);
    const [result,setResult]=useState(9);
    const [page, setPage] = useState(0);
    const [isLoadMore,setisLoadMore]=useState(0);
    const { id } = useParams();
    const { auth, message, theme, socket,peer } = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(()=>{
         const newData=message.data.find(item=>item._id === id)
         if(newData){
            setData(newData.messages);
            setResult(newData.result);
            setPage(newData.page)
         }
        
         
    },[message.data,id])

    useEffect(() => {
        if(id && message.users.length>0){
            setTimeout(()=>{
                refDisplay.current.scrollIntoView({
                    behavior: 'smooth', block: 'end'
                })
            },50)
            const newUser = message.users.find(user => user._id === id);
            if (newUser) {
                setUser(newUser);
            }
        }
    }, [message.users, id])
    const handleChangeMedia = (e) => {
        const files = [...e.target.files];
        let err = "";
        let newMedia = [];
        files.forEach(file => {

            if (!file) return err = "File dos not exist"
            if (file.size > 1024 * 1024 * 5) {
                return err = "The image largest is 5mb"
            }
            return newMedia.push(file);
        })
        if (err) dispatch({ type: TYPE.NOTIFY, payload: { error: err } })

        setMedia([...media, ...newMedia]);
    }

    const handleDeleteMedia = (index) => {
        const newArr = [...media];
        newArr.splice(index, 1);
        setMedia(newArr);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() && media.length === 0) return;

        setText('');
        setMedia([]);
        setLoadMedia(true);


        let newArr = [];
        if (media.length > 0) newArr = await imageUpload(media)

        const msg = {
            sender: auth.user._id,
            recipient: id,
            text,
            media: newArr,
            createdAt: new Date().toISOString()
        }


        setLoadMedia(false);
        await dispatch(addMessage({ msg, auth, socket }))
        if (refDisplay.current) {
            refDisplay.current.scrollIntoView({
                behavior: 'smooth', block: 'end'
            })
        }

    }

    useEffect(() => {
            const getMessagesData = async () => {    
               if(message.data.every(item=>item._id !== id)){
                await dispatch(getMessages({ auth, id }))
                setTimeout(()=>{
                    refDisplay.current.scrollIntoView({
                        behavior: 'smooth', block: 'end'
                    })
                },50)
               }       
               
            }
            getMessagesData();
        
    }, [id, dispatch, auth,message.data])

    

    // Load More
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setisLoadMore(p => p + 1)
            }
        }, {
            threshold: 0.1
        })
        observer.observe(pageEnd.current)
    }, [setisLoadMore])


    useEffect(()=>{
        if(isLoadMore>1){
            if(result >= page* 9 ){
                dispatch(loadMoreMessages({auth,id,page:page+1}))
                setisLoadMore(1);
            }
        }
    //   eslint-disable-next-line
    },[isLoadMore])

    const handleDeleteConversation=()=>{
        if(window.confirm('Do you want to delete?')){
            dispatch(deleteConversation({auth,id}))
            return history.push('/message');
        }
          
    }

    const caller=({video})=>{
        const {_id,avatar,username,fullname}=user;
        const msg={
            sender:auth.user._id,
            recipient:_id,
            avatar,username,fullname,video

        }
        dispatch({type:CALL,payload:msg})
    }

  
    const callUser=({video})=>{
        const {_id,avatar,username,fullname}=auth.user;
        const msg={
            sender:_id,
            recipient:user._id,
            avatar,username,fullname,video

        }
        if(peer.open) msg.peerId=peer._id
        socket.emit('callUser',msg);
    }

    const handleAudioCall=()=>{
        caller({video:false})
        callUser({video:false});
   }

    const handleVideoCall=()=>{
         caller({video:true})
         callUser({video:true});
    }
    
    return (
        <>
            <div className="message_header" style={{
                filter: theme ? 'invert(1)' : 'invert(0)',cursor:'pointer'
            }}>
                {
                    user.length !== 0 &&
                    <RightCard user={user} >
                      <div>
                        <i className="fas fa-phone-alt" 
                            onClick={handleAudioCall}
                        />
                        <i className="fas fa-video mx-3" 
                             onClick={handleVideoCall}
                        />
                        <i className="fas fa-trash" 
                            onClick={handleDeleteConversation}
                        />
                        </div>
                    </RightCard>
                }

            </div>

            <div className={`chat_container ${media.length > 0 && "chat_input_visible"}`} style={{ height: media.length > 0 ? 'calc(100vh - 297px)' : '' }}>
                <div className="chat_display" ref={refDisplay}>
                    <button style={{ marginTop: '-25px',opacity:'0' }} ref={pageEnd}>Load more</button>
                    {
                        data.map((msg, index) => (

                            <div key={index}>
                                {
                                    msg.sender !== auth.user._id &&
                                    <div className="chat_row other_message">
                                        <MsgDisplay user={user} msg={msg} theme={theme} />
                                    </div>
                                }
                                {
                                    msg.sender === auth.user._id &&
                                    <div className="chat_row my_message">
                                        <MsgDisplay user={auth.user} msg={msg} theme={theme} data={data}/>
                                    </div>
                                }
                            </div>
                        ))
                    }

                    {
                        loadMedia &&
                        <Loading />
                    }
                </div>
            </div>

            <div className="show_media" style={{ display: media.length === 0 ? 'none' : 'grid' }}>
                {
                    media.map((item, index) => (
                        <div key={index} id="file_media">
                            {
                                item.type.match(/video/i) ?
                                    videoShow(URL.createObjectURL(item), theme)
                                    : imageShow(URL.createObjectURL(item), theme)
                            }
                            <span onClick={() => handleDeleteMedia(index)}>&times;</span>
                        </div>
                    ))
                }

            </div>

            <form className="chat_input" onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter you message.." value={text} onChange={(e) => setText(e.target.value)}
                    style={{
                        filter: theme ? 'invert(1)' : 'invert(0)',
                        color: theme ? 'white' : '#111',
                        background: theme ? 'rgba(0,0,0,.03)' : '',
                    }}
                />

                <Icons setContent={setText} content={text} theme={theme} />
                <div className="file_upload">
                    <i className="fas fa-image" />
                    <input type="file" name="file" id="file"
                        multiple accept="image/*,video/*" onChange={handleChangeMedia}

                    />
                </div>
                <input type="submit" placeholder="Enter a message..." id="msg_send" />


            </form>
        </>
    )
}

export default RightSide
