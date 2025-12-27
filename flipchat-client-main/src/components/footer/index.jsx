import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import MailIcon from "../../assets/inbox.svg";
import Instagram from "../../assets/instagram.svg";
import twitter from "../../assets/twitter.svg";
import linkedin from "../../assets/linkedin.svg";

const Footer = () => {
    const navigate = useNavigate();

    const handleTerms = () => {
        navigate('/terms-of-service')
    }

    const handlePrivacy = () => {
        navigate('/privacy-policy')
    }

    const handleRefund = () => {
        navigate('/refund-policy')
    }
    return (
        < section id="footer" className="landing-footer" >
            <div className="landing-container">
                <div className="landing-footer-head">
                    <img
                        src={MailIcon}
                        alt="mail icon"
                        className="landing-footer-head-icon"
                    />
                    <h3 className="landing-footer-head-title">Reach Out Today</h3>
                </div>

                <p className="landing-footer-para" on>
                    Flipchat.link is neither associated with nor sponsored by
                    WhatsApp LLC or Meta Platforms, Inc. We offer a service based on
                    WhatsApp’s public API. By using our service, you are accepting
                    our <a className="landing-footer-link" onClick={handleTerms}>terms of service</a>, <a className="landing-footer-link" onClick={handlePrivacy}>privacy policy</a> and <a className="landing-footer-link" onClick={handleRefund}>refund policy</a>
                </p>

                <p className="landing-footer-email">support@flipchat.link</p>
                <div className="landing-footer-social">
                    <Link className="landing-footer-social-item">
                        <img src={Instagram} alt="instagram icon" />
                    </Link>
                    <Link className="landing-footer-social-item">
                        <img src={twitter} alt="twitter icon" />
                    </Link>
                    <Link className="landing-footer-social-item">
                        <img src={linkedin} alt="linkedin icon" />
                    </Link>
                </div>
            </div>
        </section >
    )
}

export default Footer