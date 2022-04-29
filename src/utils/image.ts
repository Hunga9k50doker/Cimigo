export const getUrlExtension = (url: string) => {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

export const getFileExtension = (name: string) => {
  return name.split('.').length > 1 ? name.split('.').pop() : null
}
