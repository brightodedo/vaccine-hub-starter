import * as React from "react"
import './Cancel.css'
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import MedicalResearch from "../MedicalResearch/MedicalResearch"


export default function Cancel({appState, setAppState}){
    const navigate = useNavigate()
    const [isCancelLoading, setIsCancelLoading] = useState(false)

    const handleCancelYesSubmit = async () => {
        setIsCancelLoading(true)

        try{
            const res = await axios.post("http://localhost:3001/auth/cancel", {
        email: appState.user.email,
      })
      if (res?.data?.user) {
        setIsCancelLoading(false)
        setAppState({})
        navigate("/")
      } else {
        setIsCancelLoading(false)
      }
        }
        catch(err){
            console.log(err)
            setIsCancelLoading(false)
        }
    }

    const handleCancelNoSubmit = async () => {
        navigate("/portal")
    }

    return(
        <div className="Update">
        <div className="media">
          <MedicalResearch width={555} />
        </div>
        <div className="card">
          <h2>Cancel your Vaccine information</h2>
  
          <div className="form">  
            <br /> 
            <button className="btn" onClick={handleCancelYesSubmit}>
              yes
            </button>
            <button className="btn"  onClick={handleCancelNoSubmit}>
              No
            </button>
          </div>

        </div>
      </div>
    )
}