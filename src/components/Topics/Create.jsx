import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";

const CreateTopic = () => {
  const [name, setName] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const { topicId } = useParams();
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
        const res = await Axios.get(`/topics/${topicId}`);
        setId(res.data.data.id);
        setName(res.data.data.name);
      } catch (err) {
        console.log(err);
        if (err.response.data.status === 404) {
          navigate("/topics");
        }
      }
    };
    topicId && fetchData();
  }, [topicId]);

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
    const data = { name };
    try {
      if (id) {
        await Axios.patch(`/admin/topics/${id}`, data, config);
        toast.success("Topic Updated");
      } else {
        await Axios.post("/admin/topics", data, config);
        setName("");
        toast.success("Topic Created");
      }
      window.scrollTo(0, 0);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setErr(err.response.data.err);
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme="colored" />
      <h3>{id ? "Update Topic" : "Create a Topic"}</h3>
      <form className="mt-3" onSubmit={handleFormSubmit}>
        <div className="input-wrapper">
          <label htmlFor="name">Topic Name</label>
          <input
            type={"text"}
            className="form-control mt-2 p-2"
            value={name}
            placeholder="Enter topic name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <button disabled={loading} className="mt-4">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </>
  );
};

export default CreateTopic;
