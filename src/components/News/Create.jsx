import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const CreateTopic = () => {
  const [title, setTitle] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [topic, setTopic] = useState("");
  const [news, setNews] = useState("");
  const [image, setImage] = useState(null);
  const [displayImage, setDisplayImage] = useState("");

  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const { newsId } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    setConfig({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  }, []);

  // fetch topics
  useEffect(() => {
    const fetchData = async () => {
      try {
        const arr = [];
        const res = await Axios.get("/topics");
        res.data.data.forEach((item) => {
          arr.push({
            value: item.id,
            label: item.name,
          });
        });
        setTopics(arr);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(`/admin/news/${newsId}`, config);
        const topicArr = [];

        res.data.data.topics
          .sort((a, b) => a.news_topic.order - b.news_topic.order)
          .forEach((item) => {
            topicArr.push({
              label: item.name,
              value: item.id,
            });
          });

        setId(res.data.data.id);
        setTitle(res.data.data.title);
        setPreviewText(res.data.data.previewText);
        setNews(res.data.data.news);
        setTopic(topicArr);
        setIsFeatured(res.data.data.isFeatured);
        setDisplayImage(res.data.data.image);
        setImage(res.data.data.image);
      } catch (err) {
        console.log(err);
        if (err.response.data.status === 404) {
          navigate("/news");
        }
      }
    };
    config && newsId && fetchData();
  }, [newsId, config]);

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
    const formData = new FormData();

    formData.append("title", title);
    formData.append("previewText", previewText);
    formData.append("news", news);
    topic?.forEach((item) => {
      formData.append("topic", item.value);
    });

    formData.append("isFeatured", isFeatured);
    formData.append("image", image);
    try {
      if (id) {
        await Axios.patch(`/admin/news/${id}`, formData, config);
        toast.success("News Updated");
      } else {
        await Axios.post("/admin/news", formData, config);
        setTitle("");
        setPreviewText("");
        setNews("");
        setDisplayImage("");
        setImage(null);
        setTopic([]);
        toast.success("News Created");
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
      <h3>{id ? "Update News Story" : "Write a News Story"}</h3>
      <form className="mt-3" onSubmit={handleFormSubmit}>
        <div className="double-input-wrapper mb-3">
          <div className="input-wrapper">
            {/* <label htmlFor="name">
              News title in English{" "}
              {titleNews.length > 0 && (
                <span
                  style={{
                    color: "#FC7300",
                  }}
                >
                  {titleNews.length} News with similar title
                </span>
              )}
            </label> */}
            <input
              type={"text"}
              className="form-control mt-2 p-2"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <p className="text-muted mt-2">
              Suggested title length is 126 characters{" "}
              {title.length > 0 && `( ${title.length} characters )`}
            </p>
          </div>
        </div>

        <div className="double-input-wrapper mb-3">
          <div className="input-wrapper">
            <label htmlFor="name">Preview text in English</label>
            <textarea
              className="form-control mt-2 p-2"
              value={previewText}
              rows={3}
              onChange={(e) => {
                setPreviewText(e.target.value);
              }}
            ></textarea>
            <p className="text-muted mt-2">
              {/* {previewText.length === 0
                ? "Suggested title length is 161 characters"
                : previewText.length + " words"} */}
              Suggested preview title length is 148 characters{" "}
              {previewText.length > 0 && `( ${previewText.length} characters )`}
            </p>
          </div>
        </div>

        <div className="double-input-wrapper mb-3">
          <div className="input-wrapper">
            <label htmlFor="name">News in English</label>
            <ReactQuill
              theme="snow"
              value={news}
              onChange={setNews}
              style={{
                backgroundColor: "#fff",
              }}
            />
          </div>
        </div>

        <div className="double-input-wrapper mb-4">
          <div className="input-wrapper">
            <label htmlFor="topic">Topic</label>
            <Select
              isMulti
              value={topic}
              options={[
                {
                  value: "*",
                  label: "All",
                },
                ...topics,
              ]}
              onChange={(selectedOptions) => {
                if (selectedOptions.some((option) => option.value === "*")) {
                  if (topic.length === topic.length - 1) {
                    setTopic([]);
                  } else {
                    setTopic(topics.filter((option) => option.value !== "*"));
                  }
                } else {
                  setTopic(selectedOptions);
                }
              }}
            />
          </div>
        </div>

        <div className="double-input-wrapper mb-3">
          <div className="input-wrapper check">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={() => {
                setIsFeatured(!isFeatured);
              }}
            />
            <label htmlFor="isFeatured">
              Add this to featured stories (pin to top)
            </label>
          </div>
        </div>

        <div className="input-wrapper">
          <input
            type="file"
            name="image"
            onChange={(e) => {
              const img = URL.createObjectURL(e.target.files[0]);
              setDisplayImage(img);
              setImage(e.target.files[0]);
            }}
          />
        </div>

        {displayImage && (
          <div className="display-img">
            <img
              src={displayImage}
              alt=""
              onClick={() => {
                setImage(null);
                setDisplayImage("");
              }}
            />
          </div>
        )}

        <button disabled={loading} className="mt-4">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </>
  );
};

export default CreateTopic;
