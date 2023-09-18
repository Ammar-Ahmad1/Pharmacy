"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/layout/Layout";
import OtpInput from "react18-input-otp";
import { toast } from "react-toastify";

function Login() {

    const [sendOTP, setSendOTP] = useState(false);
    const [codeOTP, setCodeOTP] = useState('');
    const [credentials, setCredentials] = useState('');
    const [isConfirmed, setIsConfirmed] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleCredentials = (e) => {
        setCredentials(e.target.value);
    };

    const handleSendOTP = (e) => {
        e.preventDefault();

        if (credentials) {
            toast.success(`OTP Sent to "${credentials}"`, { autoClose: 3000 })
            setTimeout(() => {
                setSendOTP(true);
            }, 2000);
            return;
        }
        toast.error('Please Enter Email', { autoClose: 3000 });
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setIsConfirmed(newPassword === confirmPassword);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        setIsConfirmed(password === e.target.value);
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();



        if (codeOTP === 111111) {
            toast.success('OTP Verified', { autoClose: 3000 });
            return;
        }
        toast.error('Please Enter Corrent OTP', { autoClose: 3000 });
    }
    return (
        <>
            <Layout parent="Home" sub="Pages" subChild="Login & Register">
                <div className="page-content pt-100 pb-100">
                    <div className="container">
                        <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                            <div className="col-lg-6 col-md-8">
                                <div className="login_wrap widget-taber-content background-white">
                                    <div className="padding_eight_all bg-white">
                                        <div className="heading_s1">
                                            <h1 className="mb-30">Forget Password</h1>
                                        </div>
                                        <form method="post">
                                            {!sendOTP && <div className="form-group">
                                                <label>Email: *</label>
                                                <input
                                                    type="email"
                                                    required=""
                                                    name="email"
                                                    placeholder="Email"
                                                    onChange={handleCredentials}
                                                    value={credentials} />
                                                <div className="form-group">
                                                    <br />
                                                    <button type="submit" className="btn btn-heading btn-block" name="sendOTP" onClick={handleSendOTP} >
                                                        Send Code
                                                    </button>
                                                </div>
                                            </div>}
                                            {sendOTP && <div className="form-group">
                                                <label>Enter OTP Code *</label>
                                                <OtpInput
                                                    value={codeOTP}
                                                    onChange={setCodeOTP}
                                                    numInputs={6}
                                                    inputStyle={{
                                                        padding: "4px",
                                                        width: "48px",
                                                        margin: "0 4px 40px",
                                                    }}
                                                    renderInput={(props) => (
                                                        <input {...props} />
                                                    )}
                                                    isInputNum
                                                />

                                                <label>New Password: *</label>
                                                <input
                                                    type="password"
                                                    required=""
                                                    name="email"
                                                    className="mb-20"
                                                    placeholder="Email/Phone Number"
                                                    onChange={handlePasswordChange}
                                                    value={password} />

                                                <label>Confirm Password: *</label>
                                                <input
                                                    type="text"
                                                    required=""
                                                    name="email"
                                                    placeholder="Email/Phone Number"
                                                    onChange={handleConfirmPassword}
                                                    value={confirmPassword} />
                                                {isConfirmed ? (
                                                    <p className="text-success">Password Matched</p>
                                                ) : (
                                                    <p className="text-danger">Password must match</p>
                                                )}
                                                <div className="form-group">
                                                    <br />
                                                    <button type="submit" className="btn btn-heading btn-block" name="verifyOTP" >
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Login;
