import React, { Component } from "react";
import BookmarksContext from "../BookmarksContext";
import config from "../config";
import "./EditBookmark.css";

const Required = () => <span className="EditBookmark__required">*</span>;

class EditBookmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      id: "",
      title: "",
      url: "",
      description: "",
      rating: 5,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  static contextType = BookmarksContext;

  componentDidMount() {
    const { id } = this.props.match.params;
    fetch(config.API_ENDPOINT + `/${id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));

        return res.json();
      })
      .then((responseData) => {
        this.setState({
          id: responseData.id,
          title: responseData.title,
          url: responseData.url,
          description: responseData.description,
          rating: responseData.rating,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  }

  handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { id, title, url, description, rating } = this.state;
    const bookmark = {
      id,
      title,
      url,
      description,
      rating: Number(rating),
    };
    this.setState({ error: null });
    fetch(`${config.API_ENDPOINT}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(bookmark),
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));
      })
      .then(() => {
        // this.resetFields(bookmark);
        this.context.updateBookmark(bookmark);
        this.props.history.push("/");
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || "",
      title: newFields.title || "",
      url: newFields.url || "",
      description: newFields.description || "",
      rating: newFields.rating || "",
    });
  };

  handleClickCancel = () => {
    this.props.history.push("/");
  };

  render() {
    const { error } = this.state;
    return (
      <section className="EditBookmark">
        <h2>Edit the bookmark</h2>
        <form className="EditBookmark__form" onSubmit={this.handleSubmit}>
          <div className="EditBookmark__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor="title">
              Title <Required />
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={this.state.title}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="url">
              URL <Required />
            </label>
            <input
              type="url"
              name="url"
              id="url"
              value={this.state.url}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={this.state.description}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="rating">
              Rating <Required />
            </label>
            <input
              type="number"
              name="rating"
              id="rating"
              value={this.state.rating}
              onChange={this.handleInputChange}
              min="1"
              max="5"
              required
            />
          </div>
          <div className="EditBookmark__buttons">
            <button type="button" onClick={this.handleClickCancel}>
              Cancel
            </button>{" "}
            <button type="submit">Save</button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
