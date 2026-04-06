import React from 'react';
import './LoginPage.css';
import LoginForm from './LoginForm';

const LoginPage: React.FC = () => {
    return (
        <div className="login-page">
            <div className="login-left"
                style={{
                    backgroundImage: "url('/images/wood-texture.jpg')",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left"
                }}
            />
            <div className="login-right">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;