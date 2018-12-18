import Prompt from 'widgets/QuestionCard/Prompt'

const PromptReason = props => {
  const { errHint } = props
  if (!errHint) return null
  return (
    <Prompt className='noPassReason' status='warning'>
      不通过原因：{errHint || '题目答案错误，需修改'}
    </Prompt>
  )
}

export default PromptReason
