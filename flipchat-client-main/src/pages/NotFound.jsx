import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/")
    }
  return (
    <div className='landing'>
        <div className="not-found">
            <div className="not-found-container">
                <h1 className='not-found-title'>OOPS!</h1>
                <h3 className='not-found-sub-title'>404 - Page Not Found</h3>
                <p className='not-found-para'>The page you are trying to reach is either does not exists or has been removed.</p>
                <button className='btn-primary not-found-btn' onClick={handleGoHome}>Go Home</button>
            </div>
        </div>
    </div>
  )
}

export default NotFound