import { Avatar } from '@material-ui/core';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link,useHistory } from 'react-router-dom';
import moment from 'moment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { STATUS } from '../../redux/actions/profileActions';
import {deletePost} from '../../redux/actions/postActions';
import {BASE_URL} from '../../utils/config';

function CardHeader({ post }) {
    const {auth,theme,socket}=useSelector(state=>state);
    const dispatch = useDispatch();
    const history=useHistory();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClose = () => {
        setAnchorEl(null);
      };
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleEditPost=()=>{
      dispatch({type:STATUS,payload:{...post,onEdit:true}});
    }

    const handledeletePost=()=>{
      if(window.confirm("Are you sure want you want to delete this post")){
        dispatch(deletePost({post,auth,socket}));
        return history.push("/");
      }
    }

    const handleCopyUrl=()=>{
      navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`);
    }
    
    return (
        <div className="card_header position-relative">
            <div className="d-flex card_header_username">
                <Avatar src={post.user.avatar} className="post_avatar" style={{filter: theme ? 'invert(1)' : 'invert(0)'}}/>
                <div className="card_name">
                    <h6 className="m-0" style={{fontFamily: 'Roboto',fontSize:'18px'}}>
                        <Link to={`/profile/${post.user._id}`} className="text-dark">{post.user.username}</Link>
                    </h6>
                    <span className="text-muted">
                        {moment(post.createdAt).fromNow()}
                    </span>
                </div>
            </div>
       
       {auth.user._id === post.user._id ?
       <>
       {/* <Avatar aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} alt="Remy Sharp" src={post.user.avatar} className="avatar"  /> */}
       <MoreHorizIcon aria-controls="simple-menu" onClick={handleClick} className="post_card_dots"/>
            <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} ><CreateIcon onClick={handleEditPost}/> Edit Post</MenuItem>
            <MenuItem onClick={handleClose}><DeleteIcon onClick={handledeletePost}/> Delete Post</MenuItem>
            <MenuItem onClick={handleClose}><FileCopyIcon/>  Copy URL</MenuItem>
          </Menu>
       </> :
       <>
       <MoreHorizIcon aria-controls="simple-menu" onClick={handleClick}/>
            <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}><FileCopyIcon onClick={handleCopyUrl}/>  Copy URL</MenuItem>
          </Menu>
          </>
         }
        
        
        </div>
    )
}

export default CardHeader
