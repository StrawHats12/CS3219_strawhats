import renderer from "react-test-renderer";
import Home from ".";
const axios = require("axios");

jest.mock("axios");

test("Home page renders correctly", async () => {
  axios.get.mockResolvedValue([]);

  const tree = renderer.create(<Home />).toJSON();
  expect(tree).toMatchSnapshot();
});
