import React from "react";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import NavBar from "../NavBar";

afterEach(cleanup);

const props = {
  title: "Hello, World!",
  logoutUser: () => {
    return true;
  },
};

const title = "Hello, World!";

it("renders a title", () => {
  const { getByText } = renderWithRouter(<NavBar {...props} />);
  expect(getByText(title)).toHaveClass("nav-title");
});

it("renders", () => {
  const { asFragment } = renderWithRouter(<NavBar {...props} />);
  expect(asFragment()).toMatchSnapshot();
});
