import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const CreateJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [numOfEmployees, setNumOfEmployees] = useState("");
  const [jobType, setJobType] = useState("");
  const [timing, setTiming] = useState("");
  const [endsIn, setEndsIn] = useState("");

  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [config, setConfig] = useState(null);

  useEffect(() => {
    setConfig({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(`/jobs/${jobId}`, config);
        console.log(res);
        setId(res.data.data.id);
        setTitle(res.data.data.title);
        setDescription(res.data.data.description);
        setSalary(res.data.data.salary);
        setNumOfEmployees(res.data.data.numOfEmployees);
        setJobType(res.data.data.jobType);
        setTiming(res.data.data.timing);
        setEndsIn(res.data.data.endsIn);
      } catch (err) {
        console.log(err);
        if (err.response.data.status === 404) {
          navigate("/jobs");
        }
      }
    };
    config && jobId && fetchData();
  }, [jobId, config]);

  useEffect(() => {
    if (err) {
      toast.error(err, {
        theme: "colored",
      });
      setErr(null);
    }
  }, [err]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      title,
      description,
      salary,
      numOfEmployees,
      jobType,
      timing,
      endsIn,
    };
    try {
      if (id) {
        await Axios.patch(`/admin/jobs/${id}`, data, config);
        toast.success("Job Updated");
      } else {
        await Axios.post("/admin/jobs", data, config);
        setTitle("");
        setDescription("");
        setSalary("");
        setNumOfEmployees("");
        setJobType("");
        setTiming("");
        setEndsIn("");
        toast.success("Job Created");
      }
      window.scrollTo(0, 0);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErr(err.response.data.err);
    }
  };

  return (
    <>
      <ToastContainer theme="colored" />
      <h3>{id ? "Update Job Post" : "Create a Job Post"}</h3>
      <form className="mt-3" onSubmit={handleFormSubmit}>
        <div className="double-input-wrapper mb-3">
          <div className="input-wrapper">
            <label htmlFor="name">Job Title</label>
            <input
              type={"text"}
              className="form-control mt-2 p-2"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="double-input-wrapper mb-3">
          <div className="input-wrapper">
            <label htmlFor="name">Job Description</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              style={{
                backgroundColor: "#fff",
              }}
            />
          </div>
        </div>

        <div className="double-input-wrapper mb-4">
          <div className="input-wrapper">
            <label htmlFor="salary">Salary</label>
            <input
              type={"text"}
              id="salary"
              className="form-control mt-2 p-2"
              value={salary}
              onChange={(e) => {
                setSalary(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="double-input-wrapper mb-4">
          <div className="input-wrapper">
            <label htmlFor="jobType">Job Type</label>
            <input
              type={"text"}
              id="jobType"
              placeholder="On Site / Remote / Hybrid"
              className="form-control mt-2 p-2"
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
              }}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="numOfEmployees">Num of Employees</label>
            <input
              type={"text"}
              id="numOfEmployees"
              className="form-control mt-2 p-2"
              value={numOfEmployees}
              onChange={(e) => {
                setNumOfEmployees(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="double-input-wrapper mb-4">
          <div className="input-wrapper">
            <label htmlFor="timing">Timing</label>
            <input
              type={"text"}
              id="timing"
              placeholder="Full Time / Part Time"
              className="form-control mt-2 p-2"
              value={timing}
              onChange={(e) => {
                setTiming(e.target.value);
              }}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="endsIn">Expiry Date</label>
            <input
              type={"date"}
              id="endsIn"
              className="form-control mt-2 p-2"
              value={endsIn}
              onChange={(e) => {
                setEndsIn(e.target.value);
              }}
            />
          </div>
        </div>

        <button disabled={loading} className="mt-4">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </>
  );
};

export default CreateJob;
