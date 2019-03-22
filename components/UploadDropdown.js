import { Component } from 'react'
import { graphql } from 'react-apollo'
import uploadsQuery from '../queries/uploads'

const UploadDropdown = function(props)
{
  const handleChange = (e) => {
    props.onChange(e.target)
  }

  return (
  <div className="form-group">
    <select name="image" onChange={handleChange} >
      <option key="">Select file</option>
    {props.data.uploads.map(({ filename, contentType }) => (
      <option key={filename}>{filename}</option>
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
