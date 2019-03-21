import { Component } from 'react'
import { graphql } from 'react-apollo'
import uploadsQuery from '../queries/uploads'

const UploadDropdown = ({ data: { uploads = [] } }) =>
{

  return (
  <div class="form-group">
    <select class="form-control">
    {uploads.map(({ _id, filename, contentType }) => (
      <option>{filename}</option>
    ))}
    </select>
  </div>
  );

}

export default graphql(uploadsQuery)(UploadDropdown)


/*

{

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      dropdownValue: "Image / 3D File"
    };
  }

  toggle = (e) => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  changeValue = (e) => {
    this.setState({dropdownValue: e.currentTarget.textContent})
  }

}(UploadDropdown)
*/
