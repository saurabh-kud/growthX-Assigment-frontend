import React, { useState } from "react";
import "../css/contactCard.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const AssignmentCard = ({ con }) => {
  const { user } = useSelector((state) => state.auth);
  const [assignmentStatus, setAssignmentStatus] = useState(con?.status);

  const handleAccept = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${user?.accessToken}`,
      },
    };
    try {
      const data = await axios.post(
        `${BASE_URL}/assignments/${con?._id}/accept`,
        {},
        config
      );
      if (data) {
        toast.success("Assignment Accepted");
        setAssignmentStatus("success");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleReject = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${user?.accessToken}`,
      },
    };
    try {
      const data = await axios.post(
        `${BASE_URL}/assignments/${con?._id}/reject`,
        {},
        config
      );
      if (data) {
        toast.success("Assignment Rejected");
        setAssignmentStatus("failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="card">
      <h3>Title: {con.title}</h3>
      <small>Description: {con?.description}</small>
      <h5>Status: {assignmentStatus}</h5>
      {user?.role === "admin" ? (
        <div>
          <h5>User: {con?.userId?.name}</h5>
          {assignmentStatus === "pending" && (
            <div className="flex">
              <button className="accept" onClick={handleAccept}>
                <FaCheckCircle /> Accept
              </button>
              <button className="reject" onClick={handleReject}>
                <FaTimesCircle /> Reject
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h5>Assigned to: {con?.adminId?.name}</h5>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
