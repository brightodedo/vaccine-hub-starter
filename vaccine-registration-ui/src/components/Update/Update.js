import * as React from 'react'
import './Update.css'
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import MedicalResearch from "../MedicalResearch/MedicalResearch"

const locationOptions = [
    { key: 1, label: "Local Clinic", value: "local clinic" },
    { key: 2, label: "Regional Hospital", value: "regional hospital" },
    { key: 3, label: "Care Center", value: "care center" },
    { key: 4, label: "Department of Health", value: "department of health" },
  ]

export default function Update({setAppState, appState}){
    const navigate = useNavigate()
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)
  const [updateErrors, setUpdateErrors] = useState({})
  const [updateForm, setUpdateForm] = useState({
    date: "",
    location: "Local Clinic",
  })
    
  const handleUpdateOnInputChange = (event) => {
    setUpdateForm((f) => ({ ...f, [event.target.name]: event.target.value }))
  }

  const handleUpdateOnSubmit = async () => {
    setIsUpdateLoading(true)
    setUpdateErrors((e) => ({ ...e, form: null }))


    try {
      const res = await axios.post("http://localhost:3001/auth/update", {
        email: appState.user.email,
        date: updateForm.date,
        location: updateForm.location,
      })
      if (res?.data?.user) {
        setIsUpdateLoading(false)
        navigate("/portal")
      } else {
        setUpdateErrors((e) => ({ ...e, form: "Something went wrong with registration" }))
        setIsUpdateLoading(false)
      }
    } catch (err) {
      console.log(err)
      const message = err?.response?.data?.error?.message
      setUpdateErrors((e) => ({ ...e, form: message ? String(message) : String(err) }))
      setIsUpdateLoading(false)
    }
  }


    return(
        <div className="Update">
        <div className="media">
          <MedicalResearch width={555} />
        </div>
        <div className="card">
          <h2>Update your Vaccine information</h2>
  
          {updateErrors.form && <span className="error">{updateErrors.form}</span>}
          <br />
  
          <div className="form">
            <div className="split-inputs">
              <div className="input-field">
                <label htmlFor="name">Select a date</label>
                <input type="date" name="date" value={updateForm.date} onChange={handleUpdateOnInputChange} />
                {updateErrors.date && <span className="error">{updateErrors.date}</span>}
              </div>
  
              <div className="input-field">
                <label htmlFor="name">Select a location</label>
                <select name="location" onChange={(event) => setUpdateForm((f) => ({ ...f, location: event.target.value }))}>
                  {locationOptions.map((location) => (
                    <option key={location.key} value={location.label}>
                      {location.label}
                    </option>
                  ))}
                </select>
                {updateErrors.location && <span className="error">{updateErrors.location}</span>}
              </div>
            </div>
  
            <br />
  
  
            <button className="btn" disabled={isUpdateLoading} onClick={handleUpdateOnSubmit}>
              {isUpdateLoading ? "Loading..." : "Update"}
            </button>
          </div>

        </div>
      </div>
    )
}