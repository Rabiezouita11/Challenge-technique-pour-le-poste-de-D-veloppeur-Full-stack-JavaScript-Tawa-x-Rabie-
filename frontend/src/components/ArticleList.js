import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import ConfirmationModal from '../utils/ConfirmationModal';
import { useNavigate } from 'react-router-dom';

const ArticleList = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [editedArticle, setEditedArticle] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [addContent, setAddContent] = useState('');

  // Fetch articles function
  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/articles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setArticles(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleShowConfirmation = (articleId) => {
    setArticleToDelete(articleId);
    setShowConfirmation(true);
  };

  const handleHideConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleConfirmDeleteArticle = async () => {
    if (articleToDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/articles/${articleToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article._id !== articleToDelete)
        );
        setShowConfirmation(false);

        // Show a toast notification for successful deletion
        toast.success('Article deleted successfully.');
      } catch (error) {
        console.error(error);
        // Show a toast notification for deletion failure
        toast.error('Failed to delete article. Please try again.');
      }
    }
  };

  const handleShowEditModal = (article) => {
    setEditedArticle(article);
    setEditTitle(article.title);
    setEditContent(article.content);
    setShowEditModal(true);
  };

  const handleHideEditModal = () => {
    setShowEditModal(false);
  };

  const handleEditArticle = async (e) => {
    e.preventDefault();
    if (!editTitle || !editContent) {
      toast.error('Please fill in all the required fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/articles/${editedArticle._id}`,
        {
          title: editTitle,
          content: editContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === editedArticle._id
            ? { ...article, title: editTitle, content: editContent }
            : article
        )
      );
      setShowEditModal(false);

      // Show a toast notification for successful edit
      toast.success('Article updated successfully.');
    } catch (error) {
      console.error(error);
      // Show a toast notification for edit failure
      toast.error('Failed to update article. Please try again.');
    }
  };

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleHideAddModal = () => {
    setShowAddModal(false);
    setAddTitle('');
    setAddContent('');
  };

  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!addTitle || !addContent) {
      toast.error('Please fill in all the required fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/articles',
        {
          title: addTitle,
          content: addContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchArticles(); // Fetch articles again to get the updated list
      setShowAddModal(false);
      setAddTitle(''); // Reset the addTitle state to clear the input field
      setAddContent(''); // Reset the addContent state to clear the input field

      // Show a toast notification for successful article addition
      toast.success('Article added successfully.');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        // If the status code is 401 (Unauthorized), the token is expired or invalid
        // Log out the user and clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('isToastShown');
        navigate('/login'); // Navigate to the login page
        window.location.reload(); // Refresh the page to clear the state
        // Show a toast notification for unauthorized access
        toast.error('You have been logged out. Please log in again.');
      } else {
        // Show a toast notification for addition failure
        toast.error('Failed to add article. Please try again.');
      }
    }
  };


  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <ToastContainer position="top-center" autoClose={3000} />

      <h2>Articles</h2>
      <div className="mb-3 text-end">
        <Button variant="primary" onClick={handleShowAddModal}>
          Add Article
        </Button>
      </div>

      {/* Article List */}
      {articles.length === 0 ? (
        <div className="text-center mt-5 fade-in" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#555',
        }}>No articles to display.</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.content}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleShowConfirmation(article._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleShowEditModal(article)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmation}
        onHide={handleHideConfirmation}
        onConfirm={handleConfirmDeleteArticle}
        message="Are you sure you want to delete this article?"
      />

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleHideEditModal}>
        <form onSubmit={handleEditArticle}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Article</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="editTitle" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editContent" className="form-label">
                Content
              </label>
              <textarea
                className="form-control"
                id="editContent"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleHideEditModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleHideAddModal}>
        <form onSubmit={handleAddArticle}>
          <Modal.Header closeButton>
            <Modal.Title>Add Article</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="addTitle" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="addTitle"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="addContent" className="form-label">
                Content
              </label>
              <textarea
                className="form-control"
                id="addContent"
                value={addContent}
                onChange={(e) => setAddContent(e.target.value)}
                required
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleHideAddModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Article
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default ArticleList;
