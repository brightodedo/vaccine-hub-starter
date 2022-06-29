import { Link, useNavigate } from "react-router-dom"
import moment from "moment"
import medicalCare from "../../assets/undraw_medical_care_deep_blue.svg"

import "./Portal.css"

export default function Portal({ user, setAppState }) {
  const navigate = useNavigate()
  const isAuthenticated = Boolean(user?.email)
  const date = new Date(user?.date)

  const handleOnLogout = () => {
    setAppState({})
    navigate("/")
  }


  const title = isAuthenticated ? "Appointment Confirmed" : "Please login to the portal to see your appointment."

  const content = isAuthenticated ? (
    <>
      <p className="appt">Your appointment is on {date.toDateString()}</p>
      <p className="location">
        Please head to <strong>{user.location}</strong> on that day.
      </p>
    </>
  ) : (
    <p className="appt">Thank you!</p>
  )

  const button = isAuthenticated ? (
    <button className="btn primary" onClick={handleOnLogout}>
      Logout
    </button>
  ) : (
    <Link to="/login">
      <button className="btn primary">Login</button>
    </Link>
  )

  const updateBtn = isAuthenticated ? (
    <Link to="/portal/update">
    <button className="btn primary">
      Update
    </button></Link>
  ) : (
    null
  )

  const cancelBtn = isAuthenticated ? (
    <Link to="/portal/cancel">
    <button className="btn primary" >
      Cancel
    </button></Link>
  ) : (
    null
  )

  return (
    <div className="Portal">
      <div className="content">
        {isAuthenticated ? <h1>Welcome, {user.first_name}!</h1> : null}

        <div className="card">
          <div className="header">
            <div className={`title ${isAuthenticated ? "green" : ""}`}>{title}</div>
          </div>
          <div className="content">{content}</div>
          <div className="footer">{button}</div>
          <div className="footer">{updateBtn}</div>
          <div className="footer">{cancelBtn}</div>
        </div>
      </div>

      <div className="media">
        <img src={medicalCare} alt="medical care" />
      </div>
    </div>
  )
}
