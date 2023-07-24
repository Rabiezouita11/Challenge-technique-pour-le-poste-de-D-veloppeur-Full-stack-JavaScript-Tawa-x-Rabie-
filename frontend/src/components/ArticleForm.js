import React, { useState } from 'react';
import axios from 'axios';
import { toast  , ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ArticleForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/articles',
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show toast notification for successful article creation
      toast.success('Article created successfully!');

      // Redirect to homepage (/) after successful article creation
  

    } catch (error) {
      console.error(error);
    }
  };

  return (
   

    <div className="container mt-5">
      <h2>Create Article</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            className="form-control"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Create Article
        </button>
      </form>
       <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default ArticleForm;
