import { Component } from 'react'
import { graphql } from 'react-apollo'
import itemDefinitionsQuery from '../queries/itemDefinitions'

const ItemDefinitionDropdown = function(props)
{
  const handleChange = (e) => {
    props.onChange(e.target)
  }

  return (
  <div className="form-group">
    <select onChange={handleChange} >
      <option key ="" value="">Select Item Definition</option>
    {props.data.itemDefinitions && props.data.itemDefinitions.map(({ id, name }) => (
      <option key={id} value={id}>{name + " (" +id + ")"}</option>
    ))}
    </select>
  </div>
  );

}

export default graphql(itemDefinitionsQuery)(ItemDefinitionDropdown)


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
