import React, { useEffect, useState } from "react";
import "./../css/addassignment.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

function AddAssignment() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adminId, setAdminId] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [adminList, setAdminList] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.role === "admin") {
      navigate("/");
    }

    const fetchAllAdmin = async () => {
      const config = {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      };
      try {
        const res = await axios.get(`${BASE_URL + "/admins"}`, config);
        if (res?.data?.data) {
          setAdminList(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch admins");
      }
    };

    fetchAllAdmin();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !adminId) {
      toast.error("All fields are mandatory");
      return;
    }
    const config = {
      headers: {
        authorization: `Bearer ${user?.accessToken}`,
      },
    };

    try {
      const addedFlight = await axios.post(
        `${BASE_URL + "/upload"}`,
        {
          title,
          description,
          adminId,
        },
        config
      );

      setTitle("");
      setDescription("");
      setAdminId(null);

      if (addedFlight) {
        toast.success("Assignment added successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="add-flight-container">
      <h2>Add Assignment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Select Admin</label>
          <select
            value={adminId || ""}
            onChange={(e) => setAdminId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select an admin
            </option>
            {adminList.map((admin) => (
              <option key={admin._id} value={admin._id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>
        <div className="button-group">
          <button className="submit-btn" type="submit">
            <FiUpload /> Upload Assignment
          </button>
          <button
            className="cancel-btn"
            onClick={() => {
              navigate("/");
            }}
            type="button"
          >
            <IoArrowBack />
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAssignment;
