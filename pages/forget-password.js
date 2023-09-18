"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/layout/Layout";
import OtpInput from "react18-input-otp";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
function ForgetPassword() {

    const router = useRouter();
    const [sendOTP, setSendOTP] = useState(false);
    const [codeOTP, setCodeOTP] = useState('');
    const [credentials, setCredentials] = useState('');
    const [isConfirmed, setIsConfirmed] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [countdown, setCountdown] = useState(120);


    const handleCredentials = (e) => {
        setCredentials(e.target.value);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (credentials) {
            try {
                // Make an API call to send OTP
                const response = await axios.post("/api/forgot-password", { email: credentials });
                console.log(response);
                if (response.status === 200) {
                    toast.success(`OTP Sent to "${credentials}"`, { autoClose: 3000 });
                    setSendOTP(true);
                    setCountdown(10);
                    setIsDisabled(true);
                } else if (response.status === 400) {
                    toast.error("User not found", { autoClose: 3000 });
                }

                else {
                    toast.error("Failed to send OTP", { autoClose: 3000 });
                }
            } catch (error) {
                if (error.response.status === 400) {
                    toast.error("User not found", { autoClose: 3000 });
                }
                else
                    toast.error("Failed to send OTP", { autoClose: 3000 });
            }
        } else {
            toast.error("Please Enter Email", { autoClose: 3000 });
        }
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

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        console.log(credentials, codeOTP, password)
        try {
            // Make an API call to verify OTP and reset password
            const response = await axios.post("/api/reset-password", {
                email: credentials,
                otp: codeOTP,
                newPassword: password,
            });

            if (response.status === 200) {
                toast.success("Password Reset Successful", { autoClose: 3000 });
                router.push("/page-login");
                // Redirect the user to the login page or home page as needed
            } else if (response.status === 400) {
                toast.error(response.data.error, { autoClose: 3000 })
            }
            else {
                toast.error("Failed to reset password", { autoClose: 3000 });
            }
        } catch (error) {
            toast.error("Failed to reset password", { autoClose: 3000 });
        }
    };


    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            setIsDisabled(false);
        }
    }, [countdown]);

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

                                                <button onClick={handleSendOTP} className="btn btn-heading btn-block" disabled={isDisabled}>
                                                    {isDisabled ? 'Send OTP' : 'Send OTP'}
                                                </button>
                                                {isDisabled && <p> {`Resend OTP in ${countdown} seconds`} </p>}
                                                <br />
                                                <br />

                                                <label>New Password: *</label>
                                                <input
                                                    type="password"
                                                    required=""
                                                    name="email"
                                                    className="mb-20"
                                                    placeholder=""
                                                    onChange={handlePasswordChange}
                                                    value={password} />

                                                <label>Confirm Password: *</label>
                                                <input
                                                    type="password"
                                                    required=""
                                                    name="email"
                                                    placeholder=""
                                                    onChange={handleConfirmPassword}
                                                    value={confirmPassword} />
                                                {isConfirmed ? (
                                                    <p className="text-success">Password Matched</p>
                                                ) : (
                                                    <p className="text-danger">Password must match</p>
                                                )}
                                                <div className="form-group">
                                                    <br />
                                                    <button type="submit" className="btn btn-heading btn-block" onClick={handleVerifyOTP} >
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

export default ForgetPassword;
