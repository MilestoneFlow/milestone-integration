export const parseBaseUrl = (urlInput: string) => {
  return urlInput.replace('https://', '').replace('http://', '').split('/')[0]
}
