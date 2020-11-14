import React from "react";
import ReactDOM from "react-dom";
import EditBookmark from "./EditBookmark";
import { BrowserRouter } from "react-router-dom";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const props = {
    match: { params: {} },
  };
  ReactDOM.render(
    <BrowserRouter>
      <EditBookmark {...props} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
