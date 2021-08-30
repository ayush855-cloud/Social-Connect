import { Avatar } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/profile.css';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import CallIcon from '@material-ui/icons/Call';
import CameraFrontIcon from '@material-ui/icons/CameraFront';

import { Link } from 'react-router-dom';

function MessageSearchCard({ user, children, msg }) {
  const { theme } = useSelector(state => state);

  const showMsg = (user) => {
    return (
      <>
        <div>
          {
            user.text.length > 25 ? user.text.slice(0, 24) + "..." : user.text
          }
        </div>
        {
          user.media.length > 0 && <div>
            {user.media.length} <i className="fas fa-image" />
          </div>
        }
        {
          user.call &&
          <span className="material_icon">
            {
              user.call.times === 0 ?
                user.call.video ? <VideocamOffIcon /> : <PhoneDisabledIcon />
                : user.call.video ? <CameraFrontIcon /> : <CallIcon />
            }
          </span>
        }
      </>
    )
  }

  return (
    <div className={`d-flex align-items-center justify-content-between pt-2 w-100`}>
      <div className="d-flex align-items-center">
        <Avatar src={user.avatar} size="big-avatar" className="avatar_style" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />

        <Link to={`profile/${user._id}`} style={{ textDecoration: 'none' }}>
          <div className="d-flex flex-column mr-4" style={{ color: 'black' }}>
            <span className="d-block" style={{ fontWeight: '600', fontSize: '1.15rem' }}>{user.username}</span>

            <span style={{ opacity: 0.7, filter: theme ? 'invert(1)' : 'invert(0)', color: theme ? 'white' : '',fontSize:'1rem' }}>
              {
                msg ?
                  showMsg(user) : user.fullname
              }

            </span>

          </div>
        </Link>
      </div>
      {children}
    </div>
  )
}

export default MessageSearchCard
