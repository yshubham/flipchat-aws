import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import Divider from "../../common/Divider";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";
import { toast, Toaster } from "sonner";
import { SERVER_URL } from "../../../utils/utils";
import Loader from "../../loader";
import EyeClose from "../../../assets/icon_eye_close.svg";
import EyeOpen from "../../../assets/icon_eye_open.svg";

const UpdatePasswordModal = ({ handleClosePassModal, open }) => {

  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useAuthContext();
  const [currentVisiblePass, setCurrentVisiblePass] = useState(false);
  const [visiblePass, setVisiblePass] = useState(false);
  const [confirmVisiblePass, setConfirmVisiblePass] = useState(false);

  const Schema = yup.object().shape({
    currentPassword: yup
      .string()
      .min(6, "invalid password")
      .required("please enter current password"),
    newPassword: yup
      .string()
      .min(6, "password must be of atleast 6 digits")
      .required("please enter new password"),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "passwords must match")
      .required("please confirm the password"),
  });

  const handleSubmit = async (values) => {
    if (formik.errors) {
      formik.validateForm();
    }

    setIsLoading(true)

    let body = {
      id: userDetails?.id,
      password: values?.currentPassword,
      newPassword: values?.newPassword
    }

    try {
      const res = await axios.patch(`${SERVER_URL}api/user/update/password`, { ...body })
      if (res.data) {
        toast.success(res.data?.message)
        handleClosePassModal()
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else if (error?.message) {
        toast.error(error?.message);
      } else {
        toast.error("something went wrong");
      }
    } finally {
      setIsLoading(false)
    }

  };

  const formik = useFormik({
    validationSchema: Schema,
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  const handleCloseModal = () => {
    formik.resetForm()
    handleClosePassModal()
  }

  // handle toggle password visibility 
  const handlePasswordVisibility = () => {
    setVisiblePass(prev => !prev)
  }

  // handle confirm password visibility 
  const handleConfirmPassVisibility = () => {
    setConfirmVisiblePass(prev => !prev)
  }

  // handle current password visibility 
  const handleCurrentPasswordVisibility = () => {
    setCurrentVisiblePass(prev => !prev)
  }


  return (
    <>
      {
        isLoading && <Loader />
      }
      <Toaster richColors position="top-center" duration={2000} />
      <div className={`modal ${open ? "show-modal" : ""}`}>
        <div className="modal-container">
          <div className="modal-body">
            <h3 className="modal-title">Update Password</h3>
            <p className="modal-para">Your password should have atleast 6 characters</p>
            <form method="POST" className="modal-form" onSubmit={formik.handleSubmit}>
              <div className="form-item">
                <div className="form-input-password">
                  <input
                    type={`${currentVisiblePass ? "text" : "password"}`}
                    name="currentPassword"
                    id="currentPassword"
                    placeholder="Enter current password"
                    className="form-input form-item-input-flex"
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    required
                  />
                  <img src={currentVisiblePass ? EyeOpen : EyeClose} className="form-input-eye-icon" onClick={handleCurrentPasswordVisibility} />
                </div>
                {formik.errors.currentPassword && (
                  <p className="auth-error">{formik.errors.currentPassword}</p>
                )}
              </div>
              <Divider />
              <div className="form-item">
                <div className="form-input-password">
                  <input
                    type={`${visiblePass ? "text" : "password"}`}
                    name="newPassword"
                    id="newPassword"
                    placeholder="Enter new password"
                    className="form-input form-item-input-flex"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    required
                  />
                  <img src={visiblePass ? EyeOpen : EyeClose} className="form-input-eye-icon" onClick={handlePasswordVisibility} />
                </div>
                {formik.errors.currentPassword && (
                  <p className="auth-error">{formik.errors.newPassword}</p>
                )}
              </div>
              <div className="form-item">
                <div className="form-input-password">
                  <input
                    type={`${confirmVisiblePass ? "text" : "password"}`}
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    placeholder="Enter confirm password"
                    className="form-input form-item-input-flex"
                    value={formik.values.confirmNewPassword}
                    onChange={formik.handleChange}
                    required
                  />
                  <img src={confirmVisiblePass ? EyeOpen : EyeClose} className="form-input-eye-icon" onClick={handleConfirmPassVisibility} />
                </div>
                {formik.errors.confirmNewPassword && (
                  <p className="auth-error">{formik.errors.confirmNewPassword}</p>
                )}
              </div>

              <button type="submit" className="auth-form-cta btn-primary">
                Update Password
              </button>
              <button type="submit" className="auth-form-cta btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePasswordModal;
