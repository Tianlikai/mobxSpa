import BaseSelect from 'widgets/Layout/BaseSelect'

const Select = listData => props => (
  <BaseSelect listData={listData} handleSelect={props.handleSelect} />
)

export default Select
