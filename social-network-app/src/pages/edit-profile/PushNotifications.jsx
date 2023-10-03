import React, { useEffect, useState } from 'react'
import { useLazyGetNotificationStatusQuery, useUpdateCommentStatusMutation, useUpdateLikeStatusMutation, useUpdateNewFollowerStatusMutation } from '../../app/services/notification.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { data } from 'jquery';
import Loading3dot from '../../components/loading/Loading3dot';

function PushNotifications() {
    const [status, setStatus] = useState(null);
    const [getStatus] = useLazyGetNotificationStatusQuery();
    const [updateLikeStatus] = useUpdateLikeStatusMutation();
    const [updateCommentStatus] = useUpdateCommentStatusMutation();
    const [updateFollowStatus] = useUpdateNewFollowerStatusMutation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleUpdateLikeStatus = () => {
        updateLikeStatus().unwrap() 
        .then((data) => {
            setStatus(data);
        })
        .catch(() => {
            toast.error("Try again!!!");
        });
    }
    const handleUpdateCommentStatus = () => {
        updateCommentStatus().unwrap()
        .then((data) => {
            setStatus(data);
        })
        .catch(() => {
            toast.error("Try again!!!");
        });
    }

    const handleUpdateFollowStatus = () => {
       updateFollowStatus().unwrap()
        .then((data) => {
            setStatus(data);
        })
        .catch(() => {
            toast.error("Try again!!!");
        });
    }

    useEffect(() => {
        setLoading(true);
        getStatus().unwrap()
        .then((data) => {
            setStatus(data);
        })
        .catch((err) => {
            console.log(err);
            navigate("/edit-profile");
        })
        .finally(() => {
            setLoading(false);
        });
    },[])

    if(loading) {
        return (<>
        <Loading3dot/>
        </>)
    }
  return (
    <>
        <div className='d-flex flex-column pe-3'>
            <h3>Push Notifications</h3>
            <div className='d-grid px-3' style={{backgroundColor:"#f3f3f3"}}>
            <div className='mt-2 d-flex'>
                <span>Likes</span>
                <div class="form-check form-switch d-flex ms-auto">
                    {/* <label classname="form-check-label">Pause all</label> */}
                    <input className="form-check-input" type="checkbox" role="switch" onChange={handleUpdateLikeStatus}
                     checked={status?.onLikes}/>                  
                </div>
                <hr />
            </div>
            <div className='mt-2 d-flex'>
                <span>Comments</span>
                <div class="form-check form-switch d-flex ms-auto">
                    {/* <label classname="form-check-label">Pause all</label> */}
                    <input className="form-check-input" type="checkbox" role="switch" onChange={handleUpdateCommentStatus}
                    checked={status?.onComments}/>                  
                </div>
                <hr />
            </div>
            <div className='mt-2 d-flex'>
                <span>New followers</span>
                <div class="form-check form-switch d-flex ms-auto">
                    {/* <label classname="form-check-label">Pause all</label> */}
                    <input className="form-check-input" type="checkbox" role="switch" onChange={handleUpdateFollowStatus}
                    checked={status?.onNewFollower}/>                  
                </div>
                <hr />
            </div>
            </div>          
        </div>
    </>
  )
}

export default PushNotifications