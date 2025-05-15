export function getCachedQuestions(companyId, timeframe) {
  try {
    const key = `questions_${companyId}_${timeframe}`
    const json = localStorage.getItem(key)
    return json ? JSON.parse(json) : null
  } catch {
    return null
  }
}

export function setCachedQuestions(companyId, timeframe, questions) {
  try {
    const key = `questions_${companyId}_${timeframe}`
    localStorage.setItem(key, JSON.stringify(questions))
  } catch {
    console.error('Failed to set cached questions:', companyId, timeframe)
  }
}
