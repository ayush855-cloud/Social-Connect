import { Avatar } from '@material-ui/core';
import React, { useState, useEffect, useRef,useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CallEndIcon from '@material-ui/icons/CallEnd';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallIcon from '@material-ui/icons/Call';
import '../styles/call_modal.css';
import { CALL } from '../redux/type/globalType';
import { TYPE } from '../redux/actions/notifyActions';
import { addMessage } from '../redux/actions/messageAction';
import RingRing from '../../src/audio/client_src_audio_ringring.mp3'

// client_src_audio_ringring.mp3
function CallModal() {
    const { call, auth, socket, peer,theme } = useSelector(state => state);
    const dispatch = useDispatch();

    const [hours, setHours] = useState(0);
    const [mins, setMins] = useState(0);
    const [seconds, setSecond] = useState(0);
    const [total, setTotal] = useState(0);
    const [answer, setAnswer] = useState(false);
    const youVideo = useRef();
    const otherVideo = useRef();
    const [tracks, setTracks] = useState(null);
    const [newCall,setNewCall]=useState(null);


    useEffect(() => {
        const setTime = () => {
            setTotal(t => t + 1)
            setTimeout(setTime, 1000)
        }
        setTime();
        return () => setTotal(0)
    }, [])

    useEffect(() => {
        setSecond(total % 60);
        setMins(parseInt(total / 60))
        setHours(parseInt(total / 3600))
    }, [total])

    const addCallMessage= useCallback((call,times,disconnect)=>{
        if(call.recipient !== auth.user._id && disconnect){
            const msg={
                sender:call.sender,
                recipient:call.recipient,
                text:'',
                media:[],
                call:{video:call.video,times},
                createdAt:new Date().toISOString()
            }
            dispatch(addMessage({msg,auth,socket}))
        }
        
    },[auth,dispatch,socket])

    const handleEndCall = () => {
        
        tracks && tracks.forEach(track=>track.stop())
        if(newCall) newCall.close()
        let times=answer ? total : 0
        socket.emit('endCall', {...call,times});
        addCallMessage(call,times);
        dispatch({ type: CALL, payload: null });
    }

    useEffect(() => {
        if (answer) {
            setTotal(0);
        }
        else {
            const timer = setTimeout(() => {
                
                socket.emit('endCall', {...call,times:0});
                addCallMessage(call,0);
                dispatch({ type: CALL, payload: null })
            }, 15000)

            return () => clearTimeout(timer);
        }


    }, [dispatch, answer,call,socket,addCallMessage])

    // Stream Call
    const openStream = (video) => {
        const config = { audio: true, video };
        return navigator.mediaDevices.getUserMedia(config);
    }

    const playStream = (tag, stream) => {
        let video = tag;
        video.srcObject = stream;
        video.play();
    }

    const handleAnswer = () => {
        openStream(call.video).then(stream => {
            playStream(youVideo.current, stream)
            const track = stream.getTracks();
            setTracks(track)
            var newCall = peer.call(call.peerId, stream);
            newCall.on('stream', function (remoteStream) {
                playStream(otherVideo.current, remoteStream)
            });

            setAnswer(true)
            setNewCall(newCall)
        })
    }
    useEffect(()=>{
        socket.on('endCallToClient',data=>{
            
            tracks && tracks.forEach(track=>track.stop())
            if(newCall) newCall.close()
            addCallMessage(data,data.times);
        dispatch({type:CALL,payload:null});
        })
     return ()=> socket.off('endCallToClient')
        },[socket,dispatch,tracks,addCallMessage,newCall])


        useEffect(() => {
            peer.on('call', newCall => {
                openStream(call.video).then(stream => {
                    if (youVideo.current) {
                        playStream(youVideo.current, stream)
                    }
                    const track = stream.getTracks();
                    setTracks(track)
                    newCall.answer(stream);
                    newCall.on('stream', function (remoteStream) {
                        if (otherVideo.current) {
                            playStream(otherVideo.current, remoteStream)
                        }

                    });

                    setAnswer(true)
                    setNewCall(newCall)
                })
            })

            return ()=>peer.removeListener('call')
        }, [peer,call.video])

        useEffect(()=>{
              socket.on('callerDisconnect',()=>{
                tracks && tracks.forEach(track=>track.stop())
                if(newCall) newCall.close()
                let times=answer ? total : 0
                addCallMessage(call,times,true);
               
                dispatch({ type: CALL, payload: null });
                dispatch({type:TYPE.NOTIFY,payload:{error:`The ${call.username} disconnect`}})
              })

              return ()=>socket.off('callerDisconnect');
        },[tracks,dispatch,socket,addCallMessage,answer,total,call,newCall])
   
        const playAudio=(newAudio)=>{
            newAudio.play()
        }

        const pauseAudio=(newAudio)=>{
            newAudio.pause();
            newAudio.currentTime = 0
        }

useEffect(()=>{
let newAudio=new Audio(RingRing)
if(answer){
    pauseAudio(newAudio)
}
else{
    playAudio(newAudio)
}
return ()=>pauseAudio(newAudio)
},[answer])

    return (
        <div className="call_modal">
            <div className="call_box" style={{display:(answer && call.video) ? 'none' : 'flex'}}>
                <div className="text-center" style={{ padding: '10px 0px' }}>
                    <Avatar src={call.avatar} className="call_avatar" />
                    <h4>{call.username}</h4>
                    <h6>{call.fullname}</h6>


                    {
                        answer ?
                            <div className="my-3">
                                <span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
                                <span>:</span>
                                <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                                <span>:</span>
                                <span>{seconds.toString().length < 2 ? '0' + seconds : seconds}</span>
                            </div> :
                            <>
                                {
                                    call.video ?
                                        <span>Calling video...</span>
                                        :
                                        <span>Calling audio...</span>
                                }
                            </>
                    }

                    {
                        !answer &&
                        <div className="timer my-3">
                            <span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
                            <span>:</span>
                            <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                            <span>:</span>
                            <span>{seconds.toString().length < 2 ? '0' + seconds : seconds}</span>
                        </div>
                    }
                </div>

                <div className="call_menu">
                    <span onClick={handleEndCall}><CallEndIcon className="call_icon" /></span>
                    {
                        (call.recipient === auth.user._id && !answer) &&
                        <>
                            {
                                call.video ?
                                    <span onClick={handleAnswer}><VideocamIcon className="call_icons" /></span>
                                    : <span onClick={handleAnswer}><CallIcon className="call_icons" /></span>

                            }
                        </>
                    }

                </div>

                
            </div>
            <div className="show_video" style={{
                    opacity:(answer && call.video) ? '1':'0',
                    filter:theme ? 'invert(1)' : 'invert(0)'
                }}>
                    <video ref={youVideo} className="you_video" playsInline muted/>
                    <video ref={otherVideo} className="other_video" playsInline/>

                    <div className="time_video">
                        <span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
                        <span>:</span>
                        <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                        <span>:</span>
                        <span>{seconds.toString().length < 2 ? '0' + seconds : seconds}</span>
                    </div>

                    <span  onClick={handleEndCall}><CallEndIcon className="call_endicon end_call" /></span>
                </div>
        </div>
    )
}

export default CallModal
