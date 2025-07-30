import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">              
                <div className="footer-section">
                    <h4>Support</h4>
                    <ul>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Kathmandu, Nepal</p>
                    <p>Email: sajilo@gamil.com</p>
                    <p>Phone: +977-9803009626</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
