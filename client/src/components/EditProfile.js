import React, { useState, useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import { useSelector, useDispatch } from 'react-redux';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import '../styles/profile.css';
import { checkImage } from '../utils/imageUpload.';
import { TYPE } from '../redux/actions/notifyActions';
import {updateProfileUser} from '../redux/actions/profileActions';
// import { THEME } from '../redux/actions/authActions';


function EditProfile({ setOnEdit }) {
    const initialState = {
        fullname: '',
        mobile: '',
        address: '',
        website: '',
        story: '',
        gender: ''
    }
    const [userData, setUserData] = useState(initialState);
    const { fullname,
        mobile,
        address,
        website,
        story } = userData;
    const dispatch = useDispatch();
    const { auth,theme } = useSelector((state) => state);
    useEffect(()=>{
        setUserData(auth.user)
     },[auth.user])
    const [state, setState] =useState({
        checkedA: true,
        checkedB: true,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const [avatar, setAvatar] = useState('');
 



    const changeAvatar = (e) => {
        const file = e.target.files[0];
        const err = checkImage(file);
        if (err) return dispatch({type:TYPE.NOTIFY,payload:{error:err}});

        setAvatar(file);
        // dispatch({type:THEME,payload:!theme});
    }
    const handleInput = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        dispatch(updateProfileUser({userData,avatar,auth}));
    }
    return (
        <div className="edit__profile">
            <Switch
                onClick={() => setOnEdit(false)}
                className="switch"
                color="primary"
                checked={state.checkedA}
                onChange={handleChange}
                name="checkedA"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            />


            <form onSubmit={handleSubmit}>
                <div className="info__avatar">
                    <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar} alt="avatar" style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />
                    <span >
                        <CameraAltIcon/>
                        <p>Change</p>
                        <input type="file" name="file" id="file_up" accept="image/*" onChange={changeAvatar}/>
                    </span>
                </div>
                <div className="form-group">
                    <label htmlFor="fullname">Full Name</label>
                    <div>
                        <input name="fullname" value={fullname} onChange={handleInput} type="text" className="form-control" id="fullname" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="mobile">Mobile</label>
                    <div>
                        <input name="mobile" value={mobile} onChange={handleInput} type="text" className="form-control" />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <div>
                        <input name="address" value={address} onChange={handleInput} type="text" className="form-control" />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <div>
                        <input name="website" value={website} onChange={handleInput} type="text" className="form-control" />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="story">Story</label>
                    <div>
                        <textarea name="story" value={story} onChange={handleInput} className="form-control" cols="30" rows="4" />
                    </div>
                </div>

                <label htmlFor="gender">Gender</label>
                <div className="input-group-prepend px-0 mb-4">
                    <select name="gender" id="gender" className="custom-select text-capitalize"
                        onChange={handleInput}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>


                </div>
                <button className="btn btn-info w-100" type="submit">Save</button>
            </form>
        </div>
    )
}

export default EditProfile
