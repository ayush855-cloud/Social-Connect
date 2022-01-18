import { Switch } from '@material-ui/core';
import React, { useState, useEffect,useRef } from 'react';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { useSelector, useDispatch } from 'react-redux';
import ImageIcon from '@material-ui/icons/Image';
import { STATUS } from '../redux/actions/profileActions';
import '../styles/status_modal.css';
import { TYPE } from '../redux/actions/notifyActions';
import { createPost, updatePost } from '../redux/actions/postActions';
import Icons from '../components/Icons';


function StatusModal() {
    const { auth, theme,status,socket } = useSelector(state => state);
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [stream, setStream] = useState(false);
    const videoRef = useRef();
    const refCanvas = useRef();
    const [tracks, setTracks] = useState('');
    const [state, setState] = useState({
        checkedA: true,
        checkedB: true,
    });
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };
    const handleChangeImages = (e) => {
        const files = [...e.target.files];
        let err = "";
        let newImages = [];
        files.forEach(file => {

            if (!file) return err = "File dos not exist"
            if (file.size > 1024 * 1024 * 5) {
                return err = "The image largest is 5mb"
            }
            return newImages.push(file);
        })
        if (err) dispatch({ type: TYPE.NOTIFY, payload: { error: err } })

        setImages([...images, ...newImages]);

    }
    const deleteImage = (index) => {
        const newArr = [...images];
        newArr.splice(index, 1);
        setImages(newArr);
    }
    const handleStream = () => {
        setStream(true);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(mediaStream => {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play();
                    const track = mediaStream.getTracks();
                    setTracks([track[0]])
                }).catch(err => console.log(err))
        }
    }
    const handleCapture=()=>{
        const width=videoRef.current.clientWidth;
        const height=videoRef.current.clientHeight;
        refCanvas.current.setAttribute("width",width);
        refCanvas.current.setAttribute("height",height);
        const ctx=refCanvas.current.getContext('2d');
        ctx.drawImage(videoRef.current,0,0,width,height);
        let URL=refCanvas.current.toDataURL();
        setImages([...images,{camera:URL}]);
    }

    const handleStopStream=()=>{
        // tracks.stop();
        setStream(false);
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        
        if(images.length===0)
        return dispatch({type:TYPE.NOTIFY,payload:{error:"Please add your photo."}});
        if(status.onEdit){
            await dispatch(updatePost({content,images,auth,status}));
        }
        else{
                dispatch(createPost({content,images,auth,socket}));

        }
        setContent('');
        setImages([]);      
        dispatch({type:STATUS,payload:false});
    }
    useEffect(()=>{
      if(status.onEdit){
          setContent(status.content);
          setImages(status.images);
      }
    },[status])
    return (
        <div className="status_modal">
            <form onSubmit={handleSubmit}>
                <div className="status_header">
                    <h5 className="m-0 status_heading">Create Post</h5>
                    <span><Switch
                        onClick={() => dispatch({ type: STATUS, payload: false })}
                        color="primary"
                        className="status_switch"
                        checked={state.checkedA}
                        onChange={handleChange}
                        name="checkedA"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        style={{filter:theme?'invert(1)':'invert(0)'}}
                    /></span>
                </div>
                <div className="status_body">
                    <textarea name="content" value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder={`${auth.user.username}, what are you thinking?`}
                        style={{filter: theme? 'invert(1)': 'invert(0)',
            color:theme? 'white' :'#111',
            background: theme ? 'rgba(0,0,0,.03)' : '',
            }}
                    />
                </div>
                
                    <div className="mt-2">
                        <Icons setContent={setContent} content={content} theme={theme}/>
                    </div>
                
                <div className="show_images">
                    {images.map((img, index) => (
                        <div key={index} id="file_img">
                            <img src={img.camera? img.camera : img.url ? img.url : URL.createObjectURL(img)} alt="images" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} className="img-thumbnail rounded" />
                            <span onClick={() => deleteImage(index)}>&times;</span>
                        </div>

                    ))}
                </div>

                {
                    stream &&
                    <div className="stream position-relative">
                        <video autoPlay muted width="100%" height="100%" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} ref={videoRef}></video>
                        <span onClick={handleStopStream}>&times;</span>
                        <canvas ref={refCanvas} style={{display:'none'}} />
                    </div>
                }

                <div className="input_images">
                {
                    stream ? <CameraAltIcon className="camera" onClick={handleCapture} />:
                    <>
                    <CameraAltIcon className="camera" onClick={handleStream} />
                    <div className="file_upload">
                        <ImageIcon className="images" />
                        <input type="file" name="file" id="file" multiple accept="image/*" onChange={handleChangeImages} />
                    </div>
                    </>
                }
                    
                </div>

                <div className="status_footer">
                    <button className="btn btn-secondary status_button" type="submit" style={{filter:theme?'invert(1)':'invert(0)'}}
                   >Post</button>
                </div>
            </form>
        </div>
    )
}

export default StatusModal
